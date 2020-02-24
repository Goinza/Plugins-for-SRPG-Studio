//Plugin by Goinza

var SkillGranter = {

    //Check if the unit can learn any skill related to their class and level
    checkCustomSkills: function(unit) {
        var skills = unit.getClass().custom.skills;
    
        if (skills!=null) {
            if (typeof skills.length != 'number') {
                throwError030(unit.getClass());
            }

            var unitLevel = unit.getLv();
            var currentSkill, skillId, skillLevel;
            var listSkills = root.getBaseData().getSkillList();
    
            var dynamicEvent = createObject(DynamicEvent);
            var generator = dynamicEvent.acquireEventGenerator();
    
            for (var i=0; i<skills.length; i++) {
                if (typeof skills[i].id != 'number' || typeof skills[i].level != 'number') {
                    throwError030(unit.getClass());
                }

                skillId = skills[i].id;
                skillLevel = skills[i].level;
                if (unitLevel >= skillLevel) {
                    currentSkill = listSkills.getDataFromId(skillId);
                    if (!SkillChecker._isSkillLearned(unit, currentSkill)) {
                        generator.skillChange(unit, currentSkill, IncreaseType.INCREASE, false);
                        if (typeof MagicAttackControl != 'undefined') {                            
                            this.checkSpellSkill(unit, currentSkill);
                        }
                    }                
                }
    
            }
            dynamicEvent.executeDynamicEvent(); 
        }
    },

    //If unit learns a skill, check if that skill can grant a spell to the unit.ç
    //Used for compatiblity with the "Weapons and Items as Skills" plugin
    checkSpellSkill: function(unit, skill) {
        if (skill.getSkillType() == SkillType.CUSTOM) {
            var keyword = skill.getCustomKeyword();
            if (keyword == "SkillAttack" || keyword == "SkillSupport") {
                MagicAttackControl.addSpell(unit, skill);
            }
        }
    }
}