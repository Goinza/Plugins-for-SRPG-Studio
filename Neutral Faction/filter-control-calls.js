//Plugin by Goinza

(function() {

    PositionIndexArray._isUnitTypeAllowed = function(piData, targetUnit) {
        var targetUnitType = NeutralControl.getUnitType(targetUnit);
        var filter = FilterControl.getNormalFilter(targetUnitType);
		
		return filter & piData.filter;
    }

    UnitAllCommandEventCommand._setPosUnitArray = function() {
		var i, index, x, y, targetUnit, targetUnitType, filter;
		var eventCommandData = root.getEventCommandObject();
		var pos = this._getFocusPos();
		var indexArray = IndexArray.getBestIndexArray(pos.x, pos.y, 0, eventCommandData.getRangeValue());
		var count = indexArray.length;
		var baseFilter = eventCommandData.getFilterFlag();
		var commandtype = eventCommandData.getSubEventCommandType();
		var session = root.getCurrentSession();
			
		for (i = 0; i < count; i++) {
			index = indexArray[i];
			x = CurrentMap.getX(index);
			y = CurrentMap.getY(index);
			if (commandtype === EventCommandType.UNITSTATECHANGE) {
				// Include the current non visible unit so as to enable the non visible state.
				targetUnit = session.getUnitFromPosEx(x, y);
			}
			else {
				targetUnit = session.getUnitFromPos(x, y);
			}
			if (targetUnit !== null && eventCommandData.isDataCondition(targetUnit)) {
                targetUnitType = NeutralControl.getUnitType(targetUnit);
				filter = FilterControl.getNormalFilter(targetUnitType);
				if (filter & baseFilter) {
					this._unitArray.push(targetUnit);
				}
			}
		}
	}

    BaseItemSelection.getUnitFilter = function() {
        var targetUnitType = NeutralControl.getUnitType(this._unit);

		return FilterControl.getBestFilter(targetUnitType, this._item.getFilterFlag());
	}

    BaseItemAvailability.isPosEnabled = function(unit, item, x, y) {
		var targetUnit, unitType, targetUnitType;
		
		targetUnit = PosChecker.getUnitFromPos(x, y);
		if (targetUnit !== null && targetUnit !== unit) {
            unitType = NeutralControl.getUnitType(unit);
            targetUnitType = NeutralControl.getUnitType(targetUnit);
			if (FilterControl.isBestUnitTypeAllowed(unitType, targetUnitType, item.getFilterFlag())) {
				return this._isCondition(unit, targetUnit, item) && this.isItemAllowed(unit, targetUnit, item);
			}
		}
		
		return false;
	}

    BaseItemAvailability._checkAll = function(unit, item) {
		var i, j, count, list, targetUnit;
        var unitType = NeutralControl.getUnitType(unit);
		var filter = FilterControl.getBestFilter(unitType, item.getFilterFlag());
		var listArray = FilterControl.getListArray(filter);
		var listCount = listArray.length;
		
		for (i = 0; i < listCount; i++) {
			list = listArray[i];
			count = list.getCount();
			for (j = 0; j < count; j++) {
				targetUnit = list.getData(j);
				if (unit !== targetUnit && this._isCondition(unit, targetUnit, item) && this.isItemAllowed(unit, targetUnit, item)) {
					return true;
				}
			}
		}
		
		return false;
	}

    BaseItemAI.getUnitFilter = function(unit, item) {
        var unitType = NeutralControl.getUnitType(unit);
		return FilterControl.getBestFilter(unitType, item.getFilterFlag());
	}

    EntireRecoveryControl.getTargetArray = function(unit, item) {
		var i, j, count, list, targetUnit;
        var unitType = NeutralControl.getUnitType(unit);
		var filter = FilterControl.getBestFilter(unitType, item.getFilterFlag());
		var listArray =  FilterControl.getListArray(filter);
		var listCount = listArray.length;
		var arr= [];
		var aggregation = item.getTargetAggregation();
		
		for (i = 0; i < listCount; i++) {
			list = listArray[i];
			count = list.getCount();
			for (j = 0; j < count; j++) {
				targetUnit = list.getData(j);
				if (!aggregation.isCondition(targetUnit)) {
					continue;
				}
				
				if (!this._isTargetAllowed(unit, targetUnit, item)) {
					continue;
				}
				
				arr.push(targetUnit);
			}
		}
		
		return arr;
	}

	ResurrectionControl.getTargetArray = function(unit, item) {
		var i, j, count, list, targetUnit;
		var unitType = NeutralControl.getUnitType(unit);
		var filter = FilterControl.getBestFilter(unitType, item.getFilterFlag());
		var listArray =  FilterControl.getDeathListArray(filter);
		var listCount = listArray.length;
		var arr= [];
		var aggregation = item.getTargetAggregation();
		
		for (i = 0; i < listCount; i++) {
			list = listArray[i];
			count = list.getCount();
			for (j = 0; j < count; j++) {
				targetUnit = list.getData(j);
				if (!aggregation.isCondition(targetUnit)) {
					continue;
				}
				
				if (!this._isTargetAllowed(unit, targetUnit, item)) {
					continue;
				}
				
				arr.push(targetUnit);
			}
		}
		
		return arr;
	}

	TeleportationItemAI.getUnitFilter = function(unit, item) {
		var unitType = NeutralControl.getUnitType(unit);
		if (item.getRangeType() === SelectionRangeType.SELFONLY) {
			// Search the opponent because self instantly moves towards the opponent.
			return FilterControl.getReverseFilter(unitType);
		}
		else {
			// Search the unit so as to make the unit instantly move.
			return FilterControl.getNormalFilter(unitType);
		}
	}

	TeleportationItemAI._isAllRangeEnabled = function(unit, targetUnit) {
		var i, list;
		var count = 0;
		var targetUnitType = NeutralControl.getUnitType(targetUnit);
		var filter = FilterControl.getReverseFilter(targetUnitType);
		var listArray = FilterControl.getListArray(filter);
		var listCount = listArray.length;
		
		for (i = 0; i < listCount; i++) {
			list = listArray[i];
			count += list.getCount();
		}
		
		return count > 0;
	}

    TeleportationControl._getAllRangeUnit = function(unit, targetUnit) {
		var i, j, count, list, focusUnit;
		var curUnit = null;
        var targetUnitType = NeutralControl.getUnitType(targetUnit);
		var filter = FilterControl.getReverseFilter(targetUnitType);
		var listArray = FilterControl.getListArray(filter);
		var listCount = listArray.length;
		
		for (i = 0; i < listCount; i++) {
			list = listArray[i];
			count = list.getCount();
			for (j = 0; j < count; j++) {
				focusUnit = list.getData(j);
				curUnit = this._checkUnit(curUnit, focusUnit);
			}
		}
		
		return curUnit;
	}

    CourceBuilder._getBlockUnitArray = function(unit, simulator, simulatorMap, goalIndex) {
		var i, j, k, x, y, x2, y2, index, list, movePoint, movePointMap, targetCount, targetUnit, mapIndex;
        var unitType = NeutralControl.getUnitType(unit);
		var filter = FilterControl.getReverseFilter(unitType);
		var listArray = FilterControl.getListArray(filter);
		var listCount = listArray.length;
		var blockUnitArray = [];
		
		for (i = 0; i < listCount; i++) {
			list = listArray[i];
			targetCount = list.getCount();
			for (j = 0; j < targetCount; j++) {
				targetUnit = list.getData(j);
				x = targetUnit.getMapX();
				y = targetUnit.getMapY();
				
				mapIndex = CurrentMap.getIndex(x, y);
				if (mapIndex === goalIndex) {
					blockUnitArray.push(targetUnit);
					continue;
				}
				
				for (k = 0; k < DirectionType.COUNT; k++) {
					x2 = x + XPoint[k];
					y2 = y + YPoint[k];
					index = CurrentMap.getIndex(x2, y2);
					if (index === -1) {
						continue;
					}
					movePoint = simulator.getSimulationMovePoint(index);
					movePointMap = simulatorMap.getSimulationMovePoint(index);
					// Check if the place where cannot move is now possible to move to.
					if (movePoint === AIValue.MAX_MOVE && movePointMap !== AIValue.MAX_MOVE) {
						if (PosChecker.getUnitFromPos(x2, y2) === null) {
							blockUnitArray.push(targetUnit);
							break;
						}
					}
				}
			}
		}
		
		return blockUnitArray;
	}

    BaseCombinationCollector._getTargetListArray = function(filter, misc) {
		var i, unit, arr, count, flag, list, unitType;
		
		if (misc.blockList === null) {
			return FilterControl.getListArray(filter);
		}
		
		arr = [];
		count = misc.blockList.getCount();
		for (i = 0; i < count; i++) {
			unit = misc.blockList.getData(i);
            unitType = NeutralControl.getUnitType(unit);
			flag = FilterControl.getNormalFilter(unitType);
			if (flag & filter) {
				arr.push(unit);
			}
		}
		
		list = StructureBuilder.buildDataList();
		list.setDataArray(arr);
		
		return [list];
	}

    CombinationCollector.Weapon._getWeaponFilter = function(unit) {
        var unitType = NeutralControl.getUnitType(unit);
		return FilterControl.getReverseFilter(unitType);
	}

    CombinationCollector.Skill._setStealCombination = function(misc) {
        var unitType = NeutralControl.getUnitType(misc.unit);
		var filter = FilterControl.getReverseFilter(unitType);
		
		this._setUnitCombination(misc, filter);
	}

    CombinationCollector.Skill._setQuickCombination = function(misc) {
        var unitType = NeutralControl.getUnitType(misc.unit);
		var filter = FilterControl.getNormalFilter(unitType);
		
		this._setUnitCombination(misc, filter);
	}

    UnitCommand.Steal._getUnitFilter = function() {
        var unit = this.getCommandTarget();
        var unitType = NeutralControl.getUnitType(unit);
		return FilterControl.getReverseFilter(unitType);
	}

    UnitCommand.Quick._getUnitFilter = function() {
        var unit = this.getCommandTarget();
        var unitType = NeutralControl.getUnitType(unit);
		return FilterControl.getNormalFilter(unitType);
	}

    UnitCommand.Attack._getUnitFilter = function() {
        var unit = this.getCommandTarget();
        var unitType = NeutralControl.getUnitType(unit);
		return FilterControl.getReverseFilter(unitType);
	}

    UnitCommand.Trade._getUnitFilter = function() {
        var unit = this.getCommandTarget();
        var unitType = NeutralControl.getUnitType(unit);
		return FilterControl.getNormalFilter(unitType);
	}	

    BaseFusionCommand._getUnitFilter = function() {
        var unit = this.getCommandTarget();
        var unitType = NeutralControl.getUnitType(unit);
		return FilterControl.getBestFilter(unitType, this._fusionData.getFilterFlag());
	}

    UnitCommand.FusionUnitTrade._getUnitFilter = function() {
		var i, x, y, targetUnit, targetChild;
        var unitType;
		var filterFlag = 0;
		var unit = this.getCommandTarget();
		var child = FusionControl.getFusionChild(unit);
		
		for (i = 0; i < DirectionType.COUNT; i++) {
			x = unit.getMapX() + XPoint[i];
			y = unit.getMapY() + YPoint[i];
			targetUnit = PosChecker.getUnitFromPos(x, y);
			if (targetUnit === null) {
				continue;
			}
			
			if (child !== null && this._isTradable(targetUnit, child)) {
				filterFlag |= FusionControl.getFusionData(unit).getFilterFlag();
			}
			else {
				targetChild = FusionControl.getFusionChild(targetUnit);
				if (targetChild !== null && this._isTradable(unit, targetChild)) {
					filterFlag |= FusionControl.getFusionData(targetUnit).getFilterFlag();
				}
			}
		}
        unitType = NeutralControl.getUnitType(unit);
		
		return FilterControl.getBestFilter(unitType, filterFlag);
	}

    OpeningEventFlowEntry._checkUnitParameter = function() {
		var i, j, list, unit, listCount, count;
		var listArray = FilterControl.getAliveListArray(UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY | UnitFilterFlag.NEUTRAL);
		
		listCount = listArray.length;
		for (i = 0; i < listCount; i++) {
			list = listArray[i];
			count = list.getCount();
			for (j = 0; j < count; j++) {
				unit = list.getData(j);
				this._resetUnit(unit);
			}
		}
		
		list = root.getCurrentSession().getGuestList();
		count = list.getCount();
		for (j = 0; j < count; j++) {
			unit = list.getData(j);
			this._resetUnit(unit);
		}
	}

    SupportCalculator._getListArray = function(unit) {
		var listArray;
		var filter = 0;
		var unitType = NeutralControl.getUnitType(unit);
		
		if (unitType === UnitType.PLAYER) {
			filter = UnitFilterFlag.PLAYER;
		}
		else if (unitType === UnitType.ENEMY) {
			filter = UnitFilterFlag.ENEMY;
		}
		else if (unitType == UnitType.ALLY) {
			filter = UnitFilterFlag.ALLY;
			// If a supportive skill including the ally as "Support" exists and if the player has the skill, use the following code.
			// filter = UnitFilterFlag.PLAYER | UnitFilterFlag.ALLY;
		}
        else if (unitType == UnitType.NEUTRAL) {
            filter = UnitFilterFlag.NEUTRAL;
        }
		
		listArray = FilterControl.getListArray(filter);
		this._appendGuestList(listArray, filter);
		
		return listArray;
	}

    MapHpControl.updateHpAll = function() {
		var i, j, count, list, targetUnit;
		var filter = UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY | UnitFilterFlag.NEUTRAL;
		var listArray = FilterControl.getListArray(filter);
		var listCount = listArray.length;
		
		for (i = 0; i < listCount; i++) {
			list = listArray[i];
			count = list.getCount();
			for (j = 0; j < count; j++) {
				targetUnit = list.getData(j);
				this.updateHp(targetUnit);
			}
		}
	}

    FusionControl.isCatchable = function(unit, targetUnit, fusionData) {
		if (this.getFusionChild(targetUnit) !== null) {
			return false;
		}
		
		if (!this.isFusionAllowed(unit, targetUnit, fusionData)) {
			return false;
		}
		
        var unitType = NeutralControl.getUnitType(unit);
        var targetUnitType = NeutralControl.getUnitType(targetUnit);

		return FilterControl.isBestUnitTypeAllowed(unitType, targetUnitType, fusionData.getFilterFlag());
	}   

	var alias1 = MapPosChooseEventCommand._createPositionIndexData;
	MapPosChooseEventCommand._createPositionIndexData = function() {
		var piData = alias1.call(this);
		if (piData.filter & UnitFilterFlag.ENEMY) {
			piData.filter |= UnitFilterFlag.NEUTRAL;
		}

		return piData;
	}

})()