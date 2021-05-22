//Plugin by Goinza

(function() {

    var alias1 = ObjectiveWindow.getWindowWidth;
    ObjectiveWindow.getWindowWidth = function() {
        var width = alias1.call(this);
        if (NeutralControl.isObjectiveEnabled()) {
            width += 180;
        }

        return width;
    }

    var alias2 = ObjectiveFaceZone.drawFaceZone;
    ObjectiveFaceZone.drawFaceZone = function(x, y) {
        if (NeutralControl.isObjectiveEnabled()) {
            var i, unitType, unit;
            var arr = [UnitType.PLAYER, UnitType.ENEMY, UnitType.ALLY, UnitType.NEUTRAL];
            var count = arr.length;
            
            x += 15;
            y -= 10;
            
            for (i = 0; i < count; i++) {
                unitType = arr[i];
                
                unit = this._getLeaderUnit(unitType);
                if (unit !== null) {
                    this._drawFaceImage(x, y, unit, unitType);
                    this._drawInfo(x, y, unit, unitType);
                }
                
                x += 180;
            }
        }
        else {
            alias2.call(this, x, y);
        }
    }
    var alias3 = ObjectiveFaceZone._drawInfo;
    ObjectiveFaceZone._drawInfo = function(x, y, unit, unitType) {
        if (NeutralControl.isObjectiveEnabled()) {
            var textui = this._getTitleTextUI();
            var color = ColorValue.KEYWORD;
            var font = textui.getFont();
            var pic = textui.getUIImage();
            var text = [StringTable.UnitType_Player, StringTable.UnitType_Enemy, StringTable.UnitType_Ally, NeutralSettings.NAME_FACTION];
            
            y += 112;
            
            TitleRenderer.drawTitle(pic, x - 20 + 5, y - 10, TitleRenderer.getTitlePartsWidth(), TitleRenderer.getTitlePartsHeight(), 3);
            TextRenderer.drawText(x + 5, y + 12, text[unitType], -1, color, font);
            NumberRenderer.drawNumber(x + 100 + 5, y + 7, this._getTotalValue(unitType));
        }
        else {
            alias3.call(this, x, y, unit, unitType);
        }        
    }

    var alias4 = ObjectiveFaceZone._getTotalValue;
    ObjectiveFaceZone._getTotalValue = function(unitType) {
        var count;
        if (NeutralControl.isObjectiveEnabled()) {
            var list, listArray;
            switch (unitType) {
                case UnitType.PLAYER:
                    list = PlayerList.getSortieDefaultList();
                    list = NeutralControl.getNonNeutralUnitList(list);
                    break;
                case UnitType.ENEMY:
                    list = EnemyList.getAliveDefaultList();
                    list = NeutralControl.getNonNeutralUnitList(list);
                    break;
                case UnitType.ALLY:
                    list = AllyList.getAliveDefaultList();
                    list = NeutralControl.getNonNeutralUnitList(list);
                    break;
                case UnitType.NEUTRAL:
                    listArray = [];
                    listArray.push(PlayerList.getSortieDefaultList());
                    listArray.push(EnemyList.getAliveDefaultList());
                    listArray.push(AllyList.getAliveDefaultList());
                    list = NeutralControl.getNeutralUnitList(listArray);
                    break;
            }
            count = list.getCount();
        }
        else {
            count = alias4.call(this, unitType);
        }

        return count;
    }

    var alias5 = ObjectiveFaceZone._getLeaderUnit;
    ObjectiveFaceZone._getLeaderUnit = function(unitType) {
        var unit = null;
        if (NeutralControl.isObjectiveEnabled()) {
            var i, list, listArray, count;
            var unit = null;
            var firstUnit = null;
            
            switch (unitType) {
                case UnitType.PLAYER:
                    list = PlayerList.getMainList();
                    list = NeutralControl.getNonNeutralUnitList(list);
                    break;
                case UnitType.ENEMY:
                    list = EnemyList.getMainList();
                    list = NeutralControl.getNonNeutralUnitList(list);
                    break;
                case UnitType.ALLY:
                    list = AllyList.getMainList();
                    list = NeutralControl.getNonNeutralUnitList(list);
                    break;
                case UnitType.NEUTRAL:
                    listArray = [];
                    listArray.push(PlayerList.getMainList());
                    listArray.push(EnemyList.getMainList());
                    listArray.push(AllyList.getMainList());
                    list = NeutralControl.getNeutralUnitList(listArray);
                    break;
            }
            
            count = list.getCount();
            if (count === 0) {
                return null;
            }
            
            for (i = 0; i < count; i++) {
                unit = list.getData(i);
                if (unit.getSortieState() === SortieType.UNSORTIE) {
                    continue;
                }
                
                if (unit.getAliveState() === AliveType.ERASE) {
                    continue;
                }
                
                if (firstUnit === null) {
                    firstUnit = unit;
                }
                
                if (unit.getImportance() === ImportanceType.LEADER) {
                    break;
                }
            }
            
            // A leader cannot be found, so first unit to be found is a target.
            if (i === count) {
                unit = firstUnit;
            }
        }
        else {
            unit = alias5.call(this, unitType);
        }
        
        return unit;
    }

})()