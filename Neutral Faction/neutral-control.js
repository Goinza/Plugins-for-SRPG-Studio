//Plugin by Goinza and Lady Rena

var FactionControl = {

    getUnitType: function(unit) {
        var unitType = unit.getUnitType();

        if (unit.custom.neutralFaction!=null) {
            if (typeof unit.custom.neutralFaction != 'boolean') {
                throwError048(unit);
            }
            if (unit.custom.neutralFaction) {
                unitType = UnitType.NEUTRAL;
            }
        }

        return unitType;
    },

    getUnitFilter: function(unit, filter) {        
        if (unit.custom.neutralFaction!=null) {
            if (typeof unit.custom.neutralFaction != 'boolean') {
                throwError048(unit);
            }
            if (unit.custom.neutralFaction) {
                filter = UnitFilterFlag.NEUTRAL;
            }
        }

        return filter;
    },

    getNeutralList: function() {
        var enemyList = EnemyList.getAliveList();
        var neutralArray = [];
        var neutralList;

        for (var i=0; i<enemyList.getCount(); i++) {
            if (this.getUnitType(enemyList.getData(i))==UnitType.NEUTRAL) {
                neutralArray.push(enemyList.getData(i));
            }
        }

        neutralList = StructureBuilder.buildDataList();
        neutralList.setDataArray(neutralArray);
        
        return neutralList;
    },

    getEnemyList: function() {
        var enemyList = EnemyList.getAliveList();
        var enemyArray = [];

        for (var i=0; i<enemyList.getCount(); i++) {
            if (this.getUnitType(enemyList.getData(i))==UnitType.ENEMY) {
                enemyArray.push(enemyList.getData(i));
            }
        }

        enemyList = StructureBuilder.buildDataList();
        enemyList.setDataArray(enemyArray);

        return enemyList;
    },

    getEnemyAndNeutralList: function() {
        var enemyList = this.getEnemyList();
        var neutralList = this.getNeutralList();
        var enemyNeutralArray = [];
        var enemyNeutralList;

        for (var i=0; i<enemyList.getCount(); i++) {
            enemyNeutralArray.push(enemyList.getData(i));
        }

        for (var i=0; i<neutralList.getCount(); i++) {
            enemyNeutralArray.push(neutralList.getData(i));
        }

        enemyNeutralList = StructureBuilder.buildDataList();
        enemyNeutralList.setDataArray(enemyNeutralArray);

        return enemyNeutralList;
    },

    getNeutralMusicHandle: function(mapInfo) {
        var id = -1;
        var handle = mapInfo.getEnemyTurnMusicHandle();

        if (mapInfo.custom.neutralMusic!=null) {
            if (typeof mapInfo.custom.neutralMusic != 'number') {
                throwError049(mapInfo);
            }
            if (mapInfo.custom.neutralMusic >= 0) {
                handle = root.createResourceHandle(false, mapInfo.custom.neutralMusic, 0, 0, 0)
            }
        }

        return handle;
    },

    getNeutralFrameUI: function() {
        return root.getBaseData().getUIResourceList(UIType.SCREENFRAME, neutralSettings.FRAME.isRuntime).getDataFromId(neutralSettings.FRAME.id);
    },

    getNeutralWindowUI: function() {
        return root.getBaseData().getUIResourceList(UIType.MENUWINDOW, neutralSettings.WINDOW.isRuntime).getDataFromId(neutralSettings.WINDOW.id);
    },

    objectiveEnabled: function() {
        return neutralSettings.ADD_OBJECTIVE_WINDOW;
    }

}