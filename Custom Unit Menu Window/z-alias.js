//Plugin by Goinza

(function() {

    UnitMenuBottomWindow = CustomBottomUnitWindow;

    var alias1 = UnitMenuScreen._configureBottomWindows;
    UnitMenuScreen._configureBottomWindows = function(groupArray) {
        alias1.call(this, groupArray);
        var window;
        for (var i=1; i<Options.WINDOWS_COUNT; i++) {
            window = createWindowObject(CustomBottomUnitWindow, this);
            window.setIndex(i);
            groupArray.push(window); 
        }
    }    

})()