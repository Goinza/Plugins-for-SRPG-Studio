MapLayer.prepareMapLayer = function() {
    this._counter = createObject(UnitCounter);
    this._unitRangePanel = createObject(CustomUnitRangePanel);
    
    this._mapChipLight = createObject(MapChipLight);
    this._mapChipLight.setLightType(MapLightType.NORMAL);
    
    this._markingPanel = createObject(MarkingPanel);
};

var MapLightType = {
	NORMAL: 0,
	MOVE: 1,
	RANGE: 2,
	HEAL: 3
};

MapChipLight.drawLight = function() {
    if (this._type === MapLightType.NORMAL) {
        root.drawFadeLight(this._indexArray, this._getColor(), this._getAlpha());
    }
    else if (this._type === MapLightType.MOVE) {
        root.drawWavePanel(this._indexArray, this._getMoveImage(), this._wavePanel.getScrollCount());
    }
    else if (this._type === MapLightType.RANGE) {
        root.drawWavePanel(this._indexArray, this._getRangeImage(), this._wavePanel.getScrollCount());
    }
    else if (this._type === MapLightType.HEAL) {
        root.drawWavePanel(this._indexArray, this._getHealImage(), this._wavePanel.getScrollCount());
    }
},

MapChipLight._getHealImage = function() {
    return root.queryUI('sortie_panel');
}

CustomUnitRangePanel = defineObject(UnitRangePanel, {
    _mapChipLightWand: null,
    _indexWeapon: null,
    _indexWand: null,

    initialize: function() {
		this._mapChipLight = createObject(MapChipLight);
		this._mapChipLightWeapon = createObject(MapChipLight);
		this._mapChipLightWand = createObject(MapChipLight);
		
		this._simulator = root.getCurrentSession().createMapSimulator();
		// Ignore "Passable Terrains" at the panel display on the map.
		this._simulator.disableRestrictedPass();
    },
    
    moveRangePanel: function() {
		if (this._unit === null) {
			return MoveResult.CONTINUE;
		}
		
		this._mapChipLight.moveLight();
		this._mapChipLightWeapon.moveLight();
		this._mapChipLightWand.moveLight();
		
		return MoveResult.CONTINUE;
    },
    
    drawRangePanel: function() {
		if (this._unit === null) {
			return;
		}
		
		if (PosChecker.getUnitFromPos(this._x, this._y) !== this._unit) {
			return;
		}
		
		if (this._unit.isWait()) {
			return;
		}
		
		this._mapChipLight.drawLight();
		this._mapChipLightWeapon.drawLight();
		this._mapChipLightWand.drawLight();
    },
    
    getUnitAttackRange: function(unit) {
		var i, item, count, rangeMetrics;
		var startRange = 99;
		var endRange = 0;
		var obj = {};
		count = UnitItemControl.getPossessionItemCount(unit);
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			rangeMetrics = this._getRangeMetricsFromItem(unit, item);
			if (rangeMetrics !== null && item.isWeapon()) {
				if (rangeMetrics.startRange < startRange) {
					startRange = rangeMetrics.startRange;
				}
				if (rangeMetrics.endRange > endRange) {
					endRange = rangeMetrics.endRange;
				}
			}
		}
		
		obj.startRange = startRange;
		obj.endRange = endRange;
		obj.mov = this._getRangeMov(unit);
		
		return obj;
    },
    
    _getUnitHealRange: function(unit) {
		var i, item, count, rangeMetrics;
		var startRange = 99;
		var endRange = 0;
		var obj = {};	
			
		count = UnitItemControl.getPossessionItemCount(unit);
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			rangeMetrics = this._getRangeMetricsFromItem(unit, item);
			if (rangeMetrics !== null && item.isWand() && ItemControl.isItemUsable(unit, item)) {
				if (rangeMetrics.startRange < startRange) {
					startRange = rangeMetrics.startRange;
				}
				if (rangeMetrics.endRange > endRange) {
					endRange = rangeMetrics.endRange;
				}
			}
		}
		
		obj.startRange = startRange;
		obj.endRange = endRange;
		obj.mov = this._getRangeMov(unit);
		
		return obj;
    },
    
    _setRangeData: function() {
		var attackRange = this.getUnitAttackRange(this._unit);
		var healRange = this._getUnitHealRange(this._unit);
		var isWeapon = attackRange.endRange !== 0;
		var isWand = healRange.endRange !== 0;
		
		if (isWeapon && !isWand) {
			this._simulator.startSimulationWeapon(this._unit, attackRange.mov, attackRange.startRange, attackRange.endRange);
			this._indexWeapon = this._simulator.getSimulationWeaponIndexArray();
		}
		else if (!isWeapon && isWand) {
			this._simulator.startSimulationWeapon(this._unit, healRange.mov, healRange.startRange, healRange.endRange);
			this._indexWand = this._simulator.getSimulationWeaponIndexArray();
		}
		else if (isWeapon && isWand) {
			this._simulator.startSimulationWeapon(this._unit, attackRange.mov, attackRange.startRange, attackRange.endRange);
			this._indexWeapon = this._simulator.getSimulationWeaponIndexArray();
			this._simulator.startSimulationWeapon(this._unit, healRange.mov, healRange.startRange, healRange.endRange);
			this._indexWand = this._simulator.getSimulationWeaponIndexArray();
		}
		else {
			this._simulator.startSimulation(this._unit, attackRange.mov);
		}
		
		this._setLight(isWeapon);
		this._setLightWand(isWand);
    },
    
	_setRepeatRangeData: function() {
		var mov = ParamBonus.getMov(this._unit) - this._unit.getMostResentMov();
		
		this._simulator.startSimulation(this._unit, mov);
		this._setLight(false);
		this._setLightWand(false);
	},

    _setLight: function(isWeapon) {
		this._mapChipLight.setLightType(MapLightType.MOVE);
		this._mapChipLight.setIndexArray(this._simulator.getSimulationIndexArray());
		if (isWeapon) {
			this._mapChipLightWeapon.setLightType(MapLightType.RANGE);
			this._mapChipLightWeapon.setIndexArray(this._indexWeapon);
		}
		else{
			this._mapChipLightWeapon.endLight();
		}
	},

	_setLightWand: function(isWand) {
		if (isWand) {
			this._mapChipLightWand.setLightType(MapLightType.HEAL);
			this._mapChipLightWand.setIndexArray(this._indexWand);
		}
		else{
			this._mapChipLightWand.endLight();			
		}
	},
	
	_getRangeMetricsFromItem: function(unit, item) {
		var rangeMetrics = null;
		
		if (item.isWeapon()) {
			if (ItemControl.isWeaponAvailable(unit, item)) {
				rangeMetrics = StructureBuilder.buildRangeMetrics();
				rangeMetrics.startRange = item.getStartRange();
				rangeMetrics.endRange = item.getEndRange();
			}
		}
		else {
			if (item.getRangeType() === SelectionRangeType.MULTI) {
				rangeMetrics = StructureBuilder.buildRangeMetrics();
				rangeMetrics.endRange = item.getRangeValue();
			}
		}
		
		return rangeMetrics;
	}
});