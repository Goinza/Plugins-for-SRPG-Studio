//Plugin by Goinza

(function() {

    UnitMenuScreen._getUnitList = function(unit) {
		var list = [];
		var type = NeutralControl.getUnitType(unit);
		
		if (type === UnitType.PLAYER) {
			if (this._unitEnumMode === UnitMenuEnum.ALIVE) {
				if (unit.isGuest()) {
					// If the unit is a guest, switch it to the guest unit.
					list = root.getCurrentSession().getGuestList();
				}
				else {
					list = PlayerList.getAliveDefaultList();
                    list = NeutralControl.getNonNeutralUnitList(list);
				}
			}
			else if (this._unitEnumMode === UnitMenuEnum.SORTIE) {
				// If sortie ends, the guest is included in the PlayerList.
				list = PlayerList.getSortieDefaultList();
                list = NeutralControl.getNonNeutralUnitList(list);
			}
			else if (this._unitEnumMode === UnitMenuEnum.SINGLE) {
				list = StructureBuilder.buildDataList();
				list.setDataArray([unit]);
			}
		}
		else if (type === UnitType.ENEMY) {
			list = EnemyList.getAliveDefaultList();
            list = NeutralControl.getNonNeutralUnitList(list);
		}
		else if (type === UnitType.ALLY) {
			list = AllyList.getAliveDefaultList();
            list = NeutralControl.getNonNeutralUnitList(list);
		}
        else if (type === UnitType.NEUTRAL) {
            var listArray = [];
            listArray.push(PlayerList.getSortieDefaultList());
            listArray.push(EnemyList.getAliveDefaultList());
            listArray.push(AllyList.getAliveDefaultList());
            list = NeutralControl.getNeutralUnitList(listArray);
        }
		
		return list;
	}

})()