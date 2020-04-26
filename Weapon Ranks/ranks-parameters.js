//Plugin by Goinza

//The variable used to make all the weapon ranks
var RankUnitParameter = defineObject(BaseUnitParameter, {

    _name: null,
    _type: null,
    _gauge: null,

    setRank: function(name, type) {
        this._name = name;
        this._type = type;
        this._gauge = createObject(GaugeBar);
        this._gauge.initialize();
    },

    getUnitValue: function(unit) {
        var rankArray = unit.custom.rank!=null ? unit.custom.rank : null;
        var rank = RANK_SYSTEM[0][1];
        if (rankArray!=null) {
            if (typeof rankArray.length != 'number' || typeof rankArray[0].length != 'number') {
                throwError007(unit);
            }
            var i = 0;
            var found = false;
            while (i<rankArray.length && !found) {
                //[i][0] is the name of the rank. [i][1] is the value of the rank
                if (rankArray[i][0]==this._name) {
                    found = true;
                    rank = rankArray[i][1];
                }
                i++;
            }      
        }

        //Prevents going over the max and min values.
        //PROBABLY THIS IS NOT NECESSARY??
        if (rank>this.getMaxValue(unit)) {
            rank = this.getMaxValue(unit);
        }
        else if (rank<this.getMinValue(unit)) {
            rank = this.getMinValue(unit);
        }

        return rank;
    },

    setUnitValue: function(unit, value) {
        //Prevents going over the max and min values.
        //Even without this if blocks, the display will still work, the unit can't equip weapons that exceed their max value of the rank
        //but the problem is that without this, the custom value can keep increasing, when it should stop at the max value of the unit.
        //So when the unit changes classes to another without a limit to the weapon rank, it will suddenly increase because it kept increasing at the time it shouldn't happen.
        if (value>this.getMaxValue(unit)) {
            value = this.getMaxValue(unit);
        }
        else if (value<this.getMinValue(unit)) {
            value = this.getMinValue(unit);
        }

        var rankArray = unit.custom.rank!=null ? unit.custom.rank : null;  
        if (rankArray!=null) {
            if (typeof rankArray.length != 'number' || typeof rankArray[0].length != 'number') {
                throwError007(unit);
            }
            var i = 0;
            var found = false;
            while (i<rankArray.length && !found) {
                //[i][0] is the name of the rank. [i][1] is the value of the rank
                if (rankArray[i][0]==this._name) {
                    found = true;
                    unit.custom.rank[i][1] = value;
                }
                i++;
            }
            if (!found) {                
                unit.custom.rank[i] = [];
                unit.custom.rank[i][0] = this._name;
                unit.custom.rank[i][1] = value;
            }      
        }
        else {
            unit.custom.rank = [];
            unit.custom.rank[0] = [];
            unit.custom.rank[0][0] = this._name;
            unit.custom.rank[0][1] = value;
        }
    },

    //Bonus rank from classes, weapons, items, states, skills.
    getParameterBonus: function(obj) {
        //return 0;
        var rankArray = obj.custom.rank!=null ? obj.custom.rank : null;
        var rank = RANK_SYSTEM[0][1];
        if (rankArray!=null) {
            if (typeof rankArray.length != 'number' || typeof rankArray[0].length != 'number') {
                throwError007(unit);
            }
            var i = 0;
            var found = false;
            while (i<rankArray.length && !found) {
                //[i][0] is the name of the rank. [i][1] is the value of the rank
                if (rankArray[i][0]==this._name) {
                    found = true;
                    rank = rankArray[i][1]
                }
                i++;
            }      
        }
        return rank;
    },

    //RANKS DON'T HAVE GROWTHS
    getGrowthBonus: function(obj) {
        return 0;
    },

    //This is not used, instead we modifiy how ParameterControl.addDoping works.
    getDopingParameter: function(obj) {
        return 0;
    },

    getMaxValue: function(unit) {
        var rankArray = unit.getClass().custom.maxRank!=null ? unit.getClass().custom.maxRank : null;
        var rank = RANK_SYSTEM[RANK_SYSTEM.length-1][1];
        if (rankArray!=null) {
            if (typeof rankArray.length != 'number' || typeof rankArray[0].length != 'number') {
                throwError008(unit.getClass());
            }
            var i = 0;
            var found = false;
            while (i<rankArray.length && !found) {
                //[i][0] is the name of the rank. [i][1] is the value of the rank
                if (rankArray[i][0]==this._name) {
                    found = true;
                    rank = rankArray[i][1]
                }
                i++;
            }      
        }
        return rank;
    },

    getMinValue: function(unit) {
        var rankArray = unit.getClass().custom.minRank!=null ? unit.getClass().custom.minRank : null;
        var rank = RANK_SYSTEM[0][1];
        if (rankArray!=null) {
            if (typeof rankArray.length != 'number' || typeof rankArray[0].length != 'number') {
                throwError009(unit);
            }
            var i = 0;
            var found = false;
            while (i<rankArray.length && !found) {
                //[i][0] is the name of the rank. [i][1] is the value of the rank
                if (rankArray[i][0]==this._name) {
                    found = true;
                    rank = rankArray[i][1]
                }
                i++;
            }      
        }
        return rank;
    },

    getParameterName: function() {
        return this._name;
    },

    getParameterType: function() {
        return this._type;
    },

    isParameterDisplayable: function(unitStatusType) {
        var defaultItemType = root.getBaseData().getWeaponTypeList(3).getDataFromId(1);
        var displayable = unitStatusType==UnitStatusType.WRANKS && this._name!=defaultItemType.getName();
        
        if (displayable) {
            var weaponTypeList, weaponType, i, j;
            i = 0;
            var found = false;
            while (i<=3 && !found) {
                weaponTypeList = root.getBaseData().getWeaponTypeList(i);
                j = 0;
                while (j<weaponTypeList.getCount() && !found) {
                    weaponType = weaponTypeList.getData(j);
                    if (weaponType.getName()==this._name) {
                        found = true;
                        displayable = weaponType.custom.hidden==null || !weaponType.custom.hidden;
                    }
                    j++;
                }
                i++;
            }
        }
        return displayable;
    },

    isParameterRenderable: function() {
        return true;
    },

    drawUnitParameter: function(x, y, statusEntry, isSelect) {
        //Find the icon of the weapon
        var icon;
        var h = 0;
        var found = false;
        while (h<4 && !found) {
            var weaponTypeList = root.getBaseData().getWeaponTypeList(h);
            var i = 0;
            while (i<weaponTypeList.getCount() && !found) {
                if (weaponTypeList.getData(i).getName()==this.getParameterName()) {
                    found = true;
                    icon = weaponTypeList.getData(i).getIconResourceHandle();
                }
                i++;
            }
            h++;
        }

        //Draw the icon
        GraphicsRenderer.drawImage(x, y, icon, GraphicsType.ICON);

        //Search for a custom gauge (or the default gauge, in case not custom gauge is available)
        var id = root.getMetaSession().global.weaponRankGauge!=null ? root.getMetaSession().global.weaponRankGauge : null;
        var isRuntime = root.getMetaSession().global.isRuntimeGauge!=null ? root.getMetaSession().global.isRuntimeGauge : null;
        var pic;
        if (id!=null && isRuntime!=null) {            
            var list = root.getBaseData().getUIResourceList(UIType.GAUGE, isRuntime);
            pic = list.getDataFromId(id);
        }
        else {
            pic = root.queryUI('map_gauge');
        }       

        //Draw the gauge
        var value = statusEntry.param;
        var maxValue = WeaponRankControl.numberToMaxRank(value) - WeaponRankControl.numberToMinRank(value);
        value -=  WeaponRankControl.numberToMinRank(value);
        this._gauge.setGaugeInfo(value, maxValue, GAUGE_COLOR);
        this._gauge.setPartsCount(8);
        this._gauge.drawGaugeBar(x + 22, y + 5, pic);

        //Draw the rank value
        var textui = root.queryTextUI('infowindow_title');
        var font = textui.getFont();
        value = statusEntry.param;
        var text = WeaponRankControl.numberToRank(value);
        if (!statusEntry.visible) {
            if (text!=RANK_SYSTEM[0][0]) {
                text = "(" + text + ")";
            }
        }
        TextRenderer.drawKeywordText(x + 60, y-2, text, 2, 0xffffff, font);
        
    }
})