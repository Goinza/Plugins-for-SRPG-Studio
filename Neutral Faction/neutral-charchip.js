//Plugin by Goinza

(function() {

    var alias2 = CustomCharChipGroup.createCustomRenderer;
    CustomCharChipGroup.createCustomRenderer = function(unit) {
        var unitType = NeutralControl.getUnitType(unit);
        var keyword = unit.getCustomCharChipKeyword();
        if (keyword == "NeutralFaction") {
            if (unitType == UnitType.NEUTRAL) {
                unit.setCustomRenderer(createObject(CustomCharChip.Neutral));
            }
        }
        else {
            alias2.call(this, unit);
        }
    }

    var alias3 = UnitRenderer._drawCustomCharChip;
    UnitRenderer._drawCustomCharChip = function(unit, x, y, unitRenderParam) {
        var unitType = NeutralControl.getUnitType(unit);
        var cpData, renderer;
        if (unitType == UnitType.NEUTRAL) {
            cpData = CustomCharChipGroup.createCustomCharChipDataFromUnit(unit, x, y, unitRenderParam);
            renderer = unit.getCustomRenderer();
            if (renderer != null) {
                renderer.drawCustomCharChip(cpData);
            }
            else {
                alias3.call(this, unit, x, y, unitRenderParam);
            }            
        }
        else {
            alias3.call(this, unit, x, y, unitRenderParam);
        }
    }

    CustomCharChip.Neutral = defineObject(BaseCustomCharChip, {

        _unit: null,
        _charchip: null,
        _handle: null,
        _currentFrame: null,
        _centralFrame: null,
        _hpGauge: null,
        _hpPic: null,

        initialize: function() {
            this._counter = createObject(UnitCounter); 
        },

        setupCustomCharChip: function(unit) {
            this._unit = unit;            
            this._handle = unit.getCharChipResourceHandle();
            this._charchip = this._getCharchip();
            this._currentFrame = this._getStartingFrame();
            this._centralFrame = this._currentFrame + 1;
            this._setHpGauge(unit);
        },

        moveCustomCharChip: function() {
            this._counter.moveUnitCounter();
            this._currentFrame = this._getStartingFrame() + this._counter.getAnimationIndexFromUnit(this._unit);
            this._hpGauge.getBalancer().setCurrentValue(this._unit.getHp());

            return MoveResult.CONTINUE;
        },

        drawCustomCharChip: function(cpData) {
            var x = cpData.xPixel;
            var y = cpData.yPixel;            
            this._drawSymbol(x, y, cpData);
            this._drawCurrentFrame(x, y, cpData.direction);
            this._drawHpGauge(x, y, cpData);
            this._drawStateIcon(x, y, cpData);
        },

        drawMenuCharChip: function(cpData) {
            var x = cpData.xPixel;
            var y = cpData.yPixel;
            this._drawCentralFrame(x, y);         
        },

        isDefaultMenuUnit: function() {
            return false;
        },

        getKeyword: function() {
            return 'NeutralFaction';
        },

        _drawCurrentFrame: function(x, y, direction) {
            var directionArray = [4, 1, 2, 3, 0];
            var width = GraphicsFormat.CHARCHIP_WIDTH;
            var height = GraphicsFormat.CHARCHIP_HEIGHT;
            var xSrc = this._handle.getSrcX() * (width * 3);
            var ySrc = this._handle.getSrcY() * (height * 5);
            var dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
            var dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
            var dxSrc = this._currentFrame;
            var dySrc = directionArray[direction];
            this._charchip.drawParts(x - dx, y - dy,xSrc + (dxSrc * width), ySrc + (dySrc * height), width, height);
        },

        _drawCentralFrame: function(x, y) {
            var width = GraphicsFormat.CHARCHIP_WIDTH;
            var height = GraphicsFormat.CHARCHIP_HEIGHT;
            var xSrc = this._handle.getSrcX() * (width * 3);
            var ySrc = this._handle.getSrcY() * (height * 5);
            var dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
            var dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
            var dxSrc = this._centralFrame;
            var dySrc = 0;
            this._charchip.drawParts(x - dx, y - dy,xSrc + (dxSrc * width), ySrc + (dySrc * height), width, height);
        },

        _drawSymbol: function(x, y, cpData) {
            if (EnvironmentControl.isMapUnitSymbol()) {
                var width = 32;
		        var height = 18;
                var canvas = root.getGraphicsManager().getCanvas();
                var color = NeutralSettings.SYMBOL_COLOR;
                canvas.setFillColor(color, 210);
                canvas.drawEllipse(x, y + 20, width, height);
            }            
        },
        
        _drawHpGauge: function(x, y, cpData) {
            var hpType = EnvironmentControl.getMapUnitHpType();
            switch (hpType) {
                case 0:
                    root.drawCharChipHpGauge(x, y, cpData.unit);
                    break;
                case 1:
                    var dx = 1;
                    var dy = 20;
                    if (this._hpGauge != null) {
                        this._hpGauge.drawGaugeBar(x + dx, y + dy, this._hpPic);
                    }
                    break; 
            }          
        },

        _getCharchip: function() {     
            var charchip = NeutralControl.getNeutralCharchip(this._unit);       
            var isRuntime = charchip.isRuntime;
            var id = charchip.id;
            var list = root.getBaseData().getGraphicsResourceList(GraphicsType.CHARCHIP, isRuntime);
            return list.getCollectionDataFromId(id, 0);
        },

        _getStartingFrame: function() {
            var charchip = NeutralControl.getNeutralCharchip(this._unit);
            var color = charchip.colorIndex;
            return color * 3;
        },

        _setHpGauge: function(unit) {
            var list = root.getBaseData().getUIResourceList(UIType.GAUGE, NeutralSettings.GAUGE.isRuntime);
            var pic = list.getDataFromId(NeutralSettings.GAUGE.id);
            var colorIndex = NeutralSettings.GAUGE.colorIndex;

            this._hpGauge = createObject(GaugeBar);
            this._hpGauge.setGaugeInfo(unit.getHp(), RealBonus.getMhp(unit), colorIndex);
            this._hpGauge.setPartsCount(3);
            this._hpPic = pic;
        }

    })

})()