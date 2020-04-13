//Plugin by Goinza

(function() {
    //Adds combat art commmand
    var alias1 = UnitCommand.configureCommands;
    UnitCommand.configureCommands = function(groupArray) {
        alias1.call(this, groupArray);
        
        var i = 0;
        var found = false;
        while (i<groupArray.length && !found) {        
            found = groupArray[i].getCommandName()==root.queryCommand('attack_unitcommand');
            i++;
        }
    
        groupArray.insertObject(UnitCommand.CombatArt, i);
    }

    //Combat arts deal one round of combat by default
    var alias2 = Calculator.calculateRoundCount;
    Calculator.calculateRoundCount = function(active, passive, weapon) {
        var rounds;
        var combatArt = root.getMetaSession().global.combatArt;
        if (combatArt!=null && combatArt) {
            rounds = 1;
        }
        else {
            rounds = alias2.call(this, active, passive, weapon);
        }
    
        return rounds
    }
    
    //Reduces weapon uses after a combat art attack
    AttackFlow._doAttackAction = function() {
        var i, count, turnState;
        var order = this._order;
        var active = order.getActiveUnit();
        var passive = order.getPassiveUnit();
        var activeStateArray = order.getActiveStateArray();
        var passiveStateArray = order.getPassiveStateArray();
        var isItemDecrement = order.isCurrentItemDecrement();
        
        DamageControl.reduceHp(active, order.getActiveDamage());
        DamageControl.reduceHp(passive, order.getPassiveDamage());
        
        DamageControl.checkHp(active, passive);
        
        count = activeStateArray.length;
        for (i = 0; i < count; i++) {
            turnState = StateControl.arrangeState(active, activeStateArray[i], IncreaseType.INCREASE);
            if (turnState !== null) {
                turnState.setLocked(true);
            }
        }
        
        count = passiveStateArray.length;
        for (i = 0; i < count; i++) {
            turnState = StateControl.arrangeState(passive, passiveStateArray[i], IncreaseType.INCREASE);
            if (turnState !== null) {
                turnState.setLocked(true);
            }
        }
        
        if (isItemDecrement) {
            // Reduce the weapons for the attacker.
            // Items don't get discarded.
            // ItemControl.getEquippedWeapon is not called because there is a possibility to return null.
            // If the "Users" of the weapon is current HP, there is a possibility that HP has changed due to the battle, so the equipment decision also changes.
            var combatArt = root.getMetaSession().global.combatArt;
            if (combatArt==null || !combatArt) {
                ItemControl.decreaseLimit(active, BattlerChecker.getBaseWeapon(active));
            }
        }
    }

    //Don't count hidden skills for the unit count of skills
    SkillChecker.arrangeSkill = function(unit, skill, increaseType) {
		var list = unit.getSkillReferenceList();
		var count = list.getTypeCount() - list.getHiddenCount()
		var editor = root.getDataEditor();
		
		if (increaseType === IncreaseType.INCREASE) {
            // Check if it doesn't exceed "Max Skill" of the config.            
			if (count < DataConfig.getMaxSkillCount() || skill.isHidden()) {
				editor.addSkillData(list, skill);
			}
		}
		else if (increaseType === IncreaseType.DECREASE) {
			editor.deleteSkillData(list, skill);
		}
		else if (increaseType === IncreaseType.ALLRELEASE) {
			editor.deleteAllSkillData(list);
		}
    }

    //Adds support bonus from the selected combat art
    var alias3 = SupportCalculator.createTotalStatus;
    SupportCalculator.createTotalStatus = function(unit) {
        var totalStatus = alias3.call(this, unit);
        var currentArt = root.getMetaSession().global.selectedArt;
        //This function only works correctly if the combat art is used only by player units
        if (currentArt!=null && unit.getUnitType() == UnitType.PLAYER) {
            var content = currentArt.getOriginalContent();

            totalStatus.powerTotal += content.getValue(0);
            totalStatus.hitTotal += content.getValue(1);
            totalStatus.criticalTotal += content.getValue(2);
            totalStatus.defenseTotal += content.getValue(3);	
            totalStatus.avoidTotal += content.getValue(4);	
            totalStatus.criticalAvoidTotal += content.getValue(5);
        }

        return totalStatus;
    }

    //Combat calculations are over, so now the selected combat art is set to null
    var alias4 = VirtualAttackControl.createVirtualAttackUnit;
    VirtualAttackControl.createVirtualAttackUnit = function(unitSelf, targetUnit, isSrc, attackInfo) {
        var toReturn = alias4.call(this, unitSelf, targetUnit, isSrc, attackInfo);

        var currentArt = root.getMetaSession().global.selectedArt;
        if (currentArt!=null) {
            root.getMetaSession().global.selectedArt = null;
        }

        return toReturn;
    }

    //Adds the Combat Art window to the unit menu screen
    var alias5 = UnitMenuScreen._configureBottomWindows;
    UnitMenuScreen._configureBottomWindows = function(groupArray) {
        alias5.call(this, groupArray);
        groupArray.appendWindowObject(CombatArtMenuBottomWindow, this);
    }

    //Adds the CombatArtEventCommand to the list of custom event commands
    var alias6 =ScriptExecuteEventCommand._configureOriginalEventCommand;
    ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
        alias6.call(this, groupArray);
        groupArray.appendObject(CombatArtEventCommand);
	}

})()
