//Plugin by Goinza

var NeutralControl = {

    getUnitType: function(unit) {
        var unitType = unit.custom.neutralFaction==null ? unit.getUnitType() : UnitType.NEUTRAL;
        return unitType;
    },

    getUnitFilter: function(unit) {
        unitType = this.getUnitType(unit);
        var filter = 0;
        switch (unitType) {
            case UnitType.PLAYER:
                filter = UnitFilterFlag.PLAYER;
                break;
            case UnitType.ENEMY:
                filter = UnitFilterFlag.ENEMY;
                break;
            case UnitType.ALLY:
                filter = UnitFilterFlag.ALLY;
                break;
            case UnitType.NEUTRAL:
                filter = UnitFilterFlag.NEUTRAL;
                break;
        }

        return filter;
    },

    changeNeutralType: function(unit) {
        if (unit.custom.neutralFaction != null) {
            unit.custom.neutralFaction = null;
            unit.setCustomRenderer({});
        }
        else {
            unit.custom.neutralFaction = true;
        }
    },

    getNeutralUnitList: function(listArray) {        
        var neutralArray = this._buildNeutralArray(listArray);
        var neutralList = StructureBuilder.buildDataList();
        neutralList.setDataArray(neutralArray);

        return neutralList;
    },

    getNonNeutralUnitList: function(list) {
        var nonNeutralArray = this._buildNonNeutralArray(list);
        var nonNeutralList = StructureBuilder.buildDataList();
        nonNeutralList.setDataArray(nonNeutralArray);

        return nonNeutralList;
    },

    isHiddenUnit: function(unit) {
        return unit.custom.neutralHidden;
    },

    getNeutralMusicHandle: function(mapInfo) {
        var handle = mapInfo.getEnemyTurnMusicHandle();
        var musicObject = mapInfo.custom.neutralMusic;
        var id, isRuntime;
        if (musicObject!=null) {            
            id = musicObject.id;
            isRuntime = musicObject.isRuntime;
            handle = root.createResourceHandle(isRuntime, id, 0, 0, 0)            
        }

        return handle;
    },

    getNeutralFrame: function() {
        var defaultFrame = root.queryUI('enemyturn_frame');
        var uiResourceList = root.getBaseData().getUIResourceList(UIType.SCREENFRAME, NeutralSettings.FRAME.isRuntime);
        var neutralFrame = uiResourceList.getDataFromId(NeutralSettings.FRAME.id);

        return neutralFrame == null ? defaultFrame : neutralFrame;
    },

    getNeutralWindow: function(originalUnitType) {
        var uiResourceList = root.getBaseData().getUIResourceList(UIType.MENUWINDOW, NeutralSettings.WINDOW.isRuntime);
        var neutralWindow = uiResourceList.getDataFromId(NeutralSettings.WINDOW.id);
        if (neutralWindow == null) {
            neutralWindow = this._getDefaultWindow(originalUnitType);
        }
        
        return neutralWindow;
    },

    getNeutralColorIndex: function(unit, defaultColor) {
        var neutralIndex = unit.getClass().custom.neutralMotion;
        var colorIndex = neutralIndex == null ? defaultColor : neutralIndex;
        return colorIndex;
    },

    getNeutralCharchip: function(unit) {
        var charchip = unit.getClass().custom.neutralCharchip;
        return charchip;
    },

    isObjectiveEnabled: function() {
        return NeutralSettings.ADD_OBJECTIVE_WINDOW;
    },

    _buildNeutralArray: function(listArray) {
        var neutralArray = [];
        for (var i=0; i<listArray.length; i++) {
            this._pushUnitsToArray(listArray[i], neutralArray);
        }

        return neutralArray;
    },

    _buildNonNeutralArray: function(list) {
        var nonNeutralArray = [];
        var unit, unitType;
        for (var i=0; i<list.getCount(); i++) {
            unit = list.getData(i);
            unitType = this.getUnitType(unit);
            if (unitType != UnitType.NEUTRAL && !this.isHiddenUnit(unit)) {
                nonNeutralArray.push(unit);
            }
        }

        return nonNeutralArray;
    },

    _pushUnitsToArray: function(list, array) {
        var unit, unitType, isNeutralUnit;
        for (var i=0; i<list.getCount(); i++) {
            unit = list.getData(i);
            unitType = this.getUnitType(unit);
            isNeutralUnit = unitType == UnitType.NEUTRAL && !this.isHiddenUnit(unit);
            if (isNeutralUnit) {
                array.push(unit);
            }
            
        }
    },

    _getDefaultWindow: function(originalUnitType) {
        var window = null;
        switch(originalUnitType) {
            case UnitType.PLAYER:
                window = root.queryTextUI('player_window').getUIImage();
                break;
            case UnitType.ENEMY:
                window = root.queryTextUI('enemy_window').getUIImage();
                break;
            case UnitType.ALLY:
                window = root.queryTextUI('partner_window').getUIImage();
                break;
        }
        
        return window;
    }

}