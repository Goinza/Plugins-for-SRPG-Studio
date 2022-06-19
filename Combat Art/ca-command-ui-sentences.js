//Plugin by Goinza

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
            NumberRenderer.drawRightNumberColor(x, y, number, 2, 255);
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
	var obj = CombatArtCost.getCostObject(combatArt);
	if (obj.cost > 0) {
		var dx = ItemInfoRenderer.getSpaceX();
		var dy = ItemInfoRenderer.getSpaceY();
		var text = "Cost";
		var obj = CombatArtCost.getCostObject(combatArt);
		ItemInfoRenderer.drawKeyword(x, y, obj.costType);
		ItemInfoRenderer.drawKeyword(x, y + dy, text);
		NumberRenderer.drawRightNumber(x + dx, y + dy, obj.cost);	
	}
        
    },
    
    getSkillSentenceCount: function(combatArt) {
        var obj = CombatArtCost.getCostObject(combatArt);
        return obj.cost > 0 ? 2 : 0;
    }

})

SupportSentence.Range = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, combatArt) {
        var obj = CombatArtRange.getCustomRangeObject(combatArt);
        if (obj.startRange > 0 && obj.endRange > 0) {
            text = root.queryCommand('range_capacity');
            ItemInfoRenderer.drawKeyword(x, y, text);
            x += ItemInfoRenderer.getSpaceX();
            this._drawRange(x, y, obj);
        }        
    },

    getSkillSentenceCount: function(combatArt) {
		return combatArt.custom.startRange!=null && combatArt.custom.endRange!=null ? 1 : 0;
    },
    
    _drawRange: function(x, y, ranges) {
        var startRange = ranges.startRange;
		var endRange = ranges.endRange;
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

SupportSentence.Requirements = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, combatArt) {
        var allowedWeaponTypes = CombatArtValidator.getAllowedWeaponTypes(combatArt);
        var allowedWeapons = CombatArtValidator.getAllowedWeapons(combatArt);
        var text = root.queryCommand('only_capacity');

        if (allowedWeaponTypes.length > 0) {
            ItemInfoRenderer.drawKeyword(x, y, text);
            x += ItemInfoRenderer.getSpaceX();
            this._drawList(x, y, allowedWeaponTypes);
        }
        else if (allowedWeapons.length > 0) {
            ItemInfoRenderer.drawKeyword(x, y, text);
            x += ItemInfoRenderer.getSpaceX();
            this._drawList(x, y, allowedWeapons);
        }

    },

    getSkillSentenceCount: function(combatArt) {
        var allowedWeaponTypes = CombatArtValidator.getAllowedWeaponTypes(combatArt);
        var allowedWeapons = CombatArtValidator.getAllowedWeapons(combatArt);
        var count = allowedWeaponTypes.length > allowedWeapons.length ? allowedWeaponTypes.length : allowedWeapons.length;
        return count;
    },

    _drawList: function(x, y, array) {
		var i, obj, name;
		var count = array.length;
		var textui = ItemInfoRenderer.getTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		
		for (i = 0 ; i < count; i++) {
			obj = array[i];
			name = obj.getName();			
			TextRenderer.drawKeywordText(x, y, name, -1, color, font);
			y += ItemInfoRenderer.getSpaceY();
		}
	}

})

SupportSentence.Skills = defineObject(BaseSkillSentence, {

    drawSkillSentence: function(x, y, combatArt) {
        var skills = CombatArtSkills.getCombatArtSkillsArray(combatArt);
        if (skills.length > 0) {
            var text = root.queryCommand('skill_object');
            ItemInfoRenderer.drawKeyword(x, y, text);
            x += ItemInfoRenderer.getSpaceX();
            this._drawList(x, y, skills);
        }
    },

    getSkillSentenceCount: function(combatArt) {
        var skills = CombatArtSkills.getCombatArtSkillsArray(combatArt);
        return skills.length;
    },

    _drawList: function(x, y, array) {
		var i, obj, name;
		var count = array.length;
		var textui = ItemInfoRenderer.getTextUI();
		var color = textui.getColor();
		var font = textui.getFont();
		
		for (i = 0 ; i < count; i++) {
			obj = array[i];
			name = obj.getName();			
			TextRenderer.drawKeywordText(x, y, name, -1, color, font);
			y += ItemInfoRenderer.getSpaceY();
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
