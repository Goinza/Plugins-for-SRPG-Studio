//Plugin by Goinza

var CustomSpellsInteraction = defineObject(TopCustomInteraction, {

    getTitle: function() {
        return SpellsConfig.NAME;
    },

    getScrollbarObject: function() {
        return CustomSpellsScrollbar;
    }

})

var CustomSpellsScrollbar = defineObject(TopCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var spells = MagicAttackControl.getAttackSpells(unit);
        spells.concat(MagicAttackControl.getSupportSpells(unit));

        this.resetScrollData();

        for (var i=0; i<spells.length; i++) {
            this.objectSet(spells[i]);
        }

        this.objectSetEnd();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {        
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        ItemRenderer.drawItem(x, y, object, color, font, true);
    }

})