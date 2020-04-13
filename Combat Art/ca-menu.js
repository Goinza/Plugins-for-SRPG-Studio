//Plugin by Goinza

var CombatArtSelectMenu = defineObject(BaseWindowManager, {

    _unit: null,
    _artList: null,
    _artInfo: null,
    _supportWindow: null,

    setMenuTarget: function(unit) {
        this._unit = unit;

        this._artList = createWindowObject(CombatArtWindow);
        this._artList.setUnit(unit);

        this._artInfo = createWindowObject(CombatArtInfo);
        this._artInfo.setCombatArt(this._artList.getSelectedCombatArt());

        this._supportWindow = createWindowObject(CombatArtSupport);
        this._supportWindow.setCombatArt(this._artList.getSelectedCombatArt());
    },

    moveWindowManager: function() {
        var result = this._artList.moveWindow();
        this._artInfo.setCombatArt(this._artList.getSelectedCombatArt());
        this._supportWindow.setCombatArt(this._artList.getSelectedCombatArt());

        return result;
    },

    drawWindowManager: function() {
        var x = this.getPositionWindowX();
        var y = this.getPositionWindowY();

        this._artList.drawWindow(x, y);
        y += this._artList.getWindowHeight();
        this._artInfo.drawWindow(x, y)

        x += this._artList.getWindowWidth();
        y = this.getPositionWindowY();
        this._supportWindow.drawWindow(x, y);
        
    },

    getSelectedCombatArt: function() {
        return this._artList.getSelectedCombatArt();
    },

    getTotalWindowWidth: function() {
		return this._artList.getWindowWidth() + this._supportWindow.getWindowWidth();
	},
	
	getTotalWindowHeight: function() {
        var height1 = this._artList.getWindowHeight() + this._artInfo.getWindowHeight();
        var height2 = this._supportWindow.getWindowHeight();
		return Math.max(height1, height2);
	},
	
	getPositionWindowX: function() {
		var width = this.getTotalWindowWidth();
		return LayoutControl.getUnitBaseX(this._unit, width);
	},
	
	getPositionWindowY: function() {
		return LayoutControl.getCenterY(-1, 340);
	}

})

var CombatArtWindow = defineObject(BaseWindow, {

    _unit: null,
    _combatArtScrollbar: null,

    setUnit: function(unit) {
        this._unit = unit;

        var artSkills = CombatArtControl.getCombatArtsArray(unit);
        var availableArtSkills = this._getAvailableArtSkillsArray(artSkills);

        this._combatArtScrollbar = createScrollbarObject(CombatArtScrollbar, this);
        this._combatArtScrollbar.setScrollFormation(1, 5);
        this._combatArtScrollbar.setObjectArray(availableArtSkills);
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

    getSelectedCombatArt: function() {
        return this._combatArtScrollbar.getObject();
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
    
    _getAvailableArtSkillsArray: function(skillArray) {
        var availableArray = [];
        var toAddRemoveSkills, toAddSkill, combatArt;
        
        var dynamicEvent, generator;

        for (var i=0; i<skillArray.length; i++) {
            combatArt = skillArray[i];
            if (CombatArtControl.isUnitAttackable(this._unit, combatArt)) {
                availableArray.push(combatArt);
            }
        }
        return availableArray;
    }

})

var CombatArtInfo = defineObject(BaseWindow, {

    _combatArt: null,

    drawWindowContent: function(x, y) {
        var textui = this.getWindowTextUI();
		var color = textui.getColor();
        var font = textui.getFont();

        var text = this._combatArt.getDescription();
        var width = ItemRenderer.getItemWidth();
        var height = Math.ceil(TextRenderer.getTextWidth(text, font) / width) * ItemInfoRenderer.getSpaceY();

        var range = createRangeObject(x, y, width, height);
        
        TextRenderer.drawRangeText(range, TextFormat.LEFT, this._combatArt.getDescription(), -1, color, font);
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
            var color = textui.getColor();
            var font = textui.getFont();
            height += Math.ceil(TextRenderer.getTextWidth(text, font) / ItemRenderer.getItemWidth()) * ItemInfoRenderer.getSpaceY();
        }
        return height;
    }

})

var CombatArtSupport = defineObject(BaseWindow, {

    _combatArt: null,
    _sentences: null,
    
    initialize: function() {
        this._sentences = [];
        this._sentences.push(SupportSentence.Cost);
        this._sentences.push(SupportSentence.Range);
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

var BaseSkillSentence = defineObject(BaseObject, {

    moveSkillSentence: function() {
		return MoveResult.CONTINUE;
	},
	
	drawSkillSentence: function(x, y, combatArt) {
	},
	
	getSkillSentenceCount: function(combatArt) {
		return 0;
    },
    
    _drawNumber: function(x, y, number) {
        if (number>0) {
            NumberRenderer.drawRightNumberColor(x, y, number, 1, 255);
        }
        else {
            number *= -1;
            NumberRenderer.drawRightNumberColor(x, y, number, 3, 255);
        }
    }

})

var SupportSentence = {};

SupportSentence.Cost = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, combatArt) {
        var text = "Cost";
        var cost = CombatArtControl.getCost(combatArt);
		ItemInfoRenderer.drawKeyword(x, y, text);
		x += ItemInfoRenderer.getSpaceX();
		NumberRenderer.drawRightNumber(x, y, cost);
    },
    
    getSkillSentenceCount: function(combatArt) {
        return 1;
    }

})

SupportSentence.Range = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, combatArt) {
        if (combatArt.custom.startRange!=null && combatArt.custom.endRange!=null) {
            text = root.queryCommand('range_capacity');
            ItemInfoRenderer.drawKeyword(x, y, text);
            x += ItemInfoRenderer.getSpaceX();
            this._drawRange(x, y, CombatArtControl.getRanges(combatArt));
        }        
    },

    getSkillSentenceCount: function(combatArt) {
		return combatArt.custom.startRange!=null && combatArt.custom.endRange!=null ? 1 : 0;
    },
    
    _drawRange: function(x, y, ranges) {
        var startRange = ranges.start;
		var endRange = ranges.end;
		var textui = root.queryTextUI('default_window');
		var color = textui.getColor();
		var font = textui.getFont();
		
		if (startRange === endRange) {
			NumberRenderer.drawRightNumber(x, y, startRange);
		}
		else {
			NumberRenderer.drawRightNumber(x, y, startRange);
			TextRenderer.drawKeywordText(x + 17, y, StringTable.SignWord_WaveDash, -1, color, font);
			NumberRenderer.drawRightNumber(x + 40, y, endRange);
		}
    }
})

SupportSentence.Attack = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, combatArt) {
        var text;
        var pow = combatArt.getOriginalContent().getValue(0);
        
        if (pow!=0) {
            text = root.queryCommand('attack_capacity');
            ItemInfoRenderer.drawKeyword(x, y, text);
            x += ItemInfoRenderer.getSpaceX();
            this._drawNumber(x, y, pow);
        }             
	},
	
	getSkillSentenceCount: function(combatArt) {
		return combatArt.getOriginalContent().getValue(0)!=0 ? 1 : 0;
	}

})

SupportSentence.Hit = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, combatArt) {
        var text;
        var hit = combatArt.getOriginalContent().getValue(1);

        if (hit!=0) {
            text = root.queryCommand('hit_capacity');
            ItemInfoRenderer.drawKeyword(x, y, text);
            x += ItemInfoRenderer.getSpaceX();
            this._drawNumber(x, y, hit);
        }
                      
    },

    getSkillSentenceCount: function(combatArt) {
        return combatArt.getOriginalContent().getValue(1)!=0 ? 1 : 0;
	}

})

SupportSentence.Critical = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, combatArt) {
        var text;
        var crit = combatArt.getOriginalContent().getValue(2);

        if (crit!=0) {
            text = root.queryCommand('critical_capacity');
            ItemInfoRenderer.drawKeyword(x, y, text);
            x += ItemInfoRenderer.getSpaceX();
            this._drawNumber(x, y, crit);  
        }               
    },

    getSkillSentenceCount: function(combatArt) {
        return combatArt.getOriginalContent().getValue(2)!=0 ? 1 : 0;
    }

})

SupportSentence.Defense = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, combatArt) {
        var text;
        var def = combatArt.getOriginalContent().getValue(3);

        if (def!=0) {
            text = root.queryCommand('def_param');
            ItemInfoRenderer.drawKeyword(x, y, text);
            x += ItemInfoRenderer.getSpaceX();
            this._drawNumber(x, y, def);
        } 
               
    },

    getSkillSentenceCount: function(combatArt) {
        return combatArt.getOriginalContent().getValue(3)!=0 ? 1 : 0;
    }
})

SupportSentence.Avoid = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, combatArt) {
        var text;
        var avo = combatArt.getOriginalContent().getValue(4);

        if (avo!=0) {
            text = root.queryCommand('avoid_capacity');
            ItemInfoRenderer.drawKeyword(x, y, text);
            x += ItemInfoRenderer.getSpaceX();
            this._drawNumber(x, y, avo);
        }        
    },

    getSkillSentenceCount: function(combatArt) {
        return combatArt.getOriginalContent().getValue(4)!=0 ? 1 : 0;
    }
})

SupportSentence.CriticalAvoid = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, combatArt) {
        var text;
        var critAvo = combatArt.getOriginalContent().getValue(5);

        if (critAvo!=0) {
            text = root.queryCommand('critical_capacity') + " " + root.queryCommand('avoid_capacity');
            ItemInfoRenderer.drawKeyword(x, y, text);
            x += ItemInfoRenderer.getSpaceX();
            this._drawNumber(x, y, critAvo);
        }             
    },

    getSkillSentenceCount: function(combatArt) {
        return combatArt.getOriginalContent().getValue(5)!=0 ? 1 : 0;
    }
})

var CombatArtScrollbar = defineObject(BaseScrollbar, {
    
    drawScrollContent: function(x, y, object, isSelect, index) {
        var skill = object;
        var icon = skill.getIconResourceHandle();
        var name = skill.getName();

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

var ArtWeaponSelectMenu = defineObject(WeaponSelectMenu, {

    _currentCombatArt: null,

    getCombatArt: function() {
        return this._currentCombatArt;
    },

    setCombatArt: function(combatArt) {
        this._currentCombatArt = combatArt;
    },

    _isWeaponAllowed: function(unit, item) {
        var available = ItemControl.isWeaponAvailable(unit, item);
        
        return available && CombatArtControl.isWeaponAllowed(this._currentCombatArt, item);
    }
})