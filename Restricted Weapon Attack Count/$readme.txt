Restricted Weapon Attack Count
By Goinza
Version 1.0
February 23, 2020

This plugin changes how the Attack Count option works for weapons that use the custom parameter 'brave'.
Basically, an unit with a "brave" weapon will only attack once if it is the defending unit.
For example, a "Brave Sword" with an attack count of 2 will attack twice if the unit is the attacker, and it
will attack once if the unit is the defender.

To make a weapon use this restriction, you need to assign it the custom paramete {brave: true}.

INCOMPATIBILITY ISSUES
This plugin is not compatible with plugins that use the following function:
    - Calculator.calculateAttackCount from singleton-calculator.js line 325