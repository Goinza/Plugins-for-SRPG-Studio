//Plugin by Goinza
//Used as reference for the guide "Creating a new stat"

(function() {
    //Adds the stats to the game
    var alias1 = ParamGroup._configureUnitParameters;
    ParamGroup._configureUnitParameters = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.appendObject(NewStat);
        groupArray.appendObject(Affinity);
    }

    //The new stat adds more damage to any attack
    var alias2 = AbilityCalculator.getPower;
    AbilityCalculator.getPower = function(unit, weapon) {
        var power = alias2.call(this, unit, weapon);
        var newStatValue = NewStatBonus.getNewStat(unit);

        return power + newStatValue;
    }
})()

ParamType.NEWSTAT = 100;

var NewStat = defineObject(BaseUnitParameter, {

    getUnitValue: function(unit) {
        var value = 0; //Default value
        if (unit.custom.newStat != null) {
            //Checks that the parameter exists to avoid crashes
            value = unit.custom.newStat;
        }

        return value;
    },

    setUnitValue: function(unit, value) {
        unit.custom.newStat = value;
    },

    getParameterBonus: function(obj) {
        var value = 0; //Default value
        if (obj.custom.newStatBonus != null) {
            //Checks that the parameter exists to avoid crashes
            value = obj.custom.newStatBonus;
        }

        return value;
    },

    getGrowthBonus: function(obj) {
        var value = 0; //Default value
        if (obj.custom.newStatGrowth != null) {
            //Checks that the parameter exists to avoid crashes
            value = obj.custom.newStatGrowth;
        }

        return value;
    },

    getDopingParameter: function(obj) {
        var value = 0; //Default value
        if (obj.custom != null && obj.custom.newStatDoping != null) {
            value = obj.custom.newStatDoping;
        }

        return value;
    },

    getMinValue: function(unit) {
        var value = 0; //Default value
        var unitClass = unit.getClass();
        if (unitClass.custom.newStatMin != null) {
            value = unitClass.custom.newStatMin;
        }

        return value;
    },

    getMaxValue: function(unit) {
        var value = 0; //Default value
        var unitClass = unit.getClass();
        if (unitClass.custom.newStatMax != null) {
            value = unitClass.custom.newStatMax;
        }

        return value;
    },

    getParameterName: function() {
		return "New";
    },

    getParameterType: function() {
        return ParamType.NEWSTAT;
    }
    
})

var Affinity = defineObject(BaseUnitParameter, {

    getUnitValue: function(unit) {
        var value = 0; //Default value
        if (unit.custom.aff != null) {
            //Checks that the parameter exists to avoid crashes
            value = unit.custom.aff;
        }

        return value;  
    },

    getParameterName: function() {
        return "Aff";
    },

    isParameterDisplayable: function(unitStatusType) {
        return unitStatusType == UnitStatusType.UNITMENU;
    },

    isParameterRenderable: function() {
        return true;
    },

    drawUnitParameter: function(x, y, statusEntry, isSelect) {
        var textui = statusEntry.textui;
		var color = textui.getColor();
		var font = textui.getFont();
        var value = statusEntry.param; //Current value of the stat
        var text = ""; //Default value
        switch (value) {
            case 0:
                text = "Ice";
                break;
            case 1:
                text = "Water";
                break;
            case 2:
                text = "Earth";
                break;
            case 3:
                text = "Fire";
                break;
            case 4:
                text = "Air";
                break;
            case 5:
                text = "Thunder";
                break
        }

        //You can change the x and y coordinates
        //if the word doesn't fit the menu
        TextRenderer.drawKeywordText(x - 30, y, text, -1, color, font);
    },
	
	getMaxValue: function(unit) {
		return 6; //This value should be the amount of options you have for this stat
	}

})

var NewStatBonus = {
    getNewStat: function(unit) {
        return ParamBonus.getBonus(unit, ParamType.NEWSTAT);
    }
}
