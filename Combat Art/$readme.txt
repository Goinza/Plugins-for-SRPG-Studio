Combat Arts
By Goinza
Version 3.2
March 14, 2022

INTRODUCTION
This plugin allows you to use Combat Arts, which are special actions or attacks that have additional cost, either with life, weapon uses or the new (and optional) stamina stat.

IMPORTANT: This plugin only works for player-controlled units. AI units can't use combat arts.

ATTACK AND ACTION COMBAT ARTS
As mentioned earlier, they are two types of combat arts: one made for attacks and other for non-offensive actions.
The attack combat art will allow the unit to use a weapon and do a special attack, with extra effects, custom range and/or better stats.
The action combat art will recreate the use of an item without the need of the unit having said item.
Aside from that, they both have an additional cost: weapon uses (for attacks), life and stamina.

HOW TO CREATE A COMBAT ART
To make a combat art, you need to create a new Original Data. If you don't know how to use Original Data, check the instructions below.
There are multiple fields that you can write data, but some of them are ignored for the purposes of this plugin. 
Here is a list of all the values used and what do each do:
    -Value 1: Bonus to attack.
    -Value 2: Bonus to hit.
    -Value 3: Bonus to critical.
    -Value 4: Bonus to defense.
    -Value 5: Bonus to avoid.
    -Value 6: Bonus to critical avoid.
        Note: these values are only necessary for the attack combat arts.
    -Keyword: If the combat art is an attack, use "AttackCombatArt". If it is an action, use "ActionCombatArt":
    -Item: Only for action combat arts. The selected item will be the one that will generate the effect of the combat art.
        For example, if you select a healing item that targets adjacent allies, then the action combat art will do that exact effect, but without needing the unit to have the item.
    -Multiple Data: In here, you can select skills, weapons and weapon types. Only use this option for offensive combat arts.
        -Skills: Each skill marked will be added to the unit during the attack. This includes custom skills created by other plugins.
        -Weapons: If there is at least one weapon marked, then the unit can only use this combat art with one of those selected weapons.
            If no weapon is marked, the combat art is allowed for any weapon, unless there are additional restrictions for the weapon types.
        -Weapon Types: If there is at least one weapon type marked, then the unit can only use this combat art with one of those selected weapon types.
            If no weapon type is marked, the combat art is allowed for any weapon type, unless there are additional restrictions for specific weapons.

HOW TO CREATE ORIGINAL DATA
    -First, go to Tools->Options->Expert->Display original data on conifg tab and enable that option.
    -Now you can go to Database->Config->Original Data. This will take you to the Original Data window.
    -Inside, you have several tabs (default name go from tab 1 to tab 10). In the bottom left, you will find the "Create Original Data" button.
    -IMPORTANT: all Original Data related to combat arts must be in the same tab. 
        You also need to specify which tab are you going to use in the config.js file. More details can be found below.

CUSTOM PARAMETERS
In addition to the values explained above, you will also need to write some custom parameters:
    -'costType': The type of cost. 0 is weapon uses, 1 is HP and 2 is Stamina.
    -'cost': This parameter defines the amount of weapon uses that will be consumed when doing an attack with the combat art.
    -'startRange' and 'endRange': These two parameters are optional.
        With these parameters, you can define the attack range of the combat art. That way it won't depend on the equipped weapon.
        If you don't use these parameters, the weapon's default range will be used instead.
Some examples of the use of the custom parameters: {costType: 0, cost: 3, startRange: 1, endRange: 3}, {costType: 1, cost:5, startRange:1, endRange: 1}.

STAMINA STAT
There is an optional stat that can be used for the cost of combat arts, called Stamina. 
Each unit has current stamina and max stamina, similar to how a unit has current life and max life.
The custom parameters determine the value of the max stamina.
You can use event commands to alter the stat, and will also be reduced with the use of combat arts.
You will also need to use an event command in order to restore to max stamina at the start of each chapter.
By default, it is disabled, if you want to add it you have to change the config.js, as explained below.
There are several custom parameters that you can use for this stat. All of have integer values.
Most of them are used for units and classes, but some of them can be used on items too.
    - stamina: unit stat. Determines the max stamina possible for the unit. It acts similar to the max HP stat.
    - bonusStamina: can be used in several objects. It gives additional max Stamina, it can override the max value of the unit's class
    - growthStamina: can be used in several objects. It increases the growth change of the max stamina stat.
    - dopingStamina: used for boosting stat items. It permanently increases the max stamina of the unit.
    - maxStamina: class stat. The max value possible that can be reached for the max stamina stat.

STAMINA EVENT COMMANDS
There are two event commands for the stamina stat: one called "ChangeStamina" and the other "RestoreAllUnitsStamina".
The first will change the stamina of one unit, while the second will restore to max stamina all units of your army. That last part can be useful to trigger at the start of a chapter.
In the Execute Script window, you need to change the "Object Name" value to one of the two names mentioned above.
In addition to that, if you are creating a "ChangeStamina" event command, then you also need to change the following values from the Original Data tab:
    - Unit: the unit that will change its stamina.
    - Keyword: the mode used for changing the stamina. "Set" changes to an absolute value, while "Add" increments the value relative to the unit's current stamina.
            There is also the "Subtract" that does the same as "Add" but reduces stamina instead of incrementing.
    - Value 1: this value defines the amount of stamina that will be changed.


HOW TO ASSIGN TO UNITS
To assign a combat art to an unit use the custom parameter 'combatArt', which uses an array of the ID's of the combat arts that unit knows.
This parameter defines the starting scenario for the unit. If the unit doesn't have the parameter, it wil start the game without combat arts.
It can also be used on classes. So you can have the parameter in both the unit and the class and it will merge both lists into one.
For example: {combatArt: [1, 4, 5]}, {combatArt: [2]}. 
If you want to assign (or remove) a combat art to an unit during an event, you need to do the following:
    -Create a "Execute Script" event command.
    -Inside the event, select the type "Event Command".
    -In the name field, write "CombatArt".
    -In the Original Data tab of the event, there are some additional fields you need to fill:
        -In the unit field select the unit that will receive (or lose) the combat art.
        -In the field Value 1 you need to specify if you using the ID of the combat art directly,
            or if you are using a variable to specify which combat art you want to add (or remove):
            You can write '0' to set into ID mode, or '1' to use the Variable mode.
        -In the field Value 2:
            -If you are in ID mode, you write the ID of the combat art.
            -If you are in Variable mode, you write the ID of the Tab where the variable is located. Note that the first tab has ID 0, the second ID 1, and so on.
        -In the field Value 3:
            -If you are in ID mode, this field will be ignored.
            -If you are in Variable mode, you write the ID of the variable you want to use.
        -In the keyword field to specify the type of command:
            -"Add": This will add the combat art to the unit.
            -"Remove": This will remove the combat art from the unit.

PLUGIN CUSTOMIZATION
There are some elements of this plugin that can be modified. For example, you can modify the name of the combat arts unit command.
To do this, you need to open the file config.js, you can use any text editor like Notepad.
In the file you will find a list of variables, each with a default value. You can change any of them.
Note that among those variables you will find the variable called "TAB_COMBATART", 
which is needed to specify which tab of the Original Data window you are using for the combat art entries.
This is the file that you'll need to edit to enable the Stamina stat.


VERSION HISTORY
1.0 - April 3, 2020
    - Initial version

2.0 - April 13, 2020
    - Reworked plugin: now it uses Original Data instead of Skills to implement the Combat Arts.
        This allows to reduce the amount of skills for each unit, in addition to reduce the amount of custom parameters.
        Note that because of this changes, you can only assign combat arts to individual units. 
        You can no longer assign combat arts to other things like classes, items, etc
    - Added a new window for the unit menu screen. In there you can see the combat arts that the unit currently has.
    - Added an Event Command that allows to add and remove combat arts from an unit.

2.1 - April 17, 2020
    - Changed the event command to allow the use of variables instead. Now you have two options:
        Use the ID directly or use the value stored in a variable.
    - Changed the name of the event command from "CombatArtEventCommand" to "CombatArt".
    - Fixed a graphical bug where the bonus from a combat art attack would not display properly during the animations of a battle.

2.2 - May 9, 2020
    - Added an option to enable or disable the combat arts window.

2.3 - August 12, 2020
    - Fixed a bug where a weapon with infinite uses could be broken when used it on a combat art.

3.0 - September 5, 2021
    - Fixed bugs related to skills used after a combat art, like the Canto skill. They now work properly.
    - Fixed a bug where after using a combat art, the unit would not be able to make double attacks.
    - New feature: action combat arts. A different type of combat art, it can be used actions that are not attacking, similar to using an item.
    - Improved cost system: now there are three different types of costs: life, stamina and weapon uses.
        Each combat art can select its own cost, meaning that there can be combat arts with different cost types.
    - New stat: stamina. This optional stat is disabled by default, but once enabled it can be used to pay the cost of the combat arts.
    - Improved UI: when selecting a combat art, it will now specify the cost type and also the required weapon or weapons types needed for using it.
    - Now it is possible to assign combat arts to classes, with the same parameter used for the units.
    - NOTE: if you are using the Custom Unit Menu Window plugin, make sure to update it to version 2.4 or better before using this plugin.

3.1 - December 3, 2021
    - Fixed visual bug where part of a window would be outside of the screen during the combat arts selection.
    - Fixed an error that would crash the game when a combat art attack had more than one possible target.
    - Event commands for assigning and removing combat arts now work correctly. Thanks to Repeat for finding and fixing the bug.
    
3.2 - March 14, 2022
    - Fixed a bug in the event command "CombatArt" where the unit wouldn't learn the combat art if the event was skipped.
        Thanks to Repeat for finding and fixing this bug.
