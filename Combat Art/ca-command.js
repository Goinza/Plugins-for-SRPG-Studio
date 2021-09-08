//Plugin by Goinza

(function() {
    var alias1 = UnitCommand.configureCommands;
    UnitCommand.configureCommands = function(groupArray) {
        alias1.call(this, groupArray);
        
        var i = 0;
        var found = false;
        while (i<groupArray.length && !found) {        
            found = groupArray[i].getCommandName()==root.queryCommand('attack_unitcommand');
            i++;
        }
    
        groupArray.insertObject(UnitCommand.CombatArt, i);
    }    

})()

UnitCommand.CombatArt = defineObject(UnitListCommand, {

    _caState: null,
    caData: null,

    openCommand: function() {
        this.caData = this._buildCombatArtData();
        this.changeState(CAState.Initial);
    },

    _buildCombatArtData: function() {
        var data = {};
        data.selectedCA = null;

        data.weapon = null;
        data.targetUnit = null;

        data.resultTargetInfo = null;

        return data;
    },

    moveCommand: function() {
        return this._caState.moveState();
    },

    drawCommand: function() {
        this._caState.drawState();
    },

    changeState: function(protoState) {
        this._caState = createObject(protoState);
        this._caState.setup(this);
    },

    isCommandDisplayable: function() {
        var unit = this.getCommandTarget();
        var validateCombatArt = CombatArtControl.getValidCombatArtsArray(unit);
        return validateCombatArt.length > 0;
    },

    getCommandName: function() {
        return CombatArtSettings.COMMAND_COMBATART;
    },

    isRepeatMoveAllowed: function() {
        return DataConfig.isUnitCommandMovable(RepeatMoveType.ATTACK);
    }

})