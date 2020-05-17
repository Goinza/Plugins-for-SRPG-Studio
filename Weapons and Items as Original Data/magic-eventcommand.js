//Plugin by Goinza

(function() {

    var alias1 = ScriptExecuteEventCommand._configureOriginalEventCommand;
    ScriptExecuteEventCommand._configureOriginalEventCommand = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.appendObject(MagicEventCommand);
    }

})()

var MagicEventMode = {
    WINDOW: 0,
    END: 1
}

var MagicEventCommand = defineObject(BaseEventCommand, {

    _unit: null,
    _spell: null,
    _noticeView: null,
    _mode: null,

    enterEventCommandCycle: function() {
        var originalContent = root.getEventCommandObject().getOriginalContent();
        this._unit = originalContent.getUnit();
        this._spell = root.getBaseData().getOriginalDataList(SpellsConfig.ORIGINAL_DATA_TAB).getDataFromId(originalContent.getValue(0));
        
        this._noticeView = createWindowObject(SpellNoticeView, this);
        this._noticeView.setViewText(this._unit, this._spell);

        this.changeCycleMode(MagicEventMode.WINDOW);

        return EnterResult.OK;
    },

    //I don't like how this function is made, but I don't know how to make it work the way it is usually done in other similar events
    moveEventCommandCycle: function() {
        var mode = this.getCycleMode();
        var result = MoveResult.CONTINUE;

        if (mode==MagicEventMode.WINDOW) {
            if (this._noticeView.moveNoticeView()!=MoveResult.CONTINUE) {
                this.mainEventCommand();
                this.changeCycleMode(1);
                result = MoveResult.END;
            }
        }
        else if (mode==MagicEventMode.END) {
            result = MoveResult.END;
        }
        
        return result;
    },

    drawEventCommandCycle: function() {
        if (this.getCycleMode()==MagicEventMode.WINDOW) {
            var x = LayoutControl.getCenterX(-1, this._noticeView.getNoticeViewWidth());
            var y = LayoutControl.getCenterY(-1, this._noticeView.getNoticeViewHeight());
            this._noticeView.drawNoticeView(x, y);
        }       
    },

    mainEventCommand: function() {
        MagicAttackControl.addSpell(this._unit, this._spell);
    },

    getEventCommandName: function() {
        return "AddSpell";
    },

    isEventCommandSkipAllowed: function() {
		return false;
	}

})

var SpellNoticeView = defineObject(BaseNoticeView, {

    _unit: null,
    _spell: null,
    _text: null,
    _icon: null,

    setViewText: function(unit, originalData) {
        this._unit = unit;
        this._spell = originalData;
        var spellName = originalData.getOriginalContent().getItem().getName();
        this._text = unit.getName() + " learnt " + spellName;
        this._icon = originalData.getOriginalContent().getItem().getIconResourceHandle();
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