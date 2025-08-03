//Plugin by Goinza

var InjuryControl = {

    setInjury: function(unit) {
        unit.custom.injury = true
    },

    removeInjury: function(unit) {
        unit.custom.injury = null
    },

    isInjured: function(unit) {
        return unit.custom.injury != null
    }

}