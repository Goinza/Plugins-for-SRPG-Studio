//Plugin by Goinza

IndexArray.createExtendedIndexArray = function(x, y, item, unit) {
    var i, rangeValue, rangeType, arr, extendedRange;
    var startRange = 1;
    var endRange = 1;
    var count = 1;
    
    if (item === null) {
        startRange = 1;
        endRange = 1;
    }
    else if (item.isWeapon()) {
        startRange = item.getStartRange();
        endRange = item.getEndRange();
        extendedRange = RangeControl.getExtendedWeaponRange(unit, item);
        startRange += extendedRange.start;
        endRange += extendedRange.end;
    }
    else {
        if (item.getItemType() === ItemType.TELEPORTATION && item.getRangeType() === SelectionRangeType.SELFONLY) {
            rangeValue = item.getTeleportationInfo().getRangeValue();
            rangeType = item.getTeleportationInfo().getRangeType();
        }
        else {
            rangeValue = item.getRangeValue();
            rangeType = item.getRangeType();
        }

        if (rangeType === SelectionRangeType.SELFONLY) {
            return [];
        }
        else if (rangeType === SelectionRangeType.MULTI) {
            endRange = RangeControl.getMagicRange(unit, item);            
            extendedRange = RangeControl.getExtendedItemRange(unit, item);
            startRange += extendedRange.start;
            endRange += extendedRange.end;      
        }
        else if (rangeType === SelectionRangeType.ALL) {
            count = CurrentMap.getSize();
                
            arr = [];
            arr.length = count;
            for (i = 0; i < count; i++) {
                arr[i] = i;
            }
                
            return arr;
        }
    }    

    //The range can never be less than 1
    if (startRange < 1) {
        startRange = 1;
    }
    if (endRange < 1) {
        endRange = 1;
    }
    
    return this.getBestIndexArray(x, y, startRange, endRange);
};

BaseItemSelection.setUnitSelection = function() {
    var filter = this.getUnitFilter();
    var indexArray = IndexArray.createExtendedIndexArray(this._unit.getMapX(), this._unit.getMapY(), this._item, this._unit);
    
    indexArray = this._getUnitOnlyIndexArray(this._unit, indexArray);
    this._posSelector.setUnitOnly(this._unit, this._item, indexArray, PosMenuType.Item, filter);
    
    this.setFirstPos();
};

// It's called if the item is used at the specific position.
BaseItemSelection.setPosSelection = function() {
    var indexArray = IndexArray.createExtendedIndexArray(this._unit.getMapX(), this._unit.getMapY(), this._item, this._unit);
    
    this._posSelector.setPosOnly(this._unit, this._item, indexArray, PosMenuType.Item);
    
    this.setFirstPos();
};

BaseItemAvailability._checkMulti = function(unit, item) {
    var i, index, x, y;
    var indexArray = IndexArray.createExtendedIndexArray(unit.getMapX(), unit.getMapY(), item, unit);
    var count = indexArray.length;
    
    for (i = 0; i < count; i++) {
        index = indexArray[i];
        x = CurrentMap.getX(index);
        y = CurrentMap.getY(index);
        if (this.isPosEnabled(unit, item, x, y)) {
            return true;
        }
    }
    
    return false;
};

AttackChecker.getAttackIndexArray = function(unit, weapon, isSingleCheck) {
    var i, index, x, y, targetUnit;
    var indexArrayNew = [];
    var indexArray = IndexArray.createExtendedIndexArray(unit.getMapX(), unit.getMapY(), weapon, unit);
    var count = indexArray.length;
    
    for (i = 0; i < count; i++) {
        index = indexArray[i];
        x = CurrentMap.getX(index);
        y = CurrentMap.getY(index);
        targetUnit = PosChecker.getUnitFromPos(x, y);
        if (targetUnit !== null && unit !== targetUnit) {
            if (FilterControl.isReverseUnitTypeAllowed(unit, targetUnit)) {
                indexArrayNew.push(index);
                if (isSingleCheck) {
                    return indexArrayNew;
                }
            }
        }
    }
    
    return indexArrayNew;
};

AttackChecker.getFusionAttackIndexArray = function(unit, weapon, fusionData) {
    var i, index, x, y, targetUnit;
    var indexArrayNew = [];
    var indexArray = IndexArray.createExtendedIndexArray(unit.getMapX(), unit.getMapY(), weapon, unit);
    var count = indexArray.length;
    
    for (i = 0; i < count; i++) {
        index = indexArray[i];
        x = CurrentMap.getX(index);
        y = CurrentMap.getY(index);
        targetUnit = PosChecker.getUnitFromPos(x, y);
        if (targetUnit !== null && unit !== targetUnit) {
            if (FusionControl.isAttackable(unit, targetUnit, fusionData) && FusionControl.isRangeAllowed(unit, targetUnit, fusionData)) {
                indexArrayNew.push(index);
            }
        }
    }
    
    return indexArrayNew;
};

AttackChecker.isCounterattack = function(unit, targetUnit) {
    if (SkillControl.getPossessionCustomSkill(targetUnit, "Counterattack")!=null) {
        return true;
    }

    var targetWeapon = ItemControl.getEquippedWeapon(targetUnit);
    if (targetWeapon!=null && targetWeapon.getWeaponType().getName()=="Bow" && SkillControl.getPossessionCustomSkill(targetUnit, "CloseCounter")!=null) {
        var deltaX = Math.abs(unit.getMapX() - targetUnit.getMapX());
        var deltaY = Math.abs(unit.getMapY() - targetUnit.getMapY())
        if (deltaX + deltaY == 1) {
            return true;
        }
    }

    var weapon, indexArray;
    
    if (!Calculator.isCounterattackAllowed(unit, targetUnit)) {
        return false;
    }
    
    weapon = ItemControl.getEquippedWeapon(unit);
    if (weapon !== null && weapon.isOneSide()) {
        // If the attacker is equipped with "One Way" weapon, no counterattack occurs.
        return false;
    }
    
    // Get the equipped weapon of those who is attacked.
    weapon = ItemControl.getEquippedWeapon(targetUnit);
    
    // If no weapon is equipped, cannot counterattack.
    if (weapon === null) {
        return false;
    }
    
    // If "One Way" weapon is equipped, cannot counterattack.
    if (weapon.isOneSide()) {
        return false;
    }
    
    indexArray = IndexArray.createExtendedIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), weapon, targetUnit);
    
    return IndexArray.findUnit(indexArray, unit);
};

AttackChecker.isCounterattackPos = function(unit, targetUnit, x, y) {
    if (SkillControl.getPossessionCustomSkill(targetUnit, "Counterattack")!=null) {
        return true;
    }

    var targetWeapon = ItemControl.getEquippedWeapon(targetUnit);
    if (targetWeapon!=null && targetWeapon.getWeaponType().getName()=="Bow" && SkillControl.getPossessionCustomSkill(targetUnit, "CloseCounter")!=null) {
        var deltaX = Math.abs(unit.getMapX() - targetUnit.getMapX());
        var deltaY = Math.abs(unit.getMapY() - targetUnit.getMapY())
        if (deltaX + deltaY == 1) {
            return true;
        }
    }

    var indexArray;
    var weapon = ItemControl.getEquippedWeapon(targetUnit);
    
    if (weapon === null) {
        return false;
    }
    
    indexArray = IndexArray.createExtendedIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), weapon, targetUnit);
    
    return IndexArray.findPos(indexArray, x, y);
};

var extrng01 = UnitRangePanel.getUnitAttackRange;
UnitRangePanel.getUnitAttackRange = function(unit) {
    var attackRange = extrng01.call(this, unit);
    var item = ItemControl.getEquippedWeapon(unit);

    if (item!=null) {
        //attackRange.endRange = RangeControl.getMagicRange(unit, item)
        var extendedRange = RangeControl.getExtendedWeaponRange(unit, item);
        attackRange.startRange += extendedRange.start;
        attackRange.endRange += extendedRange.end;
    }    

    return attackRange;
}

var extrng03 = BaseCombinationCollector._setUnitRangeCombination;
BaseCombinationCollector._setUnitRangeCombination = function(misc, filter, rangeMetrics) {
    var unit = misc.unit;
    var item = misc.item;
    var extendedRange;

	if (item!=null) {
		if (item.isWeapon()) {        
			extendedRange = RangeControl.getExtendedWeaponRange(unit, item);
			rangeMetrics.startRange += extendedRange.start;
			rangeMetrics.endRange += extendedRange.end;
		}
		else {
            extendedRange = RangeControl.getExtendedItemRange(unit, item);
			rangeMetrics.endRange = RangeControl.getMagicRange(unit, item);
            rangeMetrics.startRange += extendedRange.start;
            rangeMetrics.endRange += extendedRange.end;
		}
	}    

    extrng03.call(this, misc, filter, rangeMetrics);
}

//This three functions handle the change of magic range, like making a staff use the range Mag/2
var extrng02 = BaseItemInfo.drawRange;
BaseItemInfo.drawRange = function(x, y, rangeValue, rangeType) {
    var textui = this.getWindowTextUI();
    var color = textui.getColor();
    var font = textui.getFont();

    if (this._item.custom.magicRange!=null) {
        if (typeof this._item.custom.magicRange != 'number') {
            throwError022(item);
        }
        ItemInfoRenderer.drawKeyword(x, y, root.queryCommand('range_capacity'));
        NumberRenderer.drawRightNumber(x + 40, y, 1);
        TextRenderer.drawKeywordText(x + 57, y, StringTable.SignWord_WaveDash, -1, color, font);
        TextRenderer.drawKeywordText(x + 74, y, "Mag/" + this._item.custom.magicRange, -1, color, font);
    }
    else {
        extrng02.call(this, x, y, rangeValue, rangeType);
    }
}

EntireRecoveryControl._isTargetAllowed = function(unit, targetUnit, item) {
    var scope = RangeControl.getMagicRange(unit, item);
    var dx = Math.abs(unit.getMapX() - targetUnit.getMapX()); //The horizontal distance
    var dy = Math.abs(unit.getMapY() - targetUnit.getMapY()); //The vertical distance
    return (dx + dy) <= scope; //The total distance must be equal or less than the scope of the item
}

EntireRecoveryItemInfo._drawValue = function(x, y) {
    var recoveryInfo = this._item.getEntireRecoveryInfo();
    
    if (recoveryInfo.getRecoveryType() === RecoveryType.SPECIFY) {
        ItemInfoRenderer.drawKeyword(x, y, StringTable.Recovery_Value);
        x += ItemInfoRenderer.getSpaceX();
        NumberRenderer.drawRightNumber(x, y, recoveryInfo.getRecoveryValue());	
    }
    else {
        ItemInfoRenderer.drawKeyword(x, y, StringTable.Recovery_All);
        x += ItemInfoRenderer.getSpaceX();
    }

    x += 40;
    this.drawRange(x, y, this._item.getRangeValue(), this._item.getRangeType());
}