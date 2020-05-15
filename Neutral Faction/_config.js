//Plugin by Goinza and Lady Rena

var neutralSettings = {
    ADD_OBJECTIVE_WINDOW: false, //If true, the neutral faction will show up in the Objective window. If it is false, it will be merged with the enemy faction.
                                    //Be aware that this option makes the Objective window wider, so it may not fit in a project with small maps
    FRAME: {                    //The graphic shows when the phase of the army starts. By default, the "Enemy Phase" graphic is used
        isRuntime: true, 
        id: 5
    },
    WINDOW: {                   //The texture used for the neutral army on some windows. By default, it uses the same texture as the enemy army.
        isRuntime: true,
        id: 6
    },
    NAME_FACTION: "Enemy" //Used by the objective screen
}