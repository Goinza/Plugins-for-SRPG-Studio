//Plugin by Goinza

var CostType = {
    WEAPON: 0,
    HP: 1,
    SP: 2
}

var CombatArtCost = {

    getCostObject: function(combatArt) {
        var obj = {};
        obj.cost = combatArt.custom.cost;
        var index;
        switch (combatArt.custom.costType) {
            case CostType.WEAPON:
                obj.costType = "Weapon uses";
                break;
            case CostType.HP:
                index = ParamGroup.getParameterIndexFromType(ParamType.MHP);
                obj.costType = ParamGroup.getParameterName(index);
                break;
            case CostType.SP:
                index = ParamGroup.getParameterIndexFromType(ParamType.STA);
                obj.costType = ParamGroup.getParameterName(index);
                break;
            default:
                obj.costType = "";
        }
        return obj;
    },

    payCost: function(unit, combatArt) {
        var costType = combatArt.custom.costType;
        var cost = combatArt.custom.cost;
        switch (costType) {
            case CostType.WEAPON:
                this._payWeaponCost(unit, cost);
                break;
            case CostType.HP:
                this._payLifeCost(unit, cost);
                break;
            case CostType.SP:
                this._payStaminaCost(unit, cost);
                break;
        }
    },

    _payWeaponCost: function(unit, cost) {
        var weapon = ItemControl.getEquippedWeapon(unit)
        var newLimit = weapon.getLimit() - cost
        if (newLimit > 0) {
            weapon.setLimit(newLimit)
        }
        else {            
            var name = weapon.getName()
            ItemControl.lostItem(unit, weapon)
            if (DataConfig.isWeaponLostDisplayable()) {
                //The timing is not right. The message happens after the battle background faded
                var dynamicEvent = createObject(DynamicEvent)
                var generator = dynamicEvent.acquireEventGenerator()
                generator.soundPlay(root.querySoundHandle('itemlost'), 1)
                generator.messageTitle(name + StringTable.ItemLost, 0, 0, true)  
                dynamicEvent.executeDynamicEvent()
            }
            
        }
    },

    _payLifeCost: function(unit, cost) {
        unit.setHp(unit.getHp() - cost);
    },

    _payStaminaCost: function(unit, cost) {
        var currentStamina = StaminaStat.getCurrentStamina(unit);
        StaminaStat.setCurrentStamina(unit, currentStamina - cost);
    },

    canPayCost: function(unit, combatArt) {
        var canPayCost = false;
        var costType = combatArt.custom.costType;
        var cost = combatArt.custom.cost;
        switch (costType) {
            case CostType.WEAPON:
                canPayCost = this._canPayWeaponCost(unit, combatArt, cost);
                break;
            case CostType.HP:
                canPayCost = this._canPayLifeCost(unit, cost);
                break;
            case CostType.SP:
                canPayCost = this._canPayStaminaCost(unit, cost);
                break;
        }
        return canPayCost;
    },

    _canPayWeaponCost: function(unit, combatArt, cost) {
        var validWeapons = CombatArtValidator.getValidWeaponsArray(unit, combatArt);
        var canPay = false;
        var i = 0;
        while (i<validWeapons.length && !canPay) {
            canPay = validWeapons[i].getLimit() >= cost;
            i++;
        }
        return canPay;
    },

    _canPayLifeCost: function(unit, cost) {
        var life = unit.getHp();
        return life > cost;
    },

    _canPayStaminaCost: function(unit, cost) {
        var stamina = StaminaStat.getCurrentStamina(unit);
        return stamina >= cost;
    },

    isWeaponAvailable: function(weapon, combatArt) {
        var costType = combatArt.custom.costType;
        var cost = combatArt.custom.cost;
        var isAvailable = costType === CostType.WEAPON ? weapon.getLimit() >= cost : true;

        return isAvailable;
    }

}