//Plugin by Goinza

var HPCostControl = {

    hasCost: function(item) {
        var lifeCost = 0;
        if (item !=null && item.custom.lifeCost!=null) {
            if (typeof item.custom.lifeCost != 'number') {
                throwError029(item);
            }
            lifeCost = item.custom.lifeCost;
        }

        return lifeCost;
    },

    //Returns a number that represent the max amount of times it can use the item with the unit's current HP
    //It assumes that the chech for the lifeCost parameter has been done
    getTimesPayCost: function(unit, item) {
        var lifeCost = item.custom.lifeCost;
        var maxUseCount = Math.floor(unit.getHp()/lifeCost); 

        return maxUseCount;
    },

    //It assumes that the chech for the lifeCost parameter has been done
    canPayCost: function(unit, item) {
        return this.getTimesPayCost(unit, item)>=1;
    },

    //Deals damage to the unit according to the amount of cost it takes from the item
    //It also assumes that the unit's current HP is greater than the damage done by the item
    payLife: function(unit, item) {
        if (this.hasCost(item)) {
            var currentHP = unit.getHp();
            var lifeCost = item.custom.lifeCost;
            unit.setHp(currentHp - lifeCost);
        }
    }

}