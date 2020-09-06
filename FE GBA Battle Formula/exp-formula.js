//Plugin by Goinza
(function() {

    /*
    Class power = 3
    Class Bonus A = 0/20
    Class Bonus B = 0/60
    Boss Bonus = 40
    */

    //Always 1
    ExperienceCalculator._getNoDamageExperience = function(data) {
        return this._getValidExperience(1);
    }

    //[31 + (enemy's Level + enemy's Class bonus A) - (Level + Class bonus A)] / Class power    
    ExperienceCalculator._getNormalValue = function(data) {
        var passiveLv = data.passive.getLv();
        var passiveClass = data.passive.getClass();
        var passiveBonus = passiveClass.getClassRank() == ClassRank.LOW ? 0 : 20;
        var activeLv = data.active.getLv();
        var activeClass = data.active.getClass();
        var activeBonus = activeClass.getClassRank() == ClassRank.LOW ? 0 : 20;

        var finalExp = (31 + (passiveLv + passiveBonus) - (activeLv + activeBonus)) / 3;

        return this._getValidExperience(finalExp);
    }

    //Experience from defeating (base) = [(enemy's Level x enemy's Class power) + enemy's Class bonus B] - { [(Level x Class power) + Class bonus B] / Mode coefficient }
    //Experience from defeating enemy = Experience from doing damage + [Experience from defeating (base) + 20 + Boss bonus, take as 0 if negative]
    ExperienceCalculator._getVictoryExperience = function(data) {
        var passiveLv = data.passive.getLv();
        var passiveClass = data.passive.getClass();
        var passiveBonus = passiveClass.getClassRank() == ClassRank.LOW ? 0 : 60;
        var activeLv = data.active.getLv();
        var activeClass = data.active.getClass();
        var activeBonus = activeClass.getClassRank() == ClassRank.LOW ? 0 : 60;

        var baseExp = (passiveLv * 3 + passiveBonus) - (activeLv * 3 + activeBonus);
        var bossBonus = data.passive.getImportance() == ImportanceType.LEADER ? 20 : 0;
        var aux = baseExp + 20 + bossBonus;
        aux = aux>0 ? aux : 0;

        var finalExp = this._getNormalValue(data) + aux;

        return this._getValidExperience(finalExp);
    }

})()