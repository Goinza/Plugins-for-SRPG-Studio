//Plugin by Goinza

HybridControl = {

    isHybrid: function(weapon) {
        var isHybrid;
        var hybrid = unit.custom.hybridAttack;
        if (hybrid!=null) {
            if (typeof hybrid.length != 'number' || typeof hybrid[0].length != 'number') {
                throwError028(weapon);
            }
            isHybrid = true;
        }
        else {
            isHybrid = false;
        }

        return isHybrid;
    },

    //Example of how hybridAttack works: {hybridAttack: [ ["Sword", 1, true], ["Wind", 2, false] ]}

    //Assumes that the hybrid check is done before calling this function.
    getWeaponType: function(weapon, range) {
        var hybrid = unit.custom.hybridAttack;
        var i = 0;
        var found = false;
        var weaponType = weapon.getWeaponType();
        while (i<hybrid.length && !found) {
            if (hybrid[i][1] == range) {
                found = true;
                weaponType = this._findWeaponType(weapon, hybrid[i][0]);
            }
            i++;
        }

        return weaponType;
    },

    //Returns true if the weapon deals physical damage, or false if it deals magical damage.
    getWeaponCategory: function(weapon, range) {
        var hybrid = unit.custom.hybridAttack;
        var i = 0;
        var found = false;
        var physical = Miscellaneous.isPhysicsBattle(weapon);

        while (i<hybrid.length && !found) {
            if (hybrid[i][1] == range) {
                found = true;
                physical = hybrid[i][2]
            }
            i++;
        }

        return physical;
    },

    _findWeaponType: function(weapon, weaponTypeName) {
        var list, count, weaponType;
        var found = false;
        var i = 0;
        var j;
        while (i<3 && !found) {
            list = root.getBaseData().getWeaponTypeList(i);
            count = list.getDataCount();
            j = 0;
            while (j<count && !found) {
                weaponType = list.getData(j);
                if (weaponType.getName() == weaponTypeName) {
                    found = true;
                }
                j++;
            }
            i++;
        }

        if (!found) {
            throwError028(weapon);
        }

        return weaponType;
    }

}