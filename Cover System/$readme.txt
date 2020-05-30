Cover System
By Goinza
May 30, 2020
Version 1.2

This plugin adds a cover system for ranged attacks. It comes with two types of cover:
    - Walls: This type of terrain blocks line of sight between units, so units from opposite sides of the wall can't attack each other.
    - Cover: This type of terrain allows for attack to be done, but provide some bonus to the unit next to the cover.
        For example, it can help reduce the hit rate and/or damage of the other unit.

Note that if an unit is standing in a wall or cover tile, it may not work as intended. It is recommended that those tiles are not passable by any unit.

HOW TO USE
 - To make a "Wall" terrain, you just need to add the custom parameter {wall: true}.
 - To make a "Cover" terrain, you need to use the custom parameter "cover", which comes with a group of custom parameters inside it.
    Those custom parameters are called 'dmg', 'hit' and 'crit'. For example: {cover: {dmg: 0.5, hit:0.8, crit:1}}.
    This means that if the unit with cover is attacked, the other unit will have reduced stats during the attack. In this case, the damage will
    be reduced to 50%, the hit rate will be reduced to 80% of what it was, and finally the critical rate will be 100% of what is was, which means that it will not be changed.
    To make the writing of this custom parameter easier, if you have a stat that want to remain at value 1 (default value) you just need to ignore the parameter.
    For example: {cover: {dmg: 0.5, hit: 0.8}} gives the exact same cover bonus as the example above.

INCOMPATIBILITY ISSUES
This plugin is not compatible with other plugins that use the following functions:
    - AttackChecker.getAttackIndexArray from singleton-system.js line 923.

VERSION HISTORY
1.0 - February 28, 2020
    - Initial version

1.1 - March 17, 2020
    - Fixed an issue where, in some specific situations, a player unit could attack an enemy unit from a position that doesn't have line of sight with that unit.
    - AI was not behaving properly. It has been partially fixed. Now, enemy units should only attack other units that are within their line of sight. 
        But the current problem is that they will only attack if they have line of sight without moving. This will be fixed in the next version. 

1.2 - May 30, 2020
	- Fixed an issue where AI units with melee weapons (that is, weapons with range 1) would not attack.