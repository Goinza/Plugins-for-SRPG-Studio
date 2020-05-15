Neutral Faction
By Goinza
Version 1.0
May 15, 2020
Credits to Lady Rena for her contributions to the code of the plugin,
    and to BlueLeafy for the edits to the graphical assets that come with this plugin.

This plugin allows you to create a new faction of units, which will be hostile to all other factions (player, ally and enemy).
This faction will also have its own phase that starts after the ally faction ends its turn. The faction will be controlled by the AI.

CREATING A NEUTRAL UNIT
To create a neutral unit, first you need to create a normal enemy unit and assign it the custom parameter {neutralFaction: true}.
This "neutralFaction" is the only parameter you need to make the plugin work. There are other options that you can modify, but they are optional.

ASSIGN A MUSIC FILE TO THE NEUTRAL FACTION
By default, the neutral phase will have the same music used in the enemy phase, unless it is specified through a map custom parameter.
The parameter is called "neutralMusic", and its value is the ID of a song you have imported to the editor.
For example: {neutralMusic: 4} will use the song that has the ID 4.
NOTE: this parameter can't be used to select the default music included with the engine. If you want to use one of those songs, export the music file
and then import it to the project.

CUSTOMIZATION OF OTHER SETTINGS
The plugin comes with a file called _config.js that can be openend and edited without any programming knowledge. You can open it with Notepad or any other text editor.
The file comes with different variables, each of them with a default value assigned. Here is the list of the variables and the explanations of what each one does:
    - ADD_OBJECTIVE_WINDOW: a boolean value, can be true or false. If it is true, the neutral army will be shown separated from the enemy army when looking at the Objective screen.
        If it is false, both armies are shown as one. Note that if you make this variable true, the Objective screen will be wider, so it may not fit in the screen when using small maps.
    - NAME_FACTION: The name of the neutral faction. Used by the objective screen if the above value is set to true. By the default, the faction has the same name as the enemy army: "Enemy".
    - FRAME: this is the graphic shown when the phase of the neutral army starts. By default, the "Enemy Phase" graphic is used.
        To import a frame, you have to make sure the asset is in the UI->screenframe category. This can be accesse in the option Resources->UI.
        To change the asset, you need to change two values, one of them is the ID of the asset and the other is a boolean:
        -isRuntime: true if the asset used is a default asset that comes with the engine. False if it is an imported asset.
        -id: the ID of the selected asset.
    - WINDOW: this is the texture used for the neutral army on some windows. By default, it uses the same texture as the enemy army.
        To import a window's texture, you have to make sure the asset is in the UI->menuwindow category. This can be accesse in the option Resources->UI.
        To change the asset, you need to change two values, one of them is the ID of the asset and the other is a boolean:
        -isRuntime: true if the asset used is a default asset that comes with the engine. False if it is an imported asset.
        -id: the ID of the selected asset.

EXAMPLE ASSETS TO USE WITH THIS PLUGIN
There are two assets that are originally created by SapphireSoft, the developers of the engine, and then edited by BlueLeafy to be used on this plugin.
One of them is the frame used when the neutral phase starts, and the other is the texture used by neutral units on some windows.
IMPORTANT: don't let those files in the Plugin folder. Make sure to import them properly in the project if you want to use them.

INCOMPATIBILITY ISSUES
This plugin is not compatible with other plugins that use the following functions:
    - FilterControl.getListArray from singleton-unitlist.js line 232.
    - TurnControl.getActorList from singleton-unitlist.js line 147.
    - TurnChangeEnd._startNextTurn from map-turnchange.js line 203.
    - EasyAttackWindow._drawWindowInternal (override of BaseWindow._drawWindowInternal from base-objects.js).
    - PosBaseWindow._drawWindowInternal (override of BaseWindow._drawWindowInternal from base-objects.js).
    - BaseTurnLogoFlowEntry._changeMusic from map-turnchange.js 313.

If you have the value of ADD_OBJECTIVE_WINDOW set to true, then this plugin won't be compatile with other plugins that use the following functions:
    - ObjectiveWindow.getWindowWidth from screen-objective.js line 94.
    - ObjectiveFaceZone.drawFaceZone from screen-objective.js line 197.
    - ObjectiveFaceZone._drawInfo from screen-objective.js line 241-
    - ObjectiveFaceZone._getTotalValue from screen-objective.js line 255.
    - ObjectiveFaceZone._getLeaderUnit from screen-objective.js line 271.