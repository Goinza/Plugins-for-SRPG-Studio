//Plugin by Goinza

var CombatArtRange = {

    getCombatArtAttackIndexArray: function(unit, weapon, combatArt) {
        return this._getAttackIndexArray(unit, weapon, true, combatArt);
    }, 
	
	getCustomRangeObject: function(combatArt) {
		var obj = {};
		obj.startRange = combatArt.custom.startRange ? combatArt.custom.startRange : 0;
		obj.endRange = combatArt.custom.endRange ? combatArt.custom.endRange : 0;
		return obj;
	},

    _getAttackIndexArray: function(unit, weapon, isSingleCheck, combatArt) {
		var i, index, x, y, targetUnit;
		var indexArrayNew = [];
		var indexArray = this._createIndexArray(unit.getMapX(), unit.getMapY(), weapon, combatArt);
		var count = indexArray.length;
		
		for (i = 0; i < count; i++) {
			index = indexArray[i];
			x = CurrentMap.getX(index);
			y = CurrentMap.getY(index);
			targetUnit = PosChecker.getUnitFromPos(x, y);
			if (targetUnit !== null && unit !== targetUnit) {
				if (FilterControl.isReverseUnitTypeAllowed(unit, targetUnit)) {
					indexArrayNew.push(index);
					if (isSingleCheck) {
						return indexArrayNew;
					}
				}
			}
		}
		
		return indexArrayNew;
	},

    _createIndexArray: function(x, y, weapon, combatArt) {
        var customStart = combatArt.custom.startRange;
        var customEnd = combatArt.custom.endRange;
		var startRange = customStart ? customStart : weapon.getStartRange();
        var endRange = customEnd ? customEnd : weapon.getEndRange();

        if (startRange > endRange) {
            throwError037(combatArt);
        }
		
		return IndexArray.getBestIndexArray(x, y, startRange, endRange);
	}

}