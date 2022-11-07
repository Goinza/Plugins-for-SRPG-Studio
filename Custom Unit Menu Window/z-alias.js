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

    var alias2 = DefineControl.getUnitMenuBottomWindowHeight;
    DefineControl.getUnitMenuBottomWindowHeight = function() {
        var height = alias2.call(this);
        height += ItemRenderer.getItemHeight();
        return height;
    }

})()
