/**
 * Plugin made by Goinza
 * 
 * Custom damage formula
 */

(function () {

	var alias1 = AbilityCalculator.getPower;
    AbilityCalculator.getPower= function(unit, weapon) {
		var pow = weapon.getPow(); //Weapon's might

		if (weapon.custom.alternative==true) {
			if (weapon.custom.life!=null) {
				if (typeof weapon.custom.life != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.life/100 * unit.getHp());
			}
			if (weapon.custom.hp!=null) {
				if (typeof weapon.custom.hp != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.hp/100 * RealBonus.getMhp(unit));
			}
			if (weapon.custom.str!=null) {
				if (typeof weapon.custom.str != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.str/100 * RealBonus.getStr(unit));
			}
			if (weapon.custom.mag!=null) {
				if (typeof weapon.custom.mag != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.mag/100 * RealBonus.getMag(unit));
			}
			if (weapon.custom.ski!=null) {
				if (typeof weapon.custom.ski != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.ski/100 * RealBonus.getSki(unit));
			}
			if (weapon.custom.spd!=null) {
				if (typeof weapon.custom.spd != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.spd/100 * RealBonus.getSpd(unit));
			}
			if (weapon.custom.lck!=null) {
				if (typeof weapon.custom.lck != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.lck/100 * RealBonus.getLuk(unit));
			}
			if (weapon.custom.def!=null) {
				if (typeof weapon.custom.def != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.def/100 * RealBonus.getDef(unit));
			}
			if (weapon.custom.res!=null) {
				if (typeof weapon.custom.res != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.res/100 * RealBonus.getMdf(unit));
			}
			if (weapon.custom.mov!=null) {
				if (typeof weapon.custom.mov != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.mov/100 * RealBonus.getMov(unit));			
			}
			if (weapon.custom.wlv!=null) {
				if (typeof weapon.custom.wlv != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.wlv/100 * RealBonus.getWlv(unit));
			}
			if (weapon.custom.bld!=null) {
				if (typeof weapon.custom.bld != 'number') {
					throwError023(weapon);
				}
				pow += Math.floor(weapon.custom.bld/100 * RealBonus.getBld(unit));
			}
		}
		else {
			pow = alias1.call(this, unit, weapon);
		}
		
		return pow;
	}

})();