//Plugin by Goinza

var TopRaceInteraction = defineObject(TopCustomInteraction, {

    getTitle: function() {
        return RACES_TITLE;
    },

    getScrollbarObject: function() {
        return TopRaceScrollbar;
    }   

})

var BottomRaceInteraction = defineObject(BottomCustomInteraction, {

    getTitle: function() {
        return RACES_TITLE;
    },

    getScrollbarObject: function() {
        return BottomRaceScrollbar;
    }

})

var TopRaceScrollbar = defineObject(TopCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var races = unit.getClass().getRaceReferenceList();
        var count = races.getTypeCount();

        this.resetScrollData();
		
		for (i=0; i<count; i++) {
			this.objectSet(races.getTypeData(i));
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

var BottomRaceScrollbar = defineObject(BottomCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var races = unit.getClass().getRaceReferenceList();
        var count = races.getTypeCount();

        this.resetScrollData();
		
		for (i=0; i<count; i++) {
			this.objectSet(races.getTypeData(i));
		}
		
		this.objectSetEnd();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var icon = object.getIconResourceHandle();

        GraphicsRenderer.drawImage(x, y, icon, GraphicsType.ICON);
    }

})