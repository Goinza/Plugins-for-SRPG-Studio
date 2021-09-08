//Plugin by Goinza

(function() {

    var alias1 = ParamGroup._configureUnitParameters;
    ParamGroup._configureUnitParameters = function(groupArray) {
        alias1.call(this, groupArray);
        if (CombatArtSettings.ENABLE_STAMINA) {
            groupArray.appendObject(UnitParameter.STA)
        }        
    }

    //Store the unit so I can call the current stamina
    var alias2 = StatusScrollbar._createStatusEntry;
    StatusScrollbar._createStatusEntry = function(unit, index , weapon) {
        var statusEntry = alias2.call(this, unit, index, weapon);
        statusEntry.unit = unit;

        return statusEntry;
    }

    var alias3 = UnitStatusScrollbar._createStatusEntry;
    UnitStatusScrollbar._createStatusEntry = function(unit, index, weapon) {
        var statusEntry = alias3.call(this, unit, index, weapon);
        statusEntry.unit = unit;

        return statusEntry;
    }

})()

var StaminaStat = {

    getCurrentStamina: function(unit) {
        var value = unit.custom.currentStamina ? unit.custom.currentStamina : 0;
        var maxValue = this.getMaxStamina(unit);
        if (value < 0) {
            value = 0;
        }
        else if (value > maxValue) {
            value = maxValue;
        }
        return value;
    },

    setCurrentStamina: function(unit, value) {
        var maxValue = this.getMaxStamina(unit);
        if (value < 0) {
            value = 0;
        }
        else if (value > maxValue) {
            value = maxValue;
        }
        unit.custom.currentStamina = value;
    },

    getMaxStamina: function(unit) {
        return ParamBonus.getBonus(unit, ParamType.STA);
    }
}

ParamType.STA = 101;

UnitParameter.STA = defineObject(BaseUnitParameter, {

    getUnitValue: function(unit) {
        var value = unit.custom.stamina ? unit.custom.stamina : 0;
        return value;
    },

    setUnitValue: function(unit, value) {
        unit.custom.stamina = value;
    },

    getParameterBonus: function(obj) {
        var value = obj.custom.bonusStamina ? obj.custom.bonusStamina : 0;
        return value;
    },

    getGrowthBonus: function(obj) {
        var value = obj.custom.growthStamina ? obj.custom.growthStamina : 0;
        return value;
    },

    getDopingParameter: function(obj) {
        if (obj.custom == null) {
            return 0;
        }
        var value = obj.custom.dopingStamina ? obj.custom.dopingStamina : 0;
        return value;
    },

    getMaxValue: function(unit) {
        var value = unit.getClass().custom.maxStamina ? unit.getClass().custom.maxStamina : 0;
        return value;
    },

    getMinValue: function(unit) {
        return 0;
    },
   
    getParameterName: function() {
        return "Sta";
    },

    getParameterType: function() {
        return ParamType.STA;
    },

    isParameterRenderable: function() {
        return true;
    },

    drawUnitParameter: function(x, y, statusEntry, isSelect) {        
        var currentStamina = StaminaStat.getCurrentStamina(statusEntry.unit);
		var maxStamina = statusEntry.param;

        if (maxStamina < 0) {
            maxStamina = 0;
        }
        x -= 33;
        NumberRenderer.drawNumber(x, y, currentStamina);
        x += 14;
        TextRenderer.drawSignText(x, y, '/');
        x += 20;
        NumberRenderer.drawNumber(x, y, maxStamina);
    }

})