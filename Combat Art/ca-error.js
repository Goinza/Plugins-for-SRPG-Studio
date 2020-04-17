//Plugin by Goinza

function throwError036(combatArt) {
    var message = "Error 36." + '\n' + "There is a problem with the Original Data " + combatArt.getName() + "." + '\n' + "Check the custom parameter 'cost'.";
    root.msg(message);
    root.endGame();
}

function throwError037(combatArt) {
    var message = "Error 37." + '\n' + "There is a problem with the Original Data " + combatArt.getName() + "." + '\n' + "Check the custom parameters 'startRange' and/or 'endRange'.";
    root.msg(message);
    root.endGame();
}

function throwError039(combatArt) {
    var message = "Error 39." + '\n' + "There is a problem with the Original Data " + combatArt.getName() + "." + '\n' + "Check the custom keyword.";
    root.msg(message);
    root.endGame();
}

function throwError040(unit) {
    var message = "Error 40." + '\n' + "There is a problem with the unit " + unit.getName() + "." + '\n' + "Check the custom parameter 'combatArt'.";
    root.msg(message);
    root.endGame();
}

function throwError047() {
    var message = "Error 47." + '\n' + "There is a problem with an event command." + '\n' + "Check the that the Value 1 is a valid number.";
    root.msg(message);
    root.endGame();
}