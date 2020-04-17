//Plugin by Goinza

function throwError042(obj) {
    var message = "Error 42." + '\n' + "There is a problem with the object " + obj.getName() + "." + '\n' + "Check the custom parameter 'trait'.";
    root.msg(message);
    root.endGame();
}

function throwError043(item) {
    var message = "Error 43." + '\n' + "There is a problem with the item " + item.getName() + "." + '\n' + "Check the custom parameter 'reqTrait'.";
    root.msg(message);
    root.endGame();
}

function throwError044(weapon) {
    var message = "Error 43." + '\n' + "There is a problem with the weapon " + weapon.getName() + "." + '\n' + "Check the custom parameter 'effTrait'.";
    root.msg(message);
    root.endGame();
} 

function throwError045(item) {
    var message = "Error 45." + '\n' + "There is a problem with the item " + weapon.getName() + "." + '\n' + "Check the custom parameter 'addTrait' and the keyword 'Trait'.";
    root.msg(message);
    root.endGame();
}

function throwError046(originalData) {
    var message = "Error 46." + '\n' + "There is a problem with the Original Data " + originalData.getName() + "." + '\n' + "Check that the keyword is 'Trait'.";
    root.msg(message);
    root.endGame(); 
}