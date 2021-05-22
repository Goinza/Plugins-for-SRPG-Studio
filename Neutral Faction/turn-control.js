//Plugin by Goinza

(function() {

    TurnControl.getActorList = function() {
		var list = null;
        var auxList;
		var turnType = root.getCurrentSession().getTurnType();
		
		if (turnType === TurnType.PLAYER) {
			auxList = PlayerList.getSortieList();
            list = NeutralControl.getNonNeutralUnitList(auxList);
		}
		else if (turnType === TurnType.ENEMY) {
			auxList = EnemyList.getAliveList();
            list = NeutralControl.getNonNeutralUnitList(auxList);
		}
		else if (turnType === TurnType.ALLY) {
			auxList = AllyList.getAliveList();
            list = NeutralControl.getNonNeutralUnitList(auxList);
		}
        else if (turnType == TurnType.NEUTRAL) {
            var listArray = [];
            listArray.push(PlayerList.getSortieList());
            listArray.push(EnemyList.getAliveList());
            listArray.push(AllyList.getAliveList());
            list = NeutralControl.getNeutralUnitList(listArray);
        }
		
		return list;
	}

    //TurnControl.getTargetList is not used??

    TurnChangeEnd._startNextTurn = function() {
		var nextTurnType;
		var turnType = root.getCurrentSession().getTurnType();
		
		this._checkActorList();
		
		if (turnType === TurnType.PLAYER) {
			// If a number of the enemy is 0 at this moment, it is also possible that the enemy turn is not executed.
			// However, in this case, the enemy turn related cannot be detected with an event condition,
			// always switch it to the enemy turn.
			// If a number of the enemy is 0, images and background music are not changed,
			// so it doesn't seem that it's switched to the enemy turn.
			nextTurnType = TurnType.ENEMY;
		}
		else if (turnType === TurnType.ENEMY) {
			nextTurnType = TurnType.ALLY;
		}
		else if (turnType === TurnType.ALLY) {
			nextTurnType = TurnType.NEUTRAL;
		}
        else if (turnType === TurnType.NEUTRAL) {
            nextTurnType = TurnType.PLAYER;
        }
		
		root.getCurrentSession().setTurnType(nextTurnType);
	}

    TurnChangeMapStart.doLastAction = function() {
		var turnType = TurnType.PLAYER;
        var playerList = NeutralControl.getNonNeutralUnitList(PlayerList.getSortieList());
        var enemyList = NeutralControl.getNonNeutralUnitList(EnemyList.getAliveList());
        var allyList = NeutralControl.getNonNeutralUnitList(AllyList.getAliveList());
        var listArray = [];
        listArray.push(PlayerList.getSortieList());
        listArray.push(EnemyList.getAliveList());
        listArray.push(AllyList.getAliveList());
        var neutralList = NeutralControl.getNeutralUnitList(listArray);
		
		if (playerList.getCount() > 0) {
			turnType = TurnType.PLAYER;
		}
		else if (enemyList.getCount() > 0) {
			turnType = TurnType.ENEMY;
		}
		else if (allyList.getCount() > 0) {
			turnType = TurnType.ALLY;
		}
        else if (neutralList.getCount() > 0) {
            turnType = TurnType.NEUTRAL;
        }
		
		root.getCurrentSession().setTurnCount(0);
		root.getCurrentSession().setTurnType(turnType);
	}

	BaseTurnLogoFlowEntry._isTurnGraphicsDisplayable = function() {
		var count, auxList, list, listArray;
		var turnType = root.getCurrentSession().getTurnType();
		
		if (turnType === TurnType.PLAYER) {
            auxList = PlayerList.getSortieList();
            list = NeutralControl.getNonNeutralUnitList(auxList);
		}
		else if (turnType === TurnType.ENEMY) {
            auxList = EnemyList.getAliveList();
            list = NeutralControl.getNonNeutralUnitList(auxList);
		}
		else if (turnType === TurnType.ALLY) {
            auxList = AllyList.getAliveList();
            list = NeutralControl.getNonNeutralUnitList(auxList);
		}
        else if (turnType === TurnType.NEUTRAL) {
            listArray = [];
            listArray.push(PlayerList.getSortieList());
            listArray.push(EnemyList.getAliveList());
            listArray.push(AllyList.getAliveList());
            list = NeutralControl.getNeutralUnitList(listArray);
        }

        count = list.getCount();		
		return count > 0;
	}

})()