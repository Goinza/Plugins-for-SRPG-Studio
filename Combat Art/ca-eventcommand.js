//Plugin by Goinza

var CombatArtEventCommand = defineObject(BaseEventCommand, {

    _unit: null,
    _combatArt: null,
    _noticeView: null,

    enterEventCommandCycle: function() {
        this._unit = root.getEventCommandObject().getOriginalContent().getUnit();

        var combatArtID = root.getEventCommandObject().getEventCommandArgument().combatArtID;
        this._combatArt = root.getBaseData().getOriginalDataList(TAB_COMBATART).getDataFromId(combatArtID);

        var keyword = root.getEventCommandObject().getOriginalContent().getCustomKeyword();

        this._noticeView = createObject(CombatArtNoticeView);
        this._noticeView.setViewText(this._unit, this._combatArt, keyword);

		return EnterResult.OK;
	},
	
	moveEventCommandCycle: function() {
		if (this._noticeView.moveNoticeView() !== MoveResult.CONTINUE) {
			this.mainEventCommand();
			return MoveResult.END;
        }
		
		return MoveResult.CONTINUE;
	},
	
	drawEventCommandCycle: function() {
        var x = LayoutControl.getCenterX(-1, this._noticeView.getNoticeViewWidth());
		var y = LayoutControl.getCenterY(-1, this._noticeView.getNoticeViewHeight());
		
		this._noticeView.drawNoticeView(x, y);
	},
	
	backEventCommandCycle: function() {
		return MoveResult.CONTNUE;
	},
	
	mainEventCommand: function() {
        var keyword = root.getEventCommandObject().getOriginalContent().getCustomKeyword();
        if (keyword == "Add") {
            CombatArtControl.addCombatArt(this._combatArt, this._unit);
        }
        else if (keyword == "Remove") {
            CombatArtControl.removeCombatArt(this._combatArt, this._unit);
        }        
	},
	
	getEventCommandName: function() {
		// If implement original event command, return the name.
		return 'CombatArtEventCommand';
	}

})

var CombatArtNoticeView = defineObject(BaseNoticeView, {

    _text: null,
    _icon: null,

    setViewText: function(unit, combatArt, keyword) {
        this._text = "";
        if (keyword == "Add") {
            this._text = ADD_COMBAT + combatArt.getName();
        }
        else if (keyword == "Remove") {
            this._text = REMOVE_COMBAT + combatArt.getName();
        }
        this._icon = combatArt.getIconResourceHandle();
    },
	
	drawNoticeViewContent: function(x, y) {
		var textui = this.getTitleTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
        var width = TextRenderer.getTextWidth(this._text, font) + 5;
		
        TextRenderer.drawKeywordText(x, y, this._text, -1, color, font);
        GraphicsRenderer.drawImage(x + width, y, this._icon, GraphicsType.ICON);
    }
    
})