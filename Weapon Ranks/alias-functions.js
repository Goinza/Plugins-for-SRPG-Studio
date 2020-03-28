//Plugin by Goinza

(function() {
    //Checks if the unit has the proper rank to equip the weapon
    var alias01 = ItemControl.isWeaponAvailable;
    ItemControl.isWeaponAvailable = function(unit, item) {
        var available = alias01.call(this, unit, item);
        var weaponType, i, found, count, unitValue, weaponValue;
        if (available) {
            weaponType = item.getWeaponType();
            i = 0;
            found = false;
            count = ParamType.COUNT;
            unitValue = 0;
            weaponValue = 1;

            //Finds the unit's rank
            while (i<count && !found) {
                if (ParamGroup.getParameterName(i)==weaponType.getName()) {
                    found = true;
                    unitValue = ParamGroup.getLastValue(unit, i, item);
                }
                i++;
            }

            //Finds the weapon requirement
            i = 0;
            found = false;
            weaponValue = item.custom.req!=null ? item.custom.req : RANK_SYSTEM[0][0];    
            if (typeof weaponValue != 'string') {
                throwError001(item);
            } 

            //Unit rank must be equal or greater than the weapon rank
            weaponValue = WeaponRankControl.rankToNumber(weaponValue);
            available = unitValue>=weaponValue;      
        }

        return available;
    };

    var alias02 = ItemControl.isItemUsable;
    ItemControl.isItemUsable = function(unit, item) {
        available = alias02.call(this, unit, item);
        var defaultItemType = root.getBaseData().getWeaponTypeList(3).getDataFromId(1);

        var weaponType, i, found, count, unitValue, weaponValue;

        if (available && item.getWeaponType()!=defaultItemType) {
            weaponType = item.getWeaponType();
            i = 0;
            found = false;
            count = ParamType.COUNT;
            unitValue = 0;
            weaponValue = 1;

            //Finds the unit's rank
            while (i<count && !found) {
                if (ParamGroup.getParameterName(i)==weaponType.getName()) {
                    found = true;
                    unitValue = ParamGroup.getLastValue(unit, i, item);                
                }
                i++;
            }

            //Finds the weapon requirement
            i = 0;
            found = false;
            weaponValue = item.custom.req!=null ? item.custom.req : RANK_SYSTEM[0][0];     
            if (typeof weaponValue != 'string') {
                throwError001(item);
            }     

            //Unit rank must be equal or greater than the weapon rank
            weaponValue = WeaponRankControl.rankToNumber(weaponValue);
            available = unitValue>=weaponValue;
        }

        return available;
    };

    //Adding the Rank Sentence to weapons
    var alias03 = ItemInfoWindow._configureWeapon;
    ItemInfoWindow._configureWeapon = function(groupArray) {
        alias03.call(this, groupArray);
        groupArray.appendObject(ItemSentence.Rank);
    };

    //Adding the Rank Sentence to staves
    var alias04 = ItemInfoWindow._configureItem;
    ItemInfoWindow._configureItem = function(groupArray) {
        alias04.call(this, groupArray);
        groupArray.appendObject(ItemSentence.Rank);
    }

    //The Sentence on the item's description. Only works for weapons and staves
    ItemSentence.Rank = defineObject(BaseItemSentence, {
        drawItemSentence: function(x, y, item) {
            var weaponType = item.getWeaponType();
            var i, wepaonValue;
            var defaultItemType = root.getBaseData().getWeaponTypeList(3).getDataFromId(1);
            if (item.isWeapon() || item.getWeaponType()!=defaultItemType) {
                //Default weapon type
                //Finds the weapon requirement
                weaponValue = item.custom.req!=null ? item.custom.req : RANK_SYSTEM[0][0];
                if (typeof weaponValue != 'string') {
                    throwError001(item);
                } 

                //Draws the weapon rank
                ItemInfoRenderer.drawKeyword(x, y, weaponType.getName());
                x += ItemInfoRenderer.getSpaceX();
                var textui = root.queryTextUI('infowindow_title');
                var font = textui.getFont();
                TextRenderer.drawKeywordText(x, y, weaponValue, 2, 0xffffff, font);             
            }
        },
        
        getItemSentenceCount: function(item) {
            var defaultItemType = root.getBaseData().getWeaponTypeList(3).getDataFromId(1);
            return item.isWeapon() || item.getWeaponType()!=defaultItemType ? 1 : 0; 
        }
    });

    //Handles the weapon experience gain with weapons (NOT STAVES)
    var alias05 = NormalAttackOrderBuilder._endVirtualAttack;
    NormalAttackOrderBuilder._endVirtualAttack = function(virtualActive, virtualPassive) {
        alias05.call(this, virtualActive, virtualPassive);
        var oldValue, newValue, wexp, skill;
        var paramType = 0;
        var found = false;
        if (virtualActive.unitSelf.getUnitType() === UnitType.PLAYER && virtualActive.weapon!=null) {
            //The player unit is the active unit
            while (paramType<ParamType.COUNT && !found) {
                if (ParamGroup.getParameterName(paramType)==virtualActive.weapon.getWeaponType().getName()) {
                    found = true
                }
                else {
                    paramType++;
                }
            }

            if (found) {        
                wexp = virtualActive.weapon.custom.wexp!=null ? virtualActive.weapon.custom.wexp : 0;
                if (typeof wexp != 'number') {
                    throwError002(virtualActive.weapon);
                }

                skill = SkillControl.getPossessionCustomSkill(virtualActive.unitSelf, "Discipline");
                if (skill!=null) {
                    if (typeof skill.custom.multiplier != 'number') {
                        throwError003(skill);
                    }
                    wexp = Math.round(skill.custom.multiplier * wexp);
                }
                oldValue = ParamGroup.getUnitValue(virtualActive.unitSelf, paramType);
                newValue = oldValue + wexp;
                ParamGroup.setUnitValue(virtualActive.unitSelf, paramType, newValue);
                WeaponRankControl.checkRankUp(virtualActive.unitSelf, paramType, newValue-oldValue);
            }      
        }
        else if (virtualPassive.unitSelf.getUnitType() === UnitType.PLAYER && virtualPassive.weapon!=null) {
            //The player unit is the passive unit
            while (paramType<ParamType.COUNT && !found) {
                if (ParamGroup.getParameterName(paramType)==virtualPassive.weapon.getWeaponType().getName()) {
                    found = true;
                }
                else {
                    paramType++;
                }
            }

            if (found) {        
                wexp = virtualPassive.weapon.custom.wexp!=null ? virtualPassive.weapon.custom.wexp : 0;
                if (typeof wexp != 'number') {
                    throwError002(virtualActive.weapon);
                }

                skill = SkillControl.getPossessionCustomSkill(virtualPassive.unitSelf, "Discipline");
                if (skill!=null) {
                    if (typeof skill.custom.multiplier != 'number') {
                        throwError003(skill);
                    }
                    wexp = Math.round(skill.custom.multiplier * wexp);
                }
                oldValue = ParamGroup.getUnitValue(virtualPassive.unitSelf, paramType);
                newValue = oldValue + wexp;
                ParamGroup.setUnitValue(virtualPassive.unitSelf, paramType, newValue);
                WeaponRankControl.checkRankUp(virtualPassive.unitSelf, paramType, newValue-oldValue);
            }      
        }
    };

    //Handles the weapon experience gain with staves and other item custom types
    var alias06 = ItemExpFlowEntry._completeMemberData;
    ItemExpFlowEntry._completeMemberData = function(itemUseParent) {
        alias06.call(this, itemUseParent);
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        var paramType = 0;
        var found = false;
        var wexp = 0;
        var value, skill;
        var defaultItemType = root.getBaseData().getWeaponTypeList(3).getDataFromId(1);
        if (unit.getUnitType() === UnitType.PLAYER && item.getWeaponType()!=defaultItemType) {
            while (paramType<ParamType.COUNT && !found) {
                if (ParamGroup.getParameterName(paramType)==item.getWeaponType().getName()) {
                    found = true
                }
                else {
                    paramType++;
                }
            }

            if (found) {        
                wexp = item.custom.wexp!=null ? item.custom.wexp : 0;
                if (typeof wexp != 'number') {
                    throwError002(item);
                }

                skill = SkillControl.getPossessionCustomSkill(unit, "Discipline");
                if (skill!=null) {
                    if (typeof skill.custom.multiplier != 'number') {
                        throwError003(skill);
                    }
                    wexp = Math.round(skill.custom.multiplier * wexp);
                }

                value = ParamGroup.getUnitValue(unit, paramType) + wexp;
                ParamGroup.setUnitValue(unit, paramType, value);
            }      
        }
    };

    //If the item is not the default "Item" type, then add the magic stat of the unit to the recovery value.
    //It also checks that the item is not a wand, because in that case the stat was already added.
    var alias07 = Calculator.calculateRecoveryItemPlus;
    Calculator.calculateRecoveryItemPlus = function(unit, targetUnit, item) {
        var plus = alias07.call(this, unit, targetUnit, item);
        var defaultItemType = root.getBaseData().getWeaponTypeList(3).getDataFromId(1);
        if (!item.isWand() && item.getWeaponType()!=defaultItemType) {
            plus += ParamBonus.getMag(unit);
        }

        return plus;
    };

    //Instead of using getDopingParamter, this function is used to change the weapon ranks
    //Normally, a parameter gets a constant number for a doping bonus,
    //but in the case of the weapon ranks we must calculate how much experience is needed to get to the next rank.
    //So the amount of weapon experience can be any number, always being the exact number that is needed to increase weapon rank.
    var alias08 = ParameterControl.addDoping;
    ParameterControl.addDoping = function(unit, obj) {
        alias08.call(this, unit, obj);    
        
        //If the object does not have the custom property, it means you can't use it increase a weapon rank.
        //This happens when you try to use the event Parameter Change to increase/decrease normal stats.
        if (obj.custom!=null) {
            //Increases the rank of weapon types used by the unit
            var bonusArray = obj.custom.rankUp!=null ? obj.custom.rankUp : null;
            var i, j, found, difference, unitValue;
            var weapon = ItemControl.getEquippedWeapon(unit);
            if (bonusArray!=null) {
                if (typeof bonusArray.length !='number') {
                    throwError006(obj);
                }
                for (i=0; i<bonusArray.length; i++) {
                    j = 0;
                    found = false;
                    //Finds the unit's rank
                    while (j<ParamType.COUNT && !found) {
                        if (ParamGroup.getParameterName(j)==bonusArray[i]) {
                            //Increases the rank of the weapon type if the unit has at least E rank on it.
                            found = true;
                            unitValue = ParamGroup.getLastValue(unit, j, weapon)
                            difference = WeaponRankControl.numberToMaxRank(unitValue) - unitValue;
                            this.changeParameter(unit, j, difference);
                        }
                        j++;
                    }
                }
            }
        
            //Adds new rank for unused weapon types
            var bonusArray = obj.custom.rankNew!=null ? obj.custom.rankNew : null;
            i = 0;
            if (bonusArray!=null) {
                if (typeof bonusArray.length !='number') {
                    throwError004(obj);
                }
                for (i=0; i<bonusArray.length; i++) {
                    j = 0;
                    found = false;
                    //Finds the unit's rank
                    while (j<ParamType.COUNT && !found) {
                        if (ParamGroup.getParameterName(j)==bonusArray[i]) {
                            found = true;
                            unitValue = ParamGroup.getLastValue(unit, j, weapon);
                            if (unitValue==0) {
                                //Guarantees a E rank with weapon types that the unit has no rank
                                this.changeParameter(unit, j, 1);
                            }
                        }
                        j++;
                    }
                }
            }

            //Increases the rank for a fixed amount of wexp
            var bonusArray = obj.custom.rankPlus!=null ? obj.custom.rankPlus : null;
            i = 0;
            if (bonusArray!=null) {
                if (typeof bonusArray.length !='number') {
                    throwError005(obj);
                }
                for (i=0; i<bonusArray.length; i++) {
                    j = 0;
                    found = false;
                    //Finds the unit's rank
                    while (j<ParamType.COUNT && !found) {
                        //bonusArray[i][0] is the name. bonusArray[i][1] is the wexp
                        if (ParamGroup.getParameterName(j)==bonusArray[i][0]) {
                            found = true;
                            this.changeParameter(unit, j, bonusArray[i][1]);
                        }
                        j++;
                    }
                }
            }
        }    
    }

    //Merges all weapon and item types with the same name under the same convoy category.
    //Remember that if you have a weapon type and an item type with the same type, you need to hide one of them turning off the option "Display on Convoy Screen".
    ItemListScrollbar.setStockItemFormationFromWeaponType = function(weapontype) {
        var i, item;
        var maxCount = StockItemControl.getStockItemCount();
        
        this._unit = null;
        
        this.resetScrollData();
        
        for (i = 0; i < maxCount; i++) {
            item = StockItemControl.getStockItem(i);
            if (item.getWeaponType().getName() === weapontype.getName()) {
                this.objectSet(item);
            }
        }
        
        this.objectSetEnd();
        
        this.resetAvailableData();
    }

    var alias09 = AttackFlow.moveEndFlow;
    AttackFlow.moveEndFlow = function() {
        var result = alias09.call(this);
        
        if (result==MoveResult.END) {
            WeaponRankControl.showRankUp();
        }
        
        return result;
    }

    //Adds the weapon ranks as parameters. The RankUnitParamete object is defined in ranks-parameter.js
    var alias10 = ParamGroup._configureUnitParameters;
    ParamGroup._configureUnitParameters = function(groupArray) {
        alias10.call(this, groupArray);

        var namesArray = [];
        var h;
        for (h=0; h<4; h++) {
            var weaponTypeList = root.getBaseData().getWeaponTypeList(h);
            var i, weaponRank;
            j = groupArray.length;
            for (i=0; i<weaponTypeList.getCount(); i++) {            
                if (!this.isSameName(namesArray, weaponTypeList.getData(i).getName())) {
                    weaponRank = createObject(RankUnitParameter);
                    weaponRank.setRank(weaponTypeList.getData(i).getName(), j);
                    groupArray.appendObject(weaponRank);
                    j++;
                    namesArray[namesArray.length] = weaponTypeList.getData(i).getName();
                }            
            }
            ParamType.COUNT = j;
        }    
    }

    //Used by alias10
    ParamGroup.isSameName = function(array, name) {
        var i = 0;
        var found = false;
        while (i<array.length && !found) {
            found = (array[i]==name);
            i++;
        }
    
        return found;
    }
    
	var alias11 = UnitMenuScreen._configureBottomWindows;
	UnitMenuScreen._configureBottomWindows = function(groupArray) {
		alias11.call(this, groupArray);
		groupArray.appendWindowObject(WeaponRanksWindow, this);
	}
	
}) ()