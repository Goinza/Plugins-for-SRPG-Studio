//Plugin by Goinza

function throwError029(item) {
    var message = "Error 29." + '\n' + "There is a problem with the item " + item.getName() + "." + '\n' + "Check the custom parameter 'lifeCost'.";
    root.msg(message);
    root.endGame();
}