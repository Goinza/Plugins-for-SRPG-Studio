//Plugin by Goinza

(function() {
    //THE FOLLOWING FUNCTIONS AFFECT HOW COMBAT WORKS USING WEAPONS FROM ORIGINAL DATA ENTRIES

    //The Attack command will display if the unit has a magic skill
    var alias1 = AttackChecker.isUnitAttackable;
    AttackChecker.isUnitAttackable = function(unit) {
        var attackable = alias1.call(this, unit);

        if (!attackable) {
            var i, item, indexArray;
            var attackSpells = MagicAttackControl.getAttackSpells(unit);
            
            for (i = 0; i < attackSpells.length; i++) {
                item = attackSpells[i];
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
        
        var attackSpells = MagicAttackControl.getAttackSpells(unit);
        for (i=0; i<attackSpells.length; i++) {
            item = attackSpells[i];    
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

        var attackSpells = MagicAttackControl.getAttackSpells(this._unit);
        for (var i=0; i<attackSpells.length; i++) {
            item = attackSpells[i];
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
            var i, item;
            var supportSpells = MagicAttackControl.getSupportSpells(unit);
            
            for (i = 0; i < supportSpells.length; i++) {
                item = supportSpells[i];
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
        
        var supportSpells = MagicAttackControl.getSupportSpells(unit);
        for (i=0; i<supportSpells.length; i++) {
            item = supportSpells[i]; 
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

        var supportSpells = MagicAttackControl.getSupportSpells(this._unit);
        for (var i=0; i<supportSpells.length; i++) {
            item = supportSpells[i];
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
        
        var attackSpells = MagicAttackControl.getAttackSpells(this._unit);
        var supportSpells = MagicAttackControl.getSupportSpells(this._unit);
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
            var attackSpells = MagicAttackControl.getAttackSpells(unit);
            var supportSpells = MagicAttackControl.getSupportSpells(unit);
            displayable = attackSpells.length>0 || supportSpells.length>0; 
        }

        return displayable;
    }

    //Allows for AI units to use weapons from skills
    var alias8 = CombinationCollector.Weapon.collectCombination;
    CombinationCollector.Weapon.collectCombination = function(misc) {
        alias8.call(this, misc);
        var unit = misc.unit;
        var spells = MagicAttackControl.getAttackSpells(unit);
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
            var spells = MagicAttackControl.getAttackSpells(unit);
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

        var spells = MagicAttackControl.getSupportSpells(unit);
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
    
    //Add spells for units when they learn a spell in the middle of a chapter
    var alias19 = ExperienceControl.obtainData;
    ExperienceControl.obtainData = function(unit) {
        alias19.call(this, unit);
        MagicAttackControl.checkSpells(unit);
    }

    var alias18 = ClassChangeItemUse.mainAction;
    ClassChangeItemUse.mainAction = function() {
        alias18.call(this);
        var itemTargetInfo = this._itemUseParent.getItemTargetInfo();
        MagicAttackControl.checkSpells(itemTargetInfo.unit);
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
        if (unit!=null && unit.custom.spellsAttack==null) {
            MagicAttackControl.setSpells(unit);
        }
    }
    //We are missing the guest units. Note: The event guests are covered in alias15

    //Resets item data from the custom parameters when loading the game.
    //This is done because objects like items can't be saved correctly as custom parameters when the game ends.
    var alias16 = ScriptCall_Load;
    ScriptCall_Load = function() {
        alias16.call(this);    
        MagicAttackControl.clear();
        var scene = root.getBaseScene()
        if (scene == SceneType.FREE) {
            MagicAttackControl.deserialize();
        }
        else {
            MagicAttackControl.setSpellsPlayerUnits();
        } 
    }

    var alias17 = LoadSaveScreen._executeSave;
    LoadSaveScreen._executeSave = function() {
        var scene = root.getBaseScene()
        if (scene == SceneType.FREE) {
            MagicAttackControl.serialize();
        }
        alias17.call(this);
    }

})();

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


        var attackSpells = MagicAttackControl.getAttackSpells(unit);
        for (i=0; i<attackSpells.length; i++) {
            item = attackSpells[i];    
            if (item!=null) {       
                this.objectSet(item);
            }
        }

        var supportSpells = MagicAttackControl.getSupportSpells(unit);
        for (i=0; i<supportSpells.length; i++) {
            item = supportSpells[i];  
            if (item!=null) {       
                this.objectSet(item);
            }
        }
        
        this.objectSetEnd();
        
        this.resetAvailableData();
    }
})