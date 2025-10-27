//Plugin by Goinza

var LastHitControl = {

    canCrit: function(weapon) {
        return weapon.custom.lastHitCrit
    },

    canIgnoreCritRules: function() {
        return IGNORE_SKILL_REQUIREMENT
    },

    isLastHit: function(weapon, attackCount) {
        return weapon.getLimit() <= attackCount
    }

}