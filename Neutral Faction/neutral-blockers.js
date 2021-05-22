//Plugin by Goinza

(function() {

    SimulationBlockerControl.getDefaultFilter = function(unit) {
        var unitType = NeutralControl.getUnitType(unit);
		return FilterControl.getReverseFilter(unitType);
	}

    SimulationBlockerControl._getScanFilter = function(unit) {
		// return UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY | UnitFilterFlag.NEUTRAL;
		
		// The following code can be used if there is no intention of treating friends (player and ally units for player) as walls.
		// In this instance, only the opposing force would be scanned, so the _scanUnitList loop would get shorter.
		// Evaluating whether the unit is a friend in isTargetBlocker would also be unnecessary.
		return this.getDefaultFilter(unit);
	}        
    
    var alias1 = SimulationBlockerControl._configureBlockerRule;
    SimulationBlockerControl._configureBlockerRule = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.appendObject(BlockerRule.Neutral);
    }

    BlockerRule.Neutral = defineObject(BaseBlockerRule, {

        isRuleApplicable: function(unit) {
            return true;
        },

        isTargetBlocker: function(unit, targetUnit) {
            var unitType = NeutralControl.getUnitType(unit);
            var filterFlag = FilterControl.getReverseFilter(unitType);
            var targetUnitFilter = NeutralControl.getUnitFilter(targetUnit);
            var isBlocker = filterFlag & targetUnitFilter;

            return isBlocker;
        }

    })
    

})()