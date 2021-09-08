//Plugin by Goinza

(function() {

    var alias1 = UnitMenuScreen._configureBottomWindows;
    UnitMenuScreen._configureBottomWindows = function(groupArray) {
        alias1.call(this, groupArray);
        if (CombatArtSettings.ENABLE_CA_WINDOW) {
            groupArray.appendWindowObject(CombatArtUnitMenuWindow, this);
        }        
    }

})()

var CombatArtUnitMenuWindow = defineObject(BaseMenuBottomWindow, {

    _combatArtInteraction: null,

    setUnitMenuData: function() {
        this._combatArtInteraction = createObject(CombatArtInteraction);
	},
	
	changeUnitMenuTarget: function(unit) {
        this._combatArtInteraction.setData(unit);
	},
	
	moveWindowContent: function() {
        if (InputControl.isSelectAction()) {
            this.setHelpMode();
            
        }
        this._combatArtInteraction.moveInteraction();
		return MoveResult.CONTINUE;
	},
	
	drawWindowContent: function(x, y) {
        var textui = root.queryTextUI('infowindow_title');
		var color = textui.getColor();
		var font = textui.getFont();
        TextRenderer.drawText(x, y, CombatArtSettings.TITLE_COMBATART, 10, color, font);

        this._combatArtInteraction.getInteractionScrollbar().drawScrollbar(x, y + 30);
        
        if (this.isHelpMode()) {
            this._combatArtInteraction.getInteractionWindow().drawWindow(x + ItemRenderer.getItemWidth(), y - 10);
        }
	},
	
	getWindowWidth: function() {
		return DefineControl.getUnitMenuWindowWidth();
	},
	
	getWindowHeight: function() {
		return DefineControl.getUnitMenuBottomWindowHeight();
	},
	
	setHelpMode: function() {
		return this._combatArtInteraction.setHelpMode();
	},
	
	isHelpMode: function() {
		return this._combatArtInteraction.isHelpMode();
	},
	
	isTracingHelp: function() {
		return this._combatArtInteraction.isTracingHelp();
	},
	
	getHelpText: function() {
		return this._combatArtInteraction.getHelpText();
	}

})

var CombatArtInteraction = defineObject(BaseInteraction, {

    _textui: null,

    initialize: function() {
        this._scrollbar = createScrollbarObject(CombatArtScrollbar, this);
        this._scrollbar.setScrollFormation(1, DefineControl.getVisibleUnitItemCount());
		
        this._window = createWindowObject(CombatArtSupportWindow, this);
        this._textui = root.queryTextUI('default_window');
    },

    setData: function(unit) {        
        var attackCA = CombatArtControl.getAttackCombatArtsArray(unit);
        var actionCA = CombatArtControl.getActionCombatArtsArray(unit);
        var combatArts = attackCA.concat(actionCA);
		this._scrollbar.setObjectArray(combatArts);		
		this._window.setCombatArt(this._scrollbar.getObject());
    },

    getWindowTextUI: function() {
		return this._textui;
	},
	
	setWindowTextUI: function(textui) {
		this._textui = textui;
    },

    _changeTopic: function() {
		var combatArt = this._scrollbar.getObject();
		
		this._window.setCombatArt(combatArt);
	}

})