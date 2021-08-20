//Plugin by Goinza

UnitCommand.Ballista = defineObject(UnitListCommand, {

    _weaponSelectMenu: null,
	_posSelector: null,

    openCommand: function() {
        this._weaponSelectMenu = createObject(BallistaSelectMenu);
        this._posSelector = createObject(PosSelector);
        this._weaponSelectMenu.setMenuTarget(this.getCommandTarget());
		this.changeCycleMode(AttackCommandMode.TOP);
    },

    moveCommand: function() {
        var mode = this.getCycleMode();
		var result = MoveResult.CONTINUE;
		
		if (mode === AttackCommandMode.TOP) {
			result = this._moveTop();
		}
		else if (mode === AttackCommandMode.SELECTION) {
			result = this._moveSelection();
		}
		else if (mode === AttackCommandMode.RESULT) {
			result = this._moveResult();
		}
		
		return result;
    },

    drawCommand: function() {
        var mode = this.getCycleMode();
		
		if (mode === AttackCommandMode.TOP) {
			this._drawTop();
		}
		else if (mode === AttackCommandMode.SELECTION) {
			this._drawSelection();
		}
		else if (mode === AttackCommandMode.RESULT) {
			this._drawResult();
		}
    },

    isCommandDisplayable: function() {
        var unit = this.getCommandTarget();
        var hasSkill = SkillControl.getPossessionCustomSkill(unit, "MapAttack");
        var weapon = hasSkill!=null ? BallistaControl.searchWeapon(unit.getMapX(), unit.getMapY()) : null;
        var usable = weapon!=null ? weapon.getLimit()>0 && ItemControl.isWeaponAvailable(unit, weapon) : false;        
        return usable;
    },

    getCommandName: function() {
        return "Arms";  
    },
	
	_startSelection: function(weapon) {
		var unit = this.getCommandTarget();
		var filter = this._getUnitFilter();
		var indexArray = this._getIndexArray(unit, weapon);
		
		// Equip with the selected item.
		ItemControl.setEquippedWeapon(unit, weapon);
		
		this._posSelector.setUnitOnly(unit, weapon, indexArray, PosMenuType.Attack, filter);
		this._posSelector.setFirstPos();
		
		this.changeCycleMode(AttackCommandMode.SELECTION);
	},
	
	_moveTop: function() {
		var weapon;
		var input = this._weaponSelectMenu.moveWindowManager();
		
		if (input === ScrollbarInput.SELECT) {
			weapon = this._weaponSelectMenu.getSelectWeapon();
			this._startSelection(weapon);
		}
		else if (input === ScrollbarInput.CANCEL) {
            ItemControl.setEquippedWeapon(this.getCommandTarget(), null);
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveSelection: function() {
		var attackParam;
		var result = this._posSelector.movePosSelector();
		
		if (result === PosSelectorResult.SELECT) {
			if (this._isPosSelectable()) {
				this._posSelector.endPosSelector();
				attackParam = this._createAttackParam();
				
				this._preAttack = createObject(PreAttack);
				result = this._preAttack.enterPreAttackCycle(attackParam);
				if (result === EnterResult.NOTENTER) {
					this.endCommandAction();
					return MoveResult.END;
				}
				
				this.changeCycleMode(AttackCommandMode.RESULT);
			}
		}
		else if (result === PosSelectorResult.CANCEL) {
			this._posSelector.endPosSelector();			
			this._weaponSelectMenu.setMenuTarget(this.getCommandTarget());
			this.changeCycleMode(AttackCommandMode.TOP);
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveResult: function() {
		if (this._preAttack.movePreAttackCycle() !== MoveResult.CONTINUE) {
			this.endCommandAction();
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	_drawTop: function() {
		this._weaponSelectMenu.drawWindowManager();
	},
	
	_drawSelection: function() {
		this._posSelector.drawPosSelector();
	},
	
	_drawResult: function() {
		if (this._preAttack.isPosMenuDraw()) {
			// Without the following code, it flickers at the easy battle.
			this._posSelector.drawPosMenu();
		}
		
		this._preAttack.drawPreAttackCycle();
	},
	
	_isPosSelectable: function() {
		var unit = this._posSelector.getSelectorTarget(true);
		
		return unit !== null;
	},
	
	_getUnitFilter: function() {
		return FilterControl.getReverseFilter(this.getCommandTarget().getUnitType());
	},
	
	_getIndexArray: function(unit, weapon) {
		return AttackChecker.getAttackIndexArray(unit, weapon, false);
	},
	
	_createAttackParam: function() {
		var attackParam = StructureBuilder.buildAttackParam();
		
		attackParam.unit = this.getCommandTarget();
		attackParam.targetUnit = this._posSelector.getSelectorTarget(false);
		attackParam.attackStartType = AttackStartType.NORMAL;
		
		return attackParam;
	}

})