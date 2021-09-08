//Plugin by Goinza

(function() {

    var alias1 =ScriptExecuteEventCommand._configureOriginalEventCommand;
    ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.appendObject(ChangeStaminaEventCommand);
        groupArray.appendObject(ResetStaminaEventCommand);
	}

})()

var ChangeStaminaEventCommand = defineObject(BaseEventCommand, {

    enterEventCommandCycle: function() {
        return EnterResult.OK;   
    },

    moveEventCommandCycle: function() {
        this.mainEventCommand();
        return MoveResult.END;
    },

    mainEventCommand: function() {
        var eventObject = root.getEventCommandObject();
        var content = eventObject.getOriginalContent();
        var unit = content.getUnit();
        var keyword = content.getCustomKeyword();
        var value = content.getValue(0);
        if (keyword == "Set") {
            StaminaStat.setCurrentStamina(unit, value);
        }
        else if (keyword == "Add") {
            var oldValue = StaminaStat.getCurrentStamina(unit);
            StaminaStat.setCurrentStamina(unit, oldValue + value);
        }
        else if (keyword == "Subtract") {
            var oldValue = StaminaStat.getCurrentStamina(unit);
            StaminaStat.setCurrentStamina(unit, oldValue - value);
        }
     },

    getEventCommandName: function() {
        return "ChangeStamina";
    }

})

var ResetStaminaEventCommand = defineObject(BaseEventCommand, {

    enterEventCommandCycle: function() {
        return EnterResult.OK;   
    },

    moveEventCommandCycle: function() {
        this.mainEventCommand();
        return MoveResult.END;
    },

    mainEventCommand: function() {
        var list = PlayerList.getAliveList();
        var count = list.getCount();
        var unit, value;
        for (var i=0; i<count; i++) {
            unit = list.getData(i);
            value = StaminaStat.getMaxStamina(unit);
            StaminaStat.setCurrentStamina(unit, value);
        }
    },

    getEventCommandName: function() {
        return "RestoreAllUnitsStamina";
    }

})