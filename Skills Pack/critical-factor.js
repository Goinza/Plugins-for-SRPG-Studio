/**
 * Critical Factor
 * By Goinza
 */
(function() {
    var alias1 = DamageCalculator.calculateDamage;
    DamageCalculator.calculateDamage = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
        var skill = SkillControl.getPossessionCustomSkill(active, "CritFactor");
        if (skill!=null) {
            if (typeof skill.custom.critFactor != 'number') {
                throwError012(skill);
            }
            root.getMetaSession().global.critFactor = skill.custom.critFactor;
        }
        var damage = alias1.call(this, active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue);
        root.getMetaSession().global.critFactor = null;
    
        return damage;
    }

    var alias2 = DamageCalculator.getCriticalFactor;
    DamageCalculator.getCriticalFactor = function() {
        if (root.getMetaSession().global.critFactor!=null) {
            return root.getMetaSession().global.critFactor;
        }
        else {
            return alias2.call(this);
        }    
    }

}) ()
