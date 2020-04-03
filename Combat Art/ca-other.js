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

    var alias2 = Calculator.calculateRoundCount;
    Calculator.calculateRoundCount = function(active, passive, weapon) {
        var rounds;
        var combatArt = root.getMetaSession().global.combatArt;
        if (combatArt!=null && combatArt) {
            rounds = 1;
        }
        else {
            rounds = alias2.call(this, active, passive, weapon);
        }
    
        return rounds
    }
    
    AttackFlow._doAttackAction = function() {
        var i, count, turnState;
        var order = this._order;
        var active = order.getActiveUnit();
        var passive = order.getPassiveUnit();
        var activeStateArray = order.getActiveStateArray();
        var passiveStateArray = order.getPassiveStateArray();
        var isItemDecrement = order.isCurrentItemDecrement();
        
        DamageControl.reduceHp(active, order.getActiveDamage());
        DamageControl.reduceHp(passive, order.getPassiveDamage());
        
        DamageControl.checkHp(active, passive);
        
        count = activeStateArray.length;
        for (i = 0; i < count; i++) {
            turnState = StateControl.arrangeState(active, activeStateArray[i], IncreaseType.INCREASE);
            if (turnState !== null) {
                turnState.setLocked(true);
            }
        }
        
        count = passiveStateArray.length;
        for (i = 0; i < count; i++) {
            turnState = StateControl.arrangeState(passive, passiveStateArray[i], IncreaseType.INCREASE);
            if (turnState !== null) {
                turnState.setLocked(true);
            }
        }
        
        if (isItemDecrement) {
            // Reduce the weapons for the attacker.
            // Items don't get discarded.
            // ItemControl.getEquippedWeapon is not called because there is a possibility to return null.
            // If the "Users" of the weapon is current HP, there is a possibility that HP has changed due to the battle, so the equipment decision also changes.
            var combatArt = root.getMetaSession().global.combatArt;
            if (combatArt==null || !combatArt) {
                ItemControl.decreaseLimit(active, BattlerChecker.getBaseWeapon(active));
            }
        }
    }
})()
