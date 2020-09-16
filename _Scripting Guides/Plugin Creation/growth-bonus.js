(function() {

    var alias1 = ItemPackageControl.getCustomItemSelectionObject;
    ItemPackageControl.getCustomItemSelectionObject = function(item, keyword) {
        if (keyword == GROWTH_ITEM_KEYWORD) {
            return GrowthItemSelection;
        }

        return alias1.call(this, item, keyword);
    }

    var alias2 = ItemPackageControl.getCustomItemUseObject;
    ItemPackageControl.getCustomItemUseObject = function(item, keyword) {
        if (keyword == GROWTH_ITEM_KEYWORD) {
            return GrowthItemUse;
        }

        return alias2.call(this, item, keyword);
    }

    var alias3 = ItemPackageControl.getCustomItemInfoObject;
    ItemPackageControl.getCustomItemInfoObject = function(item, keyword) {
        if (keyword == GROWTH_ITEM_KEYWORD) {
            return GrowthItemInfo;
        }

        return alias3.call(this, item, keyword);
    }

    var alias4 = ItemPackageControl.getCustomItemPotencyObject;
    ItemPackageControl.getCustomItemPotencyObject = function(item, keyword) {
        if (keyword == GROWTH_ITEM_KEYWORD) {
            return GrowthItemPotency;
        }

        return alias4.call(this, item, keyword);
    }

    var alias5 = ItemPackageControl.getCustomItemAvailabilityObject;
    ItemPackageControl.getCustomItemAvailabilityObject = function(item, keyword) {
        if (keyword == GROWTH_ITEM_KEYWORD) {
            return GrowthItemAvailability;
        }

        return alias5.call(this, item, keyword);
    }

    var alias6 = ItemPackageControl.getCustomItemAIObject;
    ItemPackageControl.getCustomItemAIObject = function(item, keyword) {
        if (keyword == GROWTH_ITEM_KEYWORD) {
            return GrowthItemAI;
        }

        return alias6.call(this, item, keyword);
    }

})()

var GROWTH_ITEM_KEYWORD = "GrowthBonus";

var GrowthItemSelection = defineObject(BaseItemSelection, {

    //We use the default selection system for units from BaseItemSelection, so this object will be empty

})

var GrowthItemUse = defineObject(BaseItemUse, {

    _itemUseParent: null,

    enterMainUseCycle: function(itemUseParent) {
        this._itemUseParent = itemUseParent; //Store the object to use later
        this.mainAction(); //Main method of the object
        return EnterResult.OK;
    },

    mainAction: function() {
        var info = this._itemUseParent.getItemTargetInfo(); //Info of the escenario, including item, unit, targetUnit, etc
        var growth = info.targetUnit.getGrowthBonus(); //The list of the target unit's growths
        var bonus = info.item.custom.bonus; //Item's custom parameter
        var currentGrowth;

        for (var i=0; i<=ParamType.MDF; i++) {
            //Cycle through all stats except Mov, Wlv and Bld
            currentGrowth = growth.getAssistValue(i); //Old growth value
            growth.setAssistValue(i, currentGrowth + bonus); //New growth value
        }

        info.targetUnit.custom.usedGrowth = true; //Mark the unit so the bonus can't be applied again to it
    }

})

var GrowthItemInfo = defineObject(BaseItemInfo, {

    drawItemInfoCycle: function(x, y) {
        ItemInfoRenderer.drawKeyword(x, y, this.getItemTypeName("Growth")); //Item type name
        y += ItemInfoRenderer.getSpaceY(); //Continue in the next row

        ItemInfoRenderer.drawKeyword(x, y, "%"); //Draw the string '%'
		x += ItemInfoRenderer.getSpaceX(); //Space between the value name and the numerical value
        NumberRenderer.drawRightNumber(x, y, this._item.custom.bonus); //Growth rate bonus
        
        x += 40; //Space between bonus and range
        this.drawRange(x, y, this._item.getRangeValue(), this._item.getRangeType()); //Item range
    },

    getInfoPartsCount: function() {
        return 2; //Amount of rows used on the item's window
    }

})

var GrowthItemPotency = defineObject(BaseItemPotency, {

    setPosMenuData: function(unit, item, targetUnit) {
        this._value = item.custom.bonus;
    },

    drawPosMenuData: function(x, y, textui) {
        var font = textui.getFont();
		
		TextRenderer.drawKeywordText(x, y, this.getKeywordName(), -1, ColorValue.KEYWORD, font);
		NumberRenderer.drawNumber(x + 65, y, this._value);
    },

    getKeywordName: function() {
        return "%";
    }

})


var GrowthItemAvailability = defineObject(BaseItemAvailability, {

    //Only available for those units that haven't used the item yet
    isItemAllowed: function(unit, targetUnit, item) {
        return targetUnit.custom.usedGrowth == null;
    }

})

var GrowthItemAI = defineObject(BaseItemAI, {

    //AI units can't use the item, so this object must be empty

})