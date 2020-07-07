//Plugin by Goinza and Lady Rena

/*
List of features and the functions that handle each of them:
    -Neutral units attack everyone, and enemy units attack neutral units: 
        -alias01: BaseCombinationCollector._arrangeFilter
        -FilterControl.getListArray
    -Neutral turn, where only neutral units move. These units don't move during the enemy turn:
        -TurnControl.getActorList
        -alias02: FreeAreaScene._prepareSceneMemberData
        -alias03: FreeAreaScene.getTurnObject
        -TurnChangeEnd._startNextTurn
    -UI changes to make the neutral army work, including graphics and music:
        -alias04: TurnMarkFlowEntry._getTurnFrame
        -EasyAttackWindow._drawWindowInternal
        -PosBaseWindow._drawWindowInternal
        -alias05: BaseTurnLogoFlowEntry._isTurnGraphicsDisplayable
        -BaseTurnLogoFlowEntry._changeMusic
        -UIBattleLayout._drawLifeGadget
    -Neutral units can't pass through enemy units and viceversa:
        -BlockerRule.Neutral
        -alias06: SimulationBlockerControl._configureBlockerRule
    -During the cycling of units in the unit menu screen, neutral unit will not show up if the first selected unit is an enemy unit, and viceversa:
        -alias07: UnitMenuScreen._getUnitList
    -Changes to the Objective screen to reflect the neutral faction:
        -alias08: ObjectiveWindow.getWindowWidth
        -alias09: ObjectiveFaceZone.drawFaceZone
        -alias10: ObjectiveFaceZone._drawInfo
        -alias11: ObjectiveFaceZone._getTotalValue
        -alias12: ObjectiveFaceZone._getLeaderUnit
*/

(function() {

    //New variables used by some of these functions
    UnitFilterFlag.NEUTRAL = 0x08;
    UnitType.NEUTRAL = 3;
    TurnType.NEUTRAL = 3;

    //alias01 and FilterControl.getListArray make neutral units able to attack other units. Also makes enemy units capable of attacking neutral units.
    //With this, units with the neutralFaction parameter will attack any unit that doesn't have the parameter
    var alias01 = BaseCombinationCollector._arrangeFilter;
    BaseCombinationCollector._arrangeFilter = function(unit, filter) {
        var filter = alias01.call(this, unit, filter);
        return FactionControl.getUnitFilter(unit, filter);
    }

    //Adds the neutral list to the array if the unit is not neutral.
    //Adds all lists but the neutral list to the array if the unit is neutral.
    FilterControl.getListArray = function(filter) {
        var listArray = [];
        
        if (filter & UnitFilterFlag.PLAYER) {
            listArray.push(PlayerList.getSortieList());
            listArray.push(FactionControl.getNeutralList());
        }
        
        if (filter & UnitFilterFlag.ENEMY) {
            listArray.push(EnemyList.getAliveList());
        }
        
        if (filter & UnitFilterFlag.ALLY) {
            listArray.push(AllyList.getAliveList());
            listArray.push(FactionControl.getNeutralList());
        }

        if (filter & UnitFilterFlag.NEUTRAL) {
            listArray.push(PlayerList.getSortieList());
            listArray.push(AllyList.getAliveList());
            listArray.push(FactionControl.getEnemyList());
        }
        
        return listArray;	
    }

    //Returns the list associated with the TurnType
    //This changes the list of units used in each turn, so that neutral units can only move during TurnType.NEUTRAL
    TurnControl.getActorList = function() {
        var list = null;
        var turnType = root.getCurrentSession().getTurnType();
        
        if (turnType === TurnType.PLAYER) {
            list = PlayerList.getSortieList();
        }
        else if (turnType === TurnType.ENEMY) {
            list = FactionControl.getEnemyList();
        }
        else if (turnType === TurnType.ALLY) {
            list = AllyList.getAliveList();
        }
        else if (turnType == TurnType.NEUTRAL) {
            list = FactionControl.getNeutralList();
        }
        
        return list;
    }

    //Creates the neutral faction turn.
    var alias02 = FreeAreaScene._prepareSceneMemberData;
    FreeAreaScene._prepareSceneMemberData = function() {
        alias02.call(this);
        this._neutralTurnObject = createObject(EnemyTurn);
    }

    //Returns the neutral object if it is the neutral faction's turn.
    var alias03 = FreeAreaScene.getTurnObject;
    FreeAreaScene.getTurnObject = function() {
        var obj = alias03.call(this);
        var type = root.getCurrentSession().getTurnType();
        
        if (type === TurnType.NEUTRAL) {
            obj = this._neutralTurnObject;
        }
        
        return obj;
    }

    //When the Ally Phase ends, it begins the Neutral Phase
    TurnChangeEnd._startNextTurn = function() {
        var nextTurnType;
        var turnType = root.getCurrentSession().getTurnType();
        
        this._checkActorList();
        
        if (turnType === TurnType.PLAYER) {
            nextTurnType = FactionControl.getEnemyList().getCount()>0 ? TurnType.ENEMY : TurnType.ALLY;
        }
        else if (turnType === TurnType.ENEMY) {
            nextTurnType = TurnType.ALLY;
        }
        else if (turnType === TurnType.ALLY){
            nextTurnType = TurnType.NEUTRAL;
        }
        else{
            nextTurnType = TurnType.PLAYER;
        }
        
        root.getCurrentSession().setTurnType(nextTurnType);
    }

    //Returns the pic of the neutral frame if the unit is part of the neutral faction.
    var alias04 = TurnMarkFlowEntry._getTurnFrame;
    TurnMarkFlowEntry._getTurnFrame = function() {
        var pic = alias04.call(this);
        var turnType = root.getCurrentSession().getTurnType();

        if (turnType == TurnType.NEUTRAL) {
            pic = FactionControl.getNeutralFrameUI();
        }

        return pic;
    }

    //Returns the pic of the neutral window if the unit is part of the neutral faction.
    EasyAttackWindow._drawWindowInternal = function(x, y, width, height) {
        var pic = null;
        var textui = this.getWindowTextUI();
        
        if (textui !== null) {
            pic = textui.getUIImage();
        }
        
        if (pic !== null) {
            if (FactionControl.getUnitType(this._unit) == UnitType.NEUTRAL) {
                pic = FactionControl.getNeutralWindowUI();
            }
            WindowRenderer.drawStretchWindow(x, y, width, height, pic);
        }
    }

    //Returns the pic of the neutral window if the unit is part of the neutral faction.
    PosBaseWindow._drawWindowInternal = function(x, y, width, height) {
        var pic = null;
        var textui = this.getWindowTextUI();
        
        if (textui !== null) {
            pic = textui.getUIImage();
        }
        
        if (pic !== null) {
            if (FactionControl.getUnitType(this._unit) == UnitType.NEUTRAL) {
                pic = FactionControl.getNeutralWindowUI();
            }
            WindowRenderer.drawStretchWindow(x, y, width, height, pic);
        }
    }

    //Only show the Neutral Phase graphic if there are neutral units.
    var alias05 = BaseTurnLogoFlowEntry._isTurnGraphicsDisplayable;
    BaseTurnLogoFlowEntry._isTurnGraphicsDisplayable = function() {
        var displayable, count;
        turnType = root.getCurrentSession().getTurnType();
        if (turnType == TurnType.NEUTRAL) {
            count = FactionControl.getNeutralList().getCount();
            displayable = count > 0;
        }
        else {
            displayable = alias05.call(this)
        }
        
        return displayable;
    }

    //Adds music for neutral units
    BaseTurnLogoFlowEntry._changeMusic = function() {
        var handle;
        var handleActive = root.getMediaManager().getActiveMusicHandle();
        var mapInfo = root.getCurrentSession().getCurrentMapInfo();
        var turnType = root.getCurrentSession().getTurnType();
        
        if (turnType === TurnType.PLAYER) {
            handle = mapInfo.getPlayerTurnMusicHandle();
        }
        else if (turnType === TurnType.ALLY) {
            handle = mapInfo.getAllyTurnMusicHandle();
        }
        else if (turnType == TurnType.ENEMY) {
            handle = mapInfo.getEnemyTurnMusicHandle();
        }
        else {
            handle = FactionControl.getNeutralMusicHandle(mapInfo);
        }
        
        // Play only if it's music which differs from the current music.
        if (!handle.isEqualHandle(handleActive)) {
            MediaControl.resetMusicList();
            MediaControl.musicPlayNew(handle);
        }
    }

    //Ensures that neutral units can't go through enemy units and viceversa  
    BlockerRule.Neutral = defineObject(BaseBlockerRule, {

        isRuleApplicable: function(unit) {
            return unit.getUnitType() == UnitType.ENEMY; //Default getUnitType always return UnitType.ENEMY for both enemy and neutral units
        },

        isTargetBlocker: function(unit, targetUnit) {
            var unitType = FactionControl.getUnitType(unit);
            var targetType = FactionControl.getUnitType(targetUnit);

            return unitType != targetType;
        }

    })

    var alias06 = SimulationBlockerControl._configureBlockerRule;
    SimulationBlockerControl._configureBlockerRule = function(groupArray) {
        alias06.call(this, groupArray);
        groupArray.appendObject(BlockerRule.Neutral);
    }
    
    //The unit menus screen lets you cycle through units of the same faction.
    //With this change, neutral units are from a separate faction, so enemy and neutral untis are no longer mixed during the cycle.
    var alias07 = UnitMenuScreen._getUnitList;
    UnitMenuScreen._getUnitList = function(unit) {
        var list = alias07.call(this, unit);
        var finalList;
        var unitType = FactionControl.getUnitType(unit)
        if (unitType == UnitType.NEUTRAL || unitType == UnitType.ENEMY) {
            var listArray = [];
            var otherUnit;
            for (var i=0; i<list.getCount(); i++) {
                otherUnit = list.getData(i);
                if (FactionControl.getUnitType(otherUnit) == unitType) {
                    listArray.push(otherUnit);
                }
            }

            finalList = StructureBuilder.buildDataList();
            finalList.setDataArray(listArray);
        }
        else {
            finalList = list;
        }

        return finalList;
    }

    //Adds the Neutral army to the Objective screen
    var alias08 = ObjectiveWindow.getWindowWidth;
    ObjectiveWindow.getWindowWidth = function() {
        return FactionControl.objectiveEnabled() ? 740 : alias08.call(this);
    }

    var alias09 = ObjectiveFaceZone.drawFaceZone;
    ObjectiveFaceZone.drawFaceZone = function(x, y) {
        if (FactionControl.objectiveEnabled()) {
            var i, unitType, unit;
            var arr = [UnitType.PLAYER, UnitType.ENEMY, UnitType.ALLY, UnitType.NEUTRAL];
            var count = arr.length;
            
            x += 15;
            y -= 10;
            
            for (i = 0; i < count; i++) {
                unitType = arr[i];
                
                unit = this._getLeaderUnit(unitType);
                if (unit !== null) {
                    this._drawFaceImage(x, y, unit, unitType);
                    this._drawInfo(x, y, unit, unitType);
                }
                
                x += 180;
            }
        }
        else {
            alias09.call(this, x, y);
        }        
    }

    var alias10 = ObjectiveFaceZone._drawInfo;
    ObjectiveFaceZone._drawInfo = function(x, y, unit, unitType) {
        if (FactionControl.objectiveEnabled()) {
            var textui = this._getTitleTextUI();
            var color = ColorValue.KEYWORD;
            var font = textui.getFont();
            var pic = textui.getUIImage();
            var text = [StringTable.UnitType_Player, StringTable.UnitType_Enemy, StringTable.UnitType_Ally, 'ENEMY'];
            
            y += 112;
            
            TitleRenderer.drawTitle(pic, x - 20 + 5, y - 10, TitleRenderer.getTitlePartsWidth(), TitleRenderer.getTitlePartsHeight(), 3);
            TextRenderer.drawText(x + 5, y + 12, text[unitType], -1, color, font);
            NumberRenderer.drawNumber(x + 100 + 5, y + 7, this._getTotalValue(unitType));
        }
        else {
            alias10.call(this, x, y, unit, unitType);
        }        
    }

    var alias11 = ObjectiveFaceZone._getTotalValue;
    ObjectiveFaceZone._getTotalValue = function(unitType) {        
        var count = 0;
        if (FactionControl.objectiveEnabled()) {
            var list;
            if (unitType === UnitType.PLAYER) {
                list = PlayerList.getSortieDefaultList();
            }
            else if (unitType === UnitType.ENEMY) {
                list = FactionControl.getEnemyList();
            }
            else if (unitType === UnitType.ALLY) {
                list = AllyList.getAliveDefaultList();
            }
            else {
                list = FactionControl.getNeutralList();
            }
            
            count = list.getCount();
        }
        else {
            count = alias11.call(this, unitType);
        }

        return count;        
    }

    var alias12 = ObjectiveFaceZone._getLeaderUnit;
    ObjectiveFaceZone._getLeaderUnit = function(unitType) {
        var unit = null;
        if (FactionControl.objectiveEnabled()) {
            var i, list, count;
            var unit = null;
            var firstUnit = null;
            
            if (unitType === UnitType.PLAYER) {
                list = PlayerList.getMainList();
            }
            else if (unitType === UnitType.ENEMY) {
                list = FactionControl.getEnemyList();
            }
            else if (unitType === UnitType.ALLY) {
                list = AllyList.getMainList();
            }
            else {
                list = FactionControl.getNeutralList();
            }
            
            count = list.getCount();
            if (count === 0) {
                return null;
            }
            
            for (i = 0; i < count; i++) {
                unit = list.getData(i);
                if (unit.getSortieState() === SortieType.UNSORTIE) {
                    continue;
                }
                
                if (unit.getAliveState() === AliveType.ERASE) {
                    continue;
                }
                
                if (firstUnit === null) {
                    firstUnit = unit;
                }
                
                if (unit.getImportance() === ImportanceType.LEADER) {
                    break;
                }
            }
            
            // A leader cannot be found, so first unit to be found is a target.
            if (i === count) {
                unit = firstUnit;
            }
        }
        else {
            unit = alias12.call(this, unitType);
        }
        
        return unit;
    }

    UIBattleLayout._drawLifeGadget = function(x, y, battler) {
		var handle = root.queryGraphicsHandle('battlecrystal');
		var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.PICTURE);
		var dx = 0;
		var type = FactionControl.getUnitType(battler.getUnit());
		
		if (type === UnitType.PLAYER) {
			dx = 0;
		}
		else if (type === UnitType.ENEMY) {
			dx = 84;
		}
		else if (type == UnitType.ALLY) {
			dx = 168;
        }
        else if (type == UnitType.NEUTRAL) {
            dx = 252;
        }
		
		if (pic !== null) {
			pic.drawStretchParts(x, y, 84, 84, dx, 0, 84, 84);
		}
	}

})()
