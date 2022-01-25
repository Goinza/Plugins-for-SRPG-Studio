//Plugin by Goinza

//Object that controls the individual enemy range
var EnemyRange = {

    _rangeIndexArray: null, //Array of arrays of index

    //Marks an unmakred unit or unmarks a marked unit
    markUnit: function(unit) {
        if (unit.custom.mark!=null) {
            unit.custom.mark = !unit.custom.mark;
        }
        else {
            unit.custom.mark = true;
        }
        this.updateRange();
    },

    //Updates the enemy range (_rangeIndexArray)
    updateRange: function() {
        this._rangeIndexArray = [];
        this._markedIndexArray = Array(CurrentMap.getSize());
        var simulator = root.getCurrentSession().createMapSimulator();
        var enemyList = EnemyList.getAliveList();
        var unit, marked, attackRange, isWeapon

        for (var i=0; i<enemyList.getCount(); i++) {
            unit = enemyList.getData(i);
            marked = unit.custom.mark!=null ? unit.custom.mark : false;
            if (marked && !unit.isInvisible()) {
                attackRange = UnitRangePanel.getUnitAttackRange(unit);
                isWeapon = attackRange.endRange !== 0;		
                if (isWeapon) {
                    simulator.startSimulationWeapon(unit, attackRange.mov, attackRange.startRange, attackRange.endRange);
                    this._addToArray(simulator.getSimulationIndexArray());
                    this._addToArray(simulator.getSimulationWeaponIndexArray());
                }            
            }
        }
    },

    //Draws the enemy range (_rangeIndexArray)
    drawRange: function() {
        if (this._rangeIndexArray!=null) {
            root.drawFadeLight(this._rangeIndexArray, this._getColor(), this._getAlpha());            
        }        
    },

    //Add the indexArray elements to the _rangeIndexArrayw
    _addToArray: function(indexArray) {
        for (var i=0; i<indexArray.length; i++) {
            if (!this._markedIndexArray[indexArray[i]]) {
                this._markedIndexArray[indexArray[i]] = true;
                this._rangeIndexArray.push(indexArray[i]);
            }
        }
    },

    //Checks if the index is in the _rangeIndexArray
    _isInArray: function(index) {
        var i = 0;
        var found = false;
        while (i<this._rangeIndexArray.length && !found) {
            found = this._rangeIndexArray[i]==index;
            i++;
        }

        return found;
    },

    _getColor: function() {
        return INDIVIDUAL_RANGE.color;
    },

    _getAlpha: function() {
        return INDIVIDUAL_RANGE.alpha;
    }

}