//Plugin by Goinza

(function() {

    var alias1 = Miscellaneous.getMotionColorIndex;
    Miscellaneous.getMotionColorIndex = function(unit) {
		var colorIndex = alias1.call(this, unit);
		var motionColor = this.getOriginalMotionColor(unit);
		var unitType = NeutralControl.getUnitType(unit);

		if (motionColor === 0 && unitType === UnitType.NEUTRAL) {
            colorIndex = NeutralControl.getNeutralColorIndex(unit, colorIndex);
		}
		
		return colorIndex;
	}

})()