//Plugin by Goinza

var CABaseState = defineObject(BaseObject, {

    _parent: null,

    setup: function(parent) {
        this._parent = parent;
    },

    moveState: function() {
        return MoveResult.CONTINUE;
    },

    drawState: function() {
    }
})

var CAState = {};

CAState.Initial = defineObject(CABaseState, {

    _catSelectMenu: null,

    setup: function(parent) {
        this._parent = parent;
        this._caSelectMenu = createObject(CombatArtSelectMenu);
        this._caSelectMenu.setUnit(this._parent.getCommandTarget());
    },

    moveState: function() {
        var result = this._caSelectMenu.moveWindowManager();

        if (result == MoveResult.SELECT) {
            var selectedCA = this._caSelectMenu.getSelectedCombatArt();
            this._parent.caData.selectedCA = selectedCA;
            if (CombatArtControl.isAttackCombatArt(selectedCA)) {
                this._parent.changeState(CAState.SelectWeapon);
            }
            else if (CombatArtControl.isActionCombatArt(selectedCA)) {
                this._parent.changeState(CAState.ActionTarget);
            }            
        }
        else if (result == MoveResult.CANCEL) {
            return MoveResult.END;
        }

        return MoveResult.CONTINUE;
    },

    drawState: function() {
        this._caSelectMenu.drawWindowManager();
    }
})

CAState.SelectWeapon = defineObject(CABaseState, {

    _weaponSelectMenu: null,

    setup: function(parent) {
        var unit = parent.getCommandTarget();
        var combatArt = parent.caData.selectedCA;
        this._parent = parent;
        this._weaponSelectMenu = createObject(CombatArtWeaponSelectMenu);
        this._weaponSelectMenu.setCombatArt(combatArt);
        this._weaponSelectMenu.setMenuTarget(unit);
    },

    moveState: function() {
        var result = this._weaponSelectMenu.moveWindowManager();

        if (result == MoveResult.SELECT) {
            var selectedWeapon = this._weaponSelectMenu.getSelectWeapon();
            this._parent.caData.weapon = selectedWeapon;
            this._parent.changeState(CAState.AttackTarget);
            CombatArtAttack.startCombatArtAttack(this._parent.getCommandTarget(), this._parent.caData.selectedCA);
        }
        else if (result == MoveResult.CANCEL) {
            this._parent.changeState(CAState.Initial);
        }

        return MoveResult.CONTINUE;
    },

    drawState: function() {
        this._weaponSelectMenu.drawWindowManager();
    }

})

CAState.AttackTarget = defineObject(CABaseState, {

    _posSelector: null,

    setup: function(parent) {
        this._parent = parent;
        this._posSelector = createObject(PosSelector);
        this._setupPosSelector();  
    },

    moveState: function() {
        var result = this._posSelector.movePosSelector();

        if (result == PosSelectorResult.SELECT) {
            var targetUnit = this._posSelector.getSelectorTarget(true);
            if (targetUnit != null) {
                this._parent.caData.targetUnit = targetUnit;
                this._posSelector.endPosSelector();            
                this._parent.changeState(CAState.AttackEffect);
            }            
        }
        else if (result === PosSelectorResult.CANCEL) {
            this._posSelector.endPosSelector();
            this._parent.changeState(CAState.SelectWeapon);
            CombatArtAttack.endCombatArtAttack();
        }

        return MoveResult.CONTINUE;
    },

    drawState: function() {
        this._posSelector.drawPosSelector();
    },

    _setupPosSelector: function() {
        var unit = this._parent.getCommandTarget();
        var weapon = this._parent.caData.weapon;
        var combatArt = this._parent.caData.selectedCA;
        var indexArray = CombatArtRange.getCombatArtAttackIndexArray(unit, weapon, combatArt);
        var filter = FilterControl.getReverseFilter(unit.getUnitType());

        ItemControl.setEquippedWeapon(unit, weapon);		
		this._posSelector.setUnitOnly(unit, weapon, indexArray, PosMenuType.Attack, filter);
		this._posSelector.setFirstPos();
    }

})

CAState.AttackEffect = defineObject(CABaseState, {

    _preAttack: null,

    setup: function(parent) {
        this._parent = parent;
        attackParam = this._createAttackParam();
        this._preAttack = createObject(PreAttack);
        if (this._preAttack.enterPreAttackCycle(attackParam) === EnterResult.NOTENTER) {
            this._parent.changeState(CAState.AttackFinished);
        }
    },

    moveState: function() {
        if (this._preAttack.movePreAttackCycle() !== MoveResult.CONTINUE) {
            this._payCost()
            this._parent.changeState(CAState.AttackFinished);
        }

        return MoveResult.CONTINUE;
    },

    drawState: function() {
        this._preAttack.drawPreAttackCycle();
    },

    _payCost: function() {        
        var unit = this._parent.getCommandTarget();
        var combatArt = this._parent.caData.selectedCA;
        CombatArtCost.payCost(unit, combatArt);
    },

    _createAttackParam: function() {
		var attackParam = StructureBuilder.buildAttackParam();
		
		attackParam.unit = this._parent.getCommandTarget();
		attackParam.targetUnit = this._parent.caData.targetUnit;
		attackParam.attackStartType = AttackStartType.NORMAL;
		
		return attackParam;
	}

})

CAState.AttackFinished = defineObject(CABaseState, {

    moveState: function() {
        this._parent.endCommandAction();
        return MoveResult.END;
    }

})

CAState.ActionTarget = defineObject(CABaseState, {
    
    _item: null,
    _itemUse: null,
    _targetSelection: null,   

    setup: function(parent) {
        this._parent = parent;
        this._targetSelection = createObject(BaseItemSelection);
        var unit = this._parent.getCommandTarget(); 
        this._item = parent.caData.selectedCA.getOriginalContent().getItem();
        if (this._targetSelection.enterItemSelectionCycle(unit, this._item) == EnterResult.NOTENTER) {
            this._finishSelection();
        }
    },

    moveState: function() {
        if (this._targetSelection.moveItemSelectionCycle() == MoveResult.END) {
            if (this._targetSelection.isSelection()) {
                this._finishSelection();
            }
            else {
                this._parent.changeState(CAState.Initial);
            }
            
        }        
        return MoveResult.CONTINUE;
    },

    drawState: function() {   
        this._targetSelection.drawItemSelectionCycle();
    },
    
    _finishSelection: function() {
        this._parent.caData.resultTargetInfo = this._targetSelection.getResultItemTargetInfo();
        this._parent.changeState(CAState.ActionEffect);
    }

})

CAState.ActionEffect = defineObject(CABaseState, {

    setup: function(parent) {
        this._parent = parent;
        var item = parent.caData.selectedCA.getOriginalContent().getItem();
        this._itemUse = ItemPackageControl.getItemUseParent(item);
        var itemTargetInfo = this._parent.caData.resultTargetInfo;	
		itemTargetInfo.unit = this._parent.getCommandTarget();
		itemTargetInfo.item = item;
		itemTargetInfo.isPlayerSideCall = true;
		this._itemUse.enterUseCycle(itemTargetInfo);
    },

    moveState: function() {
        if (this._itemUse.moveUseCycle() !== MoveResult.CONTINUE) {
			this._parent.endCommandAction();
            var unit = this._parent.getCommandTarget();
            var combatArt = this._parent.caData.selectedCA;
            CombatArtCost.payCost(unit, combatArt);
			return MoveResult.END;
		}		
		return MoveResult.CONTINUE;
    },

    drawState: function() {
        this._itemUse.drawUseCycle();
    }

})