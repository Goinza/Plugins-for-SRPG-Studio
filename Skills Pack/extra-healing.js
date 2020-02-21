//Plugin by Goinza

(function() {
    var alias1 = Calculator.calculateRecoveryItemPlus;
    Calculator.calculateRecoveryItemPlus = function(unit, targetUnit, item) {
        var healing = alias1.call(this, unit, targetUnit, item);
        var plus = 0;
        var skill = SkillControl.getPossessionCustomSkill(unit, "ExtraHeal");
        var wandOnly;
        if (skill!=null) {
            wandOnly = skill.custom.wand!=null ? skill.custom.wand : false;
            if (typeof wandOnly != 'boolean') {
                throwError013(skill);
            }
            //If wandOnly is true, then the extra healing only applies to staves
            if (!wandOnly || (wandOnly && item.isWand())) { 
                plus = skill.custom.heal;
                if (typeof plus != 'number') {
                    throwError014(skill);
                }
            }
        }
    
        return healing + plus;
    }

}) ()