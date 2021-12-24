//Plugin by Goinza

(function() {
    
    var alias1 = UnitCommand.configureCommands;
    UnitCommand.configureCommands = function(groupArray) {
        alias1.call(this, groupArray);
        
        var i = 0;
        var found = false;
        while (i<groupArray.length && !found) {        
            found = groupArray[i].getCommandName()==root.queryCommand('attack_unitcommand');
            i++;
        }
    
        groupArray.insertObject(UnitCommand.DoubleAttack, i)
    }

})()

UnitCommand.DoubleAttack = defineObject(UnitListCommand, {

    _state: null,
    data: null,

    openCommand: function() {        
        this.data = this._buildCommandData();
        this.changeState(DAState.FirstWeapon);
    },

    moveCommand: function() {
        return this._state.moveState();
    },

    drawCommand: function() {
        this._state.drawState();
    },

    isCommandDisplayable: function() {
        var unit = this.getCommandTarget();
        var skill = SkillControl.getPossessionCustomSkill(unit, DoubleAttackSettings.SKILL_KEYWORD);
        var canAttack = skill && this._canAttack(unit, skill);
        return canAttack;
    },

    getCommandName: function() {
        return DoubleAttackSettings.COMMAND_NAME;
    },

    isRepeatMoveAllowed: function() {
        return DataConfig.isUnitCommandMovable(RepeatMoveType.ATTACK);
    },

    changeState: function(protoState) {
        this._state = createObject(protoState);
        this._state.setup(this);
    },

    _buildCommandData: function() {
        var data = {};
        data.unit = this.getCommandTarget();
        data.firstWeapon = null;
        data.firstTarget = null;
        data.secondWeapon = null;
        data.secondTarget = null;
        data.weaponSelectionDisabled = false;

        return data;
    },

    _canAttack: function(unit, skill) {
        var i, item, indexArray;
		var count = UnitItemControl.getPossessionItemCount(unit);
        var validWeaponTypesArray = DoubleAttackControl.getValidWeaponTypes(skill);
		
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			if (item !== null && ItemControl.isWeaponAvailable(unit, item) && DoubleAttackControl.isValidWeaponType(item, validWeaponTypesArray)) {
				indexArray = AttackChecker.getAttackIndexArray(unit, item, true);
				if (indexArray.length !== 0) {
					return true;
				}
			}
		}
		
		return false;
    }

})