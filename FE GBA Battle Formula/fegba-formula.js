//Plugin by Goinza

(function() {
    
	//Uses normal version if magic is enabled. Else, it only uses Str.
	var alias0 = AbilityCalculator.getPower;
    AbilityCalculator.getPower = function(unit, weapon) {
		if (MAGIC_ENABLED) {
			return alias0.call(this, unit, weapon);
		}

		return RealBonus.getStr(unit) + weapon.getPow();
    }
    
    //Hit rate: weapon + Skill*2 + Luck/2
    AbilityCalculator.getHit = function(unit, weapon) {
        // Hit rate formula.
		return weapon.getHit() + (RealBonus.getSki(unit) * 2) + (RealBonus.getLuk(unit) / 2);
    }
    
    //Avoid: Attack Speed * 2 + Luck
	AbilityCalculator.getAvoid = function(unit) {
		var avoid, terrain;
		var cls = unit.getClass();
		
		// Avoid is (Attack Speed * 2) + Luck
		avoid = (this.getAgility(unit, ItemControl.getEquippedWeapon(unit)) * 2) + RealBonus.getLuk(unit);
		
		// If class type gains terrain bonus, add the avoid rate of terrain.
		if (cls.getClassType().isTerrainBonusEnabled()) {
			terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
			if (terrain !== null) {
				avoid += terrain.getAvoid();
			}
		}
		
		return avoid;
    }
    
    //Crit rate: weapon + Skill/2
	AbilityCalculator.getCritical = function(unit, weapon) {
		return RealBonus.getSki(unit)/2 + weapon.getCritical();
    }
    
    //Change agility: use Build stat
    AbilityCalculator.getAgility = function(unit, weapon) {
		var agi, value, param;
		var spd = RealBonus.getSpd(unit);
		
		// Normally, agility is identical with spd.
		agi = spd;
		
		// If a weapon is not specified or the weight is not included, agility doesn't change.
		if (weapon === null || !DataConfig.isItemWeightDisplayable()) {
			return agi;
		}
		
		param = ParamBonus.getBld(unit);		
		
		value = weapon.getWeight() - param;
		if (value > 0) {
			// If a parameter is lower than the weight, lower the agility according to the difference.
			agi -= value;
		}
		
		return agi;
	}

    //Changes the effective damage, so it multiplies the weapon's might, instead of multiplying the attack power
	DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
		var pow = AbilityCalculator.getPower(active, weapon) + CompatibleCalculator.getPower(active, passive, weapon) + SupportCalculator.getPower(totalStatus);
		
		if (this.isEffective(active, passive, weapon, isCritical, trueHitValue)) {
			pow += weapon.getPow() * (this.getEffectiveFactor() - 1); //Example: If effective factor is 3, then you need to add weapon might * 2 to the total power
		}															  //because the total power already added the weapon might once
		
		return pow;
	}

    //If Mag is disabled, healing staves use Str instead
    var alias1 = Calculator.calculateRecoveryItemPlus;
	Calculator.calculateRecoveryItemPlus = function(unit, targetUnit, item) {
        if (MAGIC_ENABLED) {
            return alias1.call(this, unit, targetUnit, item);
        }

		var plus = 0;
		var itemType = item.getItemType();
		
		if (itemType !== ItemType.RECOVERY && itemType !== ItemType.ENTIRERECOVERY) {
			return 0;
		}
		
		// If the item is a wand, add the user's Mag.
		if (item.isWand()) {
			plus = ParamBonus.getStr(unit);
		}
		
		return plus;
    }
    
    //If Mag is disabled, damaging staves use Str instead
    var alias2 = Calculator.calculateDamageItemPlus;
    Calculator.calculateDamageItemPlus = function(unit, targetUnit, item) {
        if (MAGIC_ENABLED) {
            return alias2.call(this, unit, targetUnit, item);
        }

		var damageInfo, damageType;
		var plus = 0;
		var itemType = item.getItemType();
		
		if (itemType === ItemType.DAMAGE) {
			damageInfo = item.getDamageInfo();
		}
		else {
			return 0;
		}
		
		damageType = damageInfo.getDamageType();
		if (item.isWand()) {
			if (damageType === DamageType.MAGIC) {
				plus = ParamBonus.getStr(unit);
			}
		}
		
		return plus;
    }
    
    //Removes the Mag stat if it is disabled
    var alias3 = UnitParameter.MAG.isParameterDisplayable;
	UnitParameter.MAG.isParameterDisplayable = function(unitStatusType) {
		return MAGIC_ENABLED ? alias3.call(this, unitStatusType) : false;
    }
    
    //Changes the hit rate calculations if 2RN is enabled
    var alias4 = AttackEvaluator.HitCritical.calculateHit
    AttackEvaluator.HitCritical.calculateHit = function(virtualActive, virtualPassive, attackEntry) {
        if (!TWO_RN_ENABLED) {
            return alias4.call(this, virtualActive, virtualPassive, attackEntry);
        }

        var percent = HitCalculator.calculateHit(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, virtualActive.totalStatus, virtualPassive.totalStatus);            
        var n = Probability.getRandomNumber() % 100;
		var m = Probability.getRandomNumber() % 100;
		var trueHit = Math.floor((n+m)/2);
    
        return percent>trueHit;
    }

})()