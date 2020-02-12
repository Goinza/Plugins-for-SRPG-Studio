UnitStatusType.WRANKS = 3;

//The weapon ranks window
var WeaponRanksWindow = defineObject(BaseMenuBottomWindow, {
    _ranksScrollbar: null,
    _unit: null,

    setUnitMenuData: function() {
        this._ranksScrollbar = createScrollbarObject(RanksScrollbar, this);
    },

    changeUnitMenuTarget: function(unit) {
        this._unit = unit;
        this._ranksScrollbar.setStatusFromUnit(unit);
    },
    
    drawWindowContent: function(x, y) {
        var textui = root.queryTextUI('infowindow_title');
		var color = textui.getColor();
		var font = textui.getFont();
        TextRenderer.drawText(x, y, "Weapon Ranks", 10, color, font);
        
        this._drawRanks(x, y + 30);
    },

    _drawRanks: function(x, y) {
        this._ranksScrollbar.drawScrollbar(x, y);
    }

});

//The scrollbar that draws each weapon type and their rank
var RanksScrollbar = defineObject(UnitStatusScrollbar, {

    setStatusFromUnit: function(unit) {
		var i, j;
		var count = ParamGroup.getParameterCount();
		var weapon = ItemControl.getEquippedWeapon(unit);
		
		this._statusArray = [];
		
		for (i = 0, j = 0; i < count; i++) {
			if (this._isParameterDisplayable(i)) {
				if (SHOW_UNUSED_WEAPONS || ParamGroup.getLastValue(unit, i, weapon)>RANK_SYSTEM[0][1]) {
					this._statusArray[j++] = this._createStatusEntry(unit, i, weapon);
				}				
			}
		}
		
		this.setScrollFormation(this.getDefaultCol(), this.getDefaultRow());
		this.setObjectArray(this._statusArray);
	},
    
    drawScrollContent: function(x, y, object, isSelect, index) {
		var statusEntry = object;
		var n = statusEntry.param;
		var text = statusEntry.type;
		var textui = this.getParentTextUI();
		var font = textui.getFont();
		var length = this._getTextLength();
		
		
		statusEntry.textui = textui;
		if (statusEntry.isRenderable) {
			ParamGroup.drawUnitParameter(x, y, statusEntry, isSelect, statusEntry.index);
		}
		else {
            TextRenderer.drawKeywordText(x, y, text, length, ColorValue.KEYWORD, font);
		    x += this._getNumberSpace();

			if (n < 0) {
				n = 0;
			}
			NumberRenderer.drawNumber(x, y, n);
		}
		
		if (statusEntry.bonus !== 0) {
			this._drawBonus(x, y, statusEntry);
		}
	},

    getDefaultCol: function() {
        return 4;
    },

    _isParameterDisplayable: function(index) {
		var i, j;
		var list;
		var displayable = false;
		var name = ParamGroup.getParameterName(index);
		i = 0;
		while (i<4 && !displayable) {
			list = root.getBaseData().getWeaponTypeList(i);
			j = 0;
			while (j<list.getCount() && !displayable) {
				if (name==list.getData(j).getName()) {
					displayable = true;
				}
				j++;
			}
			i++;
		}
        return (displayable && ParamGroup.isParameterDisplayable(UnitStatusType.WRANKS, index));
	},
	
	_createStatusEntry: function(unit, index, weapon) {
		var statusEntry = StructureBuilder.buildStatusEntry();
		
		statusEntry.type = ParamGroup.getParameterName(index);
		// Include items or state bonuses by calling the ParamGroup.getLastValue, not the ParamGroup.getClassUnitValue.
		statusEntry.param = ParamGroup.getLastValue(unit, index, weapon);
		statusEntry.bonus = 0;
		statusEntry.index = index;
		statusEntry.isRenderable = ParamGroup.isParameterRenderable(index);
		statusEntry.visible = this._isRankVisible(unit, index);
		
		return statusEntry;
	},

	_isRankVisible: function(unit, index) {
		var i;
		var typeList;
		var found, hasWeapon, name;
		var unitWeaponsList = unit.getClass().getEquipmentWeaponTypeReferenceList();

		i = 0;
		while (i<unitWeaponsList.getTypeCount() && !found) {
			found = (unitWeaponsList.getTypeData(i).getName()==ParamGroup.getParameterName(index)) 
			i++;                       
		}

		if (!found) {
			//If this parameter is not a weapon rank, check if it is the staff rank
			var staffName = root.getBaseData().getWeaponTypeList(3).getDataFromId(0).getName();
			found = ParamGroup.getParameterName(index)==staffName && (unit.getClass().getClassOption() & ClassOptionFlag.WAND);

			if (!found) {
				var itemTypes = root.getBaseData().getWeaponTypeList(3);
				var i = 2;
				var itemName;
				while (i<itemTypes.getCount() && !found) {
					itemName = itemTypes.getData(i).getName();
					found = ParamGroup.getParameterName(index)==itemName;
					i++;
				}
			}
		}
		
		return found;
	}
});


UnitMenuBottomWindow._drawWeaponTypeArea = function(xBase, yBase) {
	//Erases the WeaponTypeArea by making this function empty. The WeaponRanksWindow makes that area useless.
};