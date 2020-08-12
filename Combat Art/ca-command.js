//Plugin by Goinza

CombatArtMode = {
    ART: 0,     //Select the Combat Art
    WEAPON: 1,  //Select the weapon
    TARGET: 2,  //Select the target unit
    RESULT: 3,
    ASSIGNING: 4
}

UnitCommand.CombatArt = defineObject(UnitListCommand, {

    _artMenu: null,
    _weaponMenu: null,
    _posSelector: null,
    _preAttack: null,
    _currentSkillArray: null,
    _dynamicEvent: null,

    openCommand: function() {
        if (this._currentSkillArray!=null) {
            this._removeArtSkill();
        }

        this._artMenu = createObject(CombatArtSelectMenu);
        this._artMenu.setMenuTarget(this.getCommandTarget());

        this._weaponMenu = createObject(ArtWeaponSelectMenu);

        this._posSelector = createObject(PosSelector);

        this._dynamicEvent = createObject(DynamicEvent);        

        this.changeCycleMode(CombatArtMode.ART);
        
        root.getMetaSession().global.combatArt = true;
    },

    moveCommand: function() {
        var mode = this.getCycleMode();
        var result = MoveResult.CONTINUE;

        if (mode == CombatArtMode.ART) {
            result = this._moveArt();
        }
        else if (mode == CombatArtMode.WEAPON) {
            result = this._moveWeapon();
        }
        else if (mode == CombatArtMode.TARGET) {
            result = this._moveTarget();
        }
        else if (mode == CombatArtMode.RESULT) {
            result = this._moveResult();
        }
        else if (mode == CombatArtMode.ASSIGNING) {
            result = this._moveAssign();
        }

        if (result == MoveResult.END) {            
            root.getMetaSession().global.combatArt = false;
        }

        return result;
    },

    drawCommand: function() {
        var mode = this.getCycleMode();

        if (mode == CombatArtMode.ART) {
            this._drawArt();
        }
        else if (mode == CombatArtMode.WEAPON) {
            this._drawWeapon();
        }
        else if (mode == CombatArtMode.TARGET) {
            this._drawTarget();
        }
        else if (mode == CombatArtMode.RESULT) {
            this._drawResult();
        }
    },

    isCommandDisplayable: function() {
        var displayable = false;
        var i = 0;
        var combatArts = CombatArtControl.getCombatArtsArray(this.getCommandTarget());

        while (!displayable && i<combatArts.length) {
            CombatArtControl.validateCombatArt(combatArts[i]);
            this._assignArtSkills(combatArts[i]); 
            displayable =  CombatArtControl.isUnitAttackable(this.getCommandTarget(), combatArts[i]);
            this._removeArtSkill();
            i++;
        }
        
        return displayable;
    },

    getCommandName: function() {
        return COMMAND_COMBATART;
    },    

    isRepeatMoveAllowed: function() {
        return DataConfig.isUnitCommandMovable(RepeatMoveType.ATTACK);
    },

    _moveArt: function() {
        var result = this._artMenu.moveWindowManager();
        
        if (result == MoveResult.SELECT) {
            result = MoveResult.CONTINUE;
            this._assignArtSkills(this._artMenu.getSelectedCombatArt());
            this.changeCycleMode(CombatArtMode.ASSIGNING);
        }
        else if (result == MoveResult.CANCEL) {
            result = MoveResult.END;
        }

        return result;
    },

    _moveAssign: function() {
        var resultEvent = this._dynamicEvent.moveDynamicEvent();
        if (resultEvent == MoveResult.END) {
            this._weaponMenu.setCombatArt(this._artMenu.getSelectedCombatArt());
            root.getMetaSession().global.selectedArt = this._weaponMenu.getCombatArt();
            this._weaponMenu.setMenuTarget(this.getCommandTarget());
            this.changeCycleMode(CombatArtMode.WEAPON);
        }
        return MoveResult.CONTINUE;
    },

    _moveWeapon: function() {
        var weapon;
		var input = this._weaponMenu.moveWindowManager();
		
		if (input === ScrollbarInput.SELECT) {
			weapon = this._weaponMenu.getSelectWeapon();
			this._startSelection(weapon);
		}
		else if (input === ScrollbarInput.CANCEL) {
            this.changeCycleMode(CombatArtMode.ART);
            root.getMetaSession().global.selectedArt = null;
            this._removeArtSkill();
        }
        
        return MoveResult.CONTINUE;
    },

    _moveTarget: function() {
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
				
				this.changeCycleMode(CombatArtMode.RESULT);
			}
		}
		else if (result === PosSelectorResult.CANCEL) {
			this._posSelector.endPosSelector();			
			this._weaponMenu.setMenuTarget(this.getCommandTarget());
			this.changeCycleMode(CombatArtMode.WEAPON);
		}
		
		return MoveResult.CONTINUE;
    },

    _moveResult: function() {
		if (this._preAttack.movePreAttackCycle() !== MoveResult.CONTINUE) {
            this.endCommandAction();
            this._removeArtSkill();
            this._reduceWeaponDurability();
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},

    _drawArt: function() {
        this._artMenu.drawWindowManager();
    },

    _drawWeapon: function() {
        this._weaponMenu.drawWindowManager();
    },

    _drawTarget: function() {
        this._posSelector.drawPosSelector();
    },

    _drawResult: function() {
		if (this._preAttack.isPosMenuDraw()) {
			// Without the following code, it flickers at the easy battle.
			this._posSelector.drawPosMenu();
		}
		
		this._preAttack.drawPreAttackCycle();
	},

    _startSelection: function(weapon) {
		var unit = this.getCommandTarget();
		var filter = this._getUnitFilter();
		var indexArray = this._getIndexArray(unit, weapon);
		
		// Equip with the selected item.
		ItemControl.setEquippedWeapon(unit, weapon);
		
		this._posSelector.setUnitOnly(unit, weapon, indexArray, PosMenuType.Attack, filter);
		this._posSelector.setFirstPos();
		
		this.changeCycleMode(CombatArtMode.TARGET);
    },
    
    _getUnitFilter: function() {
		return FilterControl.getReverseFilter(this.getCommandTarget().getUnitType());
	},
	
	_getIndexArray: function(unit, weapon) {
        var indexArray = [];
        var combatArt = this._artMenu.getSelectedCombatArt();

        if (combatArt!=null) {
            var ranges = CombatArtControl.getRanges(combatArt, weapon);
            indexArray = CombatArtControl.getAttackIndexArray(unit, ranges.start, ranges.end, false);
        }

		return indexArray;
    },
    
    _isPosSelectable: function() {
		var unit = this._posSelector.getSelectorTarget(true);
		
		return unit !== null;
    },
    
    _createAttackParam: function() {
		var attackParam = StructureBuilder.buildAttackParam();
		
		attackParam.unit = this.getCommandTarget();
		attackParam.targetUnit = this._posSelector.getSelectorTarget(false);
		attackParam.attackStartType = AttackStartType.NORMAL;
		
		return attackParam;
    },

    _checkAllArtSkills: function() {
        var artSkills = CombatArtControl.getCombatArtsArray(this.getCommandTarget());
        if (artSkills.length==0) {
            return false;
        }

        for (var i=0; i<artSkills.length; i++) {
            this._assignArtSkills(artSkills[i]);
        }       
    },
    
    _assignArtSkills: function(skill) {
        if (this._currentSkillArray==null) {
            this._currentSkillArray = [];
        }
        var skillArray = CombatArtControl.getArtSkillsArray(skill);
        for (var i=0; i<skillArray.length; i++) {
            this._currentSkillArray.push(skillArray[i]);
        }

        this._dynamicEvent = createObject(DynamicEvent);
        var generator = this._dynamicEvent.acquireEventGenerator();

        for (var i=0; i<this._currentSkillArray.length; i++) {
            generator.skillChange(this.getCommandTarget(), this._currentSkillArray[i], IncreaseType.INCREASE, true);
        }

        this._dynamicEvent.executeDynamicEvent();
    },

    _removeArtSkill: function() {
        var dynamicEvent = createObject(DynamicEvent);
        var generator = dynamicEvent.acquireEventGenerator();

        for (var i=0; i<this._currentSkillArray.length; i++) {
            generator.skillChange(this.getCommandTarget(), this._currentSkillArray[i], IncreaseType.DECREASE, true);
        }

        this._currentSkillArray = [];
        dynamicEvent.executeDynamicEvent();
    },

    _reduceWeaponDurability: function() {
        var cost = CombatArtControl.getCost(this._artMenu.getSelectedCombatArt());
        var weapon = ItemControl.getEquippedWeapon(this.getCommandTarget());
        if (cost!=null && weapon!=null && weapon.getLimitMax()>0) {
            var dynamicEvent = createObject(DynamicEvent);
            var generator = dynamicEvent.acquireEventGenerator();            
            generator.itemDurabilityChange(this.getCommandTarget(), weapon, cost, IncreaseType.DECREASE, true);    
            dynamicEvent.executeDynamicEvent();
        }
       
    }

})