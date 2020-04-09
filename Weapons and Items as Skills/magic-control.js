//Plugin by Goinza

var MagicAttackControl = {

    clear: function() {
        var list = PlayerList.getAliveList();
        for (var i=0; i<list.getCount(); i++) {
            unit = list.getData(i);
            unit.custom.equipped = null;
        }
    },

    setSpellsAllUnits: function() {
        var groupArray = [];
        groupArray.push(PlayerList.getAliveList());
        groupArray.push(EnemyList.getAliveList());
        groupArray.push(AllyList.getAliveList());

        var list, unit, magicSkills, skill, item;
        for (var h=0; h<groupArray.length; h++) {
            list = groupArray[h];
            for (var i=0; i<list.getCount(); i++) {
                unit = list.getData(i);
                this.setSpells(unit);
            }
        }
    },

    setSpellsPlayerUnits: function() {
        var list = PlayerList.getAliveList();
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
        var magicSkills, skill, item;
        //Skill weapons
        magicSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillAttack");
        unit.custom.spellsAttack = [];
        for (var j=0; j<magicSkills.length; j++) {
            skill = magicSkills[j].skill;
            if (typeof skill.custom.weapon != 'number') {
                throwError027(skill);
            }
            item = root.duplicateItem(root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));
            unit.custom.spellsAttack.push(item);
        }
        //Equip the first skill if the unit doesn't have any normal weapon
        if (unit.custom.spellsAttack.length>0 && ItemControl.getEquippedWeapon(unit)==null) {
            unit.custom.equipped = unit.custom.spellsAttack[0];
        }
        //Skill items
        magicSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "SkillSupport");
        unit.custom.spellsSupport = [];
        for (var j=0; j<magicSkills.length; j++) {
            skill = magicSkills[j].skill;
            if (typeof skill.custom.item != 'number') {
                throwError027(skill);
            }
            item = root.duplicateItem(root.getBaseData().getItemList().getDataFromId(skill.custom.item));
            unit.custom.spellsSupport.push(item);
        }
    },

    addSpell: function(unit, skill) {
        if (typeof unit.custom.spellsAttack != 'undefined' || typeof unit.custom.spellsSupport != 'undefined') {
            throwError026();
        }
        var item;
        if (skill!=null && skill.getSkillType()==SkillType.CUSTOM) {            
            if (skill.getCustomKeyword() == "SkillAttack") {
                if (typeof skill.custom.weapon != 'number') {
                    throwError027(skill);
                }
                item = root.duplicateItem(root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));
                unit.custom.spellsAttack.push(item);
            }
            else if (skill.getCustomKeyword() == "SkillSupport") {
                if (typeof skill.custom.item != 'number') {
                    throwError027(skill);
                }
                item = root.duplicateItem(root.getBaseData().getItemList().getDataFromId(skill.custom.item));
                unit.custom.spellsSupport.push(item);
            }
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
    }
    
}
