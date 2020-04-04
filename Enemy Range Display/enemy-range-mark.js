//Plugin by Goinza

(function() {

    //Draws the enemy range
    var alias1 = MapLayer.drawMapLayer;
    MapLayer.drawMapLayer = function() {
        alias1.call(this);
        EnemyRange.drawRange();
    }

    //Marks an enemy unit every time it is selected
    //Marking an already marked unit will unmark it
    var alias2 = MapEdit._selectAction;
    MapEdit._selectAction = function(unit) {
        var result = MapEditResult.NONE;
        if (unit!=null && unit.getUnitType()==UnitType.ENEMY) {
            EnemyRange.markUnit(unit);
        }
        else {
            result = alias2.call(this, unit);
        }

        return result;
    }

    //Updates the enemy range when a enemy or ally unit ends its move
    var alias3 = SimulateMove._endMove;
    SimulateMove._endMove = function(unit) {
        alias3.call(this, unit);
        if (unit.getUnitType()!=UnitType.PLAYER) {
            EnemyRange.updateRange();
        }
    }

    //Updates the enemy range when an unit dies
    var alias4 = DamageControl.setDeathState;
    DamageControl.setDeathState = function(unit) {
        alias4.call(this, unit);
        EnemyRange.updateRange();
    }

    //Updates the enemy range when a player unit ends its move
    var alias5 = PlayerTurn.moveTurnCycle;
    PlayerTurn.moveTurnCycle = function() {
        var oldMode, newMode;
        oldMode = this.getCycleMode();
        result = alias5.call(this);
        newMode = this.getCycleMode();

        if (oldMode==PlayerTurnMode.UNITCOMMAND && newMode==PlayerTurnMode.MAP) {
            //Going from UNITCOMMAND to MAP means that the unit finished its move, so we update the enemy range
            EnemyRange.updateRange();
        }

        return result;
    }

    //Updates the enemy range when a reinforcement enemy unit spawns
    var alias6 = ReinforcementChecker.moveTurnChangeCycle;
    ReinforcementChecker.moveTurnChangeCycle = function() {
        result = alias6.call(this);
        if (result==MoveResult.END) {
            EnemyRange.updateRange();
        }

        return result;    
    }

    var alias7 = RetryControl.register;
    RetryControl.register = function() {
        EnemyRange.updateRange();
        alias7.call(this);
    }
})()