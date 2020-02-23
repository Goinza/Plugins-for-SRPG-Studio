//Plugin by Goinza

function throwError028(weapon) {
    var message = "Error 28." + '\n' + "There is a problem with the weapon " + weapon.getName() + "." + '\n' + "Check the custom parameter 'hybridAttack'.";
    root.msg(message);
    root.endGame();
}