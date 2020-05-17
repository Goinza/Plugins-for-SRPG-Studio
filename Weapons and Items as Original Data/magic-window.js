//Plugin by Goinza

(function() {

    var alias1 = UnitMenuScreen._configureBottomWindows;
    UnitMenuScreen._configureBottomWindows = function(groupArray) {
        alias1.call(this, groupArray);
        if (SpellsConfig.ADD_WINDOW) {
            groupArray.appendWindowObject(SpellsBottomWindow, this);
        }
    }

})()

var SpellsBottomWindow = defineObject(BaseMenuBottomWindow, {

    _interaction: null,

    setUnitMenuData: function() {
        this._interaction = createObject(SpellsInteraction);
        this._interaction.setWindowTextUI(this.getWindowTextUI());
    },

    changeUnitMenuTarget: function(unit) {
        this._interaction.setData(unit);
    },

    moveWindowContent: function() {
        this._interaction.moveInteraction();

        return MoveResult.CONTINUE;
    },

    drawWindowContent: function(x, y) {
        var textui = this.getWindowTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        TextRenderer.drawText(x, y, SpellsConfig.NAME, -1, ColorValue.KEYWORD, font);

        this._interaction.getInteractionScrollbar().drawScrollbar(x, y + 30);
        if (this.isHelpMode()) {
            this._interaction.getInteractionWindow().drawWindow(x + ItemRenderer.getItemWidth(), y);
        }
    },

    setHelpMode: function() {
        return this._interaction.setHelpMode();
    },

    isHelpMode: function() {
        return this._interaction.isHelpMode();
    },

    isTracingHelp: function() {
        return this._interaction.isTracingHelp();
    },

    getHelpText: function() {
        return this._interaction.getHelpText();
    }

})

var SpellsInteraction = defineObject(BaseInteraction, {

    _textui: null,

    initialize: function() {
        this._scrollbar = createScrollbarObject(SpellsScrollbar, this);
        this._scrollbar.setScrollFormation(1, DefineControl.getVisibleUnitItemCount());
        this._window = createWindowObject(ItemInfoWindow, this);
    },

    setData: function(unit) {
        var spells = MagicAttackControl.getAttackSpells(unit);
        spells.concat(MagicAttackControl.getSupportSpells(unit));
        this._scrollbar.setObjectArray(spells);
    },

    getWindowTextUI: function() {
		return this._textui;
	},
	
	setWindowTextUI: function(textui) {
		this._textui = textui;
	},

    _changeTopic: function() {
		var item = this._scrollbar.getObject();
		
		this._window.setInfoItem(item);
	}

})

var SpellsScrollbar = defineObject(BaseScrollbar, {

    drawScrollContent: function(x, y, object, isSelect, index) {        
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        ItemRenderer.drawItem(x, y, object, color, font, true);
    },

    getObjectWidth: function() {
		return ItemRenderer.getItemWidth();
	},
	
	getObjectHeight: function() {
		return ItemRenderer.getItemHeight();
	}
    
})