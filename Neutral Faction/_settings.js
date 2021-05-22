//Plugin by Goinza

var NeutralSettings = {
    FRAME: {                    //The graphic shows when the phase of the army starts. By default, the "Enemy Phase" graphic is used
        isRuntime: true, 
        id: 5
    },
    WINDOW: {                   //The texture used for the neutral army on some windows. By default, it uses the same texture as the enemy army.
        isRuntime: true,
        id: 6
    },
    ADD_OBJECTIVE_WINDOW: true , //If true, the neutral faction will show up in the Objective window. If it is false, it will be merged with the enemy faction.
    //Be aware that this option makes the Objective window wider, so it may not fit in a project with small maps
    NAME_FACTION: "NEUTRAL", //Used by the objective screen
    SYMBOL_COLOR: 0xECD932,  //Color used for the shadow under the unit when the setting "Map Unit Symbol" is enabled
    GAUGE: {                 //Graphic used to render the hp bar over the map sprite when the setting "Map Unit HP" is set to "Gauge"
        isRuntime: true,
        id: 1,
        colorIndex: 2
    }
}