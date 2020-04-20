//Plugin by Goinza

var NullInteraction = defineObject(CustomInteraction, {

    initialize: function() {
		this._scrollbar = createScrollbarObject(this.getScrollbarObject(), this);
		this._scrollbar.setScrollFormation(1, 1);
    },

    getScrollbarObject: function() {
        return NullScrollbar;
    }

})

var NullScrollbar = defineObject(CustomScrollbar, {

    setDataScrollbar: function(unit) {
    },

    getObjectWidth: function() {
		return 0;
	},
	
	getObjectHeight: function() {
		return 0;
	}

})