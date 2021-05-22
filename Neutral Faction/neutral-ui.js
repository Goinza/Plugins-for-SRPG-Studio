//Plugin by Goinza

(function() {
    var alias1 = TurnMarkFlowEntry._getTurnFrame;
    TurnMarkFlowEntry._getTurnFrame = function() {
        var pic = alias1.call(this);
        var turnType = root.getCurrentSession().getTurnType();
        if (turnType == TurnType.NEUTRAL) {
            pic = NeutralControl.getNeutralFrame();
        }

        return pic;
    }

    EasyAttackWindow._drawWindowInternal = function(x, y, width, height) {
        var pic = null;
        var textui = this.getWindowTextUI();
        var unitType, originalUnitType;
        
        if (textui !== null) {
            pic = textui.getUIImage();
        }
        
        if (pic !== null) {
            unitType = NeutralControl.getUnitType(this._unit);
            originalUnitType = this._unit.getUnitType();
            if (unitType == UnitType.NEUTRAL) {
                pic = NeutralControl.getNeutralWindow(originalUnitType);
            }
            WindowRenderer.drawStretchWindow(x, y, width, height, pic);
        }
    }

    PosBaseWindow._drawWindowInternal = function(x, y, width, height) {
        var pic = null;
        var textui = this.getWindowTextUI();
        
        if (textui !== null) {
            pic = textui.getUIImage();
        }
        
        if (pic !== null) {
            unitType = NeutralControl.getUnitType(this._unit);
            originalUnitType = this._unit.getUnitType();
            if (unitType == UnitType.NEUTRAL) {
                pic = NeutralControl.getNeutralWindow(originalUnitType);
            }
            WindowRenderer.drawStretchWindow(x, y, width, height, pic);
        }
    }

    UIBattleLayout._drawLifeGadget = function(x, y, battler) {
		var handle = root.queryGraphicsHandle('battlecrystal');
		var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.PICTURE);
		var dx = 0;
		var type = NeutralControl.getUnitType(battler.getUnit());
		
		if (type === UnitType.PLAYER) {
			dx = 84 * 0;
		}
		else if (type === UnitType.ENEMY) {
			dx = 84 * 1;
		}
		else if (type === UnitType.ALLY) {
			dx = 84 * 2;
		}
        else if (type === UnitType.NEUTRAL) {
            dx = 84 * 3;
        }
		
		if (pic !== null) {
			pic.drawStretchParts(x, y, 84, 84, dx, 0, 84, 84);
		}
	}

})()