//Plugin by Goinza

(function() {

    var alias1 = ScriptExecuteEventCommand._configureOriginalEventCommand
    ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
        alias1.call(this, groupArray)
        groupArray.appendObject(SetInjuryEventCommmand)
        groupArray.appendObject(RemoveInjuryEventCommand)
    }

})()

var SetInjuryEventCommmand = defineObject(BaseEventCommand, {

    enterEventCommandCycle: function() {
        return EnterResult.OK
    },

    moveEventCommandCycle: function() {
        this.mainEventCommand()

        return MoveResult.END
    },

    mainEventCommand: function() {
        var unit = root.getEventCommandObject().getOriginalContent().getUnit()
        InjuryControl.setInjury(unit)
    },

    getEventCommandName: function() {
        return "SetInjury"
    }

})

var RemoveInjuryEventCommand = defineObject(BaseEventCommand, {

    enterEventCommandCycle: function() {
        return EnterResult.OK
    },

    moveEventCommandCycle: function() {
        this.mainEventCommand()

        return MoveResult.END
    },

    mainEventCommand: function() {
        var unit = root.getEventCommandObject().getOriginalContent().getUnit()
        InjuryControl.removeInjury(unit)
    },

    getEventCommandName: function() {
        return "RemoveInjury"
    }

})