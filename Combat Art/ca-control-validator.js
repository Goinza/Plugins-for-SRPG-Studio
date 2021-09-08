//Plugin by Goinza

var CombatArtValidator = {

    getValidWeaponsArray: function(unit, combatArt) {
        var validWeaponsArray = [];
        var allowedWeaponTypes = this.getAllowedWeaponTypes(combatArt);
        var allowedWeapons = this.getAllowedWeapons(combatArt);
        var inventoryCount = UnitItemControl.getPossessionItemCount(unit);
        var item, found, j;

        //Only use one (or neither) of the arrays
        if (allowedWeaponTypes.length > 0) {
            for (var i=0; i<inventoryCount; i++) {
                item = UnitItemControl.getItem(unit, i);
                if (ItemControl.isWeaponAvailable(unit, item)) {
                    found = false;
                    j = 0;
                    while (j<allowedWeaponTypes.length && !found) {
                        if (item.getWeaponType().getName() == allowedWeaponTypes[j].getName()) {
                            found = true;
                            validWeaponsArray.push(item);
                        }
                        j++;
                    }
                }
            }
        }
        else if (allowedWeapons.length > 0) {
            for (var i=0; i<inventoryCount; i++) {
                item = UnitItemControl.getItem(unit, i);
                if (ItemControl.isWeaponAvailable(unit, item)) {
                    found = false;
                    j = 0;
                    while (j<allowedWeapons.length && !found) {
                        if (item.getName() == allowedWeapons[j].getName()) {
                            found = true;
                            validWeaponsArray.push(item);
                        }
                        j++;
                    }
                }
            }
        }
        else {
            for (var i=0; i<inventoryCount; i++) {
                item = UnitItemControl.getItem(unit, i);
                if (ItemControl.isWeaponAvailable(unit, item)) {
                    validWeaponsArray.push(item);
                }
            }
        }              

        return validWeaponsArray;
    },

    getAllowedWeaponTypes: function(combatArt) {
        var multipleData = combatArt.getOriginalContent().getTargetAggregation();
        var count = multipleData.getObjectCount();
        var weaponTypes = [];
        for (var i=0; i<count; i++) {
            if (multipleData.getObjectType(i) == 203) { //203 = ObjectType.WEAPONTYPE
                weaponTypes.push(multipleData.getObjectData(i));
            }
        }

        return weaponTypes;
    },

    getAllowedWeapons: function(combatArt) {
        var multipleData = combatArt.getOriginalContent().getTargetAggregation();
        var count = multipleData.getObjectCount();
        var weapons = [];
        for (var i=0; i<count; i++) {
            if (multipleData.getObjectType(i) == ObjectType.WEAPON) {
                weapons.push(multipleData.getObjectData(i));
            }
        }

        return weapons;
    }

}