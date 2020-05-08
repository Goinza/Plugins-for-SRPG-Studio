//Plugin by Goinza

var RangeControl = {

    getExtendedWeaponRange: function(unit, weapon) {
        var range = {};
        range.start = 0;
        range.end = 0;

        if (weapon!=null) {
            var skillArr = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "WeaponRange");
            var skill = null;
            var j = 0;
            var found = false;
            while (j<skillArr.length && !found) {
                skill = skillArr[j].skill;
                if (typeof skill.custom.type != 'string') {
                    throwError019(skill);
                }
                if (skill.custom.type==weapon.getWeaponType().getName()) {
                    skill = skill;
                    found = true;
                }
                j++;
            }
    
            if (found) {
                if (skill.custom.startRange!=null) {
                    if (typeof skill.custom.startRange != 'number') {
                        throwError020(skill);
                    }
                    range.start = skill.custom.startRange;
                }
                if (skill.custom.endRange!=null) {
                    if (typeof skill.custom.endRange != 'number') {
                        throwError021(skill);
                    }
                    range.end = skill.custom.endRange;
                }
            }
        }        

        return range;
    },

    getExtendedItemRange: function(unit, item) {
        var range = {};
        range.start = 0;
        range.end = 0;
        var skill;

        if (item.isWand()) {
            skill = SkillControl.getPossessionCustomSkill(unit, "StaffRange");
            if (skill!=null) {
                if (skill.custom.startRange!=null) {
                    if (typeof skill.custom.startRange != 'number') {
                        throwError20(skill);
                    }
                    range.start += skill.custom.startRange
                }
                if (skill.custom.endRange!=null) {
                    if (typeof skill.custom.endRange != 'number') {
                        throwError021(skill);
                    }
                    range.end += skill.custom.endRange;
                }
            }
        }
        else {
            skill = SkillControl.getPossessionCustomSkill(unit, "ItemRange");
            if (skill!=null) {
                if (skill.custom.startRange!=null) {
                    if (typeof skill.custom.startRange != 'number') {
                        throwError020(skill);
                    }
                    range.start += skill.custom.startRange;
                }
                if (skill.custom.endRange!=null) {
                    if (typeof skill.custom.endRange != 'number') {
                        throwError021(skill);
                    }
                    range.end += skill.custom.endRange;
                }
            }
        }

        return range;
    },

    getMagicRange: function(unit, item) {
        var range = item.getRangeValue();

        if (item.custom.magicRange!=null) {
            if (typeof item.custom.magicRange != 'number') {
                throwError022(item);
            }
            range = Math.floor(RealBonus.getMag(unit) / item.custom.magicRange);
        }

        return range;
    }

}