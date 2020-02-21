//Plugin by Goinza

(function() {
    var alias1 = Calculator.calculateRoundCount;
    Calculator.calculateRoundCount = function(active, passive, weapon) {
        var activeSkill = SkillControl.getPossessionCustomSkill(active, "WaryFighter");
        var passiveSkill = SkillControl.getPossessionCustomSkill(passive, "WaryFighter");
        var round;
        if (activeSkill!=null || passiveSkill!=null) {
            round = 1;
        }
        else {
            round = alias1.call(this, active, passive, weapon);
        }
    
        return round;
    }
}) ()

