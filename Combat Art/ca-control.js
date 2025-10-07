//Plugin by Goinza

var CombatArtType = {
    ATTACK: "AttackCombatArt",
    ACTION: "ActionCombatArt"
}

var CombatArtControl = {

    getAttackCombatArtsArray: function(unit) {
        return this._getCombatArtsArray(unit, CombatArtType.ATTACK);
    },

    getActionCombatArtsArray: function(unit) {
        return this._getCombatArtsArray(unit, CombatArtType.ACTION);
    },

    isAttackCombatArt: function(combatArt) {
        return combatArt.getOriginalContent().getCustomKeyword() == CombatArtType.ATTACK;
    },

    isActionCombatArt: function(combatArt) {
        return combatArt.getOriginalContent().getCustomKeyword() == CombatArtType.ACTION;
    },

    getValidCombatArtsArray: function(unit) {
        var validCombatArts = [];
        var attackCombatArts = this.getAttackCombatArtsArray(unit);
        var actionCombatArt = this.getActionCombatArtsArray(unit);
        for (var i=0; i<attackCombatArts.length; i++) {
            if (this._canUseCombatArt(unit, attackCombatArts[i])) {
                validCombatArts.push(attackCombatArts[i]);
            }
        }
        for (var i=0; i<actionCombatArt.length; i++) {
            if (this._canUseCombatArt(unit, actionCombatArt[i])) {
                validCombatArts.push(actionCombatArt[i]);
            }
        }

        return validCombatArts;
    },

    _canUseCombatArt: function(unit, combatArt) {
        var payCost = CombatArtCost.canPayCost(unit, combatArt);
        var weaponTypeReq = this._meetsWeaponTypeRequirements(unit, combatArt);
        var hasTarget = this._hasTarget(unit, combatArt);
        
        return payCost && weaponTypeReq && hasTarget;
    }, 

    _meetsWeaponTypeRequirements: function(unit, combatArt) {
        var validWeapons;
        var meetsReq = true;
        if (this.isAttackCombatArt(combatArt)) {
            validWeapons = CombatArtValidator.getValidWeaponsArray(unit, combatArt);
            meetsReq = validWeapons.length > 0;
        }

        if (typeof CurseControl !== 'undefined' && meetsReq && CurseControl.hasCursedWeaponEquipped(unit)) {
            var i = 0
            meetsReq = false
            while (!meetsReq && i<validWeapons.length) {
                meetsReq = CurseControl.isCursedAndEquipped(unit, validWeapons[i])
                i++
            }
        }

        return meetsReq;
    },

    _hasTarget: function(unit, combatArt) {
        var hasTarget = false;

        if (this.isActionCombatArt(combatArt)) {
            var item = combatArt.getOriginalContent().getItem();
            var availabilityObject = ItemPackageControl.getItemAvailabilityObject(item);
            hasTarget = availabilityObject.isItemAvailableCondition(unit, item);
        }
        else if (this.isAttackCombatArt(combatArt)) {
            hasTarget = this._canAttack(unit, combatArt);
        }

        return hasTarget;
    },

    _canAttack: function(unit, combatArt) {
        var validWeapons = CombatArtValidator.getValidWeaponsArray(unit, combatArt);
        var i = 0;
        var canAttack = false;
        var weapon, indexArray;
        while (i<validWeapons.length && !canAttack) {
            weapon = validWeapons[i];
            indexArray = CombatArtRange.getCombatArtAttackIndexArray(unit, weapon, combatArt);
            canAttack = indexArray.length > 0;
            i++;
        }
        return canAttack;
    },

    _getCombatArtsArray: function(unit, keyword) {
        this._validateUnit(unit);
        var unitParameterArts = unit.custom.combatArt;
        var classParameterArts = unit.getClass().custom.combatArt;
        var combatArts = [];
        this._addFromParameterToArray(unitParameterArts, combatArts, keyword);
        this._addFromParameterToArray(classParameterArts, combatArts, keyword);
        
        return combatArts;
    },

    _addFromParameterToArray: function(parameterArray, combatArtsArray, keyword) {
        if (parameterArray != null) {
            var originalDataList = root.getBaseData().getOriginalDataList(CombatArtSettings.TAB_COMBATART);
            var originalData;
            for (var i=0; i<parameterArray.length; i++) {
                originalData = originalDataList.getDataFromId(parameterArray[i]);
                if (originalData.getOriginalContent().getCustomKeyword() == keyword) {
                    combatArtsArray.push(originalData);
                }
            }
        }
    },

    _validateUnit: function(unit) {
        var parameterArts = unit.custom.combatArt;
        if (parameterArts!=null) {
            if (typeof parameterArts.length != 'number') {
                throwError040(unit);
            }
            for (var i=0; i<parameterArts.length; i++) {
                if (typeof parameterArts[i] != 'number') {
                    throwError040(unit);
                }
            }
        }
    }

}