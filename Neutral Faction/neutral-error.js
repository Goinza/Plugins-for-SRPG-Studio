//Plugin by Goinza

function throwError048(unit) {
    var message = "Error 48." + '\n' + "There is a problem with the unit " + unit.getName() + "." + '\n' + "Check the custom parameter 'neutralFaction'.";
    root.msg(message);
    root.endGame();
}

function throwError049(map) {
    var message = "Error 49." + '\n' + "There is a problem with the map " + map.getName() + "." + '\n' + "Check the custom parameter 'neutralMusic'.";
    root.msg(message);
    root.endGame();
}