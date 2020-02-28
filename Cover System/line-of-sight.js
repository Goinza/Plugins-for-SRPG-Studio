//Plugin by Goinza

(function() {
    AttackChecker.getAttackIndexArray = function(unit, weapon, isSingleCheck) {
        var i, index, x, y, targetUnit;
        var indexArrayNew = [];
        var indexArray = IndexArray.createIndexArray(unit.getMapX(), unit.getMapY(), weapon);
        var count = indexArray.length;
        
        for (i = 0; i < count; i++) {
            index = indexArray[i];
            x = CurrentMap.getX(index);
            y = CurrentMap.getY(index);
            targetUnit = PosChecker.getUnitFromPos(x, y);
            if (targetUnit !== null && unit !== targetUnit && CoverControl.hasLineOfSight(unit, targetUnit)) {
                if (FilterControl.isReverseUnitTypeAllowed(unit, targetUnit)) {
                    indexArrayNew.push(index);
                    if (isSingleCheck) {
                        return indexArrayNew;
                    }
                }
            }
        }
        
        return indexArrayNew;
    }
    
    var alias1 = DamageCalculator.calculateDamage;
    DamageCalculator.calculateDamage = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
        var damage = alias1.call(this, active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue);
        var cover = CoverControl.getCoverBonus(active, passive);

        return Math.round(damage * cover.dmg);
    }

    var alias2 = HitCalculator.calculateHit;
    HitCalculator.calculateHit = function(active, passive, weapon, activeTotalStatus, passiveTotalStatus) {
        var hit = alias2.call(this, active, passive, weapon, activeTotalStatus, passiveTotalStatus);
        var cover = CoverControl.getCoverBonus(active, passive);

        return Math.round(hit * cover.hit);
    }

    var alias3 = CriticalCalculator.calculateCritical;
    CriticalCalculator.calculateCritical = function(active, passive, weapon, activeTotalStatus, passiveTotalStatus) {
        var critical = alias3.call(this, active, passive, weapon, activeTotalStatus, passiveTotalStatus);
        var cover = CoverControl.getCoverBonus(active, passive);

        return Math.round(critical * cover.crit);
    }
    
    var alias4 = AIScorer.Weapon.getScore;
    AIScorer.Weapon.getScore = function(unit, combination) {
        var index = combination.posIndex;
        var currentX = unit.getMapX();
        var currentY = unit.getMapY();

        unit.setMapX(CurrentMap.getX(index));
        unit.setMapY(CurrentMap.getY(index));

        var score = CoverControl.hasLineOfSight(unit, combination.targetUnit) ? -1 : alias4.call(this, unit, combination);

        unit.setMapX(currentX);
        unit.setMapY(currentY);

        return score;
    }

})()