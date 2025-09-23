//Plugin by Goinza

var CurseControl = {

    isCursed: function(weapon) {
        if (weapon == null || !weapon.isWeapon()) {
            return false
        }
        return weapon.custom.curse
    },

    //Is the weapon a curse weapon and the same weapon as the unit's equipped weapon?
    isCursedAndEquipped: function(unit, weapon) {
        var isCursed = this.isCursed(weapon)
        var equippedWeapon = ItemControl.getEquippedWeapon(unit)
        if (equippedWeapon == null) {
            return false
        }
        
        return isCursed && ItemControl.compareItem(weapon, equippedWeapon)
    },

    hasCursedWeaponEquipped: function(unit) {
        var weapon = ItemControl.getEquippedWeapon(unit)

        return this.isCursed(weapon)
    }

}