//Plugin by Goinza

var DoubleAttackControl = {

    getValidWeaponTypes: function(skill) {
        var validWeaponTypes = [];
        if (skill.custom.weaponTypes != null) {
            validWeaponTypes = skill.custom.weaponTypes;
        }

        return validWeaponTypes;
    },

    isValidWeaponType: function(weapon, weaponTypesArray) {
        if (!weapon.isWeapon()) {
            return false;
        }

        var isValid = false;
        var i = 0;
        var weaponTypeId = weapon.getWeaponType().getId();
        var weaponCategoryType = weapon.getWeaponCategoryType();
        while (i < weaponTypesArray.length && !isValid) {
            isValid = weaponTypeId == weaponTypesArray[i].id && weaponCategoryType == weaponTypesArray[i].category;
            i++;
        }

        return isValid;
    }

}