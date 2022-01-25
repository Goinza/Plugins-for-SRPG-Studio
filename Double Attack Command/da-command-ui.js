//Plugin by Goinza

var InfoBattleWindow = defineObject(BaseWindow, {

    _text: "",

    setInfoText: function(text) {
        this._text = text;
    },

    drawWindowContent: function(x, y) {
        var textui = this.getWindowTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        TextRenderer.drawText(x, y, this._text, -1, color, font);
	},

    getWindowWidth: function() {
		return InfoWindowSettings.WIDTH;
	},
	
	getWindowHeight: function() {
		return 50;
	} 

})

var DoubleWeaponSelectMenu = defineObject(WeaponSelectMenu, {

    _isWeaponAllowed: function(unit, item) {
		var indexArray;
		
		if (!ItemControl.isWeaponAvailable(unit, item)) {
			return false;
		}

        var skill = SkillControl.getPossessionCustomSkill(unit, DoubleAttackSettings.SKILL_KEYWORD);
        if (!DoubleAttackControl.isValidWeaponType(item, DoubleAttackControl.getValidWeaponTypes(skill))) {
            return false;
        }
	
		indexArray = AttackChecker.getAttackIndexArray(unit, item, true);
		
		return indexArray.length !== 0;
	}

})