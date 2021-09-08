(function() {

    var alias1 = SupportCalculator.createTotalStatus;
    SupportCalculator.createTotalStatus = function(unit) {
        var totalStatus = alias1.call(this, unit);
        var usingCombatArt = CombatArtAttack.isCombatArtAttack() && unit.getId() == CombatArtAttack.getAttackingUnit().getId();
        if (usingCombatArt) {
            var combatArt = CombatArtAttack.getCombatArt();
            var content = combatArt.getOriginalContent();
            totalStatus.powerTotal += content.getValue(0);
            totalStatus.hitTotal += content.getValue(1);
            totalStatus.criticalTotal += content.getValue(2);
            totalStatus.defenseTotal += content.getValue(3);	
            totalStatus.avoidTotal += content.getValue(4);	
            totalStatus.criticalAvoidTotal += content.getValue(5);
        }

        return totalStatus;
    }

    var alias2 = Calculator.calculateRoundCount;
    Calculator.calculateRoundCount = function(active, passive, weapon) {
        var rounds = alias2.call(this, active, passive, weapon);

        if (CombatArtAttack.isCombatArtAttack()) {
            var unit = CombatArtAttack.getAttackingUnit();
            var isAttacker = active.getId() == unit.getId();
            if (isAttacker) {
                rounds = 1;
            }
        }

        return rounds;
    }

    var alias3 = AttackOrder.isCurrentItemDecrement;
    AttackOrder.isCurrentItemDecrement = function() {
        var isItemDecrement = alias3.call(this);
        if (CombatArtAttack.isCombatArtAttack()) {
            var active = this.getActiveUnit();
            var unit = CombatArtAttack.getAttackingUnit();
            isItemDecrement = unit.getId() !== active.getId();
        }

        return isItemDecrement;
    }

})()