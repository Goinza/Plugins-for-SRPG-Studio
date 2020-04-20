//Plugin by Goinza

(function() {

    var alias1 = UnitMenuScreen._configureBottomWindows;
    UnitMenuScreen._configureBottomWindows = function(groupArray) {
        alias1.call(this, groupArray);
        groupArray.appendWindowObject(CustomBottomUnitWindow);
    }

})()