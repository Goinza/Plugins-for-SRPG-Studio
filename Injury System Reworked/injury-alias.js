//Plugin by Goinza

(function() {

    //Don't allows injured units to be selected
    SortieSetting._setInitialUnitPos = function() {
        	var i, unit;
		var list = PlayerList.getAliveList();
		var count = list.getCount();
		var maxCount = this._sortiePosArray.length;
		var sortieCount = 0;
		
		// If the save is executed even once on the battle setup scene on the current map, func returns false. 
		if (!root.getMetaSession().isFirstSetup()) {
			// Initialize the unit of _sortiePosArray as a reference of the current unit position.
			this._arrangeUnitPos();
			return;
		}
		
		// If the battle setup scene is displayed for the first time, the subsequent process sets the sortie state automatically.
		
		this._clearSortieList();
		
		// The unit of force sortie (the specified position) is set to be a sortie state in order.
		for (i = 0; i < count && sortieCount < maxCount; i++) {
			unit = list.getData(i);
			if (this.isForceSortie(unit)) {
				if (this._sortieFixedUnit(unit)) {
					InjuryControl.removeInjury(unit) //Remove injury from forced units
					sortieCount++;
				}
			}
		}
		
		// The unit of force sortie (the unspecified position) is set to be a sortie state in order.
		for (i = 0; i < count && sortieCount < maxCount; i++) {
			unit = list.getData(i);
			if (this.isForceSortie(unit) && unit.getSortieState() !== SortieType.SORTIE) {
				if (this._sortieForceUnit(unit)) {
					InjuryControl.removeInjury(unit) //Remove injury from forced units
					sortieCount++;
				}
			}
		}
		
		// The other units are set to be sortie states in order.
		for (i = 0; i < count && sortieCount < maxCount; i++) {
			unit = list.getData(i);
			if (InjuryControl.isInjured(unit)) {
				continue //Don't allows injured units to be fielded
			}
			if (unit.getSortieState() !== SortieType.SORTIE) {
				if (this._sortieUnit(unit)) {
					sortieCount++;
				}
			}
		}
    }

    var alias01 = SortieSetting.setSortieMark
    SortieSetting.setSortieMark = function(index) {
        var list = PlayerList.getAliveList();
		var unit = list.getData(index);

        if (InjuryControl.isInjured(unit)) {
            return false
        }

        return alias01.call(this, index)
    }

	//Trigger injury when unit is killed
	var alias02 = DamageControl.setDeathState
	DamageControl.setDeathState = function(unit) {
		alias02.call(this, unit)
		if (unit.getAliveState() == AliveType.INJURY) {
			InjuryControl.setInjury(unit)
		}
	}

	var alias03 = AllEventFlowEntry._unitStateChange
	AllEventFlowEntry._unitStateChange = function(generator, targetUnit, command) {
		InjuryControl.setInjury(targetUnit)
		//root.log(targetUnit.getName())
		alias03.call(this, generator, targetUnit, command)
	}

})()