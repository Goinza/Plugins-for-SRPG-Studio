//Plugin by Goinza

function throwError024(map) {
    var message = "Error 24." + '\n' + "There is a problem with the chapter " + map.getName() + "." + '\n' + "Check the custom parameter 'ballista'.";
    root.msg(message);
    root.endGame();
}

function throwError025(map) {
    var message = "Error 25." + '\n' + "There is a problem with the chapter " + map.getName() + "." + '\n' + "Check that the Opening Event is calling the BallistaControl.addBallista function.";
    root.msg(message);
    root.endGame();
}

function throwError026() {
    var message = "Error 26." + '\n' + "There is a problem with the current chapter." + '\n' + "Check that the Opening Event is calling the MagicAttackControl.setSpellsAllUnits function.";
    root.msg(message);
    root.endGame();
}

function throwError027(skill) {
    var message = "Error 27." + '\n' + "There is a problem with the skill " + skill.getName() + "." + '\n' + "Check the custom paramters 'weapon' or 'item'.";
    root.msg(message);
    root.endGame();
}