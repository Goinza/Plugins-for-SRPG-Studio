Custom Unit Menu Window
By Goinza
Version 1.1
May 9, 2020

This plugin adds a new window to the unit menu screen, which shows data from the unit that is not available by default.
The data that will be displayed will be choosen by the user from the list of data that was added to the plugin.
You don't need to use custom parameters and you don't need to know about progamming. To modify the window, you only need to change some options (more detailed instructions below).
For example, you can make window things like races, states, class type, among other things.

HOW THE WINDOW WORKS
The window is divided into four sectors: top left, top right, bottom left and bottom right.
Each of these sector can hold one type of data. In particular, the top sectors are bigger than the bottom ones,
so they can have more detailed information. 
For example, if you insert the races in a top sector, you can see the name and icon of the race, but if you add it to a bottom sector, you can only see the icon.
Note that not all data is available in all sectors. Some are exclusive to top and some to bottom.
In addition to that, most data can be selected, which allows to show the description of the data below the window. In the example used above, it would show
the description of the selected race.

HOW TO ASSIGN DATA TO EACH SECTOR
To assign data to a sector, you need to open the _config.js file with a text editor like Notepad. In there, you will find some variables.
The variables TOP_OPTIONS and BOTTOM_OPTIONS have the data available to use, while the Options variable is where you can assign one of those data options.
    - TOP_OPTIONS: this is an array containing with all the options available for top sectors:
        - NullInteraction: Empty space. Used when you don't want to fill this sector with data.
        - TopRaceInteraction: Races list. Shows name and icon.
        - TopStateInteraction: States list. While by default the game shows the current states of an unit, this will let you see its name and description.
        - GrowthInteraction: Unit's growth values.
        - SupportInteraction: Supports list.
        - TopTraitsInteraction: List of traits. This only works if you also have the plugin "Traits System" installed.
        - CustomCombatArtsInteraction: List of combat arts. This only works if you also have the plugin "Combat Arts" installed.
    - BOTTOM_OPTIONS: this is an array containing with all the options available for bottom sectors:
        - NullInteraction: Empty space. Used when you don't want to fill this sector with data.
        - BottomRaceInteraction: Races list. Shows icon.
        - BottomStateInteraction: States list. While by default the game shows the current states of an unit, this will let you see its description.
        - ClassTypeInteraction: Class type of the unit's current class. Shows name and icon.
        - BottomTraitsInteraction: List of traits. This only works if you also have the plugin "Traits System" installed.
    - Options: this variable has 4 fields, where each field correspond to one of the window's sectors.
        Each field has its name explaning the sector that will be assigned, for example the field TOPLEFT is assigned to the top left sector. 
        There are two way to assign a value to the field:
            You can do something like TOP_OPTIONS[2], in this case you are using the third value found in the array of TOP_OPTIONS.
                Note that the index starts with zero, so the first element is TOP_OPTIONS[0], the second TOP_OPTIONS[1], and so on.
            The other option is to directly specify the name of the data, like for example writing BottomRaceInteraction or BottomStateInteraction.

INCOMPATIBILIY ISSUES
This plugin is compatible with all other plugins.

VERSION HISTORY
1.0 - April 19, 2020
	- Initial version
	
1.1 - May 9, 2020
	- Added option to see traits in the window. Requires the Traits System plugin.
    - Added option to see combat arts in the window. Requires the Combat Arts plugin.