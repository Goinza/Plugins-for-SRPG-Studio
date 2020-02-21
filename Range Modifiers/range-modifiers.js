//Plugin by Goinza

IndexArray.createExtendedIndexArray = function(x, y, item, unit) {
    var i, rangeValue, rangeType, arr, skill, skillArr;
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

        skillArr = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "WeaponRange");
        skill = null;
        var j = 0;
        var found = false;
        while (j<skillArr.length && !found) {
            if (typeof skillArr[j].skill.custom.type != 'string') {
                throwError019(skillArr[j].skill);
            }
            if (skillArr[j].skill.custom.type==item.getWeaponType().getName()) {
                skill = skillArr[j].skill;
                found = true;
            }
            j++;
        }

        if (skill!=null) {
            startRange += skill.custom.startRange!=null ? skill.custom.startRange : 0;
            endRange += skill.custom.endRange!=null ? skill.custom.endRange : 0;
            if (typeof startRange != 'number') {
                throwError020(skill);
            }
            if (typeof endRange != 'number') {
                throwError021(skill);
            }
        }
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
            endRange = rangeValue;

            if (item.custom.magicRange!=null) {
                if (typeof item.custom.magicRange != 'number') {
                    throwError022(item);
                }
                endRange = Math.floor(RealBonus.getMag(unit) / item.custom.magicRange);
            }

            skill = SkillControl.getPossessionCustomSkill(unit, "StaffRange");
            if (skill!=null && item.isWand()) {
                startRange += skill.custom.startRange!=null ? skill.custom.startRange : 0;
                endRange += skill.custom.endRange!=null ? skill.custom.endRange : 0;
                if (typeof startRange != 'number') {
                    throwError020(skill);
                }
                if (typeof endRange != 'number') {
                    throwError021(skill);
                }
            }
            skill = SkillControl.getPossessionCustomSkill(unit, "ItemRange");  
            if (skill!=null && !item.isWand()) {
                startRange += skill.custom.startRange!=null ? skill.custom.startRange : 0;
                endRange += skill.custom.endRange!=null ? skill.custom.endRange : 0;
                if (typeof startRange != 'number') {
                    throwError020(skill);
                }
                if (typeof endRange != 'number') {
                    throwError021(skill);
                }
            }          
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

    var skill = SkillControl.getPossessionCustomSkill(unit, "WeaponRange");  
    var item = ItemControl.getEquippedWeapon(unit);

    if (item!=null && item.custom.magicRange!=null) {
        if (typeof item.custom.magicRange != 'number') {
            throwError022(item);
        }
        attackRange.endRange = Math.floor(RealBonus.getMag(unit) / item.custom.magicRange);
    }

    if (item!=null && skill!=null) {
        if (typeof skillArr[j].skill.custom.type != 'string') {
            throwError019(skillArr[j].skill);
        }
        if (skill.custom.type==item.getWeaponType().getName()) {
            attackRange.startRange += skill.custom.startRange!=null ? skill.custom.startRange : 0;
            attackRange.endRange += skill.custom.endRange!=null ? skill.custom.endRange : 0;
            if (typeof attackRange.startRange != 'number') {
                throwError020(skill);
            }
            if (typeof attackRange.endRange != 'number') {
                throwError021(skill);
            }
        }
        
    }

    return attackRange;
}

var extrng03 = BaseCombinationCollector._setUnitRangeCombination;
BaseCombinationCollector._setUnitRangeCombination = function(misc, filter, rangeMetrics) {
    var unit = misc.unit;
    var item = misc.item;

    if (item.isWeapon()) {
        var skill = SkillControl.getPossessionCustomSkill(unit, "WeaponRange");  
        if (item!=null && item.custom.magicRange!=null) {
            if (typeof item.custom.magicRange != 'number') {
                throwError022(item);
            }
            rangeMetrics.endRange = Math.floor(RealBonus.getMag(unit) / item.custom.magicRange);
        }
    
        if (item!=null && skill!=null && skill.custom.type==item.getWeaponType().getName()) {
            rangeMetrics.startRange += skill.custom.startRange!=null ? skill.custom.startRange : 0;
            rangeMetrics.endRange += skill.custom.endRange!=null ? skill.custom.endRange : 0;
            if (typeof rangeMetrics.startRange != 'number') {
                throwError020(skill);
            }
            if (typeof rangeMetrics.endRange != 'number') {
                throwError021(skill);
            }
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
        if (typeof item.custom.magicRange != 'number') {
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
    var scope;
    if (item.custom.magicRange != null) {
        if (typeof item.custom.magicRange != 'number') {
            throwError022(item);
        }
        scope = Math.floor(RealBonus.getMag(unit) / item.custom.magicRange);
    }
    else {
        scope = item.getRangeValue();
    }
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