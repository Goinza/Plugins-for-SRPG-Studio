//Plugin by Goinza

(function() {
    //A custom item that gives a trait
    var TraitItemSelection = defineObject(BaseItemSelection, {

    });

    var TraitItemUse = defineObject(BaseItemUse, {
        _unit: null,
        _traitID: null,

        enterMainUseCycle: function(itemUseParent) {
            this._unit = itemUseParent.getItemTargetInfo().targetUnit;
            this._traitArray = TraitControl.getAddTrait(itemUseParent.getItemTargetInfo().item);
            return EnterResult.OK;
        },

        moveMainUseCycle: function() {
            this.mainAction();
            return MoveResult.END;
        },

        mainAction: function() {
            for (var i=0; i<this._traitArray.length; i++) {
                if (!TraitControl.hasTrait(this._unit, this._traitArray[i])) {
                    TraitControl.addUnitTrait(this._unit, this._traitArray[i]);
                }
            }
        }
    });

    var TraitItemInfo = defineObject(BaseItemInfo, {

    });

    var TraitItemPotency = defineObject(BaseItemPotency, {

    });

    var TraitItemAvailability = defineObject(BaseItemAvailability, {

        isItemAllowed: function(unit, targetUnit, item) {
            var addTrait = TraitControl.getAddTrait(item);
            var i = 0;
            var allowed = false;
            while (i<addTrait.length && !allowed) {
                allowed = !TraitControl.hasTrait(unit, addTrait[i]);
                i++;
            }
            return allowed;
        }

    });

    var TraitItemAI = defineObject(BaseItemAI, {

    });


    var alias1 = ItemPackageControl.getCustomItemSelectionObject;
    ItemPackageControl.getCustomItemSelectionObject = function(item, keyword) {
        if (keyword=="Trait") {
            return TraitItemSelection;
        }
        else {
            return alias1.call(this, item, keyword);
        }
    };

    var alias2 = ItemPackageControl.getCustomItemUseObject;
    ItemPackageControl.getCustomItemUseObject = function(item, keyword) {
        if (keyword=="Trait") {
            return TraitItemUse;
        }
        else {
            return alias2.call(this, item, keyword);
        }
    };

    var alias3 = ItemPackageControl.getCustomItemInfoObject;
    ItemPackageControl.getCustomItemInfoObject = function(item, keyword) {
        if (keyword=="Trait") {
            return TraitItemInfo;
        }
        else {
            return alias3.call(this, item, keyword);
        }
    };

    var alias4 = ItemPackageControl.getCustomItemPotencyObject;
    ItemPackageControl.getCustomItemPotencyObject = function(item, keyword) {
        if (keyword=="Trait") {
            return TraitItemPotency;
        }
        else {
            return alias4.call(this, item, keyword);
        }
    };

    var alias5 = ItemPackageControl.getCustomItemAvailabilityObject;
    ItemPackageControl.getCustomItemAvailabilityObject = function(item, keyword) {
        if (keyword=="Trait") {
            return TraitItemAvailability;
        }
        else {
            return alias5.call(this, item, keyword);
        }
    };

    var alias6 = ItemPackageControl.getCustomItemAIObject;
    ItemPackageControl.getCustomItemAIObject = function(item, keyword) {
        if (keyword=="Trait") {
            return TraitItemAI;
        }
        else {
            return alias6.call(this, item, keyword);
        }
    }
})()