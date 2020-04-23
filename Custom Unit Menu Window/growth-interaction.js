//Plugin by Goinza

var GrowthInteraction = defineObject(TopCustomInteraction, {

    initialize: function() {
		this._scrollbar = createScrollbarObject(this.getScrollbarObject(), this);
		this._scrollbar.setScrollFormation(3, 4);
    },
    
    getTitle: function() {
        return GROWTHS_TITLE;
    },

    getScrollbarObject: function() {
        return GrowthScrollbar;
    },

    isHelpAvailable: function() {
        return false;
    },

    getHelpText: function() {
        return "";
    }

})

var GrowthScrollbar = defineObject(TopCustomScrollbar, {   

    setDataScrollbar: function(unit) {
        var count = ParamGroup.getParameterCount();
        var growth, name, value;

        this.resetScrollData();
		
		for (i=0; i<count; i++) {
            if (this._isParameterDisplayable(i)) {
                growth = createObject(GrowthObject);
                name = ParamGroup.getParameterName(i);
                value = ParamGroup.getGrowthBonus(unit, i) + ParamGroup.getGrowthBonus(unit.getClass(), i);
                growth.setGrowth(name, value);
                this.objectSet(growth);
            }
		}
		
		this.objectSetEnd();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = this.getParentTextUI();
        var font = textui.getFont();
        var name = object.getName();
        var value = object.getValue();

        TextRenderer.drawKeywordText(x, y, name, -1, ColorValue.KEYWORD, font);
        NumberRenderer.drawNumber(x + 45, y, value);
    },

    getObjectWidth: function() {
		return 70;
	},

    _isParameterDisplayable: function(index) {
		return ParamGroup.isParameterDisplayable(UnitStatusType.NORMAL, index);
	}

})

//Object used to store the properties of each growth stat
var GrowthObject = defineObject(BaseObject, {

    _name: null,
    _value: 0,

    setGrowth: function(name, value) {
        this._name = name;
        this._value = value;
    },

    getName: function() {
        return this._name;
    },

    getValue: function() {
        return this._value;
    }

})