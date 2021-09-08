//Plugin by Goinza

(function() {

    SkillChecker.arrangeSkill = function(unit, skill, increaseType) {
		var list = unit.getSkillReferenceList();
		var count = list.getTypeCount() - list.getHiddenCount()
		var editor = root.getDataEditor();
		
		if (increaseType === IncreaseType.INCREASE) {
            // Check if it doesn't exceed "Max Skill" of the config.            
			if (count < DataConfig.getMaxSkillCount() || skill.isHidden()) {
				editor.addSkillData(list, skill);
			}
		}
		else if (increaseType === IncreaseType.DECREASE) {
			editor.deleteSkillData(list, skill);
		}
		else if (increaseType === IncreaseType.ALLRELEASE) {
			editor.deleteAllSkillData(list);
		}
    }

})()

var CombatArtSkills = {

    addCombatArtSkills: function(unit, combatArt) {
        this._changeCombatArtSkills(unit, combatArt, IncreaseType.INCREASE);
    },

    removeCombatArtSkills: function(unit, combatArt) {
        this._changeCombatArtSkills(unit, combatArt, IncreaseType.DECREASE);
    },

    _changeCombatArtSkills: function(unit, combatArt, increaseType) {
        var skills = this.getCombatArtSkillsArray(combatArt);
        var dynamicEvent = createObject(DynamicEvent);
        var generator = dynamicEvent.acquireEventGenerator();

        for (var i=0; i<skills.length; i++) {
            generator.skillChange(unit, skills[i], increaseType, true);
        }

        dynamicEvent.executeDynamicEvent();
    },

    getCombatArtSkillsArray: function(combatArt) {
        var multipleData = combatArt.getOriginalContent().getTargetAggregation();
        var count = multipleData.getObjectCount();
        var skills = [];
        for (var i=0; i<count; i++) {
            if (multipleData.getObjectType(i) == ObjectType.SKILL) {
                skills.push(multipleData.getObjectData(i));
            }
        }

        return skills;
    }

}