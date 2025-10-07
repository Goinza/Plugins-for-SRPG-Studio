//Plugin by Goinza

var TopStateInteraction = defineObject(TopCustomInteraction, {

    getTitle: function() {
        return STATES_TITLE;
    },

    getScrollbarObject: function() {
        return TopStateScrollbar;
    },

    getHelpText: function() {
        var turnState = this._scrollbar.getObject();
        var turnsLeft = this._scrollbar.getObject().getTurn();
        var help = turnState.getState().getDescription();

        if (turnsLeft>0) {
            help += "\n" + "Turns left: " + turnsLeft;
        }
		
		return help;
	}

})

var BottomStateInteraction = defineObject(BottomCustomInteraction, {

    getTitle: function() {
        return STATES_TITLE;
    },

    getScrollbarObject: function() {
        return BottomStateScrollbar;
    },

    getHelpText: function() {
        var turnState = this._scrollbar.getObject();
        var turnsLeft = this._scrollbar.getObject().getTurn();
        var help = turnState.getState().getDescription();

        if (turnsLeft>0) {
            help += "\n" + "Turns left: " + turnsLeft;
        }
		
		return help;
	}
}) 

var TopStateScrollbar = defineObject(TopCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var dataList = unit.getTurnStateList();
        var count = dataList.getCount();
        var turnState;

        this.resetScrollData();
		
		for (i=0; i<count; i++) {
            turnState = dataList.getData(i);
            if (!turnState.getState().isHidden()) {
                this.objectSet(turnState);
            }			
		}
		
		this.objectSetEnd();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        var state = object.getState();
        var name = state.getName();
        var icon = state.getIconResourceHandle();

        GraphicsRenderer.drawImage(x, y, icon, GraphicsType.ICON);
        TextRenderer.drawKeywordText(x + 32, y, name, -1, color, font);
    }

})

var BottomStateScrollbar = defineObject(BottomCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var dataList = unit.getTurnStateList();
        var count = dataList.getCount();
        var turnState;

        this.resetScrollData();
		
		for (i=0; i<count; i++) {
            turnState = dataList.getData(i);
            if (!turnState.getState().isHidden()) {
                this.objectSet(turnState);
            }			
		}
		
		this.objectSetEnd();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var state = object.getState();
        var icon = state.getIconResourceHandle();

        GraphicsRenderer.drawImage(x, y, icon, GraphicsType.ICON);
    }

})