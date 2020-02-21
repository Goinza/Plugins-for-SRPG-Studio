//Plugin by Goinza

function throwError019(skill) {
    var message = "Error 19." + '\n' + "There is a problem with the skill " + skill.getName() + "." + '\n' + "Check the custom parameter 'type'.";
    root.msg(message);
    root.endGame();
}

function throwError020(skill) {
    var message = "Error 20." + '\n' + "There is a problem with the skill " + skill.getName() + "." + '\n' + "Check the custom parameter 'startRange'.";
    root.msg(message);
    root.endGame();
}

function throwError021(skill) {
    var message = "Error 21." + '\n' + "There is a problem with the skill " + skill.getName() + "." + '\n' + "Check the custom parameter 'endRange'.";
    root.msg(message);
    root.endGame();
}

function throwError022(item) {
    var message = "Error 22." + '\n' + "There is a problem with the item " + item.getName() + "." + '\n' + "Check the custom parameter 'magicRange'.";
    root.msg(message);
    root.endGame();
}