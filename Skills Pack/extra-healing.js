/**
 * Extra Healing
 * Extra healing does not show up in the UI if the item's scope is Self/Single.
 * The item will still work as intended.
 */
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