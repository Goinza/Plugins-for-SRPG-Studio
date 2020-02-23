//Plugin by Goinza

(function() {
    CompatibleCalculator._getCompatible = function(active, passive, weapon) {
        var compatible;
        var passiveWeapon = ItemControl.getEquippedWeapon(passive);

        if (weapon==null || passiveWeapon==null) {
            return null;
        }

        var dx = Math.abs(active.getMapX() - passive.getMapX());
        var dy = Math.abs(active.getMapY() - passive.getMapY());
        var range = dx + dy;

        var activeWeaponType = HybridControl.isHybrid(weapon) ? HybridControl.getWeaponType(weapon, range) : weapon.getWeaponType();
        var passiveWeaponType = HybridControl.isHybrid(passiveWeapon) ? HybridControl.getWeaponType(passiveWeapon, range) : passiveWeapon.getWeaponType();

        var count = activeWeaponType.getCompatibleCount();
		for (i = 0; i < count; i++) {
			compatible = activeWeaponType.getCompatibleData(i);
			if (compatible.getSrcObject() === passiveWeaponType) {
				return compatible.getSupportStatus();
			}
        }
        
        return null;
    }

    var alias1 = DamageCalculator.calculateAttackPower;
    DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
        var dx = Math.abs(active.getMapX() - passive.getMapX());
        var dy = Math.abs(active.getMapY() - passive.getMapY());
        var range = dx + dy;

        if (HybridControl.isHybrid(weapon)) {
            weapon.custom.physical = HybridControl.getWeaponCategory(weapon, range);            
        }

        var pow = alias1.call(this, active, passive, weapon, isCritical, totalStatus, trueHitValue);

        if (weapon!=null) {
            weapon.custom.physical = null;
        }

        return pow;
    }

    var alias2 = DamageCalculator.calculateDefense;
    DamageCalculator.calculateDefense = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
        var dx = Math.abs(active.getMapX() - passive.getMapX());
        var dy = Math.abs(active.getMapY() - passive.getMapY());
        var range = dx + dy;

        if (HybridControl.isHybrid(weapon)) {
            weapon.custom.physical = HybridControl.getWeaponCategory(weapon, range);
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

})()
