//Plugin by Goinza

var CombatArtSelectMenu = defineObject(BaseWindowManager, {

    _unit: null,
    _caWindow: null,
    _infoWindow: null,
    _supportWindow: null,

    setUnit: function(unit) {
        this._unit = unit;
        this._caWindow = createWindowObject(ValidCombatArtWindow);
        this._caWindow.setup(unit);

        var selectedCA = this.getSelectedCombatArt();
        this._infoWindow = createWindowObject(SelectedCombatArtInfoWindow);
        this._infoWindow.setCombatArt(selectedCA);
        this._supportWindow = createWindowObject(CombatArtSupportWindow);
        this._supportWindow.setCombatArt(selectedCA);
    },

    moveWindowManager: function() {
        var result = this._caWindow.moveWindow();
        var selectedCA = this.getSelectedCombatArt();
        this._infoWindow.setCombatArt(selectedCA);
        this._infoWindow.moveWindow();
        this._supportWindow.setCombatArt(selectedCA);
        this._supportWindow.moveWindow();

        return result;
    },

    drawWindowManager: function() {
        var x = this.getPositionWindowX();
        var y = this.getPositionWindowY();
        
        this._caWindow.drawWindow(x, y);
        
        y += this._caWindow.getWindowHeight() + DefineControl.getWindowYPadding();
        this._infoWindow.drawWindow(x, y);

        y = this.getPositionWindowY();

        var leftScreenOverflow = x - this._supportWindow.getWindowWidth() + DefineControl.getWindowXPadding() < 0;

        if (leftScreenOverflow) {
            x += this._caWindow.getWindowWidth() + DefineControl.getWindowXPadding();
        }
        else {
            x -= this._supportWindow.getWindowWidth() + DefineControl.getWindowXPadding();            
        }

        this._supportWindow.drawWindow(x, y);
    },

    getTotalWindowWidth: function() {
        return 350;
    },

    getTotalWindowHeight: function() {
        return 300;
    },

    getPositionWindowX: function() {
		var width = this.getTotalWindowWidth();
		return LayoutControl.getUnitBaseX(this._unit, width);
	},
	
	getPositionWindowY: function() {
		return LayoutControl.getCenterY(-1, 340);
	},

    getSelectedCombatArt: function() {
        return this._caWindow.getSelectedCombatArt();
    }

})

var ValidCombatArtWindow = defineObject(BaseWindow, {

    setup: function(unit) {
        var validCombatArts = CombatArtControl.getValidCombatArtsArray(unit);

        this._createScrollbar(validCombatArts);
    },

    _createScrollbar: function(validCombatArts) {
        this._combatArtScrollbar = createScrollbarObject(CombatArtScrollbar, this);
        this._combatArtScrollbar.setScrollFormation(1, 5);
        this._combatArtScrollbar.setObjectArray(validCombatArts);
        this._combatArtScrollbar.enableSelectCursor(true);
    },

    moveWindowContent: function() {
        var result = MoveResult.CONTINUE;
        var input = this._combatArtScrollbar.moveScrollbarCursor();
        
        if (InputControl.isSelectAction()) {
            result = MoveResult.SELECT;
        }
        else if (InputControl.isCancelAction()) {
            result = MoveResult.CANCEL;
        }

        return result;
    },

    drawWindowContent: function(x, y) {
        this._combatArtScrollbar.drawScrollbar(x, y);
    },

    getWindowWidth: function() {
		return this._combatArtScrollbar.getObjectWidth() + (this.getWindowXPadding() * 2);
	},
	
	getWindowHeight: function() {
		return this._combatArtScrollbar.getObjectCount() * this._combatArtScrollbar.getObjectHeight() + (this.getWindowYPadding() * 2);
    },

    getSelectedCombatArt: function() {
        return this._combatArtScrollbar.getObject();
    }

})

var CombatArtScrollbar = defineObject(BaseScrollbar, {
    
    drawScrollContent: function(x, y, object, isSelect, index) {
        var icon = object.getIconResourceHandle();
        var name = object.getName();

        var textui = this.getParentTextUI();
		var color = textui.getColor();
		var font = textui.getFont();

        GraphicsRenderer.drawImage(x, y, icon, GraphicsType.ICON);
        TextRenderer.drawText(x + 32, y + 2, name, -1, color, font);
    },
    
    getObjectWidth: function() {
		return ItemRenderer.getItemWidth();
	},
	
	getObjectHeight: function() {
		return ItemRenderer.getItemHeight();
    }
        
})

var SelectedCombatArtInfoWindow = defineObject(BaseWindow, {

    _combatArt: null,

    drawWindowContent: function(x, y) {
        var textui = this.getWindowTextUI();
		var color = textui.getColor();
        var font = textui.getFont();
        var text = this._combatArt.getDescription();
        var width = ItemRenderer.getItemWidth();
        var height = Math.ceil(TextRenderer.getTextWidth(text, font) / width) * ItemInfoRenderer.getSpaceY();
        var range = createRangeObject(x, y, width, height);
        
        TextRenderer.drawRangeText(range, TextFormat.LEFT, text, -1, color, font);
    },

    setCombatArt: function(combatArt) {
        this._combatArt = combatArt;
    },

    getWindowWidth: function() {
		return ItemRenderer.getItemWidth() + this.getWindowXPadding()*2;
    },
    
    getWindowHeight: function() {
        var height = this.getWindowYPadding()*2;
        if (this._combatArt!=null) {
            var text = this._combatArt.getDescription();
            var textui = this.getWindowTextUI();
            var font = textui.getFont();
            height += Math.ceil(TextRenderer.getTextWidth(text, font) / ItemRenderer.getItemWidth()) * ItemInfoRenderer.getSpaceY();
        }
        return height;
    }

})

var CombatArtSupportWindow = defineObject(BaseWindow, {

    _combatArt: null,
    _sentences: null,
    
    initialize: function() {
        this._sentences = [];
        this._sentences.push(SupportSentence.Cost);
        this._sentences.push(SupportSentence.Range);
        this._sentences.push(SupportSentence.Requirements);
        //this._sentences.push(SupportSentence.Skills);
        this._sentences.push(SupportSentence.Attack);
        this._sentences.push(SupportSentence.Hit);
        this._sentences.push(SupportSentence.Critical);
        this._sentences.push(SupportSentence.Defense);
        this._sentences.push(SupportSentence.Avoid);
        this._sentences.push(SupportSentence.CriticalAvoid);
    },

    drawWindowContent: function(x, y) {
        for (var i=0; i<this._sentences.length; i++) {
            this._sentences[i].drawSkillSentence(x, y, this._combatArt);
            y += this._sentences[i].getSkillSentenceCount(this._combatArt) * ItemInfoRenderer.getSpaceY();
        }
    },

    setCombatArt: function(combatArt) {
        this._combatArt = combatArt;
    },

    getWindowWidth: function() {
		return ItemRenderer.getItemWidth()/2 + this.getWindowXPadding()*2;
    },

    getWindowHeight: function() {
        var height = this.getWindowYPadding()*2;
        if (this._sentences!=null) {
            for (var i=0; i<this._sentences.length; i++) {  
                height += this._sentences[i].getSkillSentenceCount(this._combatArt) * ItemInfoRenderer.getSpaceY();
            }
        }

        return height;
    }

})