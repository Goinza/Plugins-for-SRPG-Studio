//Plugin by Goinza

var CombatArtAttack = {

    _attacking: false,
    _unit: null,
    _combatArt: null,

    startCombatArtAttack: function(unit, combatArt) {
        this._attacking = true;
        this._unit = unit,
        this._combatArt = combatArt;
        CombatArtSkills.addCombatArtSkills(unit, combatArt);
    },

    endCombatArtAttack: function() {
        CombatArtSkills.removeCombatArtSkills(this._unit, this._combatArt);
        this._attacking = false;
        this._unit = null;
        this._combatArt = null;
    },

    isCombatArtAttack: function() {
        return this._attacking;
    },

    getCombatArt: function() {
       return this._combatArt; 
    },

    getAttackingUnit: function() {
        return this._unit;
    }

}