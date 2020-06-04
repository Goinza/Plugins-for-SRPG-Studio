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

    getHelpText: function() {
        var text = "";
        var data = StatODControl.getOriginalDataFromStatusEntry(this._scrollbar.getObject());
        if (data!=null) {
            text = data.getDescription();
        }

        return text;
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
    },

    objectSetEnd: function() {
        var objectCount = this._objectArray.length;
        
        this._commandCursor.setCursorUpDown(objectCount);
        
		this._rowCount = Math.ceil(objectCount / this._col);
		if (this._rowCount > this._showRowCount) {
			this._rowCount = this._showRowCount;
		}
		
		// Check if the number of previous index doesn't exceed the new count.
		this._commandCursor.validate(); 
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