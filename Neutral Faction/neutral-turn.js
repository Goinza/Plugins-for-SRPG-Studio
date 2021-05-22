//Plugin by Goinza

(function() {

    FreeAreaScene._neutralTurnObject;

    var alias1 = FreeAreaScene._prepareSceneMemberData;
    FreeAreaScene._prepareSceneMemberData = function() {
        alias1.call(this);
        this._neutralTurnObject = createObject(EnemyTurn);
    }

    var alias2 = FreeAreaScene.getTurnObject;
    FreeAreaScene.getTurnObject = function() {
        var obj = alias2.call(this);
        var turnType = root.getCurrentSession().getTurnType();        
        if (turnType == TurnType.NEUTRAL) {
            obj = this._neutralTurnObject;
        }

        return obj;
    }

})()