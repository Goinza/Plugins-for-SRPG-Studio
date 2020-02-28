//Plugin by Goinza

function throwError31(terrain) {
    var message = "Error 31." + '\n' + "There is a problem with the terrain " + terrain.getName() + "." + '\n' + "Check the custom parameter 'wall'.";
    root.msg(message);
    root.endGame();
}

function throwError32(terrain) {
    var message = "Error 32." + '\n' + "There is a problem with the terrain " + terrain.getName() + "." + '\n' + "Check the custom parameter 'cover'.";
    root.msg(message);
    root.endGame();
}