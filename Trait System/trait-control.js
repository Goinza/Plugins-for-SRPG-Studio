//Plugin by Goinza

var TraitControl = {

    addUnitTrait: function(unit, id) {
        if (unit.custom.trait!=null) {
            this._validateTrait(unit);
            unit.custom.trait.push(id);
        }
        else {
            unit.custom.trait = [id];
        }
    },

    getTrait: function(obj) {
        var trait = [];
        if (obj.custom.trait!=null) {
            this._validateTrait(obj);
            trait = obj.custom.trait;
        }

        return trait;
    },

    getReqTrait: function(item) {
        var reqTrait = [];
        if (item.custom.reqTrait!=null) {
            this._validateReqTrait(item);
            reqTrait = item.custom.reqTrait;
        }

        return reqTrait;
    },

    getEffTrait: function(weapon) {
        var effTrait = [];
        if (weapon.custom.effTrait!=null) {
            this._validateEffTrait(weapon);
            effTrait = weapon.custom.effTrait;
        }

        return effTrait;
    },

    getAddTrait: function(item) {
        if (item.getItemType() != ItemType.CUSTOM || item.getCustomKeyword() != "Trait") {
            throwError045(item);
        }
        
        var addTrait = item.custom.addTrait;
        if (addTrait==null) {
            throwError045(item);
        }

        if (typeof addTrait.length != 'number') {
            throwError045(item);
        }

        for (var i=0; i<addTrait.length; i++) {
            if (typeof addTrait[i] != 'number') {
                throwError045(item);
            }
        }

        return addTrait;
    },

    //We assume that the traits are ordered in a way that the first trait has ID 0, the second ID 1, and so on.
    getTraitFromId: function(id) {
        var list = root.getBaseData().getOriginalDataList(TAB_TRAITS);
        var trait = list.getDataFromId(id);
        if (trait.getOriginalContent().getCustomKeyword() != "Trait") {
            //Throw new error
        }
        return trait;
    },

    getTraitsArray: function(unit) {
        var traitArray = [];
        var i;

        //The traitArray starts empty, so we insert all the traits from the unit without checking for duplicates    
        var auxArray = TraitControl.getTrait(unit);
        for (i=0; i<auxArray.length; i++) {
            traitArray.push(auxArray[i]);
        }

        //Traits of the class
        var unitClass = unit.getClass();
        auxArray = TraitControl.getTrait(unitClass);
        for (i=0; i<auxArray.length; i++) {
            if (!this._isRepeated(traitArray, auxArray[i])) {
                traitArray.push(auxArray[i]);
            }
        }

        return traitArray;
    },

    //True if the active unit has a skill effective againts the passive unit or if the weapon is effective against the passive unit
    isEffective: function(active, passive, weapon) {
        var effective = false;        
        var weaponTraits = this.getEffTrait(weapon);
        var passiveTraits = this.getTraitsArray(passive);                
        var i = 0;
        var j;
        //Check if the weapon is effective against the passive unit
        while (i<passiveTraits.length && !effective) {
            j = 0;
            while (j<weaponTraits.length && !effective) {
                effective = passiveTraits[i] == weaponTraits[j];
                j++;
            }
            i++;
        }

        return effective;
    },

    //True if the unit can equip/use the item
    canUse: function(unit, item) {
        var usable = true;
        var unitTraits = this.getTraitsArray(unit);
        var itemTraits = this.getReqTrait(item);
        var i = 0;
        var j, found;

        while (i<itemTraits.length && usable) {
            found = false;
            j = 0;
            while(j<unitTraits.length && !found) {
                found = itemTraits[i] == unitTraits[j];
                j++;
            }
            usable = found;
            i++;
        }

        return usable;
    },
    
    hasTrait: function(unit, trait) {
        unitTraits = this.getTraitsArray(unit);
        return (this._isRepeated(unitTraits, trait));
    },

    //True if the trait is inside the array
    _isRepeated: function(array, trait) {
        var i = 0;
        var found = false;

        while (i<array.length && !found) {
            found = array[i]==trait;
            i++;
        }

        return found;
    },

    //Assume obj.custom.trait!=null
    //for all validate functions
    _validateTrait: function(obj) {
        var trait = obj.custom.trait;
        if (typeof trait.length != 'number') {
            throwError042(obj);            
        }
        for (var i=0; i<trait.length; i++) {
            if (typeof trait[i] != 'number') {
                throwError042(obj);
            }
        }
    },

    _validateReqTrait: function(item) {
        var reqTrait = item.custom.reqTrait;
        if (typeof reqTrait.length != 'number') {
            throwError043(item);            
        }
        for (var i=0; i<reqTrait.length; i++) {
            if (typeof reqTrait[i] != 'number') {
                throwError043(item);
            }
        }
    },

    _validateEffTrait: function(weapon) {
        var effTrait = weapon.custom.effTrait;
        if (typeof effTrait.length != 'number') {
            throwError044(weapon);            
        }
        for (var i=0; i<effTrait.length; i++) {
            if (typeof effTrait[i] != 'number') {
                throwError044(weapon);
            }
        }
    }

};