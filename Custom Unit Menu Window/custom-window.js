//Plugin by Goinza

var CustomHelpMode = {
    TOPLEFT: 0,
    TOPRIGHT: 1,
    BOTTOMLEFT: 2,
    BOTTOMRIGHT: 3
}

var CustomBottomUnitWindow = defineObject(BaseMenuBottomWindow, {

    _topLeftInteraction: null,
    _topRightInteraction: null,
    _bottomLeftInteraction: null,
    _bottomRightInteraction: null,
    _unitMenuHelp: 0,
    _index: 0,

    setUnitMenuData: function() {
        this._topLeftInteraction = createObject(Options.TOPLEFT[this._index]);
        this._topRightInteraction = createObject(Options.TOPRIGHT[this._index]);
        this._bottomLeftInteraction = createObject(Options.BOTTOMLEFT[this._index]);       
        this._bottomRightInteraction = createObject(Options.BOTTOMRIGHT[this._index]);
	},
	
	changeUnitMenuTarget: function(unit) {
        this._topLeftInteraction.setUnitData(unit);
        this._topRightInteraction.setUnitData(unit);
        this._bottomLeftInteraction.setUnitData(unit);
        this._bottomRightInteraction.setUnitData(unit);
	},
	
	moveWindowContent: function() {
        this._topLeftInteraction.moveInteraction();
        this._topRightInteraction.moveInteraction();
        this._bottomLeftInteraction.moveInteraction();
        this._bottomRightInteraction.moveInteraction();

        if (this._topLeftInteraction.isTracingHelp() && this._unitMenuHelp != CustomHelpMode.TOPLEFT && !this._topRightInteraction.isTracingHelp()) {
            this._unitMenuHelp = CustomHelpMode.TOPLEFT;
            this._topRightInteraction.cancelInteraction();
            this._bottomLeftInteraction.cancelInteraction();
            this._bottomRightInteraction.cancelInteraction();
            this.setHelpMode();
        }
        else if (this._topRightInteraction.isTracingHelp() && this._unitMenuHelp != CustomHelpMode.TOPRIGHT && !this._topLeftInteraction.isTracingHelp()) {
            this._unitMenuHelp = CustomHelpMode.TOPRIGHT;
            this._topLeftInteraction.cancelInteraction();
            this._bottomLeftInteraction.cancelInteraction();
            this._bottomRightInteraction.cancelInteraction();
            this.setHelpMode();            
        }
        else if (this._bottomLeftInteraction.isTracingHelp() && this._unitMenuHelp != CustomHelpMode.BOTTOMLEFT) {
            this._unitMenuHelp = CustomHelpMode.BOTTOMLEFT;
            this._topLeftInteraction.cancelInteraction();
            this._topRightInteraction.cancelInteraction();
            this._bottomRightInteraction.cancelInteraction();
            this.setHelpMode();
        }
        else if (this._bottomRightInteraction.isTracingHelp() && this._unitMenuHelp != CustomHelpMode.BOTTOMRIGHT) {
            this._unitMenuHelp = CustomHelpMode.BOTTOMRIGHT;
            this._topLeftInteraction.cancelInteraction();
            this._topRightInteraction.cancelInteraction();
            this._bottomLeftInteraction.cancelInteraction();
            this.setHelpMode();
        }   

        if (this.isHelpMode()) {
            if (this._unitMenuHelp == CustomHelpMode.TOPLEFT) {
                this._moveTopLeft();
            }
            else if (this._unitMenuHelp == CustomHelpMode.TOPRIGHT) {
                this._moveTopRight();
            }
            else if (this._unitMenuHelp == CustomHelpMode.BOTTOMLEFT) {
                this._moveBottomLeft();
            }
            else if (this._unitMenuHelp == CustomHelpMode.BOTTOMRIGHT) {
                this._moveBottomRight();
            }
            else {
                root.log("Hola");
            }
		}       

		return MoveResult.CONTINUE;
	},
	
	drawWindowContent: function(x, y) {
        var width = ItemRenderer.getItemWidth();
        var height = (DefineControl.getVisibleUnitItemCount() + 1) * ItemRenderer.getItemHeight() + Options.SECTION_DISTANCE;

        this._drawTopLeft(x, y);
        this._drawTopRight(x + width, y);
        this._drawBottomLeft(x, y + height);
        this._drawBottomRight(x + width, y + height);
        this._drawHelpWindow(x, y, width);
	},
	
	setHelpMode: function() {
        var isHelp = false;
        switch (this._unitMenuHelp) {
            case CustomHelpMode.TOPLEFT:
                this._topLeftInteraction.setHelpMode();
                isHelp = true;
                break;
            case CustomHelpMode.TOPRIGHT:
                this._topRightInteraction.setHelpMode();
                isHelp = true;
                break;
            case CustomHelpMode.BOTTOMLEFT:
                this._bottomLeftInteraction.setHelpMode();
                isHelp = true;
                break;
            case CustomHelpMode.BOTTOMRIGHT:
                this._bottomRightInteraction.setHelpMode();
                isHelp = true;
                break;        
        }
        if (isHelp) {
            this.getParentInstance().changeCycleMode(UnitMenuMode.HELP);
        }
        return isHelp;
	},
	
	isHelpMode: function() {
        return this._topLeftInteraction.isHelpMode() || this._topRightInteraction.isHelpMode()
            || this._bottomLeftInteraction.isHelpMode() || this._bottomRightInteraction.isHelpMode();
	},
	
	isTracingHelp: function() {
        return this._topLeftInteraction.isTracingHelp() || this._topRightInteraction.isTracingHelp()
            || this._bottomLeftInteraction.isTracingHelp() || this._bottomRightInteraction.isTracingHelp();
    },   
	
	getHelpText: function() {
        var text = "";

        if (this._unitMenuHelp == CustomHelpMode.TOPLEFT) {
            text = this._topLeftInteraction.getHelpText();
        }
        else if (this._unitMenuHelp == CustomHelpMode.TOPRIGHT) {
            text = this._topRightInteraction.getHelpText();
        }
        else if (this._unitMenuHelp == CustomHelpMode.BOTTOMLEFT) {
            text = this._bottomLeftInteraction.getHelpText();
        }
        else if (this._unitMenuHelp == CustomHelpMode.BOTTOMRIGHT) {
            text = this._bottomRightInteraction.getHelpText();
        }

		return text;
    },

    setIndex: function(newIndex) {
        this._index = newIndex;
    },

    lockTracing: function(isLocked) {
	},

    _moveTopLeft: function() {
        var recentlyInput = this._topLeftInteraction.getInteractionScrollbar().getRecentlyInputType();
        if (this._topRightInteraction.isHelpAvailable() && (recentlyInput === InputType.LEFT || recentlyInput === InputType.RIGHT)) {
            this._topLeftInteraction.cancelInteraction();
            this._unitMenuHelp = CustomHelpMode.TOPRIGHT;
            this._topRightInteraction.setHelpMode();
        }
        else if (this._bottomLeftInteraction.isHelpAvailable()) {
            var scrollbar = this._topLeftInteraction.getInteractionScrollbar();
            var index = scrollbar.getIndex();
            var maxIndex = scrollbar.getObjectCount() - 1;
            var start = index==0 && recentlyInput==InputType.DOWN; //Cusor moved down and it end up in the first index
            var end = index==maxIndex && recentlyInput==InputType.UP; //Cursor moved up and it end up in the last index
            if (start || end) {
                if (end) {
                    scrollbar.setIndex(0);
                }
                this._topLeftInteraction.cancelInteraction();
                this._unitMenuHelp = CustomHelpMode.BOTTOMLEFT;
                this._bottomLeftInteraction.setHelpMode();
            }
        }
    },

    _moveTopRight: function() {
        var recentlyInput = this._topRightInteraction.getInteractionScrollbar().getRecentlyInputType();
        if (this._topLeftInteraction.isHelpAvailable() && (recentlyInput === InputType.LEFT || recentlyInput === InputType.RIGHT)) {
            this._topRightInteraction.cancelInteraction();
            this._unitMenuHelp = CustomHelpMode.TOPLEFT;
            this._topLeftInteraction.setHelpMode();
        }  
        else if (this._bottomRightInteraction.isHelpAvailable()) {
            var scrollbar = this._topRightInteraction.getInteractionScrollbar();
            var index = scrollbar.getIndex();
            var maxIndex = scrollbar.getObjectCount() - 1;
            var start = index==0 && recentlyInput==InputType.DOWN; //Cusor moved down and it end up in the first index
            var end = index==maxIndex && recentlyInput==InputType.UP; //Cursor moved up and it end up in the last index
            if (start || end) {
                if (end) {
                    scrollbar.setIndex(0);
                }
                this._topRightInteraction.cancelInteraction();
                this._unitMenuHelp = CustomHelpMode.BOTTOMRIGHT;
                this._bottomRightInteraction.setHelpMode();
            }
        }      
    },

    _moveBottomLeft: function() {
        var recentlyInput = this._bottomLeftInteraction.getInteractionScrollbar().getRecentlyInputType();
        if (this._topLeftInteraction.isHelpAvailable() && (recentlyInput === InputType.UP || recentlyInput === InputType.DOWN)) {
            this._bottomLeftInteraction.cancelInteraction();
            this._unitMenuHelp = CustomHelpMode.TOPLEFT;
            this._topLeftInteraction.setHelpMode();
        }
        else if (this._bottomRightInteraction.isHelpAvailable()) {
            var scrollbar = this._bottomLeftInteraction.getInteractionScrollbar();
            var index = scrollbar.getIndex();
            var maxIndex = scrollbar.getObjectCount() - 1;
            var start = index==0 && recentlyInput==InputType.RIGHT; //Cusor moved left and it end up in the first index
            var end = index==maxIndex && recentlyInput==InputType.LEFT; //Cursor moved right and it end up in the last index
            if (start || end) {
                if (end) {
                    scrollbar.setIndex(0);
                }
                this._bottomLeftInteraction.cancelInteraction();
                this._unitMenuHelp = CustomHelpMode.BOTTOMRIGHT;
                this._bottomRightInteraction.setHelpMode();
            }
        } 
    },

    _moveBottomRight: function() {
        var recentlyInput = this._bottomRightInteraction.getInteractionScrollbar().getRecentlyInputType();
        if (this._topRightInteraction.isHelpAvailable() && (recentlyInput === InputType.UP || recentlyInput === InputType.DOWN)) {
            this._bottomRightInteraction.cancelInteraction();
            this._unitMenuHelp = CustomHelpMode.TOPRIGHT;
            this._topRightInteraction.setHelpMode();
        }
        else if (this._bottomLeftInteraction.isHelpAvailable()) {
            var scrollbar = this._bottomRightInteraction.getInteractionScrollbar();
            var index = scrollbar.getIndex();
            var maxIndex = scrollbar.getObjectCount() - 1;
            var start = index==0 && recentlyInput==InputType.RIGHT; //Cusor moved left and it end up in the first index
            var end = index==maxIndex && recentlyInput==InputType.LEFT; //Cursor moved right and it end up in the last index
            if (start || end) {
                if (end) {
                    scrollbar.setIndex(0);
                }
                this._bottomRightInteraction.cancelInteraction();
                this._unitMenuHelp = CustomHelpMode.BOTTOMLEFT;
                this._bottomLeftInteraction.setHelpMode();
            }
        } 
    },
    
    _drawTopLeft: function(x, y) {
        var textui = this.getWindowTextUI();
        var font = textui.getFont();
        var title = this._topLeftInteraction.getTitle();

        TextRenderer.drawText(x, y - 5, title, -1, ColorValue.KEYWORD, font);

        this._topLeftInteraction.getInteractionScrollbar().drawScrollbar(x, y + 20);
    },

    _drawTopRight: function(x, y) {
        var textui = this.getWindowTextUI();
        var font = textui.getFont();
        var title = this._topRightInteraction.getTitle();

        TextRenderer.drawText(x, y - 5, title, -1, ColorValue.KEYWORD, font);

        this._topRightInteraction.getInteractionScrollbar().drawScrollbar(x, y + 20);
    },

    _drawBottomLeft: function(x, y) {
        var textui = this.getWindowTextUI();
        var font = textui.getFont();
        var title = this._bottomLeftInteraction.getTitle();

        TextRenderer.drawText(x, y, title, -1, ColorValue.KEYWORD, font);

        this._bottomLeftInteraction.getInteractionScrollbar().drawScrollbar(x, y + 22);
    },

    _drawBottomRight: function(x, y) {
        var textui = this.getWindowTextUI();
        var font = textui.getFont();
        var title = this._bottomRightInteraction.getTitle();

        TextRenderer.drawText(x, y, title, -1, ColorValue.KEYWORD, font);

        this._bottomRightInteraction.getInteractionScrollbar().drawScrollbar(x, y + 22);
    },

    _drawHelpWindow: function(x, y, dx) {
        if (this.isHelpMode()) {
            if (this._unitMenuHelp == CustomHelpMode.TOPLEFT && this._topLeftInteraction.hasWindow()) {
                this._topLeftInteraction.getInteractionWindow().drawWindow(x + dx, y);
            }
            else if (this._unitMenuHelp == CustomHelpMode.TOPRIGHT && this._topRightInteraction.hasWindow()) {
                this._topRightInteraction.getInteractionWindow().drawWindow(x, y);
            }
            else if (this._unitMenuHelp == CustomHelpMode.BOTTOMLEFT && this._bottomLeftInteraction.hasWindow()) {
                this._bottomLeftInteraction.getInteractionWindow().drawWindow(x + dx, y);
            }
            else if (this._unitMenuHelp == CustomHelpMode.BOTTOMRIGHT && this._bottomRightInteraction.hasWindow()) {
                this._bottomRightInteraction.getInteractionWindow().drawWindow(x, y);
            }
        }
       
    }

})