//Plugin by Goinza

var CustomInteraction = defineObject(BaseInteraction, {

    setUnitData: function(unit) {
        this._scrollbar.setDataScrollbar(unit);
    },

    //Title that will show up in the window
    getTitle: function() {
        return '';
    },

    //The interaction must use a diffent scrollbar object
    getScrollbarObject: function() {
        return BaseScrollbar;
    },

    getWindowTextUI: function() {
        return root.queryTextUI('default_window');
    },

    hasWindow: function() {
        return this._window!=null;
    }
})

var TopCustomInteraction = defineObject(CustomInteraction, {

    initialize: function() {
		this._scrollbar = createScrollbarObject(this.getScrollbarObject(), this);
		this._scrollbar.setScrollFormation(1, 4);
    }

})

var BottomCustomInteraction = defineObject(CustomInteraction, {

    initialize: function() {
		this._scrollbar = createScrollbarObject(this.getScrollbarObject(), this);
		this._scrollbar.setScrollFormation(6, 1);
    }

})

var CustomScrollbar = defineObject(BaseScrollbar, {

    setDataScrollbar: function(unit) {
    }

})

var TopCustomScrollbar = defineObject(CustomScrollbar, {
  
    getObjectWidth: function() {
		return ItemRenderer.getItemWidth();
	},
	
	getObjectHeight: function() {
		return ItemRenderer.getItemHeight();
	}

})

var BottomCustomScrollbar = defineObject(CustomScrollbar, {

    getObjectWidth: function() {
		return 32;
	},
	
	getObjectHeight: function() {
		return ItemRenderer.getItemHeight();
	}
})