//Plugin by Goinza

var TopSkillInteraction = defineObject(TopCustomInteraction, {

    getTitle: function() {
        return SKILLS_TITLE;
    },

    getScrollbarObject: function() {
        return TopSkillScrollbar;
    },

    getWindowObject: function() {
        return SkillInfoWindow;
    },
    
    getHelpText: function() {
		var skill = this._scrollbar.getObject().skill;
		
		return skill.getDescription();
    },
    
    _changeTopic: function() {
		var skillEntry = this._scrollbar.getObject();
		
		this._window.setSkillInfoData(skillEntry.skill, skillEntry.objecttype);
	}

})

var BottomSkillInteraction = defineObject(BottomCustomInteraction, {

    getTitle: function() {
        return SKILLS_TITLE;
    },

    getScrollbarObject: function() {
        return BottomSkillScrollbar;
    },

    getWindowObject: function() {
        return SkillInfoWindow;
    },    
    
    getHelpText: function() {
		var skill = this._scrollbar.getObject().skill;
		
		return skill.getDescription();
	},
    
    _changeTopic: function() {
		var skillEntry = this._scrollbar.getObject();
		
		this._window.setSkillInfoData(skillEntry.skill, skillEntry.objecttype);
	}

})

var TopSkillScrollbar = defineObject(TopCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var i;
		var weapon = ItemControl.getEquippedWeapon(unit);
		var arr = SkillControl.getSkillMixArray(unit, weapon, -1, '');
		var count = arr.length;
		var newSkillArray = [];
		
		for (i = 0; i < count; i++) {
			if (!arr[i].skill.isHidden()) {
				newSkillArray.push(arr[i]);
			}
        }
        
        this.setObjectArray(newSkillArray);
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        var skill = object.skill;
        var handle = skill.getIconResourceHandle();
        var name = skill.getName();
		
        GraphicsRenderer.drawImage(x, y, handle, GraphicsType.ICON);
        TextRenderer.drawKeywordText(x + 32, y, name, -1, color, font);
    }

})

var BottomSkillScrollbar = defineObject(BottomCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var i;
		var weapon = ItemControl.getEquippedWeapon(unit);
		var arr = SkillControl.getSkillMixArray(unit, weapon, -1, '');
		var count = arr.length;
		var newSkillArray = [];
		
		for (i = 0; i < count; i++) {
			if (!arr[i].skill.isHidden()) {
				newSkillArray.push(arr[i]);
			}
        }
        
        this.setObjectArray(newSkillArray);
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var skill = object.skill;
        var handle = skill.getIconResourceHandle();
		
        GraphicsRenderer.drawImage(x, y, handle, GraphicsType.ICON);
    }

})