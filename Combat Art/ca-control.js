//Plugin by Goinza

var CombatArtControl = {

    getCombatArtsArray: function(unit) {
        this.validateUnit(unit);
        var unitArts = unit.custom.combatArt;  
        
        var combatArts = [];
        if (unitArts!=null) {
            var originalDataList = root.getBaseData().getOriginalDataList(TAB_COMBATART);
            var originalData;
    
            for (var i=0; i<unitArts.length; i++) {
                originalData = originalDataList.getDataFromId(unitArts[i]);
                this.validateCombatArt(originalData);
                combatArts.push(originalData);
            }
        }       

        return combatArts;
    },

    getArtSkillsArray: function(combatArt) {
        var multipleData = combatArt.getOriginalContent().getTargetAggregation();
        var count = multipleData.getObjectCount();
        var artSkills = [];
        for (var i=0; i<count; i++) {
            if (multipleData.getObjectType(i) == ObjectType.SKILL) {
                artSkills.push(multipleData.getObjectData(i));
            }
        }

        return artSkills;
    },

    getArtWeaponsArray: function(combatArt) {
        var multipleData = combatArt.getOriginalContent().getTargetAggregation();
        var count = multipleData.getObjectCount();
        var artWeapons = [];
        for (var i=0; i<count; i++) {
            if (multipleData.getObjectType(i) == ObjectType.WEAPON) {
                artWeapons.push(multipleData.getObjectData(i));
            }
        }

        return artWeapons;
    },

    getCost: function(combatArt) {
        var cost = combatArt.custom.cost;
        if (typeof cost != 'number') {
            throwError036(combatArt);
        }
        return cost;
    },

    getRanges: function(combatArt, weapon) {
        var ranges = {};
        ranges.start = combatArt.custom.startRange!=null ? combatArt.custom.startRange : weapon.getStartRange();
        ranges.end = combatArt.custom.endRange!=null ? combatArt.custom.endRange : weapon.getEndRange();
        if (typeof ranges.start != 'number' || typeof ranges.end != 'number') {
            throwError037(combatArt);
        }

        return ranges;
    },

    getArtWeaponTypesArray: function(combatArt) {
        var multipleData = combatArt.getOriginalContent().getTargetAggregation();
        var count = multipleData.getObjectCount();
        var artWeaponTypes = [];
        for (var i=0; i<count; i++) {
            if (multipleData.getObjectType(i) == 203) { //203 = Weapon Type value
                artWeaponTypes.push(multipleData.getObjectData(i));
            }
        }

        return artWeaponTypes;
    },

    addCombatArt: function(combatArt, unit) {
        this.validateUnit(unit);
        if (unit.custom.combatArt==null) {
            unit.custom.combatArt = [];
        }
        this.validateCombatArt(combatArt);
        unit.custom.combatArt.push(combatArt.getId());
    },

    removeCombatArt: function(combatArt, unit) {
        this.validateUnit(unit);
        var unitArts = unit.custom.combatArt;
        var found = false;
        var i = 0;
        while (i<unitArts.length && !found) {
            if (unitArts[i] == combatArt.getId()) {
                found = true;
                unit.custom.combatArt.splice(i, 1);
            }
            i++;
        }

        return found;
    },
    
    isUnitAttackable: function(unit, combatArt) {
		var i, item, indexArray;
        var count = UnitItemControl.getPossessionItemCount(unit);
        var ranges;
        
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			if (item !== null && ItemControl.isWeaponAvailable(unit, item) && this.isWeaponAllowed(combatArt, item)) {
                ranges = this.getRanges(combatArt, item);
                indexArray = this.getAttackIndexArray(unit, ranges.start, ranges.end, true);
                if (indexArray.length !== 0) {
                    return true;
                }				
			}
		}
		
		return false;
    },
    
    getAttackIndexArray: function(unit, startRange, endRange, isSingleCheck) {
        var indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), startRange, endRange);
        var index, x, y, targetUnit;
        var indexArrayNew = [];

        for (var i=0; i<indexArray.length; i++) {
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

    //Checks that the weapon is compatible with the selected combat art
    isWeaponAllowed: function(combatArt, weapon) {
        var artWeapons = this.getArtWeaponsArray(combatArt);
        var artWeaponTypes = this.getArtWeaponTypesArray(combatArt);
        var cost = this.getCost(combatArt);
        var isWeapon, isWeaponType, durability, i;

        if (artWeapons.length > 0) {
            isWeapon = false;
            i = 0;
            while (i<artWeapons.length && !isWeapon) {
                isWeapon = weapon.getName()==artWeapons[i].getName();
                i++;
            }
        }
        else {
            isWeapon = true;
        }

        if (artWeaponTypes.length > 0) {
            isWeaponType = false;
            i = 0;
            while (i<artWeaponTypes.length && !isWeaponType) {
                isWeaponType = weapon.getWeaponType().getName() == artWeaponTypes[i].getName();
                i++;
            }
        }
        else {
            isWeaponType = true;
        }

        durability = cost <= weapon.getLimit() || weapon.getLimitMax() === 0;

        return isWeapon && isWeaponType && durability;
    },

    //Check that all parameters work correctly
    validateCombatArt: function(combatArt) {
        if (combatArt.getOriginalContent().getCustomKeyword() != "CombatArt") {
            throwError039(combatArt);
        }        
    },

    validateUnit: function(unit) {
        var unitArts = unit.custom.combatArt;
        if (unitArts!=null) {
            if (typeof unitArts.length != 'number') {
                throwError040(unit);
            }
            for (var i=0; i<unitArts.length; i++) {
                if (typeof unitArts[i] != 'number') {
                    throwError040(unit);
                }
            }
        }
    }
}