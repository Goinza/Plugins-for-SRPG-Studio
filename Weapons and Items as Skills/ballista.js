//Plugin by Goinza

(function() {
	//Adds the Arms unit command
    var alias1 = UnitCommand.configureCommands;
    UnitCommand.configureCommands = function (groupArray) {
        alias1.call(this, groupArray);
        
        var i = 0;
        var found = false;
        while (i<groupArray.length && !found) {        
            found = groupArray[i].getCommandName()==root.queryCommand('attack_unitcommand');
            i++;
        }
    
        groupArray.insertObject(UnitCommand.Ballista, i);
        
    }

    //Changes to how the code gets and sets the equipped weapon to account for the ballista
    var alias2 = ItemControl.getEquippedWeapon;
    ItemControl.getEquippedWeapon = function(unit) {
        return unit.custom.ballistaEquip!=null ? unit.custom.ballistaEquip : alias2.call(this, unit);
    }
   
    var alias3 = ItemControl.setEquippedWeapon;
    ItemControl.setEquippedWeapon = function(unit, item) {
        if (item!=null && item.custom.ballista!=null) {
            unit.custom.ballistaEquip = BallistaControl.searchWeapon(unit.getMapX(), unit.getMapY());
        }
        else {
            unit.custom.ballistaEquip = null;
        }

        alias3.call(this, unit, item);
    }

	//Removes the equipped weapon, in order to avoid 
    var alias4 = AttackFlow.moveEndFlow;
    AttackFlow.moveEndFlow = function() {
        var result = alias4.call(this);

        if (result==MoveResult.END) {
			var active = this._order.getActiveUnit();
			if (active.custom.ballistaEquip!=null && active.custom.ballistaEquip.custom.ballista!=null) {
				active.custom.ballistaEquip = null;
			}
        }
        
        return result;
	}
	
	//Allows for AI units to use weapons from skills
    var alias5 = CombinationCollector.Weapon.collectCombination;
    CombinationCollector.Weapon.collectCombination = function(misc) {
		alias5.call(this, misc);
		
		var unit = misc.unit;
		var skill = SkillControl.getPossessionCustomSkill(unit, "MapAttack");
		var weapon = skill!=null ? BallistaControl.searchWeapon(unit.getMapX(), unit.getMapY()) : null;
		var usable = weapon!=null ? weapon.getLimit()>0 && ItemControl.isWeaponAvailable(unit, weapon) : false;    
		if (usable) {
			misc.item = weapon;
			
			rangeMetrics = StructureBuilder.buildRangeMetrics();
			rangeMetrics.startRange = weapon.getStartRange();
			rangeMetrics.endRange = weapon.getEndRange();
			
			filter = this._getWeaponFilter(unit);
			this._checkSimulator(misc);
			this._setUnitRangeCombination(misc, filter, rangeMetrics);
		}
		
    }

    //Renders the weapon range panel for AI units with weapons from skills
    var alias6 = UnitRangePanel.getUnitAttackRange;
    UnitRangePanel.getUnitAttackRange = function(unit) {
		var obj = alias6.call(this, unit);
		
		var skill = SkillControl.getPossessionCustomSkill(unit, "MapAttack");
		var weapon = skill!=null ? BallistaControl.searchWeapon(unit.getMapX(), unit.getMapY()) : null;
		var usable = weapon!=null ? weapon.getLimit()>0 && ItemControl.isWeaponAvailable(unit, weapon) : false;    

		if (usable) {
			rangeMetrics = this._getRangeMetricsFromItem(unit, weapon);
			if (rangeMetrics != null) {
				if (rangeMetrics.startRange < obj.startRange) {
					obj.startRange = rangeMetrics.startRange;
				}
				if (rangeMetrics.endRange > obj.endRange) {
					obj.endRange = rangeMetrics.endRange;
				}
			}
		}

        return obj;
	}
	
	//Override of the functions _setTemporaryWeapon and _resetTemporaryWeapon to remove any problems with spells
    //This coud lead to the AI not choosing the best weapon available in some very particular cases.
    AIScorer.Weapon._setTemporaryWeapon = function(unit, combination) {
		return 0;
	},
	
	AIScorer.Weapon._resetTemporaryWeapon = function(unit, combination, prevItemIndex) {
	}

})()

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

var BallistaControl = {
    
    addBallista: function() {
        var ballista = root.getCurrentSession().getCurrentMapInfo().custom.ballista;
        var terrain1, terrain2, skill, weapon;
        if (ballista!=null) {
            for (var i=0; i<ballista.length; i++) {
                terrain1 = PosChecker.getTerrainFromPos(ballista[i].x, ballista[i].y);
                terrain2 = PosChecker.getTerrainFromPosEx(ballista[i].x, ballista[i].y);      
                skill = terrain1!=null ? terrain1.getSkillReferenceList().getTypeData(0) : null;
                if (skill!=null) {
                    weapon = root.duplicateItem(root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));
                    ballista[i].weapon = weapon;
                }
                else {
                    skill = terrain2!=null ? terrain2.getSkillReferenceList().getTypeData(0) : null;
                    if (skill!=null) {
                        weapon = root.duplicateItem(root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));
                        ballista[i].weapon = weapon;
                    }
                    else {
                        root.log("Error");
                    }
                }
            }
        }
    },

    searchWeapon: function(x, y) {
        var weapon = null;
        var ballista = root.getCurrentSession().getCurrentMapInfo().custom.ballista;
        if (ballista!=null) {
            var i = 0;
            var found = false;
            while (i<ballista.length && !found) {
                if (ballista[i].x == x && ballista[i].y == y) {
                    weapon = ballista[i].weapon;
                    found = true;
                }
                i++;
            }
		}

        return weapon;
    }
}

BallistaSelectMenu = defineObject(WeaponSelectMenu, {

    getWeaponCount: function() {
        return 1;
    },

    _setWeaponbar: function(unit) {
        var weapon = BallistaControl.searchWeapon(unit.getMapX(), unit.getMapY());        
		var scrollbar = this._itemListWindow.getItemScrollbar();
		
		scrollbar.resetScrollData();		
		scrollbar.objectSet(weapon);		
		scrollbar.objectSetEnd();
	}

})