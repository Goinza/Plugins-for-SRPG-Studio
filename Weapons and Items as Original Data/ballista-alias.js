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