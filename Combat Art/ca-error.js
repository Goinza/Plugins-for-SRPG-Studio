function throwError035(skill) {
    var message = "Error 35." + '\n' + "There is a problem with the skill " + skill.getName() + "." + '\n' + "Check the custom parameter 'artSkill'.";
    root.msg(message);
    root.endGame();
}

function throwError036(skill) {
    var message = "Error 36." + '\n' + "There is a problem with the skill " + skill.getName() + "." + '\n' + "Check the custom parameter 'cost'.";
    root.msg(message);
    root.endGame();
}

function throwError037(skill) {
    var message = "Error 37." + '\n' + "There is a problem with the skill " + skill.getName() + "." + '\n' + "Check the custom parameters 'startRange' and/or 'endRange'.";
    root.msg(message);
    root.endGame();
}

function throwError038(skill) {
    var message = "Error 38." + '\n' + "There is a problem with the skill " + skill.getName() + "." + '\n' + "Check the custom parameters 'weaponName' and/or 'weaponType.";
    root.msg(message);
    root.endGame();
}