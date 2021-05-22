//Plugin by Goinza

(function() {

    var alias1 = FilterControl.getNormalFilter;
    FilterControl.getNormalFilter = function(unitType) {
        if (unitType == UnitType.NEUTRAL) {
            filter = UnitFilterFlag.NEUTRAL;
        }
        else {
            filter = alias1.call(this, unitType);
        }

        return filter;
    }

    var alias2 = FilterControl.getReverseFilter;
    FilterControl.getReverseFilter = function(unitType) {
        var filter = 0;

        if (unitType == UnitType.NEUTRAL) {
            filter = UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY;
        }
        else {
            filter = alias2.call(this, unitType);
            filter |= UnitFilterFlag.NEUTRAL;
        }

        return filter;
    }

    var alias3 = FilterControl.getBestFilter;
    FilterControl.getBestFilter = function(unitType, filterFlag) {
        var newFlag = 0;
        if (unitType == UnitType.NEUTRAL) {
            if (filterFlag & UnitFilterFlag.PLAYER) {
                newFlag |= UnitFilterFlag.NEUTRAL;
            }
            if (filterFlag & UnitFilterFlag.ENEMY) {
                newFlag |= UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY;
            }
        }
        else {
            newFlag = alias3.call(this, unitType, filterFlag);
            if (filterFlag & UnitFilterFlag.ENEMY) {
                newFlag |= UnitFilterFlag.NEUTRAL;
            }
        }

        return newFlag;
    }

    FilterControl.getListArray = function(filter) {
        var listArray = [];
        var auxList, auxArray;

        if (filter & UnitFilterFlag.PLAYER) {
            auxList = PlayerList.getSortieList()
			listArray.push(NeutralControl.getNonNeutralUnitList(auxList));
		}
		
		if (filter & UnitFilterFlag.ENEMY) {
            auxList = EnemyList.getAliveList();
			listArray.push(NeutralControl.getNonNeutralUnitList(auxList));
		}
		
		if (filter & UnitFilterFlag.ALLY) {
            auxList = AllyList.getAliveList();
			listArray.push(NeutralControl.getNonNeutralUnitList(auxList));
		}

        if (filter & UnitFilterFlag.NEUTRAL) {
            auxArray = [];
            auxArray.push(PlayerList.getSortieList());
            auxArray.push(EnemyList.getAliveList());
            auxArray.push(AllyList.getAliveList());
            listArray.push(NeutralControl.getNeutralUnitList(auxArray));
        }
		
		return listArray;
    }

    FilterControl.getAliveListArray = function(filter) {
		var listArray = [];
        var auxList, auxArray;

		if (filter & UnitFilterFlag.PLAYER) {
            auxList = PlayerList.getAliveList();
			listArray.push(NeutralControl.getNonNeutralUnitList(auxList));
		}
		
		if (filter & UnitFilterFlag.ENEMY) {
            auxList = EnemyList.getAliveList();
			listArray.push(NeutralControl.getNonNeutralUnitList(auxList));
		}
		
		if (filter & UnitFilterFlag.ALLY) {
            auxList = AllyList.getAliveList();
			listArray.push(NeutralControl.getNonNeutralUnitList(auxList));
		}

        if (filter & UnitFilterFlag.NEUTRAL) {
            auxArray = [];
            auxArray.push(PlayerList.getAliveList());
            auxArray.push(EnemyList.getAliveList());
            auxArray.push(AllyList.getAliveList());
            listArray.push(NeutralControl.getNeutralUnitList(auxArray));
        }
		
		return listArray;	
	}

    FilterControl.getDeathListArray = function(filter) {
        var listArray = [];
        var auxList, auxArray;

		if (filter & UnitFilterFlag.PLAYER) {
            auxList = PlayerList.getDeathList();
			listArray.push(NeutralControl.getNonNeutralUnitList(auxList));
		}
		
		if (filter & UnitFilterFlag.ENEMY) {
            auxList = EnemyList.getDeathList();
			listArray.push(NeutralControl.getNonNeutralUnitList(auxList));
		}
		
		if (filter & UnitFilterFlag.ALLY) {
            auxList = AllyList.getDeathList();
			listArray.push(NeutralControl.getNonNeutralUnitList(auxList));
		}

        if (filter & UnitFilterFlag.NEUTRAL) {
            auxArray = [];
            auxArray.push(PlayerList.getDeathList());
            auxArray.push(EnemyList.getDeathList());
            auxArray.push(AllyList.getDeathList());
            listArray.push(NeutralControl.getNeutralUnitList(auxArray));
        }
		
		return listArray;
    }

    var alias4 = FilterControl.isUnitTypeAllowed;
    FilterControl.isUnitTypeAllowed = function(unit, targetUnit) {
        var unitType = NeutralControl.getUnitType(unit);
        var targetUnitType = NeutralControl.getUnitType(targetUnit);
        if (unitType === UnitType.NEUTRAL) {
            return targetUnitType == UnitType.NEUTRAL;
        }
        return alias4.call(this, unitType, targetUnitType);
    }

    FilterControl.isReverseUnitTypeAllowed = function(unit, targetUnit) {
        var unitType = NeutralControl.getUnitType(unit);
        var targetUnitType = NeutralControl.getUnitType(targetUnit);
        var isReverse = false;

        switch (unitType) {
            case UnitType.PLAYER:
                isReverse = targetUnitType === UnitType.ENEMY || targetUnitType === UnitType.NEUTRAL;
                break;
            case UnitType.ENEMY:
                isReverse = targetUnitType === UnitType.PLAYER || targetUnitType === UnitType.ALLY || targetUnitType === UnitType.NEUTRAL;
                break;
            case UnitType.ALLY:
                isReverse = targetUnitType === UnitType.ENEMY || targetUnitType == UnitType.NEUTRAL;
                break;
            case UnitType.NEUTRAL:
                isReverse = targetUnitType === UnitType.PLAYER || targetUnitType == UnitType.ENEMY || targetUnitType == UnitType.ALLY;
        }

        return isReverse;
    }

    var alias5 = FilterControl.isBestUnitTypeAllowed;
    FilterControl.isBestUnitTypeAllowed = function(unitType, targetUnitType, filterFlag) {
        var newFilterFlag = this.getBestFilter(unitType, filterFlag);
        var isAliasAllowed = alias5.call(this, unitType, targetUnitType, filterFlag);
        var isNeutralAllowed = newFilterFlag & UnitFilterFlag.NEUTRAL && targetUnitType === UnitType.NEUTRAL;

        return isAliasAllowed || isNeutralAllowed;
    }

})()