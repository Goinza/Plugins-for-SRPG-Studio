Traits System
By Goinza
Version 1.1
May 9, 2020

This plugin allows you to add "traits" to units and classes, similar to how the "Races" option works.
The main difference is that races can only be assigned to classes, while traits can be assigned to units and classes.
In order to display the traits that an unit has, a new window has been added to the unit menu screen.

HOW TO CREATE TRAITS
Because traits are not something that comes with the engine, we will need to create an Original Data entry for each trait. In order to do this:
	-First, go to Tools->Options->Expert->Display original data on conifg tab and enable that option.
    -Now you can go to Database->Config->Original Data. This will take you to the Original Data window.
    -Inside, you have several tabs (default name go from tab 1 to tab 10). In the bottom left, you will find the "Create Original Data" button.
	-Once you have created an entry, you can select the icon, name and description. Only those values will be used for this plugin.
	-Finally, to identify the entry as a trait, you need to fill the Keyword field with "Trait". 
    -IMPORTANT: all Original Data related to traits must be in the same tab. 
        You also need to specify which tab are you going to use in the config-traits.js file.

CONFIGURATION OPTIONS
In the file config-traits.js you can modify some variables. In this plugin there are two variable to modify:
	-ENABLE_WINDOW: This is the value that will enable or disable the traits window. By default it is true, so the window will be visible.
	-TAB_TRAITS: This is the tab that will be used in the Original Data window. Note that 0 is the first tab, 1 is the second tab, and so on.
	-MENU_TITLE: This is the string that will show up as the title of the traits window.

HOW TO USE CUSTOM PARAMETERS
There are several custom parameters that can be used in this script, but all of them work the same way.
They are arrays of numbers, where each number is the ID of an Original Data entry. For example: {trait: [2, 3]} or {effTrait: [6]}
Here is the list of custom parameters available to use:
	- "trait: Used for units and classes. An unit will have all the traits specified by itself and its current class.
	- "reqTrait": Used for weapons and items. To use the weapon/item, the unit must have all the traits specified by this parameter.
	- "effTrait": Used for weapons. An unit attacking with a weapon will deal effective damage if the target unit has at least one of the traits specified by this parameter.
	- "addTrait": Used for custom items. The item must have the keyword "Trait". When the item is used on an unit, that unit will obtain all the traits specified by the parameter.

TRAIT EVENT COMMAND
You can create an event command that will add one trait to an unit.
To do this, create a Execute Script event command, select the Call Event Command type and, in the Object Name field, write "AddTrait".
Then, go to the Original Data tab and select the unit that will obtain the trait. Finally, use the Value 1 field to write the ID of the trait to add.

INCOMPATIBILITY ISSUES
This plugin is not compatible with other plugins that use the following functions:
	- ItemSentence.Effective.drawItemSentence from window-iteminfo.js line 355.
	- ItemSentence.Effective.getItemSentenceCount from window-iteminfo.js line 359.
	- ItemSentence.Only.drawItemSentence from window-iteminfo.js line 540.
	- ItemSentence.Only.getItemSentenceCount from window-iteminfo.js line 544.

VERSION HISTORY
1.0 - April 17, 2020
	- Initial version
	
1.1 - May 9, 2020
	- Added an option to enable or disable the traits window.