//Plugin by Goinza

var SupportInteraction = defineObject(TopCustomInteraction, {

    initialize: function() {
		this._scrollbar = createScrollbarObject(this.getScrollbarObject(), this);
		this._scrollbar.setScrollFormation(1, 2);
    },

    getTitle: function() {
        return SUPPORTS_TITLE;
    },

    getScrollbarObject: function() {
        return SupportScrollbar;
    },

    getHelpText: function() {
        var text = "";        
        var supportStatus = this._scrollbar.getObject().getSupportStatus();
        
        if (supportStatus.getPower()!=0) {
            text += " | " + root.queryCommand('attack_capacity') + ": " + supportStatus.getPower() + " | ";
        }

        if (supportStatus.getHit()!=0) {
            text += root.queryCommand('hit_capacity') + ": " + supportStatus.getHit() + " | ";
        }

        if (supportStatus.getCritical()!=0) {
            text += root.queryCommand('critical_capacity') + ": " + supportStatus.getCritical() + " | ";
        }

        if (supportStatus.getDefense()!=0) {
            text += root.queryCommand('def_param') + ": " + supportStatus.getDefense() + " | ";
        }

        if (supportStatus.getAvoid()!=0) {
            text += root.queryCommand('avoid_capacity') + ": " + supportStatus.getAvoid() + " | ";
        }

        if (supportStatus.getCriticalAvoid()!=0) {
            text += root.queryCommand('critical_capacity') + root.queryCommand('avoid_capacity') + ": " +   supportStatus.getCriticalAvoid() + " | ";
        }   
		
		return text;
	}

})

var SupportScrollbar = defineObject(TopCustomScrollbar, {

    setDataScrollbar: function(unit) {
        var count = unit.getSupportDataCount();
        var supportData;
        
        this.resetScrollData();

        for (var i=0; i<count; i++) {
            supportData = unit.getSupportData(i);
            if (supportData.isGlobalSwitchOn() && supportData.isVariableOn()) {
                this.objectSet(supportData);
            }            
        }

        this.objectSetEnd();
    },

    drawScrollContent: function(x, y, object, isSelect, index) {
        var textui = this.getParentTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        
        var supportUnit = object.getUnit();        
        var icon = supportUnit.getCharChipResourceHandle();
        var name = supportUnit.getName();

        UnitRenderer.drawDefaultUnit(supportUnit, x, y, null);
        TextRenderer.drawText(x + 48, y + 10, name, -1, color, font);
    },

    getObjectHeight: function() {
		return 48;
	}

})