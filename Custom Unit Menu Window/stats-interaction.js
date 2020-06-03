//Plugin by Goinza

var StatsInteraction = defineObject(TopCustomInteraction, {    

    initialize: function() {
		this._scrollbar = createScrollbarObject(this.getScrollbarObject(), this);
		this._scrollbar.setScrollFormation(2, DataConfig.getMaxUnitItemCount()-1);
    },
  
    getTitle: function() {
        return STATS_TITLE;
    },

    getScrollbarObject: function() {
        return StatsScrollbar;
    },

    isHelpAvailable: function() {
        return false;
    },

    getHelpText: function() {
        return "";
    }
    
})

var AltStatsInteraction = defineObject(StatsInteraction, {

    initialize: function() {
		this._scrollbar = createScrollbarObject(this.getScrollbarObject(), this);
		this._scrollbar.setScrollFormation(3, DataConfig.getMaxUnitItemCount()-1);
    },

    getScrollbarObject: function() {
        return AltStatsScrollbar;
    }

})

var StatsScrollbar = defineObject(UnitStatusScrollbar, {

    setDataScrollbar: function(unit) {
        this.setStatusFromUnit(unit);
    }
})

var AltStatsScrollbar = defineObject(StatsScrollbar, {

    getDefaultCol: function() {
        return this._col;
    },

    getObjectWidth: function() {
		return 70;
    },
    
    _getNumberSpace: function() {
		return 45;
	}

})