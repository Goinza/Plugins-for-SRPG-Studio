Cover System
By Goinza
February 28, 2020
Version 1.0

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