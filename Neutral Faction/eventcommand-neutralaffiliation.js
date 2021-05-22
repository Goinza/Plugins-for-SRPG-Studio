//Plugin by Goinza

(function() {

    var alias1 = ScriptExecuteEventCommand._configureOriginalEventCommand;
    ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.appendObject(NeutralAffiliationCommand);
    }

    var NeutralAffiliationCommand = defineObject(BaseEventCommand, {

        enterEventCommandCycle: function() {
            return EnterResult.OK;
        },

        moveEventCommandCycle: function() {
            this.mainEventCommand();
            return MoveResult.END;
        },

        mainEventCommand: function() {
            var originalContent = root.getEventCommandObject().getOriginalContent();
            var unit = originalContent = originalContent.getUnit();
            NeutralControl.changeNeutralType(unit);
        },

        getEventCommandName: function() {
            return "NeutralAffiliation";
        }

    })

})()