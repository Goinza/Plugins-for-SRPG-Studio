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
    
    //THIS FUNCTION CANNOT USE combination.posIndex SO I NEED TO FIX IT SO IT CAN USE THAT OR SOMETHING SIMILAR
    var alias4 = AIScorer.Weapon.getScore;
    AIScorer.Weapon.getScore = function(unit, combination) {
       /* var index = combination.posIndex;
        var currentX = unit.getMapX();
        var currentY = unit.getMapY();

        unit.setMapX(CurrentMap.getX(index));
        unit.setMapY(CurrentMap.getY(index));

        root.log("X: " + CurrentMap.getX(index) + " - Y: " + CurrentMap.getY(index));*/

        var score = CoverControl.hasLineOfSight(unit, combination.targetUnit) ? alias4.call(this, unit, combination) : -1;

       /* unit.setMapX(currentX);
        unit.setMapY(currentY);*/

        return score;
    }
    
    var alias5 = AIScorer.Avoid.getScore;
    AIScorer.Avoid.getScore = function(unit, combination) {
        var score = alias5.call(this, unit, combination);

        var x = unit.getMapX();
		var y = unit.getMapY();
		
		// Change the unit current position temporarily.
		unit.setMapX(CurrentMap.getX(combination.posIndex));
        unit.setMapY(CurrentMap.getY(combination.posIndex));

        var cover = CoverControl.getCoverBonus(combination.targetUnit, unit);
        var damage = Math.round((1 - cover.dmg) * 100);
        var hit = Math.round((1 - cover.hit) * 50);
        score += damage + hit;

        unit.setMapX(x);
		unit.setMapY(y);

        return score;
    }

})()