//Plugin by Goinza

var CombatArtEvent = {

    addCombatArt: function(combatArt, unit) {
        //this.validateUnit(unit);
        if (unit.custom.combatArt==null) {
            unit.custom.combatArt = [];
        }
        //this.validateCombatArt(combatArt);
        unit.custom.combatArt.push(combatArt.getId());
    },

    removeCombatArt: function(combatArt, unit) {
        //this.validateUnit(unit);
        var unitArts = unit.custom.combatArt;
        var found = false;
        var i = 0;
        while (i<unitArts.length && !found) {
            if (unitArts[i] == combatArt.getId()) {
                found = true;
                unit.custom.combatArt.splice(i, 1);
            }
            i++;
        }

        return found;
    }
}