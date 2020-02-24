//Plugin by Goinza

function throwError030(unitClass) {
    var message = "Error 24." + '\n' + "There is a problem with the class " + unitClass.getName() + "." + '\n' + "Check the custom parameter 'skills'.";
    root.msg(message);
    root.endGame();
}