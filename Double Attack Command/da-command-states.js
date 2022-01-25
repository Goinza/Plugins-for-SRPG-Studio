//Plugin by Goinza

var DABaseState = defineObject(BaseObject, {

    _parent: null,

    setup: function(parent) {
        this._parent = parent;
    },

    moveState: function() {
        return MoveResult.CONTINUE;
    },

    drawState: function() {        
    }

})

var DAState = {};

DAState.FirstWeapon = defineObject(DABaseState, {

    _weaponSelectMenu: null,
    _weaponPrev: null,
    _infoWindow: null,

    setup: function(parent) {
        this._parent = parent;

		this._createInfoWindow();
        
        this._weaponSelectMenu = createObject(DoubleWeaponSelectMenu);
        var isWeaponSelectDisabled = false;
        if (DataConfig.isWeaponSelectSkippable()) {
			if (this._getWeaponCount() === 1) {
				isWeaponSelectDisabled = true;
			}
		}
        if (isWeaponSelectDisabled) {			
			var weapon = this._parent.data.unit;
			this._finishState(ItemControl.getEquippedWeapon(weapon));
		}
		else {
			this._weaponSelectMenu.setMenuTarget(this._parent.data.unit);
			this._weaponPrev = this._weaponSelectMenu.getSelectWeapon();
		}

        this._parent.data.weaponSelectionDisabled = isWeaponSelectDisabled;
    },

    _getWeaponCount: function() {
		var i, weapon;
		var unit = this._parent.data.unit;
		var count = UnitItemControl.getPossessionItemCount(unit);
		var weaponCount = 0;
		
		for (i = 0; i < count; i++) {
			weapon = UnitItemControl.getItem(unit, i);
			if (weapon === null) {
				continue;
			}
			
			if (ItemControl.isWeaponAvailable(unit, weapon)) {
				weaponCount++;
			}
		}
		
		return weaponCount;
	},

    moveState: function() {
        var weapon;
		var input = this._weaponSelectMenu.moveWindowManager();
		
		if (input === ScrollbarInput.SELECT) {
			weapon = this._weaponSelectMenu.getSelectWeapon();
			this._finishState(weapon);
		}
		else if (input === ScrollbarInput.CANCEL) {
			return this._cancelState();
		}

        return MoveResult.CONTINUE;
    },

    drawState: function() {
		var x = Math.round(root.getGameAreaWidth() / 2 - this._infoWindow.getWindowWidth() / 2);
		var y = root.getGameAreaHeight() - this._infoWindow.getWindowHeight();
        this._infoWindow.drawWindow(x, y);        
        this._weaponSelectMenu.drawWindowManager();
    },

	_createInfoWindow: function() {
        this._infoWindow = createWindowObject(InfoBattleWindow);
        this._infoWindow.setInfoText(InfoWindowSettings.FIRST_WEAPON_MESSAGE);
	},

	_finishState: function(weapon) {
		this._parent.data.firstWeapon = weapon;
		this._parent.changeState(DAState.FirstTarget);
	},

	_cancelState: function() {
		if (this._weaponPrev !== this._weaponSelectMenu.getSelectWeapon()) {
			// Rebuild the command because the equipped weapon has changed.
			// For example, if the equipped weapon includes "Steal" as "Optional Skills", "Steal" must be removed from the command.
			this.rebuildCommand();
		}
		return MoveResult.END;
	}

})

DAState.FirstTarget = defineObject(DABaseState, {

    _posSelector: null,
    _infoWindow: null,

    setup: function(parent) {
        this._parent = parent;

		this._createInfoWindow();

        var weapon = this._parent.data.firstWeapon;
        this._posSelector = createObject(PosSelector);
        var unit = this._parent.data.unit
		var filter = this._getUnitFilter(unit);
		var indexArray = this._getIndexArray(unit, weapon);
        this._posSelector.setUnitOnly(unit, weapon, indexArray, PosMenuType.Attack, filter);
		this._posSelector.setFirstPos();
    },

    _getUnitFilter: function(unit) {
		return FilterControl.getReverseFilter(unit.getUnitType());
	},

    _getIndexArray: function(unit, weapon) {
		return AttackChecker.getAttackIndexArray(unit, weapon, false);
	},

    moveState: function() {
		var result = this._posSelector.movePosSelector();
		
		if (result === PosSelectorResult.SELECT) {
			if (this._isPosSelectable()) {
				this._posSelector.endPosSelector();
                var targetUnit = this._posSelector.getSelectorTarget(false);
				this._finishState(targetUnit);
			}
		}
		else if (result === PosSelectorResult.CANCEL) {
			this._posSelector.endPosSelector();
			return this._cancelState();						
		}
		
		return MoveResult.CONTINUE;
    },

    drawState: function() {
		var x = Math.round(root.getGameAreaWidth() / 2 - this._infoWindow.getWindowWidth() / 2);
		var y = root.getGameAreaHeight() - this._infoWindow.getWindowHeight();
        this._infoWindow.drawWindow(x, y);        
        this._posSelector.drawPosSelector();
    },

	_createInfoWindow: function() {		
        this._infoWindow = createWindowObject(InfoBattleWindow);
        this._infoWindow.setInfoText(InfoWindowSettings.FIRST_TARGET_MESSAGE);
	},

	_finishState: function(targetUnit) {
		this._parent.data.firstTarget = targetUnit;								
		this._parent.changeState(DAState.SecondWeapon);
	},

	_cancelState: function() {
		if (this._parent.data.weaponSelectionDisabled) {
			return MoveResult.END;
		}
		this._parent.changeState(DAState.FirstWeapon);
		return MoveResult.CONTINUE;
	},

    _isPosSelectable: function() {
		var unit = this._posSelector.getSelectorTarget(true);
		
		return unit !== null;
	}

})

DAState.SecondWeapon = defineObject(DAState.FirstWeapon, {

	_createInfoWindow: function() {		
        this._infoWindow = createWindowObject(InfoBattleWindow);
        this._infoWindow.setInfoText(InfoWindowSettings.SECOND_WEAPON_MESSAGE);
	},

	_finishState: function(weapon) {		
		this._parent.data.secondWeapon = weapon;
		this._parent.changeState(DAState.SecondTarget);
	},

	_cancelState: function() {
		this._parent.changeState(DAState.FirstTarget);
		return MoveResult.CONTINUE;
	}

})

DAState.SecondTarget = defineObject(DAState.FirstTarget, {

	_createInfoWindow: function() {		
        this._infoWindow = createWindowObject(InfoBattleWindow);
        this._infoWindow.setInfoText(InfoWindowSettings.SECOND_TARGET_MESSAGE);
	},

	_finishState: function(targetUnit) {
		this._parent.data.secondTarget = targetUnit;								
		this._parent.changeState(DAState.FirstBattle);
	},

	_cancelState: function() {
		if (this._parent.data.weaponSelectionDisabled) {
			this._parent.changeState(DAState.FirstTarget);
		}
		else {
			this._parent.changeState(DAState.SecondWeapon);
		}
		return MoveResult.CONTINUE;
	}

})

DAState.FirstBattle = defineObject(DABaseState, {

	_preAttack: null,
	_result: null,

	setup: function(parent) {
		this._parent = parent;
	
		this._equipWeapon();	
		attackParam = this._createAttackParam();				
		this._preAttack = createObject(PreAttack);

		if (this._canStartAttack()) {
			this._result = this._preAttack.enterPreAttackCycle(attackParam);			
		}
		else {
			this._parent.endCommandAction();
			this._result = EnterResult.NOTENTER;
		}
	},

	moveState: function() {
		if (this._result === EnterResult.NOTENTER) {
			this._parent.endCommandAction();
			return MoveResult.END;
		}
		
		if (this._preAttack.movePreAttackCycle() !== MoveResult.CONTINUE) {
			return this._finishState();
		}
		
		return MoveResult.CONTINUE;
	},

	drawState: function() {	
		if (this._result === EnterResult.OK) {	
			this._preAttack.drawPreAttackCycle();
		}
	},

	_createAttackParam: function() {
		var attackParam = StructureBuilder.buildAttackParam();
		
		attackParam.unit = this._parent.data.unit;
		attackParam.targetUnit = this._getTarget();
		attackParam.attackStartType = AttackStartType.NORMAL;
		
		return attackParam;
	},

	_equipWeapon: function() {
		var unit = this._parent.data.unit;
		var weapon = this._parent.data.firstWeapon;
		ItemControl.setEquippedWeapon(unit, weapon);
	},

	_getTarget: function() {
		return this._parent.data.firstTarget;
	},

	_finishState: function() {
		this._parent.changeState(DAState.SecondBattle);
		return MoveResult.CONTINUE;
	},

	_canStartAttack: function() {
		return true;
	}

})

DAState.SecondBattle = defineObject(DAState.FirstBattle, {

	_equipWeapon: function() {
		var unit = this._parent.data.unit;
		var weapon = this._parent.data.secondWeapon;
		ItemControl.setEquippedWeapon(unit, weapon);
	},

	_getTarget: function() {
		return this._parent.data.secondTarget;
	},

	_finishState: function() {
		this._parent.endCommandAction();
		return MoveResult.END;
	},

	_canStartAttack: function() {
		var active = this._parent.data.unit;
		var passive = this._parent.data.secondTarget;

		var activeAlive = !DamageControl.isLosted(active);
		var passiveAlive = !DamageControl.isLosted(passive);
		var activeAvailable = this._canUnitAttack(active);
		
		return activeAlive && passiveAlive && activeAvailable;
	},

	//Assume unit is alive.
	//Check for conditions that would prevent the unit from attacking
	_canUnitAttack: function(unit) {
		var weaponAvailable = AttackChecker.isUnitAttackable(unit);
		var unitAsleep = StateControl.isBadStateOption(unit, BadStateOption.NOACTION);
		
		return weaponAvailable && !unitAsleep;
	}

})