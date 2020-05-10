//Plugin by Goinza

var TopTraitsInteraction = defineObject(TopCustomInteraction, {

    getTitle: function() {
        return TraitsConfig.MENU_TITLE;
    },

    getScrollbarObject: function() {
        return TopTraitsScrollbar;
    } 
})

var BottomTraitsInteraction = defineObject(BottomCustomInteraction, {

    getTitle: function() {
        return TraitsConfig.MENU_TITLE;
    },

    getScrollbarObject: function() {
        return BottomTraitsScrollbar;
    } 

})

var TopTraitsScrollbar = defineObject(TopCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var traits = TraitControl.getTraitsArray(unit);

        this.resetScrollData();
		
		for (i=0; i<traits.length; i++) {
			this.objectSet(TraitControl.getTraitFromId(traits[i]));
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

var BottomTraitsScrollbar = defineObject(BottomCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var traits = TraitControl.getTraitsArray(unit);

        this.resetScrollData();
		
		for (i=0; i<traits.length; i++) {
			this.objectSet(TraitControl.getTraitFromId(traits[i]));
		}
		
		this.objectSetEnd();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var icon = object.getIconResourceHandle();

        GraphicsRenderer.drawImage(x, y, icon, GraphicsType.ICON);
    }

})