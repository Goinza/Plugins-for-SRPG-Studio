//Plugin by Goinza

(function() {
    //THE FOLLOWING FUNCTIONS AFFECT HOW COMBAT WORKS USING WEAPONS FROM SKILLS

    //The Attack command will display if the unit has a magic skill
    var alias1 = AttackChecker.isUnitAttackable;
    AttackChecker.isUnitAttackable = function(unit) {
        var attackable = alias1.call(this, unit);

        if (!attackable) {
            var i, skill, item, indexArray;
            var magicSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillAttack");
            
            for (i = 0; i < magicSkills.length; i++) {
                skill = magicSkills[i].skill;
                item = MagicAttackControl.getWeaponFromUnit(unit, root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));
                if (item !== null && ItemControl.isWeaponAvailable(unit, item)) {
                    indexArray = this.getAttackIndexArray(unit, item, true);
                    if (indexArray.length !== 0) {
                        return true;
                    }
                }
            }
        }

        return attackable;
    }

    //The weapon select menu will account for the weapons of magic skills
    WeaponSelectMenu._setWeaponbar = function(unit) {
		var i, item;
		var count = UnitItemControl.getPossessionItemCount(unit);
		var scrollbar = this._itemListWindow.getItemScrollbar();
		
		scrollbar.resetScrollData();
		
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			if (this._isWeaponAllowed(unit, item)) {
				scrollbar.objectSet(item);
			}
        }
        
        var magicSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillAttack");
        var skill;
        for (i=0; i<magicSkills.length; i++) {
            skill = magicSkills[i].skill;
            item = MagicAttackControl.getWeaponFromUnit(unit, root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));        
            if (this._isWeaponAllowed(unit, item)) {       
				scrollbar.objectSet(item);
			}
        }
		
		scrollbar.objectSetEnd();
    }
    
    //The weapon select menu will display correctly the weapons of magic skills
    var alias2 = WeaponSelectMenu.getWeaponCount;
    WeaponSelectMenu.getWeaponCount = function() {
        var count = alias2.call(this);

        var magicSkills = SkillControl.getDirectSkillArray(this._unit, SkillType.CUSTOM, "SkillAttack");
        var skill;
        for (var i=0; i<magicSkills.length; i++) {
            skill = magicSkills[i].skill;
            item = MagicAttackControl.getWeaponFromUnit(this._unit, root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));
            if (this._isWeaponAllowed(this._unit, item)) {
				count++;
			}
        }

        return count;
    }

    //Changes to how the code gets and sets the equipped weapon to account for the skill attack weapons.
    var alias3 = ItemControl.setEquippedWeapon;
    ItemControl.setEquippedWeapon = function(unit, item) {
        if (item!=null && item.custom.magic!=null) {
            unit.custom.equipped = MagicAttackControl.getWeaponFromUnit(unit, item);
        }
        else {
            unit.custom.equipped = null;
            alias3.call(this, unit, item);
        }

    }

    var alias4 = ItemControl.getEquippedWeapon;
    ItemControl.getEquippedWeapon = function(unit) {
        return unit.custom.equipped!=null ? unit.custom.equipped : alias4.call(this, unit);
    }

    //CHANGES TO MAKE STAVES BE USABLE FROM THE SKILLS
    //The Staff command will display if the unit has a magic skill
    var alias5 = WandChecker.isWandUsable;
    WandChecker.isWandUsable = function(unit) {
        var usable = alias5.call(this, unit);

        if (!usable) {
            var i, skill, item;
            var magicSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillSupport");
            
            for (i = 0; i < magicSkills.length; i++) {
                skill = magicSkills[i].skill;
                item = MagicAttackControl.getWandFromUnit(unit, root.getBaseData().getItemList().getDataFromId(skill.custom.item));
                if (item !== null) {
                    if (this.isWandUsableInternal(unit, item)) {
                        return true;
                    }
                }
            }
        }

        return usable;
    }

    //The wand select menu will account for the item of magic skills
    WandSelectMenu._setWandbar = function(unit) {
		var i, item;
		var count = UnitItemControl.getPossessionItemCount(unit);
		var scrollbar = this._itemListWindow.getItemScrollbar();
		
		scrollbar.resetScrollData();
		
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			if (this._isWandAllowed(unit, item)) {
				scrollbar.objectSet(item);
			}
        }
        
        var magicSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillSupport");
        var skill;
        for (i=0; i<magicSkills.length; i++) {
            skill = magicSkills[i].skill;
            item = MagicAttackControl.getWandFromUnit(unit, root.getBaseData().getItemList().getDataFromId(skill.custom.item));        
            if (this._isWandAllowed(unit, item)) {       
				scrollbar.objectSet(item);
			}
        }
		
		scrollbar.objectSetEnd();
	}

    //The wand select menu will display correctly the staves of magic skills
    var alias6 = WandSelectMenu.getWandCount;
    WandSelectMenu.getWandCount = function() {
        var count = alias6.call(this);

        var magicSkills = SkillControl.getDirectSkillArray(this._unit, SkillType.CUSTOM, "SkillSupport");
        var skill;
        for (var i=0; i<magicSkills.length; i++) {
            skill = magicSkills[i].skill;
            item = MagicAttackControl.getWandFromUnit(this._unit, root.getBaseData().getItemList().getDataFromId(skill.custom.item));
            if (this._isWandAllowed(this._unit, item)) {
				count++;
			}
        }

        return count;
    }

    //CHANGES TO MAKE BOTH TYPES OF SPELLS BE VISIBLE IN THE ITEM COMMAND
    //Shows the weapons and items from skills on the Item command list
    ItemSelectMenu.setMenuTarget = function(unit) {
        this._unit = unit;
		
		this._itemListWindow = createWindowObject(ItemAndSpellListWindow, this);
		this._itemInfoWindow = createWindowObject(ItemInfoWindow, this);
		this._itemWorkWindow = createWindowObject(ItemWorkWindow, this);
		this._discardManager = createObject(DiscardManager);
		
		this._itemWorkWindow.setupItemWorkWindow();
		
		this._resetItemList();
		
		this._processMode(ItemSelectMenuMode.ITEMSELECT);
    }

    //Changes the size of the item scrollbar to make it fit the weapons and items from skills
    ItemSelectMenu._resetItemList = function() {
		var count = UnitItemControl.getPossessionItemCount(this._unit);
        var visibleCount = 8;
        
        var attackSpells = SkillControl.getDirectSkillArray(this._unit, SkillType.CUSTOM, "SkillAttack");
        var supportSpells = SkillControl.getDirectSkillArray(this._unit, SkillType.CUSTOM, "SkillSupport");
        count += attackSpells.length + supportSpells.length;
		
		if (count > visibleCount) {
			count = visibleCount;
		}      

		this._itemListWindow.setItemFormation(count);
		this._itemListWindow.setUnitItemFormation(this._unit);
	}
    
    //Shows the Item command if the unit has weapons or items from skills
    var alias7 = UnitCommand.Item.isCommandDisplayable;
    UnitCommand.Item.isCommandDisplayable = function() {
        var displayable = alias7.call(this);

        if (!displayable) {
            var unit = this.getCommandTarget();
            var attackSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillAttack");
            var supportSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillSupport");
            displayable = attackSkills.length>0 || supportSkills.length>0; 
        }

        return displayable;
    }

    //Allows for AI units to use weapons from skills
    var alias8 = CombinationCollector.Weapon.collectCombination;
    CombinationCollector.Weapon.collectCombination = function(misc) {
        alias8.call(this, misc);
        var unit = misc.unit;
        var spells = unit.custom.spellsAttack;
		var weapon;
		for (var i=0; i<spells.length; i++) {
			weapon = spells[i];
			if (this._isWeaponEnabled(unit, weapon, misc)) {
				misc.item = weapon;
			
				rangeMetrics = StructureBuilder.buildRangeMetrics();
				rangeMetrics.startRange = weapon.getStartRange();
				rangeMetrics.endRange = weapon.getEndRange();
				
				filter = this._getWeaponFilter(unit);
				this._checkSimulator(misc);
				this._setUnitRangeCombination(misc, filter, rangeMetrics);
			}
		}
    }

    //Renders the weapon range panel for AI units with weapons from skills
    var alias9 = UnitRangePanel.getUnitAttackRange;
    UnitRangePanel.getUnitAttackRange = function(unit) {
        var obj = alias9.call(this, unit);
        if (unit.getUnitType() != UnitType.PLAYER) {
            var spells = unit.custom.spellsAttack;
            var weapon;
            for (var i=0; i<spells.length; i++) {
                weapon = spells[i];
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
        }

        return obj;
    }

    var alias10 = CombinationCollector.Item.collectCombination;
    CombinationCollector.Item.collectCombination = function(misc) {
        alias10.call(this, misc);
        var unit = misc.unit;

        var spells = unit.custom.spellsSupport;
        var item;
        for (var i = 0; i < spells.length; i++) {
			item = spells[i];
			if (item === null) {
				continue;
			}
			
			// Don't continue if it's not an item or cannot use the item.
			if (item.isWeapon() || !this._isItemEnabled(unit, item, misc)) {
				continue;
			}
			
			obj = ItemPackageControl.getItemAIObject(item);
			if (obj === null) {
				continue;
			}
			
			// It depends on the item about what the item is used for.
			// The recovery item is used for the specific unit, but if it's a key, it's used a specific place. 
			actionTargetType = obj.getActionTargetType(unit, item);
			
			misc.item = item;
			misc.actionTargetType = actionTargetType;
			
			this._setCombination(misc);
		}
    }

    //Override of the functions _setTemporaryWeapon and _resetTemporaryWeapon to remove any problems with spells
    //This coud lead to the AI not choosing the best weapon available in some very particular cases.
    AIScorer.Weapon._setTemporaryWeapon = function(unit, combination) {
		return 0;
	},
	
	AIScorer.Weapon._resetTemporaryWeapon = function(unit, combination, prevItemIndex) {
    }
    
    //Add spells for units when they learn a skill in the middle of a chapter
    var alias11 = AllEventFlowEntry._skillChange;
    AllEventFlowEntry._skillChange = function(generator, targetUnit, command) {
        alias11.call(this, generator, targetUnit, command);
        MagicAttackControl.addSpell(targetUnit, command.getTargetSkill());
    }

    var alias12 = SkillChangeItemUse.enterMainUseCycle;
    SkillChangeItemUse.enterMainUseCycle = function(itemUseParent) {
        alias12.call(this, itemUseParent);
        var itemTargetInfo = itemUseParent.getItemTargetInfo();
        var info = itemTargetInfo.item.getSkillChangeInfo();
        MagicAttackControl.addSpell(itemTargetInfo.targetUnit, info.getSkill());
    }

    var alias13 = SkillChecker.arrangeSkill;
    SkillChecker.arrangeSkill = function(unit, skill, increaseType) {
        alias13.call(this, unit, skill, increaseType);
        if (increaseType == IncreaseType.INCREASE) {
            MagicAttackControl.addSpell(unit, skill);
        }
    }

    //Adds spells to reinforcements
    var alias14 = ReinforcementChecker._appearUnit;
    ReinforcementChecker._appearUnit = function(pageData, x, y) {
        var unit = alias14.call(this, pageData, x, y);
        if (unit!=null) {
            MagicAttackControl.setSpells(unit);
        }

        return unit;
    }

    //Adds spells to event units
    var alias15 = ScriptCall_AppearEventUnit;
    ScriptCall_AppearEventUnit = function(unit) {
        alias15.call(this, unit);
        if (unit.custom.spellsAttack==null) {
            //root.log(unit.getName());
            MagicAttackControl.setSpells(unit);
        }
    }

    //We are missing the guest units. Note: The event guests are covered in alias15

})();

MagicAttackControl = {

    setSpellsAllUnits: function() {
        var groupArray = [];
        groupArray.push(PlayerList.getAliveList());
        groupArray.push(EnemyList.getAliveList());
        groupArray.push(AllyList.getAliveList());

        var list, unit, magicSkills, skill, item;
        for (var h=0; h<groupArray.length; h++) {
            list = groupArray[h];
            for (var i=0; i<list.getCount(); i++) {
                unit = list.getData(i);
                this.setSpells(unit);
            }
        }
    },

    setSpells: function(unit) {
        var magicSkills, skill, item;
        //Skill weapons
        magicSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillAttack");
        unit.custom.spellsAttack = [];
        for (var j=0; j<magicSkills.length; j++) {
            skill = magicSkills[j].skill;
            item = root.duplicateItem(root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));
            unit.custom.spellsAttack.push(item);
        }
        //Equip the first skill if the unit doesn't have any normal weapon
        if (unit.custom.spellsAttack.length>0 && ItemControl.getEquippedWeapon(unit)==null) {
            unit.custom.equipped = unit.custom.spellsAttack[0];
        }
        //Skill items
        magicSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillSupport");
        unit.custom.spellsSupport = [];
        for (var j=0; j<magicSkills.length; j++) {
            skill = magicSkills[j].skill;
            item = root.duplicateItem(root.getBaseData().getItemList().getDataFromId(skill.custom.item));
            unit.custom.spellsSupport.push(item);
        }

        this.setMagicUses(unit);
    },

    addSpell: function(unit, skill) {
        var item;
        if (skill!=null && skill.getSkillType()==SkillType.CUSTOM) {            
            if (skill.getCustomKeyword() == "SkillAttack") {
                item = root.duplicateItem(root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));
                unit.custom.spellsAttack.push(item);
            }
            else if (skill.getCustomKeyword() == "SkillSupport") {
                item = root.duplicateItem(root.getBaseData().getItemList().getDataFromId(skill.custom.item));
                unit.custom.spellsSupport.push(item);
            }
        }
    },

    getWeaponFromUnit: function(unit, weapon) {
        var unitWeapon = null;
        var spells = unit.custom.spellsAttack;
        var i = 0;
        var found = false;
        while (i<spells.length && !found) {
            if (spells[i].getId() == weapon.getId()) {
                found = true;
                unitWeapon = spells[i];
            }
            i++;
        }            
        
        return unitWeapon;
    },

    getWandFromUnit: function(unit, item) {
        var unitItem = null;
        var spells = unit.custom.spellsSupport;
        var i = 0;
        var found = false;
        while (i<spells.length && !found) {
            if (spells[i].getId() == item.getId()) {
                found = true;
                unitItem = spells[i];
            }
            i++;
        }        

        return unitItem;
    },

    setMagicUses: function(unit) {
        var spells, item, type;

        var black = SkillControl.getPossessionCustomSkill(unit, "DoubleBlackUses");
        var white = SkillControl.getPossessionCustomSkill(unit, "DoubleWhiteUses");
        var dark = SkillControl.getPossessionCustomSkill(unit, "DoubleDarkUses");

        spells = unit.custom.spellsAttack;
        for (var j=0; j<spells.length; j++) {
            item = spells[j];
            if (item.custom.magic!=null && item.custom.magic) {
                type = item.custom.type;
                if (type == "Black" && black!=null) {
                    item.setLimit(item.getLimitMax());
                }
                else if (type == "Dark" && dark!=null) {
                    item.setLimit(item.getLimitMax());
                }
                else if (type == "White" && white!=null) {
                    item.setLimit(item.getLimitMax());
                }
                else {
                    item.setLimit(Math.ceil(item.getLimitMax()/2));
                }
            }
        }
        spells = unit.custom.spellsSupport; 
        for (var j=0; j<spells.length; j++) {
            item = spells[j];
            if (item.custom.magic!=null && item.custom.magic) {                
                type = item.custom.type;
                if (type == "Black" && black!=null) {
                    item.setLimit(item.getLimitMax());
                }
                else if (type == "Dark" && dark!=null) {
                    item.setLimit(item.getLimitMax());
                }
                else if (type == "White" && white!=null) {
                    item.setLimit(item.getLimitMax());
                }
                else {
                    item.setLimit(Math.ceil(item.getLimitMax()/2));
                }
            }
        }
    }
}

//CHANGES TO MAKE BOTH TYPES OF SPELLS BE VISIBLE IN THE ITEM COMMAND
var ItemAndSpellListWindow = defineObject(ItemListWindow, {

    initialize: function() {
		this._scrollbar = createScrollbarObject(ItemAndSpellListScrollbar, this);
	}        
})

var ItemAndSpellListScrollbar = defineObject(ItemListScrollbar, {    
    
    //Shows the weapons and items from skills on the Item command list
    setUnitItemFormation: function(unit) {
        var i, item;
        var maxCount = DataConfig.getMaxUnitItemCount();
        
        this._unit = unit;
        
        this.resetScrollData();
        
        for (i = 0; i < maxCount; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (item !== null) {
                this.objectSet(item);
            }
        }

        var magicSkills, skill;

        magicSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillAttack");
        skill;
        for (i=0; i<magicSkills.length; i++) {
            skill = magicSkills[i].skill;
            item = MagicAttackControl.getWeaponFromUnit(unit, root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));        
            if (item!=null) {       
                this.objectSet(item);
            }
        }

        magicSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillSupport");
        skill;
        for (i=0; i<magicSkills.length; i++) {
            skill = magicSkills[i].skill;
            item = MagicAttackControl.getWandFromUnit(unit, root.getBaseData().getItemList().getDataFromId(skill.custom.item));        
            if (item!=null) {       
                this.objectSet(item);
            }
        }
        
        this.objectSetEnd();
        
        this.resetAvailableData();
    }
})