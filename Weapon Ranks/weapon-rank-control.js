//Plugin by Goinza

WeaponRankControl = {

    //Changes a rank value of an unit.
    //Used by events to test play different rank values
    setWeaponRank: function(unitID, weaponType, value) {
        var unitList = PlayerList.getSortieList();
        var unitFound = false;
        var unit;
        var j = 0;
        while (j<unitList.getCount() && !unitFound) {
            unit = unitList.getData(j);
            unitFound = unit.getId()==unitID && !unit.isGuest();
            j++;            
        }

        var rankArray = unit.custom.rank!=null ? unit.custom.rank : null;  
        if (rankArray!=null) {
            if (typeof rankArray.length != 'number' || typeof rankArray[0].length != 'number') {
                throwError007(unit);
            }
            var i = 0;
            var found = false;
            while (i<rankArray.length && !found) {
                //[i][0] is the name of the rank. [i][1] is the value of the rank
                if (rankArray[i][0]==weaponType) {
                    found = true;
                    unit.custom.rank[i][1] = value;
                }
                i++;
            }
            if (!found) {              
                unit.custom.rank[i] = [];
                unit.custom.rank[i][0] = weaponType;
                unit.custom.rank[i][1] = value;
            }      
        }
        else {
            unit.custom.rank = [];
            unit.custom.rank[0] = [];
            unit.custom.rank[0][0] = weaponType;
            unit.custom.rank[0][1] = value;
        }
    },

    //Give a rank value, returns the lowest number associated to the rank
    rankToNumber: function(rank) {
        var number;

        //RANK_SYSTEM[i][0] is the name of the rank. RANK_SYSTEM[i][1] is the value of the rank.
        if (rank==RANK_SYSTEM[0][0]) {
            number = RANK_SYSTEM[0][1];
        }
        else {
            var i = 1;
            var found = false;
            while (i<RANK_SYSTEM.length-1 && !found) {
                if (rank==RANK_SYSTEM[i][0]) {
                    number = RANK_SYSTEM[i][1];
                    found = true;
                }
                i++;
            }
    
            if (!found) {
                number = RANK_SYSTEM[RANK_SYSTEM.length-1][1];
            }
        }
        
        return number;
    },

    //Returns the letter of the weapon rank of this value
    numberToRank: function(value) {
        var text;

        //RANK_SYSTEM[i][0] is the name of the rank. RANK_SYSTEM[i][1] is the value of the rank.
        if (value==RANK_SYSTEM[0][1]) {
            text = RANK_SYSTEM[0][0];
        }
        else {
            var i = 1;
            var found = false;
            while (i<RANK_SYSTEM.length-1 && !found) {
                if (value>=RANK_SYSTEM[i][1] && value<RANK_SYSTEM[i+1][1]) {
                    text = RANK_SYSTEM[i][0];
                    found = true;
                }
                i++;
            }
    
            if (!found) {
                text = RANK_SYSTEM[RANK_SYSTEM.length-1][0];
            }
        }
        
        return text;
    },

    //Returns the lowest value possible without changing the rank
    numberToMinRank: function(value) {
        var minRank;

        if (value==RANK_SYSTEM[0][1]) {
            minRank = RANK_SYSTEM[0][1];
        }
        else {
            var i = 1;
            var found = false;
            while (i<RANK_SYSTEM.length-1 && !found) {
                if (value>=RANK_SYSTEM[i][1] && value<RANK_SYSTEM[i+1][1]) {
                    minRank = RANK_SYSTEM[i][1];
                    found = true;
                }
                i++;
            }
    
            if (!found) {
                minRank = RANK_SYSTEM[RANK_SYSTEM.length-1][1];
            }
        }  
        
        return minRank;
    },

    //Returns the lowest value possible so that it belongs to the next rank
    numberToMaxRank: function(value) {
        var maxRank;

        if (value==RANK_SYSTEM[0][1]) {
            maxRank = RANK_SYSTEM[0][1];
        }
        else {
            var i = 1;
            var found = false;
            while (i<RANK_SYSTEM.length-1 && !found) {
                if (value>=RANK_SYSTEM[i][1] && value<RANK_SYSTEM[i+1][1]) {
                    maxRank = RANK_SYSTEM[i+1][1];
                    found = true;
                }
                i++;
            }
    
            if (!found) {
                maxRank = RANK_SYSTEM[RANK_SYSTEM.length-1][1];
            }
        }   

        return maxRank;
    },

    //Called every time an unit gains weapon experience
    checkRankUp: function(unit, paramType, delta) {
        var newValue = ParamGroup.getClassUnitValue(unit, paramType);
        var oldValue = newValue - delta;

        var oldRank = this.numberToRank(oldValue);
        var newRank = this.numberToRank(newValue);

        if (oldRank!=newRank) {
            this._saveRankUp(unit, paramType);
        }
    },

    //Saves the information related to the new rank up
    _saveRankUp: function(unit, paramType) {
        var weaponType = ParamGroup.getParameterName(paramType);
        var message = "Rank up: " + weaponType;

        root.getMetaSession().global.rankUpData = {};
        root.getMetaSession().global.rankUpData.unit = unit;
        root.getMetaSession().global.rankUpData.message = message;
        root.getMetaSession().global.rankUpData.rank = this.numberToRank(ParamGroup.getClassUnitValue(unit, paramType));
        root.getMetaSession().global.rankUpData.weaponType = weaponType;
    },

    //Shows the rank up. It also gives the unit the skill(s) related to that new rank.
    showRankUp: function() {
        var rankUpData = root.getMetaSession().global.rankUpData;

        if (rankUpData!=null) {
            var dynamicEvent = createObject(DynamicEvent);
            var generator = dynamicEvent.acquireEventGenerator();

            this._generateMessage(rankUpData, generator);
            this._assignNewSkill(rankUpData, generator);

            root.getMetaSession().global.rankUpMessage = null;
            dynamicEvent.executeDynamicEvent();
            root.getMetaSession().global.rankUpData = null;
        }    
    },

    //Message saying the unit gained a new rank
    _generateMessage: function(rankUpData, generator) {
        //generator.messageTerop(rankUpData.message, MessagePos.CENTER, true);
        generator.messageTitle(rankUpData.message, 0, 0, true)
    },

    //Gives the unit the skill(s) related to the new rank earned
    //Use custom paramter rankSkills to make it work. For example: {rankSkills: [ ["Sword", "D", 15], ["Sword", "C", 20], ["Lance", "C", 23] ] }
    _assignNewSkill: function(rankUpData, generator) {
        var unit = rankUpData.unit;
        var rankSkills = unit.custom.rankSkills;
        var currentRank = rankUpData.rank;
        var weaponType = rankUpData.weaponType; //Name of the weapon type

        //Rank skills of the unit
        if (rankSkills!=null) {
            if (typeof rankSkills.length != 'number' || typeof rankSkills[0].length != 'number') {
                throwError010(unit);
            }
            //rankSkills[i][0] is the name of the weapon type, rankSkills[i][1] is the rank value ("C", "B", etc) and rankSkills[i][2] is the ID of the skill.
            var skill;
            for (var i=0; i<rankSkills.length; i++) {
                if (rankSkills[i][0]==weaponType && rankSkills[i][1]==currentRank) {
                    skill = root.getBaseData().getSkillList().getDataFromId(rankSkills[i][2]);
                    generator.skillChange(unit, skill, IncreaseType.INCREASE, false);
                    SkillGranter.checkItemSkill(unit, skill);
                }
            }
        }

        //Rank skill of the weapon type
        var wpnTypeList;
        var wpnType; //The weapon type object
        var found = false;
        var i = 0;
        var j = 0;
        while (i<=3 && !found) {
            wpnTypeList = root.getBaseData().getWeaponTypeList(0);
            while (j<wpnTypeList.getCount() && !found) {
                wpnType = wpnTypeList.getData(j);
                found = wpnType.getName()==weaponType;
                j++;
            }
            i++;
        }
        if (found) {
            rankSkills = wpnType.custom.rankSkills;
            if (rankSkills!=null) {
                if (typeof rankSkills.length != 'number' || typeof rankSkills[0].length != 'number') {
                    throwError011(wpnType);
                }
                //rankSkills[i][0] is the rank value ("C", "B", etc) and rankSkills[i][1] is the ID of the skill.
                var skill;
                for (var i=0; i<rankSkills.length; i++) {
                    if (rankSkills[i][0]==currentRank) {
                        skill = root.getBaseData().getSkillList().getDataFromId(rankSkills[i][1]);
                        generator.skillChange(unit, skill, IncreaseType.INCREASE, false);
                        SkillGranter.checkItemSkill(unit, skill);
                    }
                }
            }
        }
    }
}