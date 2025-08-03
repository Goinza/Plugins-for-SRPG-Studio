//Plugin by Goinza

(function() {

    var alias01 = MarshalCommandWindow._configureMarshalItem
    MarshalCommandWindow._configureMarshalItem = function(groupArray) {
        alias01.call(this, groupArray)
        groupArray.appendObject(InfirmaryMarshalCommand)
    }

    var alias02 = MarshalScreen.drawScreenCycle
    MarshalScreen.drawScreenCycle = function() {
        var mode = this.getCycleMode()
        var object
        if (mode === MarshalScreenMode.OPEN) {
            object = this._marshalCommandWindow.getObject()
            if (object.getCommandName() == InjurySettings.INFIRMARY_SCREEN_NAME) {
                this._drawLeftWindow()
                this._drawSubWindow()
                this._drawRightWindow()
                object.drawCommand()
                return
            }
        }

        alias02.call(this)
    }

})()

var InfirmaryMarshalCommand = defineObject(MarshalBaseCommand, {

    _questionWindow: null,
    _reviveItemWindow: null,

    initialize: function() {
        this._questionWindow = createWindowObject(QuestionWindow, this)
        this._questionWindow.setQuestionMessage(InjurySettings.INFIRMARY_SCREEN_QUESTION)
        this._reviveItemWindow = createWindowObject(ReviveItemWindow, this)
        this._reviveItemCount = ReviveControl.getReviveItemCount()
	},

    openCommand: function() {
       	this._unitSelectWindow.setActive(true)
		this._unitSelectWindow.setSingleMode() 
        this._setSelectableArray()
    },

    getCommandName: function() {
        return InjurySettings.INFIRMARY_SCREEN_NAME
    },

    getMarshalDescription: function() {
        return InjurySettings.INFIRMARY_SCREEN_DESCRIPTION
    },

    getInfoWindowType: function() {
		return MarshalInfoWindowType.UNIT
	},

    isMarshalScreenCloesed: function() {
		return true;
	},
    
    drawCommand: function() {
        var mode = this.getCycleMode()

        this._drawRevive()

        if (mode == MarshalBaseMode.SCREEN) {
            var width = this._questionWindow.getWindowWidth()
            var height = this._questionWindow.getWindowHeight()
            var x = LayoutControl.getCenterX(-1, width)
            var y = LayoutControl.getCenterY(-1, height)        
            this._questionWindow.drawWindow(x, y)
        }
	},

    _drawRevive: function() {
        var parent = this._parentMarshalScreen
        var width = parent._marshalCommandWindow.getWindowWidth() + parent._unitSelectWindow.getWindowWidth()
        var x = LayoutControl.getCenterX(-1, width)
        var y = parent._getStartY()
        x += parent._marshalCommandWindow.getWindowWidth() + parent._unitSelectWindow.getWindowWidth()
        x -= this._reviveItemWindow.getWindowWidth()
        y -= this._reviveItemWindow.getWindowHeight()

        this._reviveItemWindow.drawWindow(x, y)
    },

    _closeCommand: function() {
        this._unitSelectWindow.getChildScrollbar().setSelectableArray(null)
	},

    _moveUnitSelect: function() {
		var result = this._unitSelectWindow.moveWindow()
		
		if (this._unitSelectWindow.isIndexChanged()) {
			this._parentMarshalScreen.updateSubWindow()
		}
		
		if (result !== MoveResult.CONTINUE) {
            result = MoveResult.CONTINUE
            var unit = this._unitSelectWindow.getFirstUnit()
            if (unit == null) {
                this._closeCommand()
                return MoveResult.END
            }

            if (InjuryControl.isInjured(unit) && this._reviveItemCount > 0) {
                this._unitSelectWindow.setActive(false)
                this.changeCycleMode(MarshalBaseMode.SCREEN)
            }
            else {
                MediaControl.soundDirect('operationblock')
            }
		}		
		return result
	},

    _moveScreen: function() {
        var result = this._questionWindow.moveWindow()
        if (result == MoveResult.END) {
            var answer = this._questionWindow.getQuestionAnswer()
            var unit = this._unitSelectWindow.getFirstUnit()
            if (answer == QuestionAnswer.YES) {
                InjuryControl.removeInjury(unit)
                ReviveControl.useReviveItem()
                this._reviveItemCount--
                this._setSelectableArray()
                this._reviveItemWindow.updateWindow()
            }
            this._unitSelectWindow.setActive(true)
            this.changeCycleMode(MarshalBaseMode.UNITSELECT)
        }        
		
		return MoveResult.CONTINUE
	},

    _setSelectableArray: function() {
		var i, unit
		var list = this._parentMarshalScreen.getUnitList()
		var count = list.getCount()
		var arr = []
		
		for (i = 0; i < count; i++) {
			unit = list.getData(i)
			arr.push(InjuryControl.isInjured(unit))
		}
		
		this._unitSelectWindow.getChildScrollbar().setSelectableArray(arr);
	}

})