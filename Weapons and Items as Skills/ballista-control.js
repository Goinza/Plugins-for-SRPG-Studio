//Plugin by Goinza

var BallistaControl = {
    
    addBallista: function() {
		var map = root.getCurrentSession().getCurrentMapInfo();
        var ballista = map.custom.ballista;
        var terrain1, terrain2, skill, weapon;
        if (ballista!=null) {
			if (typeof ballista.length != 'number') {
				throwError024(map);
			}
            for (var i=0; i<ballista.length; i++) {
				if (typeof ballista[i].x != 'number' || typeof ballista[i].y != 'number' || typeof ballista[i].skill != 'number') {
					throwError024(map);
				}
                terrain1 = PosChecker.getTerrainFromPos(ballista[i].x, ballista[i].y);
                terrain2 = PosChecker.getTerrainFromPosEx(ballista[i].x, ballista[i].y);      
                skill = terrain1!=null ? terrain1.getSkillReferenceList().getTypeData(0) : null;
                if (skill!=null) {
                    weapon = root.duplicateItem(root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));
                    ballista[i].weapon = weapon;
                }
                else {
                    skill = terrain2!=null ? terrain2.getSkillReferenceList().getTypeData(0) : null;
                    if (skill!=null) {
                        weapon = root.duplicateItem(root.getBaseData().getWeaponList().getDataFromId(skill.custom.weapon));
                        ballista[i].weapon = weapon;
                    }
                    else {
                        throwError024(map);
                    }
                }
            }
        }
    },

    searchWeapon: function(x, y) {
		var weapon = null;
		var map = root.getCurrentSession().getCurrentMapInfo();
        var ballista = map.custom.ballista;
        if (ballista!=null) {
			if (typeof ballista.length != 'number') {
				throwError025(map);
			}
            var i = 0;
            var found = false;
            while (i<ballista.length && !found) {
				if (typeof ballista[i].x != 'number' || typeof ballista[i].y != 'number' || typeof ballista[i].skill != 'number' || typeof ballista[i].weapon != 'object') {
					throwError025(map);
				}
                if (ballista[i].x == x && ballista[i].y == y) {
                    weapon = ballista[i].weapon;
                    found = true;
                }
                i++;
            }
		}

        return weapon;
    }
}