ENEMY RANGE DISPLAY
By Goinza
Version 1.0
April 4, 2020

This plugin adds two features regarding the display of enemy range:
    -First, it adds an individual enemy range, which keep tracks of certain units' range. Each individual range is activated or deactivaded by pressing the select
        button while the cursor is over that unit.
    -Also, you can now edit the color and transparency of the enemy range. You can also assign a different color and transparency to the individual enemy range.

HOW TO USE
This plugin doesn't require any custom parameters. Instead, you need to change the values on the config-range.js using a text editor like Notepad.
The variable called ENEMY_RANGE is for the normal enemy range that applies to the entire enemy army, 
and the variable INDIVIDUAL_RANGE is the enemy range that you can apply to individual enemy units.
In both cases, to change the color you need to use an RGB value, and for the transparency you need to change the alpha number using a value between 0 and 255.

INDIVIDUAL ENEMY RANGE
With this plugin you can select an enemy unit to mark it and see only its range.
Once this is done, you can select it again to unmark it. You can also mark another unit to see the range of more that one unit at the same time.

INCOMPATIBILITY ISSUES
This plugin is not compatbile with other plugins that use the following functions:
    - MapEdit._selectAction from map-mapeditor.js line 138
    - MarkingPanel._getColor from utility-panel.js line 468
    - MarkingPanel._getAlpha from utility-panel.js line 472