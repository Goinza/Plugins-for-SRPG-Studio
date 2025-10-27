//Plugin by Goinza

(function() {

    var alias01 = Miscellaneous.isCriticalAllowed
    Miscellaneous.isCriticalAllowed = function(active, passive) {
        var allowed = alias01.call(this, active, passive)

        return allowed || LastHitControl.canIgnoreCritRules()
    }

    var alias02 = VirtualAttackControl._calculateAttackAndRoundCount
    VirtualAttackControl._calculateAttackAndRoundCount = function(virtualAttackUnit, isAttack, targetUnit) {
        alias02.call(this, virtualAttackUnit, isAttack, targetUnit)
        virtualAttackUnit.totalAttackCount = virtualAttackUnit.attackCount * virtualAttackUnit.roundCount
        if (virtualAttackUnit.weapon != null) {
            virtualAttackUnit.currentAttackCount = Math.min(virtualAttackUnit.weapon.getLimit(), virtualAttackUnit.totalAttackCount)
        }
        else {
            virtualAttackUnit.currentAttackCount = virtualAttackUnit.totalAttackCount
        }	
        
        if (typeof CombatArtAttack !== 'undefined' && CombatArtAttack.isCombatArtAttack()) {
            var combatArt = CombatArtAttack.getCombatArt()
            if (combatArt.custom.costType == CostType.WEAPON) {
                virtualAttackUnit.totalAttackCount = combatArt.custom.cost
            }
        }
    }

    var alias03 = AttackEvaluator.HitCritical.isCritical
    AttackEvaluator.HitCritical.isCritical = function(virtualActive, virtualPassive, attackEntry) {
        var isCritical = alias03.call(this, virtualActive, virtualPassive, attackEntry)

        if (CriticalCalculator.isCritical(virtualActive.unitSelf, virtualPassive.unitSelf)) {
            virtualActive.currentAttackCount--
            var isLastAttack = virtualActive.currentAttackCount == 0
            var canWeaponCrit = LastHitControl.canCrit(virtualActive.weapon)
            var isLastHit = LastHitControl.isLastHit(virtualActive.weapon, virtualActive.totalAttackCount)
            if (canWeaponCrit && isLastAttack && isLastHit) {
                isCritical = true
            }
        }		

        return isCritical
    }

})()