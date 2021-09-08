//Plugin by Goinza

var CombatArtWeaponSelectMenu = defineObject(WeaponSelectMenu, {

    _combatArt: null,

    setCombatArt: function(combatArt) {
        this._combatArt = combatArt;
    },

    _isWeaponAllowed: function(unit, item) {
		var indexArray = CombatArtRange.getCombatArtAttackIndexArray(unit, item, this._combatArt);
		var allowedWeapons = CombatArtValidator.getValidWeaponsArray(unit, this._combatArt);

        var hasTarget = indexArray.length !== 0
        var canUseWeapon = ItemControl.isWeaponAvailable(unit, item) && CombatArtCost.isWeaponAvailable(item, this._combatArt);
        var allowed = false;

        var i = 0;
        while (i<allowedWeapons.length && !allowed) {
            allowed = ItemControl.compareItem(item, allowedWeapons[i]);
            i++; 
        }

		return hasTarget && canUseWeapon && allowed;
	}

})