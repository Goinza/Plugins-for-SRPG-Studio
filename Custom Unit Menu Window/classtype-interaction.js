//Plugin by Goinza

var ClassTypeInteraction = defineObject(BottomCustomInteraction, {

    initialize: function() {
		this._scrollbar = createScrollbarObject(this.getScrollbarObject(), this);
		this._scrollbar.setScrollFormation(1, 1);
    },

    getTitle: function() {
        return CLASSTYPE_TITLE;
    },

    getScrollbarObject: function() {
        return ClassTypeScrollbar;
    }

})

var ClassTypeScrollbar = defineObject(BottomCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var classType = unit.getClass().getClassType();
        this.resetScrollData();
        this.objectSet(classType);        
		this.objectSetEnd();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        var name = object.getName();
        var icon = object.getIconResourceHandle();

        GraphicsRenderer.drawImage(x, y, icon, GraphicsType.ICON);
        TextRenderer.drawKeywordText(x + 32, y, name, -1, color, font);
    },

    getObjectWidth: function() {
		return ItemRenderer.getItemWidth();
	}

})