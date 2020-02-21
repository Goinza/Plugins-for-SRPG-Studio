function throwError023(weapon) {
    var message = "Error 23." + '\n' + "There is a problem with the weapon " + weapon.getName() + "." + '\n' + "Check its customs parameters.";
    root.msg(message);
    root.endGame();
}