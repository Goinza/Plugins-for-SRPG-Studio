//Plugin by Goinza

(function() {
    //hybtidAttack[i][2] is the type of attack. True is physic attack, false is magic attack
    var alias1 = DamageCalculator.calculateAttackPower;
    DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {      
        if (HybridControl.isHybrid(weapon)) {
            var deltaX = Math.abs(active.getMapX() - passive.getMapX());
            var deltaY = Math.abs(active.getMapY() - passive.getMapY());
            var range = deltaX + deltaY;
            weapon.custom.physical = HybridControl.isPhysical(weapon, range);
        }

        var pow = alias1.call(this, active, passive, weapon, isCritical, totalStatus, trueHitValue);

        if (weapon!=null) {
            weapon.custom.physical = null;
        }

        return pow;
    }

    var alias2 = DamageCalculator.calculateDefense;
    DamageCalculator.calculateDefense = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {    
        if (HybridControl.isHybrid(weapon)) {
            var deltaX = Math.abs(active.getMapX() - passive.getMapX());
            var deltaY = Math.abs(active.getMapY() - passive.getMapY());
            var range = deltaX + deltaY;
            weapon.custom.physical = HybridControl.isPhysical(weapon, range);
        }

        var def = alias2.call(this, active, passive, weapon, isCritical, totalStatus, trueHitValue);

        if (weapon!=null) {
            weapon.custom.physical = null;
        }

        return def;
    }

    var alias3 = Miscellaneous.isPhysicsBattle;
    Miscellaneous.isPhysicsBattle = function(weapon) {
        if (weapon.custom.physical!=null) {
            return weapon.custom.physical;
        }
        else {
            return alias3.call(this, weapon);
        }
    }

    CompatibleCalculator._getCompatible = function(active, passive, weapon) {
		var i, count, compatible, weaponTypeActive, weaponTypePassive;
		var weaponPassive = ItemControl.getEquippedWeapon(passive);
		
		if (weaponPassive === null || weapon === null) {
			return null;
		}
        
        var range = Math.abs(active.getMapX() - passive.getMapX()) + Math.abs(active.getMapY() - passive.getMapY());
		weaponTypeActive = HybridControl.isHybrid(weapon) ? HybridControl.getWeaponType(weapon, range) : weapon.getWeaponType();
		weaponTypePassive = HybridControl.isHybrid(weaponPassive) ? HybridControl.getWeaponType(weaponPassive, range) : weaponPassive.getWeaponType();
		
		count = weaponTypeActive.getCompatibleCount();
		for (i = 0; i < count; i++) {
			compatible = weaponTypeActive.getCompatibleData(i);
			if (compatible.getSrcObject() === weaponTypePassive) {
				return compatible.getSupportStatus();
			}
		}
		
        return null;
    }

})()