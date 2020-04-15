//Plugin by Goinza

var HybridControl = {

    isHybrid: function(weapon) {
        var isHybrid = weapon!=null && weapon.custom.hybrid!=null;
        if (isHybrid) {
            this._validateParameter(weapon);
        }
        
        return isHybrid;
    },

    //Finds the element of the hybrid weapons assigned to the selected range.
    //If not element is found, return null and treat the weapon as a normal weapon. 
    findElement: function(weapon, range) {
        var hybrid = weapon.custom.hybrid;
        var i = 0;
        var found = false;
        var element = null;

        while (i<hybrid.length && element==null) {
            if (hybrid[i].range == range) {
                element = hybrid[i];
            }
            i++;
        }

        return element;
    },

    isPhysical: function(weapon, range) {
        var element = this.findElement(weapon, range);

        return element!=null ? element.physical : Miscellaneous.isPhysicsBattle(weapon);
    },

    getWeaponType: function(weapon, range) {
        var element = this.findElement(weapon, range);

        return element!=null ? this.findWeaponTypeObject(weapon, element.type) : weapon.getWeaponType();
    },

    findWeaponTypeObject: function(weapon, weaponTypeName) {
        var found = false;
        var i = 0;
        var j;
        var weaponType;
        var weaponTypeList;
        var count;
        while (i<3 && !found) {
            weaponTypeList = root.getBaseData().getWeaponTypeList(i);
            j = 0;
            count = weaponTypeList.getCount();
            while (j<count && !found) {
                if (weaponTypeList.getData(j).getName() == weaponTypeName) {
                    found = true;
                    weaponType = weaponTypeList.getData(j);
                }
                j++;
            }
            i++;
        }

        if (!found) {
            throwError041(weapon);
        }

        return weaponType;
    },

    //Assume weapon.custom.hybrid != null
    _validateParameter: function(weapon) {
        var hybrid = weapon.custom.hybrid;

        if (typeof hybrid.length != 'number') {
            throwError041(weapon);
        }
        // {hybrid: [ {type:"Sword", range: 1, physical: true}, {type:"Fire", range: 2, physical: false} ]}
        for (var i=0; i<hybrid.length; i++) {
            if (typeof hybrid[i].type != 'string') {
                throwError041(weapon);
            }
            if (typeof hybrid[i].range != 'number') {
                throwError041(weapon);
            }
            if (typeof hybrid[i].physical != 'boolean') {
                throwError041(weapon);
            }
        }
    }

}