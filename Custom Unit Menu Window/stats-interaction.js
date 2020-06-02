//Plugin by Goinza

var StatsInteraction = defineObject(TopCustomInteraction, {
  
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

var StatsScrollbar = defineObject(UnitStatusScrollbar, {

    setDataScrollbar: function(unit) {
        this.setStatusFromUnit(unit);
    }
})