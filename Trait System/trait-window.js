//Plugin by Goinza

(function() {
    var alias1 = UnitMenuScreen._configureBottomWindows;
    UnitMenuScreen._configureBottomWindows = function(groupArray) {
        alias1.call(this, groupArray);
        if (TraitsConfig.ENABLE_WINDOW) {
            groupArray.appendWindowObject(TraitWindow, this);
        }
    }
})()

var TraitWindow = defineObject(BaseMenuBottomWindow, {

    _unit: null,
    _traitInteraction: null,
    
    setUnitMenuData: function() {
		this._traitInteraction = createObject(TraitInteraction);
    },
    
    changeUnitMenuTarget: function(unit) {
		this._unit = unit;
		this._unitMenuHelp = 0;
		
		this._traitInteraction.setData(unit);
		this._traitInteraction.setWindowTextUI(this.getWindowTextUI());		
		this._traitInteraction.checkInitialTopic();
    },
    
    moveWindowContent: function() {
        this._traitInteraction.moveInteraction();
        return MoveResult.CONTINUE;
    },

    drawWindowContent: function(x, y) {
        var textui = root.queryTextUI('extraname_title');
		var color = textui.getColor();
		var font = textui.getFont();
		TextRenderer.drawText(x + ItemRenderer.getItemWidth()*3/4, y, TraitsConfig.MENU_TITLE, 15, color, font);
		this._traitInteraction.getInteractionScrollbar().drawScrollbar(x, y + 40);
    },

    setHelpMode: function() {
        this._traitInteraction.setHelpMode();		
		return true;
	},

    isHelpMode: function() {
        return this._traitInteraction.isHelpMode();
    },

    getHelpText: function() {
		return this._traitInteraction.getHelpText();
	}

})

var TraitInteraction = defineObject(BaseInteraction,
    {
        _textui: null,
        
        initialize: function() {
            this._scrollbar = createScrollbarObject(TraitScrollbar, this);
            this._scrollbar.setScrollFormation(2, DefineControl.getVisibleUnitItemCount());
        },
        
        setData: function(unit) {
            var unitTraits = TraitControl.getTraitsArray(unit);
            var traitArray = [];
            var i;
            for (i=0; i<unitTraits.length; i++) {
                traitArray.push(TraitControl.getTraitFromId(unitTraits[i]));
            }
            
            this._scrollbar.setObjectArray(traitArray);

        },
        
        getWindowTextUI: function() {
            return this._textui;
        },
        
        setWindowTextUI: function(textui) {
            this._textui = textui;
        },

        getHelpText: function() {
            var item = this._scrollbar.getObject();
            
            return item.getDescription();
        },
        
        _changeTopic: function() {
            var item = this._scrollbar.getObject();
        }
    }
)

var TraitScrollbar = defineObject(BaseScrollbar, {

    drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = root.queryTextUI('extraitem_title');
		var color = textui.getColor();
		var font = textui.getFont();
        var handle = object.getIconResourceHandle();
		var length = 20;
		
		GraphicsRenderer.drawImage(x, y, handle, GraphicsType.ICON);
		x += 30;
		
		TextRenderer.drawKeywordText(x, y, object.getName(), length, color, font);
    },

    drawDescriptionLine: function(x, y) {
    },

    getObjectWidth: function() {
		return TraitWindow.getWindowWidth()/2;
	},
	
	getObjectHeight: function() {
		return 20;
	}

})