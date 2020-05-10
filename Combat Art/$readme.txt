Combat Arts
By Goinza
Version 2.2
May 9, 2020

INTRODUCTION
This plugin allows you to use Combat Arts, which are attacks with special effect at the expense of more weapon uses per attack.
For example, you can make an attack that deals more damage but cost 2 weapon uses instead of 1.
This system also allows for adding effects from skills to the attack, and restrict the combat art to a specific weapon or weapon type.

IMPORTANT: This plugin only works for player-controlled units. AI units can't use combat arts.

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
    -Keyword: This value must always be "CombatArt".
    -Multiple Data: In here, you can select skills, weapons and weapon types:
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
    -'cost': This parameter defines the amount of weapon uses that will be consumed when doing an attack with the combat art.
    -'startRange' and 'endRange': These two parameters are optional, but if one of them is used, the other must be used too.
        With these parameters, you can define the attack range of the combat art. That way it won't depend on the equipped weapon.
        If you don't use these parameters, the weapon's default range will be used instead.
Some examples of the use of the custom parameters: {cost: 3, startRange: 1, endRange: 3}, {cost:5, startRange:1, endRange: 1}.

HOW TO ASSIGN TO UNITS
To assign a combat art to an unit use the custom parameter 'combatArt', which uses an array of the ID's of the combat arts that unit knows.
This parameter defines the starting scenario for the unit. If the unit doesn't have the parameter, it wil start the game without combat arts.
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

INCOMPATIBILITY ISSUES
This plugin is not compatible with other plugins that use the following functions:
    - AttackFlow._doAttackAction from attack-flow.js line 175.
    - SkillChecker.arrangeSkill from singleton-calculator.js line 457

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
    - Changed the name of the event commadn from "CombatArtEventCommand" to "CombatArt".
    - Fixed a graphical bug where the bonus from a combat art attack would not display properly during the animations of a battle.

2.2 - May 9, 2020
    - Added an option to enable or disable the combat arts window.