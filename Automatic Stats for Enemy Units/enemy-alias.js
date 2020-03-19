//Plugin by Goinza

ReinforcementChecker._appearUnit = function(pageData, x, y) {
    var unit;
    var list = EnemyList.getAliveList();
    
    if (list.getCount() >= DataConfig.getMaxAppearUnitCount()) {
        // Don't appear by exceeding "Max Map Enemy".
        return null;
    }
    
    // It means that the unit has appeared with this following method.
    unit = root.getObjectGenerator().generateUnitFromRefinforcementPage(pageData);
    if (unit !== null) {
        unit.setMapX(x);
        unit.setMapY(y);

        if (unit.getImportance() === ImportanceType.MOB) {
            EnemyCalculator.setUnitStats(unit);
            EnemyCalculator.setRandomVariance(unit);
            if (typeof RankUnitParameter != 'undefined') {
                EnemyCalculator.setWeaponRanks(unit);
            }
        }        

        UnitProvider.setupFirstUnit(unit);
    }
    
    return unit;
}

var bss = BattleSetupScene.setSceneData;
BattleSetupScene.setSceneData = function() {
    bss.call(this);

    var enemies = EnemyList.getAliveDefaultList();
    var i = 0;
    for (i=0; i<enemies.getCount(); i++) {
        if (enemies.getData(i).getImportance() === ImportanceType.MOB) {
            EnemyCalculator.setUnitStats(enemies.getData(i));
            EnemyCalculator.setRandomVariance(enemies.getData(i));
            if (typeof RankUnitParameter != 'undefined') {
                EnemyCalculator.setWeaponRanks(enemies.getData(i));
            }
        }
    }  
    
}

var eis01 = ScriptCall_AppearEventUnit;
ScriptCall_AppearEventUnit = function(unit) {
    eis01.call(this, unit);
    if (unit.getImportance() === ImportanceType.MOB && unit.getUnitType()==UnitType.ENEMY) {
        EnemyCalculator.setUnitStats(unit);
        EnemyCalculator.setRandomVariance(unit);
        if (typeof RankUnitParameter != 'undefined') {
            EnemyCalculator.setWeaponRanks(unit);
        }
    } 
}