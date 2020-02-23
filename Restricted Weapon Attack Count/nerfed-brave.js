//Plugin by Goinza

(function() {
    var alias1 = Calculator.calculateAttackCount;
    Calculator.calculateAttackCount = function(active, passive, weapon) {
        var count = alias1.call(this, active, passive, weapon);
        if (weapon.custom.brave!=null && weapon.custom.brave) {
            var ableUnit = root.getCurrentScene() === SceneType.FREE ? ((root.getCurrentSession().getTurnType() === TurnType.PLAYER && active.getUnitType() === UnitType.PLAYER) || (root.getCurrentSession().getTurnType() === TurnType.ALLY && active.getUnitType() === UnitType.ALLY)  || (root.getCurrentSession().getTurnType() === TurnType.ENEMY && active.getUnitType() === UnitType.ENEMY)) : false;
            if (!ableUnit) {
                count = 1;
            }
        }
    
        return count;
    }

})();
