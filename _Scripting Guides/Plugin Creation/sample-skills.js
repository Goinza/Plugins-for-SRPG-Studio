//Plugin by Goinza
//Sample code used as reference on Chapter 2: Custom Skills

(function() {

    //If the unit has the "AlwaysDouble" skill, it will have 2 rounds of combats.
    //active: the attacking unit
    //passive: the defending unit
    //weapon: the equipped weapon of the active unit
    var alias1 = Calculator.calculateRoundCount;
    Calculator.calculateRoundCount = function(active, passive, weapon) {
        var rounds = alias1.call(this, active, passive, weapon);

        var skill = SkillControl.getPossessionCustomSkill(active, "AlwaysDouble");

        if (skill!=null) {
            //Unit has the skill
            rounds = 2;
        }

        return rounds;
    }

    //Gets more attacks if the unit has the skill "MoreAttacks"
    //active: the attacking unit
    //passive: the defending unit
    //weapon: the equipped weapon of the active unit
    var alias2 = Calculator.calculateAttackCount;
    Calculator.calculateAttackCount = function(active, passive, weapon) {
        var count = alias2.call(this, active, passive, weapon);

        var skillArr = SkillControl.getDirectSkillArray(active, SkillType.CUSTOM, "MoreAttacks");
        var extra = 0;
        var skill;
        for (var i=0; i<skillArr; i++) {
            skill = skillArr[i].skill;
            if (skill.custom.attack != null) {
                extra += skill.custom.attack;
            }
        }

        return count + extra;
    }

    //Check if a custom skill has been triggered
    //active: the attacking unit
    //passive: the defending unit
    //skill: the skill that can be triggered
    //keyword: the keyword of the skill
    var alias3 = SkillRandomizer.isCustomSkillInvokedInternal;
    SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
        if (keyword === 'ExtraDamage') {
            //Check if activation rate is satisfied.
            return this._isSkillInvokedInternal(active, passive, skill);
        }

        //Default function is called if the skill didn't have the keyword
        return alias3.call(this, active, passive, skill, keyword);
    }

    //If the active unit has the "ExtraDamage" skill, deal 5 more damage
    //Note that in this function we are using "virtual" units. 
    //Those are objects that containt information about the units.
    //One of their properties is "unitSelf", which refers to the actual unit object.
    //virtualActive: an object containing information on the active unit
    //virtualPassive: an object containing information on the passive unit
    //attackEntry: the entry object of this attack
    var alias4 = AttackEvaluator.HitCritical.calculateDamage;
    AttackEvaluator.HitCritical.calculateDamage = function(virtualActive, virtualPassive, attackEntry) {
        var damage = alias4.call(this, virtualActive, virtualPassive, attackEntry);
        var skill = SkillControl.checkAndPushCustomSkill(virtualActive.unitSelf, virtualPassive.unitSelf, entry, true, 'ExtraDamage');
        //If skill is triggered, increase damage by 5
        if (skill != null) {
            damage += 5;
        }

        return damage;
    }
    
})()