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

function throwError050(unit) {
    var message = "Error 50." + '\n' + "There is a problem with the unit " + unit.getName() + "." + '\n' + "Check the custom paramters 'spells'.";
    root.msg(message);
    root.endGame();
}

function throwError051(originalData) {
    var message = "Error 50." + '\n' + "There is a problem with the Original Data entry " + originalData.getName() + "." + '\n' + "The entry should have the 'Spell' keyword.";
    root.msg(message);
    root.endGame();
}

function throwError052 () {
    var message = "Error 52." + '\n' + "Please disable the following config option in Database -> Config:" + '\n' + '\"Skip weapon select menu when only have 1 weapon\"';
    root.msg(message);
    root.endGame();
}
