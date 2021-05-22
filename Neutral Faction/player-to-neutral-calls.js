//Plugin by Goinza

(function() {

    UnitCommand.Trade._isTradable = function(targetUnit) {
		var targetUnitType = NeutralControl.getUnitType(targetUnit);
		if (targetUnitType !== UnitType.PLAYER) {
			return false;
		}
		
		if (!Miscellaneous.isItemAccess(targetUnit)) {
			return false;
		}
		
		// If "Berserk" state, cannot trade the item.
		if (StateControl.isBadStateOption(targetUnit, BadStateOption.BERSERK)) {
			return false;
		}
		
		return true;
	}

	MapSequenceArea._isTargetMovable = function() {
		if (!StateControl.isTargetControllable(this._targetUnit)) {
			return false;
		}
        
		var targetUnitType = NeutralControl.getUnitType(this._targetUnit);
		// The player who doesn't wait allows moving.
		return targetUnitType === UnitType.PLAYER && !this._targetUnit.isWait();
	}

})()