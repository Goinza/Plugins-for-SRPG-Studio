//Plugin by Goinza

(function() {

    var alias1 = ScriptExecuteEventCommand._configureOriginalEventCommand;
    ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.appendObject(TraitEventCommand);
    }

})()

var TraitEventCommand = defineObject(BaseEventCommand, {

    _unit: null,
    _traitID: null,
    _noticeView: null,

    enterEventCommandCycle: function() {
        this._unit = root.getEventCommandObject().getOriginalContent().getUnit();

        this._traitID = root.getEventCommandObject().getOriginalContent().getValue(0);

        this._noticeView = createObject(TraitNoticeView);
        this._noticeView.setViewText(this._unit, this._traitID);

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
    
    mainEventCommand: function() {
        TraitControl.addUnitTrait(this._unit, this._traitID);
    },

    getEventCommandName: function() {
        return 'AddTrait';
    }

})

var TraitNoticeView = defineObject(BaseNoticeView, {

    _text: null,
    _icon: null,

    setViewText: function(unit, traitID) {
        var trait = TraitControl.getTraitFromId(traitID);
        this._text = "Added " + trait.getName();
        this._icon = trait.getIconResourceHandle();
    },
	
	drawNoticeViewContent: function(x, y) {
		var textui = this.getTitleTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
        
        var dx = 0;
        if (!this._icon.isNullHandle()) {
            GraphicsRenderer.drawImage(x, y, this._icon, GraphicsType.ICON);
            dx += 32;
        }
        TextRenderer.drawKeywordText(x + dx, y, this._text, -1, color, font);
    }
    
})