//Plugin by Goinza

var CoverControl = {

    hasLineOfSight: function(active, passive) {
        var activeX = active.getMapX() + 0.5;
        var activeY = active.getMapY() + 0.5;
        var passiveX = passive.getMapX() + 0.5;
        var passiveY = passive.getMapY() + 0.5;

        var vector = {x: passiveX-activeX, y: passiveY-activeY}; //Vector from active to passive

        var lineX = activeX;
        var lineY = activeY;
        var movX, movY, terrain;
        var sight = true;
        if (Math.abs(vector.y)>Math.abs(vector.x)) {
            movX = (vector.x / vector.y) / 4;
            movY = vector.y>0 ? 0.25 : -0.25;
            while (lineY!=passiveY && sight) {
                lineX += movX;
                lineY += movY;
                terrain = PosChecker.getTerrainFromPos(Math.floor(lineX), Math.floor(lineY));
                sight = !this.isWall(terrain);
            }
        }
        else {
            movX = vector.x>0 ? 0.25 : -0.25;
            movY = (vector.y / vector.x) / 4;
            while (lineX!=passiveX && sight) {
                lineX += movX;
                lineY += movY;
                terrain = PosChecker.getTerrainFromPos(Math.floor(lineX), Math.floor(lineY));
                sight = !this.isWall(terrain);
            }
        }        

        return sight;
    },

    //The active unit is attacking the passive unit.
    //The cover bonus defense applies to the passive unit if it has a cover next to it.
    getCoverBonus: function(active, passive) {
        var activeX = active.getMapX() + 0.5;
        var activeY = active.getMapY() + 0.5;
        var passiveX = passive.getMapX() + 0.5;
        var passiveY = passive.getMapY() + 0.5;

        var vector = {x: activeX-passiveX, y: activeY-passiveY}; //Vector from passive to active

        var lineX = passiveX;
        var lineY = passiveY;
        var movX, movY, terrain, cover;
        
        if (Math.abs(vector.y)>Math.abs(vector.x)) {
            movX = (vector.x / vector.y);
            movY = vector.y>0 ? 1 : -1;
            lineX += movX;
            lineY += movY;
            terrain = PosChecker.getTerrainFromPos(Math.floor(lineX), Math.floor(lineY));
            cover = this.getCoverValue(terrain);
        }
        else {
            movX = vector.x>0 ? 1 : -1;
            movY = (vector.y / vector.x);
            lineX += movX;
            lineY += movY;
            terrain = PosChecker.getTerrainFromPos(Math.floor(lineX), Math.floor(lineY));
            cover = this.getCoverValue(terrain);
        }

        return cover;
    },

    isWall: function(terrain) {
        var isWall = false;
        if (terrain.custom.wall!=null) {
            if (typeof terrain.custom.wall != 'boolean') {
                throwError31(terrain);
            }
            isWall = terrain.custom.wall;
        }
        return isWall;
    },

    getCoverValue: function(terrain) {
        var cover = {dmg: 1, hit: 1, crit: 1};
        if (terrain.custom.cover!=null) {
            if (typeof terrain.custom.cover != 'object') {
                throwError32(terrain);
            }

            if (terrain.custom.cover.dmg!=null) {
                if (typeof terrain.custom.cover.dmg != 'number') {
                    throwError32(terrain);
                }
                cover.dmg = terrain.custom.cover.dmg;
            }
            
            if (terrain.custom.cover.hit!=null) {
                if (typeof terrain.custom.cover.hit != 'number') {
                    throwError32(terrain);
                }
                cover.hit = terrain.custom.cover.hit;
            }

            if (terrain.custom.cover.crit!=null) {
                if (typeof terrain.custom.cover.crit != 'number') {
                    throwError32(terrain);
                }
                cover.crit = terrain.custom.cover.crit;
            }
        }
        
        return cover;
    },

    getVectorScale: function() {
        return 0.25;
    }

}