//Plugin by Goinza

var CustomCombatArtsInteraction = defineObject(TopCustomInteraction, {

    getTitle: function() {
        return CombatArtSettings.TITLE_COMBATART;
    },

    getScrollbarObject: function() {
        return CustomCombatArtsScrollbar;
    },

    setUnitData: function(unit) {
        this._window = createWindowObject(CombatArtSupportWindow, this);
        this._scrollbar.setDataScrollbar(unit);
		this._window.setCombatArt(this._scrollbar.getObject());
    },

    _changeTopic: function() {
		var combatArt = this._scrollbar.getObject();		
		this._window.setCombatArt(combatArt);
	}

})

var CustomCombatArtsScrollbar = defineObject(TopCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var attackCA = CombatArtControl.getAttackCombatArtsArray(unit);
        var actionCA = CombatArtControl.getActionCombatArtsArray(unit);
        var combatArts = attackCA.concat(actionCA);

        this.resetScrollData();
		
		for (i=0; i<combatArts.length; i++) {
			this.objectSet(combatArts[i]);
		}
		
		this.objectSetEnd();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var skill = object;
        var icon = skill.getIconResourceHandle();
        var name = skill.getName();

        var textui = this.getParentTextUI();
		var color = textui.getColor();
		var font = textui.getFont();

        GraphicsRenderer.drawImage(x, y, icon, GraphicsType.ICON);
        TextRenderer.drawText(x + 32, y + 2, name, -1, color, font);
    }

})