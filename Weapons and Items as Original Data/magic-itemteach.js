/**
 * Addition by Repeat.
 * Adds support for custom items that teach spells.
 * 
 * Keyword: SpellItem
 * Custom parameters: 
 *  * ID of the original data of the spell to teach.
 *  * reqCategory: ID of weapon category the item is usable by (0: weapons, 1: bows, 2: magic)
 *  * staffReq: true/false, does the ability to use a staff enable the user to use the item? Defaults to false if left off
 * Ex: {teachSpell:0, reqCategory:2, staffReq:true} for spell with ID 0 to only be usable by mages and/or staff users.
 */

var SpellItemStrings = {
    KEYWORD: 'SpellItem',
    ITEMNAME: 'Spell Scroll',
    TEACHES: 'Teaches',
    PREREQ: 'Prereq'
};

(function () {
    var alias1 = ItemControl.isItemUsable;
    ItemControl.isItemUsable = function (unit, item) {
        var result = alias1.call(this, unit, item);
        if (result) {
            if (item.getCustomKeyword() === SpellItemStrings.KEYWORD && typeof item.custom.teachSpell === 'number') {
                if (ItemControl.unitMeetsWeaponTypeRequirement(unit.getClass(), item.custom.reqCategory, item.custom.staffReq)) {
                    return true;
                }
                return false;
            }
        }
        return result;
    };

    var alias2 = ItemPackageControl.getCustomItemSelectionObject;
    ItemPackageControl.getCustomItemSelectionObject = function (item, keyword) {
        if (keyword === SpellItemStrings.KEYWORD) {
            return SpellItemSelection;
        }

        return alias2.call(this, item, keyword);
    };

    var alias3 = ItemPackageControl.getCustomItemAvailabilityObject;
    ItemPackageControl.getCustomItemAvailabilityObject = function (item, keyword) {
        if (keyword === SpellItemStrings.KEYWORD) {
            return SpellItemAvailability;
        }
        return alias3.call(this, item, keyword);
    };

    var alias4 = ItemPackageControl.getCustomItemUseObject;
    ItemPackageControl.getCustomItemUseObject = function (item, keyword) {
        if (keyword === SpellItemStrings.KEYWORD) {
            return SpellItemUse;
        }
        return alias4.call(this, item, keyword);
    };

    var alias5 = ItemPackageControl.getCustomItemInfoObject;
    ItemPackageControl.getCustomItemInfoObject = function (item, keyword) {
        if (keyword === SpellItemStrings.KEYWORD) {
            return SpellItemInfo;
        }
        return alias5.call(this, item, keyword);
    };
})();

var SpellItemSelection = defineObject(BaseItemSelection, {});
var SpellItemInfo = defineObject(BaseItemInfo, {
    _spell: null,
    _weaponTypeList: null,
    _hasStaffReq: false,

    drawItemInfoCycle: function (x, y) {
        ItemInfoRenderer.drawKeyword(x, y, SpellItemStrings.ITEMNAME);
        y += ItemInfoRenderer.getSpaceY();

        // cached for performance
        if (!this._spell) {
            var id = this._item.custom.teachSpell;
            var spell = root.getBaseData().getOriginalDataList(SpellsConfig.ORIGINAL_DATA_TAB).getDataFromId(id);
            this._spell = spell;

            if (!this._weaponTypeList && typeof this._item.custom.reqCategory === 'number') {
                this._weaponTypeList = root.getBaseData().getWeaponTypeList(this._item.custom.reqCategory);
            }

            if (this._item.custom.staffReq) {
                this._hasStaffReq = true;
            }
        }

        this._drawName(x, y);

        y += ItemInfoRenderer.getSpaceY();

        if (this._weaponTypeList || this._hasStaffReq) {
            this._drawReqs(x, y);
        }
    },

    getInfoPartsCount: function () {
        var hasReqs = typeof this._item.custom.reqCategory === 'number' || this._item.custom.staffReq;

        return hasReqs ? 3 : 2;
    },

    _drawName: function (x, y) {
        var textui = this.getWindowTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        ItemInfoRenderer.drawKeyword(x, y, SpellItemStrings.TEACHES);
        x += ItemInfoRenderer.getSpaceX() + 16;
        TextRenderer.drawKeywordText(x, y, this._spell.getName(), -1, color, font);
    },

    _drawReqs: function (x, y) {
        ItemInfoRenderer.drawKeyword(x, y, SpellItemStrings.PREREQ);
        x += ItemInfoRenderer.getSpaceX() + 16;

        if (this._weaponTypeList) {
            for (var i = 0; i < this._weaponTypeList.getCount(); i++) {
                var handle = this._weaponTypeList.getDataFromId(i).getIconResourceHandle();
                GraphicsRenderer.drawImage(x, y, handle, GraphicsType.ICON);
                x += GraphicsFormat.ICON_WIDTH;
            }
        }

        if (this._hasStaffReq) {
            var handle = root.getBaseData().getWeaponTypeList(3).getDataFromId(0).getIconResourceHandle();
            GraphicsRenderer.drawImage(x, y, handle, GraphicsType.ICON);
        }
    }
}
);

var SpellItemAvailability = defineObject(BaseItemAvailability, {
    isItemAvailableCondition: function (unit, item) {
        var able = ItemControl.unitMeetsWeaponTypeRequirement(unit.getClass(), item.custom.reqCategory, item.custom.staffReq);

        return able;
    }
});

// This is largely a duplication of MagicEventCommand's effort.
// Luckily I can reuse its noticeView at least.
var SpellItemUse = defineObject(BaseItemUse, {
    _unit: null,
    _noticeView: null,
    _spell: null,
    _keyword: '',

    enterMainUseCycle: function (itemUseParent) {
        var itemTargetInfo = itemUseParent.getItemTargetInfo();
        var item = itemTargetInfo.item;
        this._unit = itemTargetInfo.targetUnit;
        this._keyword = item.custom.teachSpell;

        this._setSpell();

        this._noticeView = createObject(AddSpellNoticeView);
        this._noticeView.setViewText(this._unit, this._spell);

        return EnterResult.OK;
    },

    moveMainUseCycle: function () {
        if (this._noticeView.moveNoticeView() !== MoveResult.CONTINUE) {
            return MoveResult.END;
        }

        return MoveResult.CONTINUE;
    },

    drawMainUseCycle: function () {
        var x = LayoutControl.getCenterX(-1, this._noticeView.getNoticeViewWidth());
        var y = LayoutControl.getCenterY(-1, this._noticeView.getNoticeViewHeight());

        this._noticeView.drawNoticeView(x, y);
    },

    _setSpell: function () {
        var id = this._keyword;
        var spell = root.getBaseData().getOriginalDataList(SpellsConfig.ORIGINAL_DATA_TAB).getDataFromId(id);
        this._spell = spell;

        MagicAttackControl.addSpell(this._unit, spell);
    }
});

/**
 * Loops through the unit's class's usable weapon types and see if any matches the required weapon category.
 * @param {obj} unit
 * @param {int} category - number from 0 to 2 (weapon, magic, bow)
 * @param {boolean} hasStaffReq - if true, staff is included in the prerequisites
 */
ItemControl.unitMeetsWeaponTypeRequirement = function (cls, category, hasStaffReq) {
    if (hasStaffReq && (cls.getClassOption() & ClassOptionFlag.WAND)) {
        return true;
    }

    if (typeof category !== 'number') {
        return true;
    }

    var refList = cls.getEquipmentWeaponTypeReferenceList();
    var i;
    var found = false;
    var count = refList.getTypeCount();

    for (i = 0; i < count; i++) {
        if (refList.getTypeData(i).getWeaponCategoryType() === category) {
            found = true;
            break;
        }
    }

    return found;
};
