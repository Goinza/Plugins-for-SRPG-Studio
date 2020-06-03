//Plugin by Goinza

var TopWeaponTypeInteraction = defineObject(TopCustomInteraction, {

    getTitle: function() {
        return WEAPONTYPE_TITLE;
    },

    getScrollbarObject: function() {
        return TopWeaponTypeScrollbar;
    }   

})

var BottomWeaponTypeInteraction = defineObject(BottomCustomInteraction, {

    getTitle: function() {
        return WEAPONTYPE_TITLE;
    },

    getScrollbarObject: function() {
        return BottomWeaponTypeScrollbar;
    }   

})

var TopWeaponTypeScrollbar = defineObject(TopCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var refList = unit.getClass().getEquipmentWeaponTypeReferenceList();
        var count = refList.getTypeCount();

        this.resetScrollData();

        for (var i=0; i<count; i++) {
            this.objectSet(refList.getTypeData(i));
        }

        if (unit.getClass().getClassOption() & ClassOptionFlag.WAND) {
            this.objectSet(root.getBaseData().getWeaponTypeList(3).getDataFromId(0));
        }

        this.objectSetEnd();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var icon = object.getIconResourceHandle();
        var name = object.getName();
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        GraphicsRenderer.drawImage(x, y, icon, GraphicsType.ICON);
        TextRenderer.drawKeywordText(x + 32, y, name, -1, color, font);
    }

})

var BottomWeaponTypeScrollbar = defineObject(BottomCustomScrollbar, {
    
    setDataScrollbar: function(unit) {
        var refList = unit.getClass().getEquipmentWeaponTypeReferenceList();
        var count = refList.getTypeCount();

        this.resetScrollData();

        for (var i=0; i<count; i++) {
            this.objectSet(refList.getTypeData(i));
        }

        if (unit.getClass().getClassOption() & ClassOptionFlag.WAND) {
            this.objectSet(root.getBaseData().getWeaponTypeList(3).getDataFromId(0));
        }

        this.objectSetEnd();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var icon = object.getIconResourceHandle();
        var name = object.getName();
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        GraphicsRenderer.drawImage(x, y, icon, GraphicsType.ICON);
    }

})