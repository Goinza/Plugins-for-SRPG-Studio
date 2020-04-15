//Plugin by Goinza

function throwError041(weapon) {
    var message = "Error 41." + '\n' + "There is a problem with the weapon " + weapon.getName() + "." + '\n' + "Check the custom parameter 'hybrid'.";
    root.msg(message);
    root.endGame();
}