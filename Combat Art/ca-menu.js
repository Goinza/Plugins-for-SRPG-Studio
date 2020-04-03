CombatArtSelectMenu = defineObject(BaseWindowManager, {

    _unit: null,
    _artList: null,
    _artInfo: null,
    _supportWindow: null,

    setMenuTarget: function(unit) {
        this._unit = unit;

        this._artList = createWindowObject(CombartArtWindow);
        this._artList.setUnit(unit);

        this._artInfo = createWindowObject(CombatArtInfo);
        this._artInfo.setSkill(this._artList.getSelectedArtSkill());

        this._supportWindow = createWindowObject(CombatArtSupport);
        this._supportWindow.setSupportSkill(this._artList.getSelectedArtSkill());
    },

    moveWindowManager: function() {
        var result = this._artList.moveWindow();
        this._artInfo.setSkill(this._artList.getSelectedArtSkill());
        this._supportWindow.setSupportSkill(this._artList.getSelectedArtSkill());

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

    getSelectedArtSkill: function() {
        return this._artList.getSelectedArtSkill();
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

CombartArtWindow = defineObject(BaseWindow, {

    _unit: null,
    _skillList: null,

    setUnit: function(unit) {
        this._unit = unit;

        var artSkills = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "CombatArt");
        var availableArtSkills = this._getAvailableArtSkillsArray(artSkills);

        this._skillList = createScrollbarObject(CombatArtScrollbar, this);
        this._skillList.setScrollFormation(1, 5);
        this._skillList.setObjectArray(availableArtSkills);
        this._skillList.enableSelectCursor(true);
    },

    moveWindowContent: function() {
        var result = MoveResult.CONTINUE;
        var input = this._skillList.moveScrollbarCursor();
        
        if (InputControl.isSelectAction()) {
            result = MoveResult.SELECT;
        }
        else if (InputControl.isCancelAction()) {
            result = MoveResult.CANCEL;
        }

        return result;
    },

    getSelectedArtSkill: function() {
        return this._skillList.getObject();
    },

    drawWindowContent: function(x, y) {
        this._skillList.drawScrollbar(x, y);
    },

    getWindowWidth: function() {
		return this._skillList.getObjectWidth() + (this.getWindowXPadding() * 2);
	},
	
	getWindowHeight: function() {
		return this._skillList.getObjectCount() * this._skillList.getObjectHeight() + (this.getWindowYPadding() * 2);
    },
    
    _getAvailableArtSkillsArray: function(skillArray) {
        var availableArray = [];
        var toAddRemoveSkills, toAddSkill, artSkill;
        
        var dynamicEvent, generator;

        for (var i=0; i<skillArray.length; i++) {
            artSkill = skillArray[i].skill;
            if (CombatArtControl.isUnitAttackable(this._unit, artSkill)) {
                availableArray.push(artSkill);
            }
        }
        return availableArray;
    }

})

CombatArtInfo = defineObject(BaseWindow, {

    _skill: null,

    drawWindowContent: function(x, y) {
        var textui = this.getWindowTextUI();
		var color = textui.getColor();
        var font = textui.getFont();

        var text = this._skill.getDescription();
        var width = ItemRenderer.getItemWidth();
        var height = Math.ceil(TextRenderer.getTextWidth(text, font) / width) * ItemInfoRenderer.getSpaceY();

        var range = createRangeObject(x, y, width, height);
        
        TextRenderer.drawRangeText(range, TextFormat.LEFT, this._skill.getDescription(), -1, color, font);
    },

    setSkill: function(skill) {
        this._skill = skill;
    },

    getWindowWidth: function() {
		return ItemRenderer.getItemWidth() + this.getWindowXPadding()*2;
    },
    
    getWindowHeight: function() {
        var height = this.getWindowYPadding()*2;
        if (this._skill!=null) {
            var text = this._skill.getDescription();
            var textui = this.getWindowTextUI();
            var color = textui.getColor();
            var font = textui.getFont();
            height += Math.ceil(TextRenderer.getTextWidth(text, font) / ItemRenderer.getItemWidth()) * ItemInfoRenderer.getSpaceY();
        }
        return height;
    }

})

CombatArtSupport = defineObject(BaseWindow, {

    _artSkill: null,
    _supportSkill: null,
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
            this._sentences[i].drawSkillSentence(x, y, this._artSkill, this._supportSkill);
            y += this._sentences[i].getSkillSentenceCount(this._artSkill, this._supportSkill) * ItemInfoRenderer.getSpaceY();
        }
    },

    hasSupportSkill: function() {
       return this._supportSkill!=null; 
    },

    setSupportSkill: function(artSkill) {
        this._artSkill = artSkill;
        this._supportSkill = CombatArtControl.getSupportSkill(artSkill);
    },

    getWindowWidth: function() {
		return ItemRenderer.getItemWidth()/2 + this.getWindowXPadding()*2;
    },

    getWindowHeight: function() {
        var height = this.getWindowYPadding()*2;
        if (this._sentences!=null) {
            for (var i=0; i<this._sentences.length; i++) {  
                height += this._sentences[i].getSkillSentenceCount(this._artSkill, this._supportSkill) * ItemInfoRenderer.getSpaceY();
            }
        }

        return height;
    }

})

var BaseSkillSentence = defineObject(BaseObject, {

    moveSkillSentence: function() {
		return MoveResult.CONTINUE;
	},
	
	drawSkillSentence: function(x, y, artSkill, supportSkill) {
	},
	
	getSkillSentenceCount: function(artSkill, supportSkill) {
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

    drawSkillSentence: function(x, y, artSkill, supportSkill) {
        var text = "Cost";
        var cost = artSkill.custom.cost;
		ItemInfoRenderer.drawKeyword(x, y, text);
		x += ItemInfoRenderer.getSpaceX();
		NumberRenderer.drawRightNumber(x, y, cost);
    },
    
    getSkillSentenceCount: function(artSkill, supportSkill) {
        return 1;
    }

})

SupportSentence.Range = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, artSkill, supportSkill) {
        text = root.queryCommand('range_capacity');
		ItemInfoRenderer.drawKeyword(x, y, text);
		x += ItemInfoRenderer.getSpaceX();
		this._drawRange(x, y, artSkill, supportSkill);
    },

    getSkillSentenceCount: function(artSkill, supportSkill) {
		return 1;
    },
    
    _drawRange: function(x, y, artSkill, supportSkill) {
        var startRange = artSkill.custom.startRange;
		var endRange = artSkill.custom.endRange;
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

    drawSkillSentence: function(x, y, artSkill, supportSkill) {
        if (supportSkill!=null) {
            var text;
            var status = supportSkill.getSupportStatus();
            
            if (status.getPower()!=0) {
                text = root.queryCommand('attack_capacity');
                ItemInfoRenderer.drawKeyword(x, y, text);
                x += ItemInfoRenderer.getSpaceX();
                this._drawNumber(x, y, status.getPower());
            }
        }                
	},
	
	getSkillSentenceCount: function(artSkill, supportSkill) {
        if (supportSkill==null) {
            return 0;
        }
        var status = supportSkill.getSupportStatus();
		return status.getPower()!=0 ? 1 : 0;
	}

})

SupportSentence.Hit = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, artSkill, supportSkill) {
        if (supportSkill!=null) {
            var text;
            var status = supportSkill.getSupportStatus();

            if (status.getHit()!=0) {
                text = root.queryCommand('hit_capacity');
                ItemInfoRenderer.drawKeyword(x, y, text);
                x += ItemInfoRenderer.getSpaceX();
                this._drawNumber(x, y, status.getHit());
            }
        }                
    },

    getSkillSentenceCount: function(artSkill, supportSkill) {
        if (supportSkill==null) {
            return 0;
        }
        var status = supportSkill.getSupportStatus();
		return status.getHit()!=0 ? 1 : 0;
	}

})

SupportSentence.Critical = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, artSkill, supportSkill) {
        if (supportSkill!=null) {
            var text;
            var status = supportSkill.getSupportStatus();
    
            if (status.getCritical()) {
                text = root.queryCommand('critical_capacity');
                ItemInfoRenderer.drawKeyword(x, y, text);
                x += ItemInfoRenderer.getSpaceX();
                this._drawNumber(x, y, status.getCritical());  
            }
        }                
    },

    getSkillSentenceCount: function(artSkill, supportSkill) {
        if (supportSkill==null) {
            return 0;
        }
        var status = supportSkill.getSupportStatus();
        return status.getCritical()!=0 ? 1 : 0;
    }

})

SupportSentence.Defense = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, artSkill, supportSkill) {
        if (supportSkill!=null) {
            var text;
            var status = supportSkill.getSupportStatus();
    
            if (status.getDefense()!=0) {
                text = root.queryCommand('def_param');
                ItemInfoRenderer.drawKeyword(x, y, text);
                x += ItemInfoRenderer.getSpaceX();
                this._drawNumber(x, y, status.getDefense());
            } 
        }
               
    },

    getSkillSentenceCount: function(artSkill, supportSkill) {
        if (supportSkill==null) {
            return 0;
        }
        var status = supportSkill.getSupportStatus();
        return status.getDefense()!=0 ? 1 : 0;
    }
})

SupportSentence.Avoid = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, artSkill, supportSkill) {
        if (supportSkill!=null) {
            var text;
            var status = supportSkill.getSupportStatus();
    
            if (status.getAvoid()!=0) {
                text = root.queryCommand('avoid_capacity');
                ItemInfoRenderer.drawKeyword(x, y, text);
                x += ItemInfoRenderer.getSpaceX();
                this._drawNumber(x, y, status.getAvoid());
            }  
        }              
    },

    getSkillSentenceCount: function(artSkill, supportSkill) {
        if (supportSkill==null) {
            return 0;
        }
        var status = supportSkill.getSupportStatus();
        return status.getAvoid()!=0 ? 1 : 0;
    }
})

SupportSentence.CriticalAvoid = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, artSkill, supportSkill) {
        if (supportSkill!=null) {
            var text;
            var status = supportSkill.getSupportStatus();
    
            if (status.getCriticalAvoid()!=0) {
                text = root.queryCommand('critical_capacity') + " " + root.queryCommand('avoid_capacity');
                ItemInfoRenderer.drawKeyword(x, y, text);
                x += ItemInfoRenderer.getSpaceX();
                this._drawNumber(x, y, status.getCriticalAvoid());
            }  
        }              
    },

    getSkillSentenceCount: function(artSkill, supportSkill) {
        if (supportSkill==null) {
            return 0;
        }
        var status = supportSkill.getSupportStatus();
        return status.getCriticalAvoid()!=0 ? 1 : 0;
    }
})

CombatArtScrollbar = defineObject(BaseScrollbar, {
    
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

ArtWeaponSelectMenu = defineObject(WeaponSelectMenu, {

    _currentArtSkill: null,

    setArtSkill: function(skill) {
        this._currentArtSkill = skill;
    },

    _isWeaponAllowed: function(unit, item) {
        var available = ItemControl.isWeaponAvailable(unit, item);

        var weaponType = this._currentArtSkill.custom.weaponType;
        var weaponName = this._currentArtSkill.custom.weaponName;
        var cost = this._currentArtSkill.custom.cost!=null ? this._currentArtSkill.custom.cost : 0;

        var startRange = this._currentArtSkill.custom.startRange;
        var endRange = this._currentArtSkill.custom.endRange;

        var correctType = weaponType!=null ? weaponType==item.getWeaponType().getName() : true;
        var correctWeapon = weaponName!=null ? weaponName==item.getName() : true;
        var durability = cost <= item.getLimit() || item.getLimitMax() === 0;
        
        return available && correctType && correctWeapon && durability;
    }
})