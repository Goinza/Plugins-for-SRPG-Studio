    /**
     * Assist Skills: Movement Skills - Sacrifice
     * By Goinza
     * 
     * Movement Skills
     * Shove - Swap - Smite - Draw Back - Pivot - Reposition
     * 
     * The custom keyword is the name of each skill (including the space in the case of "Draw Back").
     * 
     * Custom parameter of the skills
     * "name": The name of the command of the skill. If no parameter is used, the default name of the skill will be its keyword.
     * For example {name:"Push"}
     * 
     * Sacrifice
     *  The skill's user can sacrifice its own HP to heal an adjacent unit. The amount of healing depends on the custom parameter.
     *  If the unit doesn't have enought HP to sacrifice, it heals as much as possible, staying at 1 HP.
     *   -Custom keyword: "Sacrifice".
     *   -Custom parameters: 
     *     "name": The name of the skill command. If this parameter is not used, the command will be called "Sacrifice".
     *     "healing": The amount of healing done.
     */
(function() {

    var alias1 = UnitCommand.configureCommands;
    UnitCommand.configureCommands = function (groupArray) {
        alias1.call(this, groupArray);
        
        var i = 0;
        var found = false;
        while (i<groupArray.length && !found) {        
            found = groupArray[i].getCommandName()==root.queryCommand('wand_unitcommand');
            i++;
        }

        groupArray.insertObject(UnitCommand.Shove, i);
        i++;
        groupArray.insertObject(UnitCommand.Swap, i);
        i++;
        groupArray.insertObject(UnitCommand.Smite, i);
        i++;
        groupArray.insertObject(UnitCommand.DrawBack, i);
        i++;
        groupArray.insertObject(UnitCommand.Pivot, i);
        i++;
        groupArray.insertObject(UnitCommand.Reposition, i);
        i++;
        groupArray.insertObject(UnitCommand.Sacrifice, i);
    }

    var AssistCommandMode = {
        SELECT: 0,
        ASSIST: 1
    }

    /**
     * Base object for all movements skills commands.
     * Considering this base object is useful for other skills (like Sacrifice), it has been renamed to AssistUnitCommand
     * When creating new commands, the following must be implemented in the child object:
     *  variable _movName
     *  function _moveAssist()
     *  function _isMovable()
     */
    AssistUnitCommand = defineObject(UnitListCommand, {
        _posSelector: null,
        _movName: null,

        openCommand: function() {
            this._prepareCommandMemberData();
            this._completeCommandMemberData();
        },

        moveCommand: function() {
            var mode = this.getCycleMode();
            var result = MoveResult.CONTINUE;

            if (mode === AssistCommandMode.SELECT) {
                result = this._moveSelect();
            }
            else if (mode === AssistCommandMode.ASSIST) {
                result = this._moveAssist();
            }

            return result;
        },

        drawCommand: function() {
            var mode = this.getCycleMode();

            if (mode === AssistCommandMode.SELECT) {
                this._drawSelect();
            }
        },

        isCommandDisplayable: function() {
            var unit = this.getCommandTarget();
            var indexArray = this._getMoveArray(unit);
            var hasSkill = SkillControl.getPossessionCustomSkill(unit, this._movName);

            return (indexArray.length !== 0 && hasSkill);
        },

        getCommandName: function() {
            var unit = this.getCommandTarget();
            var skill = SkillControl.getPossessionCustomSkill(unit, this._movName);
            var name = skill.custom.name!=null ? skill.custom.name : this._movName;
            if (typeof name != 'string') {
                throwError015(skill);
            }
            return name;
        },

        isRepeatMoveAllowed: function() {
            return false;
        },

        _prepareCommandMemberData: function() {
            this._posSelector = createObject(PosSelector);
        },

        _completeCommandMemberData: function() {
            var unit = this.getCommandTarget();
            var filter = this._getUnitFilter();
            var indexArray = this._getMoveArray(this.getCommandTarget());

            this._posSelector.setUnitOnly(unit, ItemControl.getEquippedWeapon(unit), indexArray, PosMenuType.Default, filter);
            this._posSelector.setFirstPos();
            this._posSelector.includeFusion();

            this.changeCycleMode(AssistCommandMode.SELECT);
        },

        _moveSelect: function() {
            var result = this._posSelector.movePosSelector();

            if (result === PosSelectorResult.SELECT) {
                if (this._isPosSelectable()) {
                    this.changeCycleMode(AssistCommandMode.ASSIST);
                }
            }
            else if (result === PosSelectorResult.CANCEL) {
                this._posSelector.endPosSelector();
                return MoveResult.END;
            }

            return MoveResult.CONTINUE;
        },

        _moveAssist: function() {
            //Abstract function
        },

        _drawSelect: function() {
            this._posSelector.drawPosSelector();
        },

        _getMoveArray: function(unit) {
            var i, x, y, targetUnit;
            var indexArray = [];

            for (i = 0; i < DirectionType.COUNT; i++) {
                x = unit.getMapX() + XPoint[i];
                y = unit.getMapY() + YPoint[i];
                targetUnit = PosChecker.getUnitFromPos(x, y);
                if (targetUnit!==null && targetUnit.getUnitType()==UnitType.PLAYER && this._isMovable(unit, targetUnit)) {
                    indexArray.push(CurrentMap.getIndex(x, y));                
                }
            }
            return indexArray;
        },

        //Returns true if the movement skill commands can be used. Otherwise, returns false
        _isMovable: function(unit, targetUnit) {        
            //Abstract function
        },

        _isPosSelectable: function () {
            var unit = this._posSelector.getSelectorTarget(true);

            return unit !== null && Miscellaneous.isItemAccess(unit);
        },

        _getUnitFilter: function () {
            return FilterControl.getNormalFilter(this.getCommandTarget().getUnitType());
        }

    })

    UnitCommand.Shove = defineObject(AssistUnitCommand, {
        _movName: "Shove",

        _moveAssist: function() {
            var unit = this.getCommandTarget();
            var targetUnit = this._posSelector.getSelectorTarget(true);
            this._posSelector.endPosSelector();

            var direction = PosChecker.getSideDirection(unit.getMapX(), unit.getMapY(), targetUnit.getMapX(), targetUnit.getMapY());
            var dynamicEvent = createObject(DynamicEvent);
            var generator = dynamicEvent.acquireEventGenerator();

            generator.unitSlide(targetUnit, direction, 3, SlideType.START, false);
            generator.unitSlide(targetUnit, 0, 0, SlideType.UPDATEEND, false);

            dynamicEvent.executeDynamicEvent();

            this.endCommandAction();
            return MoveResult.END;
        },

        _isMovable: function(unit, targetUnit) {
            var deltaX, deltaY; //Distance between the units
            var boundaryX, boundaryY; //Boundary of the map
            var targetX, targetY; //Position where the targetUnit would get if pushed
            var targetTerrain; //The tile where the targetUnit would get if pushed
            var terrainOccupied;
            var movable = false;

            //This makes it so the targetUnit moves a tile away from the unit
            //Because both units are adjacent, one of the deltas must be zero, while the other must be one
            deltaX = targetUnit.getMapX() - unit.getMapX();
            deltaY = targetUnit.getMapY() - unit.getMapY();

            boundaryX = root.getCurrentSession().getCurrentMapInfo().getMapWidth();
            boundaryY = root.getCurrentSession().getCurrentMapInfo().getMapHeight();

            targetX = targetUnit.getMapX() + deltaX;
            targetY = targetUnit.getMapY() + deltaY;

            //Checks so the unit does not move beyond the limits of the map
            if (targetX < boundaryX && targetX >= 0 && targetY < boundaryY && targetY >= 0) {
                targetTerrain = root.getCurrentSession().getTerrainFromPos(targetX, targetY, true); //I do not know the impact of the boolean on this function
                tileOccupied = (root.getCurrentSession().getUnitFromPos(targetX, targetY) != null) //True if there is a unit in the targetTerrain
                if (targetTerrain.getMovePoint(targetUnit) > 0 && !tileOccupied) {
                    movable = true;
                }
            }

            return movable;
        }
    })

    UnitCommand.Swap = defineObject(AssistUnitCommand, {
        _movName: "Swap",

        _moveAssist: function() {
            var unit = this.getCommandTarget();
            var targetUnit = this._posSelector.getSelectorTarget(true);
            this._posSelector.endPosSelector();

            var direction = PosChecker.getSideDirection(unit.getMapX(), unit.getMapY(), targetUnit.getMapX(), targetUnit.getMapY());
            var opposite = PosChecker.getSideDirection(targetUnit.getMapX(), targetUnit.getMapY(), unit.getMapX(), unit.getMapY());
            var dynamicEvent = createObject(DynamicEvent);
            var generator = dynamicEvent.acquireEventGenerator();

            generator.unitSlide(targetUnit, opposite, 3, SlideType.START, false);
            generator.unitSlide(targetUnit, 0, 0, SlideType.UPDATEEND, false);

            generator.unitSlide(unit, direction, 3, SlideType.START, false);
            generator.unitSlide(unit, 0, 0, SlideType.UPDATEEND, false);

            dynamicEvent.executeDynamicEvent();

            this.endCommandAction();
            return MoveResult.END;
        },

        _isMovable: function(unit, targetUnit) {
            return true;
        }
    })

    UnitCommand.Smite = defineObject(AssistUnitCommand, {
        _movName: "Smite",

        _moveAssist: function() {
            var unit = this.getCommandTarget();
            var targetUnit = this._posSelector.getSelectorTarget(true);
            this._posSelector.endPosSelector();

            var direction = PosChecker.getSideDirection(unit.getMapX(), unit.getMapY(), targetUnit.getMapX(), targetUnit.getMapY());
            var dynamicEvent = createObject(DynamicEvent);
            var generator = dynamicEvent.acquireEventGenerator();

            generator.unitSlide(targetUnit, direction, 7, SlideType.START, false);
            generator.unitSlide(targetUnit, 0, 0, SlideType.UPDATEEND, false);

            dynamicEvent.executeDynamicEvent();

            this.endCommandAction();
            return MoveResult.END;
        },

        _isMovable: function(unit, targetUnit) {
            var deltaX, deltaY; //Distance between the units
            var boundaryX, boundaryY; //Boundary of the map
            var targetX, targetY; //Position where the targetUnit would get if pushed
            var targetTerrain; //The tile where the targetUnit would get if pushed. If the unit gets moved more that one tile
                                //This var will iterate for each tile.
            var terrainOccupied;
            

            //This makes it so the targetUnit moves a tile away from the unit
            //Because both units are adjacent, one of the deltas must be zero, while the other must be one
            deltaX = targetUnit.getMapX() - unit.getMapX();
            deltaY = targetUnit.getMapY() - unit.getMapY();

            boundaryX = root.getCurrentSession().getCurrentMapInfo().getMapWidth();
            boundaryY = root.getCurrentSession().getCurrentMapInfo().getMapHeight();

            //The targetUnit will be pushed 2 tiles, so we need to check both tiles where is going to be pushed
            //The var i is used for checking every tile that the unit will travel so it can be pushed to the final tile.
            var movable = true;
            var i = 1;
            while (i<3 && movable) {
                targetX = targetUnit.getMapX() + deltaX * i;
                targetY = targetUnit.getMapY() + deltaY * i;

                //Checks so the unit does not move beyond the limits of the map
                if (targetX < boundaryX && targetX >= 0 && targetY < boundaryY && targetY >= 0) {
                    targetTerrain = root.getCurrentSession().getTerrainFromPos(targetX, targetY, true); //I do not know the impact of the boolean on this function
                    tileOccupied = (root.getCurrentSession().getUnitFromPos(targetX, targetY) != null) //True if there is a unit in the targetTerrain
                    if (targetTerrain.getMovePoint(targetUnit) == 0 || tileOccupied) {
                        movable = false;
                    }
                }
                else {
                    movable = false;
                }
                i++;
            }

            return movable;
        }    
    })

    UnitCommand.DrawBack = defineObject(AssistUnitCommand, {
        _movName: "Draw Back",

        _moveAssist: function() {
            var unit = this.getCommandTarget();
            var targetUnit = this._posSelector.getSelectorTarget(true);
            this._posSelector.endPosSelector();

            var direction = PosChecker.getSideDirection(targetUnit.getMapX(), targetUnit.getMapY(), unit.getMapX(), unit.getMapY());
            var dynamicEvent = createObject(DynamicEvent);
            var generator = dynamicEvent.acquireEventGenerator();

            generator.unitSlide(targetUnit, direction, 3, SlideType.START, false);
            generator.unitSlide(targetUnit, 0, 0, SlideType.UPDATEEND, false);

            generator.unitSlide(unit, direction, 3, SlideType.START, false);
            generator.unitSlide(unit, 0, 0, SlideType.UPDATEEND, false);

            dynamicEvent.executeDynamicEvent();

            this.endCommandAction();
            return MoveResult.END;
        },

        _isMovable: function (unit, targetUnit) {
            var deltaX, deltaY; //Distance between the units
            var boundaryX, boundaryY; //Boundary of the map
            var targetX, targetY; //Position where the targetUnit would get if pushed
            var targetTerrain; //The tile where the targetUnit would get if pushed
            var terrainOccupied;
            var movable = false;

            //Because both units are adjacent, one of the deltas must be zero, while the other must be one
            deltaX = unit.getMapX() - targetUnit.getMapX();
            deltaY = unit.getMapY() - targetUnit.getMapY();

            boundaryX = root.getCurrentSession().getCurrentMapInfo().getMapWidth();
            boundaryY = root.getCurrentSession().getCurrentMapInfo().getMapHeight();

            //Checks the tile that is 1 tile away from the unit and 2 tiles away from the tagetUnit
            targetX = unit.getMapX() + deltaX;
            targetY = unit.getMapY() + deltaY;

            //Checks so the unit does not move beyond the limits of the map
            if (targetX < boundaryX && targetX >= 0 && targetY < boundaryY && targetY >= 0) {
                targetTerrain = root.getCurrentSession().getTerrainFromPos(targetX, targetY, true); //I do not know the impact of the boolean on this function
                tileOccupied = (root.getCurrentSession().getUnitFromPos(targetX, targetY) != null) //True if there is a unit in the targetTerrain
                if (targetTerrain.getMovePoint(unit) > 0 && !tileOccupied) {
                    movable = true;
                }
            }

            return movable;
        }

    })

    UnitCommand.Pivot = defineObject(AssistUnitCommand, {
        _movName: "Pivot",

        _moveAssist: function() {
            var unit = this.getCommandTarget();
            var targetUnit = this._posSelector.getSelectorTarget(true);
            this._posSelector.endPosSelector();

            var direction = PosChecker.getSideDirection(unit.getMapX(), unit.getMapY(), targetUnit.getMapX(), targetUnit.getMapY());
            var dynamicEvent = createObject(DynamicEvent);
            var generator = dynamicEvent.acquireEventGenerator();

            generator.unitSlide(unit, direction, 7, SlideType.START, false);
            generator.unitSlide(unit, 0, 0, SlideType.UPDATEEND, false);

            dynamicEvent.executeDynamicEvent();

            this.endCommandAction();
            return MoveResult.END;
        },

        _isMovable: function (unit, targetUnit) {
            var deltaX, deltaY; //Distance between the units
            var boundaryX, boundaryY; //Boundary of the map
            var targetX, targetY; //Position where the targetUnit would get if pushed
            var targetTerrain; //The tile where the targetUnit would get if pushed
            var terrainOccupied;
            var movable = false;

            //Because both units are adjacent, one of the deltas must be zero, while the other must be one
            deltaX = targetUnit.getMapX() - unit.getMapX();
            deltaY = targetUnit.getMapY() - unit.getMapY();

            boundaryX = root.getCurrentSession().getCurrentMapInfo().getMapWidth();
            boundaryY = root.getCurrentSession().getCurrentMapInfo().getMapHeight();

            //Checks the tile that is 1 tile away from the targetUnit and 2 tiles away from the unit
            targetX = unit.getMapX() + deltaX * 2;
            targetY = unit.getMapY() + deltaY * 2;

            //Checks so the unit does not move beyond the limits of the map
            if (targetX < boundaryX && targetX >= 0 && targetY < boundaryY && targetY >= 0) {
                targetTerrain = root.getCurrentSession().getTerrainFromPos(targetX, targetY, true); //I do not know the impact of the boolean on this function
                tileOccupied = (root.getCurrentSession().getUnitFromPos(targetX, targetY) != null) //True if there is a unit in the targetTerrain
                if (targetTerrain.getMovePoint(unit) > 0 && !tileOccupied) {
                    movable = true;
                }
            }

            return movable;
        }
    })

    UnitCommand.Reposition = defineObject(AssistUnitCommand, {
        _movName: "Reposition",

        _moveAssist: function() {
            var unit = this.getCommandTarget();
            var targetUnit = this._posSelector.getSelectorTarget(true);
            this._posSelector.endPosSelector();

            var direction = PosChecker.getSideDirection(targetUnit.getMapX(), targetUnit.getMapY(), unit.getMapX(), unit.getMapY());
            var dynamicEvent = createObject(DynamicEvent);
            var generator = dynamicEvent.acquireEventGenerator();

            generator.unitSlide(targetUnit, direction, 7, SlideType.START, false);
            generator.unitSlide(targetUnit, 0, 0, SlideType.UPDATEEND, false);

            dynamicEvent.executeDynamicEvent();

            this.endCommandAction();
            return MoveResult.END;
        },

        _isMovable: function (unit, targetUnit) {
            var deltaX, deltaY; //Distance between the units
            var boundaryX, boundaryY; //Boundary of the map
            var targetX, targetY; //Position where the targetUnit would get if pushed
            var targetTerrain; //The tile where the targetUnit would get if pushed
            var terrainOccupied;
            var movable = false;

            //Because both units are adjacent, one of the deltas must be zero, while the other must be one
            deltaX = unit.getMapX() - targetUnit.getMapX();
            deltaY = unit.getMapY() - targetUnit.getMapY();

            boundaryX = root.getCurrentSession().getCurrentMapInfo().getMapWidth();
            boundaryY = root.getCurrentSession().getCurrentMapInfo().getMapHeight();

            //Checks the tile that is 1 tile away from the unit and 2 tiles away from the targetUnit
            targetX = targetUnit.getMapX() + deltaX * 2;
            targetY = targetUnit.getMapY() + deltaY * 2;

            //Checks so the unit does not move beyond the limits of the map
            if (targetX < boundaryX && targetX >= 0 && targetY < boundaryY && targetY >= 0) {
                targetTerrain = root.getCurrentSession().getTerrainFromPos(targetX, targetY, true); //I do not know the impact of the boolean on this function
                tileOccupied = (root.getCurrentSession().getUnitFromPos(targetX, targetY) != null) //True if there is a unit in the targetTerrain
                if (targetTerrain.getMovePoint(targetUnit) > 0 && !tileOccupied) {
                    movable = true;
                }
            }

            return movable;
        }
    })

    UnitCommand.Sacrifice = defineObject(AssistUnitCommand, {
        _movName: "Sacrifice",

        _moveAssist: function() {
            var unit = this.getCommandTarget();
            var targetUnit = this._posSelector.getSelectorTarget(true);
            this._posSelector.endPosSelector();
            var skill = SkillControl.getPossessionCustomSkill(unit, "Sacrifice");
            var healing = skill.custom.healing;
            if (typeof healing != 'number') {
                throwError016(skill);
            }
            var finalHealing;

            //Max amount of healing possible
            var deltaActive = unit.getHP() - 1;
            var deltaPassive = ParamBonus.getMhp(targetUnit) - targetUnit.getHP();        
            var deltaFinal = deltaActive<deltaPassive ? deltaActive : deltaPassive;

            if (healing==0) {    
                //Micaiah's Sacrifice
                //Heals the max amount of points possible
                finalHealing = deltaFinal;      
            } 
            else {
                //Ardent Sacrifice
                //Heals the smaller value between the max amount of points possible and the healing value
                finalHealing = deltaFinal>healing ? healing : deltaFinal;  
            }

            var dynamicEvent = createObject(DynamicEvent);
            var generator = dynamicEvent.acquireEventGenerator(); 
            var itemAnime = root.getBaseData().getEffectAnimationList(true).getDataFromId(307); //Small healing animation

            generator.damageHit(unit, itemAnime, finalHealing, DamageType.FIXED, {}, false);
            generator.hpRecovery(targetUnit, itemAnime, finalHealing, RecoveryType.SPECIFY, false);

            dynamicEvent.executeDynamicEvent();
            this.endCommandAction();
            return MoveResult.END;
        },

        _isMovable: function(unit, targetUnit) {
            return unit.getHP()>1 && targetUnit.getHP()<ParamBonus.getMhp(targetUnit);
        }
    })

    //This getCommandName functions are modified so the game does not crash
    //when trying to search the list of commands by name.
    var cn1 = UnitCommand.PlaceCommand.getCommandName;
    UnitCommand.PlaceCommand.getCommandName = function() {
        if (this._listCommandManager==null) {
            return "";
        }
        
        return cn1.call(this);
    }

    var cn2 = UnitCommand.Shop.getCommandName;
    UnitCommand.Shop.getCommandName = function() {
        if (this._listCommandManager==null) {
            return "";
        }
        
        return cn2.call(this);
    }

    var cn3 = UnitCommand.Quick.getCommandName;
    UnitCommand.Quick.getCommandName = function() {
        if (this._listCommandManager==null) {
            return "";
        }
        
        return cn3.call(this);
    }

    var cn4 = UnitCommand.Steal.getCommandName;
    UnitCommand.Steal.getCommandName = function() {
        if (this._listCommandManager==null) {
            return "";
        }
        
        return cn4.call(this);
    }
}) ()