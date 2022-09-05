//Plugin by Goinza

var MagicAttackControl = {

    clear: function() {
        var list = PlayerList.getAliveDefaultList();
        for (var i=0; i<list.getCount(); i++) {
            unit = list.getData(i);
            unit.custom.equipped = null;
        }
    },
    
    serialize: function() {
        var groupArray = [];
        groupArray.push(PlayerList.getAliveDefaultList());
        groupArray.push(EnemyList.getAliveDefaultList());
        groupArray.push(AllyList.getAliveDefaultList());

        var list, unit;
        for (var h=0; h<groupArray.length; h++) {
            list = groupArray[h];
            for (var i=0; i<list.getCount(); i++) {
                unit = list.getData(i);           
                this._serializeUnit(unit);
            }
        }
    },

    deserialize: function() {
        var groupArray = [];
        groupArray.push(PlayerList.getAliveDefaultList());
        groupArray.push(EnemyList.getAliveDefaultList());
        groupArray.push(AllyList.getAliveDefaultList());
        var list, unit;
        for (var h=0; h<groupArray.length; h++) {
            list = groupArray[h];
            for (var i=0; i<list.getCount(); i++) {
                unit = list.getData(i);
                this._deserializeUnit(unit);
            }
        }
    },

    _serializeUnit: function(unit) {
        var spells;
        unit.custom.storedInfo = [];
        var object;

        spells = this.getAttackSpells(unit);
        for (var i=0; i<spells.length; i++) {
            object = {};
            object.id = spells[i].getId();
            object.uses = spells[i].getLimit();            
            object.isWeapon = true;
            unit.custom.storedInfo.push(object);
        }

        spells = this.getSupportSpells(unit);
        for (var i=0; i<spells.length; i++) {
            object = {};
            object.id = spells[i].getId();
            object.uses = spells[i].getLimit();
            object.isWeapon = false;
            unit.custom.storedInfo.push(object);
        }

    },

    _deserializeUnit: function(unit) {
        var storedInfo = unit.custom.storedInfo;        
        unit.custom.spellsAttack = [];
        unit.custom.spellsSupport = [];

        var dataList, item, index;
        for (var i=0; i<storedInfo.length; i++) {
            dataList = storedInfo[i].isWeapon ? dataList = root.getBaseData().getWeaponList() : dataList = root.getBaseData().getItemList();
            item = root.duplicateItem(dataList.getDataFromId(storedInfo[i].id));                       
            item.setLimit(storedInfo[i].uses);
            if (storedInfo[i].isWeapon) {
                index = unit.custom.spellsAttack.push(item);
            }
            else {
                unit.custom.spellsSupport.push(item);
            }
        }
    },

    setSpellsAllUnits: function() {
        var groupArray = [];

        if (DataConfig.isWeaponSelectSkippable()) {
            throwError052();
        }

        groupArray.push(PlayerList.getAliveDefaultList());
        groupArray.push(EnemyList.getAliveDefaultList());
        groupArray.push(AllyList.getAliveDefaultList());

        var list, unit;
        for (var h=0; h<groupArray.length; h++) {
            list = groupArray[h];
            for (var i=0; i<list.getCount(); i++) {
                unit = list.getData(i);
                this.setSpells(unit);
            }
        }
    },

    setSpellsPlayerUnits: function() {
        var list = PlayerList.getAliveDefaultList();
        for (var i=0; i<list.getCount(); i++) {
            unit = list.getData(i);
            this.setSpells(unit);
        }
    },

    getAttackSpells: function(unit) {
        if (typeof unit.custom.spellsAttack == "undefined") {
            throwError026();
        }
        return unit.custom.spellsAttack;
    },

    getSupportSpells: function(unit) {
        if (typeof unit.custom.spellsSupport == "undefined") {
            throwError026();
        }
        return unit.custom.spellsSupport;
    },

    setSpells: function(unit) {
        var item;        
        var magicData  = unit.custom.spells;
        
        unit.custom.spellsAttack = [];
        unit.custom.spellsSupport = [];

        if(magicData!=null) {
            this._validateParameter(unit);

            var dataList = root.getBaseData().getOriginalDataList(SpellsConfig.ORIGINAL_DATA_TAB);
            var originalData;

            for (var i=0; i<magicData.length; i++) {
                originalData = dataList.getDataFromId(magicData[i]);
                if (originalData.getOriginalContent().getCustomKeyword()!="Spell") {
                    throwError051(originalData);
                }
                item = originalData.getOriginalContent().getItem();
                this._addItem(unit, item);
            }
        } 
    },

    addSpell: function(unit, originalData) {
        if (typeof unit.custom.spellsAttack == 'undefined' || typeof unit.custom.spellsSupport == 'undefined') {
            throwError026();
        }
        if (originalData.getOriginalContent().getCustomKeyword()!="Spell") {
            throwError051(originalData);
        }
        if (!this.hasSpell(unit, originalData)) {
            item = originalData.getOriginalContent().getItem();
            this._addOriginalData(unit, originalData);
            this._addItem(unit, item);
        }      
    },

    getWeaponFromUnit: function(unit, weapon) {
        var unitWeapon = null;
        var spells = this.getAttackSpells(unit);
        var i = 0;
        var found = false;
        while (i<spells.length && !found) {
            if (spells[i].getId() == weapon.getId()) {
                found = true;
                unitWeapon = spells[i];
            }
            i++;
        }            
        
        return unitWeapon;
    },

    getWandFromUnit: function(unit, item) {
        var unitItem = null;
        var spells = this.getSupportSpells(unit);
        var i = 0;
        var found = false;
        while (i<spells.length && !found) {
            if (spells[i].getId() == item.getId()) {
                found = true;
                unitItem = spells[i];
            }
            i++;
        }        

        return unitItem;
    },

    checkSpells: function(unit) {        
        var dataList = root.getBaseData().getOriginalDataList(SpellsConfig.ORIGINAL_DATA_TAB);
        var originalData;

        for (var i=0; i<dataList.getCount(); i++) {
            originalData = dataList.getData(i);
            if (!this.hasSpell(unit, originalData) && this.canLearn(unit, originalData)) {
                this.addSpell(unit, originalData);
            }
        }
    },

    hasSpell: function(unit, originalData) {
        var magicData  = unit.custom.spells;
        var found = false;

        if(magicData!=null) {
            var i = 0;
            while (i<magicData.length && !found) {
                found = magicData[i] == originalData.getId();
                i++;
            }
        } 

        return found;
    },

    canLearn: function(unit, originalData) {
        var originalContent = originalData.getOriginalContent();
        var levelReq = originalContent.getValue(0);
        var canLearn = false;

        if (unit.getLv() >= levelReq) {
            var multipleData = originalData.getOriginalContent().getTargetAggregation();
            var count = multipleData.getObjectCount();
            var i = 0;
            var objectType;
            var objectData;
            while (i<count && !canLearn) {
                objectType = multipleData.getObjectType(i);
                switch(objectType) {
                    case ObjectType.UNIT:
                        canLearn = unit.getId() == multipleData.getObjectData(i).getId();
                        break;
                    case ObjectType.CLASS:
                    canLearn = unit.getClass().getId() == multipleData.getObjectData(i).getId();
                        break;                    
                }
                i++;
            }
        }       

        return canLearn;
    },

    _validateParameter: function(unit) {
        if (unit.custom.spells != null) {
            if (typeof unit.custom.spells.length != 'number') {
                throwError050(unit);
            }
            for (var i=0; i<unit.custom.spells.length; i++) {
                if (typeof unit.custom.spells[i] != 'number') {
                    throwError050(unit);
                }
            }
        }
    },

    _addOriginalData: function(unit, originalData) {
        if (unit.custom.spells==null) {
            unit.custom.spells = [];
        }

        unit.custom.spells.push(originalData.getId());
    },

    _addItem: function(unit, item) {
        var copyItem = root.duplicateItem(item);
       
        if (item.isWeapon()) {
            unit.custom.spellsAttack.push(copyItem);
        }
        else {
            unit.custom.spellsSupport.push(copyItem);
        }
    }
}
