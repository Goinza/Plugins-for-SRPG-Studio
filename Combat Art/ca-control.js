CombatArtControl = {

    isUnitAttackable: function(unit, artSkill) {
		var i, item, indexArray, durability, correctType, correctWeapon;
        var count = UnitItemControl.getPossessionItemCount(unit);
        var artType = artSkill.custom.weaponType;
        var artWeapon = artSkill.custom.weaponName;   
        var cost = artSkill.custom.cost!=null ? artSkill.custom.cost : 0;   
        var startRange = artSkill.custom.startRange;
        var endRange = artSkill.custom.endRange;
        		
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			if (item !== null && ItemControl.isWeaponAvailable(unit, item)) {
                correctType = artType!=null ? artType==item.getWeaponType().getName() : true;
                correctWeapon = artWeapon!=null ? artWeapon==item.getName() : true;
                durability = cost <= item.getLimit() || item.getLimitMax() === 0;

                if (correctType && correctWeapon && durability) {
                    indexArray = this.getAttackIndexArray(unit, startRange, endRange, true);
                    if (indexArray.length !== 0) {
                        return true;
                    }
                }
				
			}
		}
		
		return false;
    },
    
    getAttackIndexArray: function(unit, startRange, endRange, isSingleCheck) {
        var indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), startRange, endRange);
        var index, x, y, targetUnit;
        var indexArrayNew = [];

        for (var i=0; i<indexArray.length; i++) {
            index = indexArray[i];
			x = CurrentMap.getX(index);
			y = CurrentMap.getY(index);
			targetUnit = PosChecker.getUnitFromPos(x, y);
			if (targetUnit !== null && unit !== targetUnit) {
				if (FilterControl.isReverseUnitTypeAllowed(unit, targetUnit)) {
					indexArrayNew.push(index);
					if (isSingleCheck) {
						return indexArrayNew;
					}
				}
			}
        }

        return indexArrayNew;
    },

    getSupportSkill: function(skill) {
        var artSkill = skill.custom.artSkill;
        var i = 0;
        var supportSkill = null;
        var skill;
        while (i<artSkill.length && supportSkill==null) {
            skill = root.getBaseData().getSkillList().getDataFromId(artSkill[i]);
            if (skill.getSkillType() == SkillType.SUPPORT) {
                supportSkill = skill;
            }
            i++;
        }
        return supportSkill;
    },

    //Check that all parameters work correctly
    validateSkill: function(skill) {
        //{artSkill: [4], weaponType: "Sword", cost:5, startRange: 1, endRange: 1}
        //{artSkill: [4], weaponName: "Steel Axe"}
        var artSkill = skill.custom.artSkill;
        var weaponType = skill.custom.weaponType;
        var weaponName = skill.custom.weaponName;
        var cost = skill.custom.cost;
        var startRange = skill.custom.startRange;
        var endRange = skill.custom.endRange;

        if (artSkill==null || typeof artSkill.length != 'number') {
            throwError035(skill);
        }
        else {
            for (var i=0; i<artSkill.length; i++) {
                if (typeof artSkill[i] != 'number') {
                    throwError035(skill);
                }
            }
        }

        if (cost==null || typeof cost != 'number') {
            throwError036(skill);
        }

        if (startRange==null || endRange==null || typeof startRange != 'number' || typeof endRange != 'number') {
            throwError037(skill);
        }

        //Throw error 38 for any problems regarding custom parameters 'weaponType' and 'weaponName'
        if (weaponType!=null) {
            if (weaponName!=null || typeof weaponType != "string") {
                throwError038(skill);
            }
        }
        if (weaponName!=null) {
            if (weaponType!=null || typeof weaponName != 'string') {
                throwError038(skill);
            }
        }
    }
}