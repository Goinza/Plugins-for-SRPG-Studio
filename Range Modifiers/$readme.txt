Range Modifiers
By Goinza
Version 1.0
February 13, 2020

This plugin contains a group of skills that allow to increase the range of a unit when using a weapon, staff and/or item.
It also comes with a way to make the range of a staff or item depend on the Mag stat of the unit.

Extended Range Skills
There are three skills that allows to change the range of weapons, items and staves.
The custom keyword for those skills are "WeaponRange" for weapons, "StaffRange" for staves and "ItemRange" for items.
To change the range, you use the custom parameter 'startRange' and 'endRange'. Those specify how much extra range have at the start and the end of the range, respectively.
Note that for weapons, you also need the custom parameter 'type', which specify the name of the weapon type that gets the extra range.
For example, an unit with a 2-3 range bow with a skill that has the following custom parameters:
    {type:"Bow", startRange: -1, endRange: 2} will have 1-5 range instead.
    Note that both startRange and endRange are optional. You can have one but remove the other.
    By default, if the parameter is not specified, it is assumed the default value is zero.

Dynamic Magic Range
With this plugin, you can also make the range of a staff or item depend on the Magic stat of an unit.
To do this, you need to use the custom parameter 'magicRange' in the item.
The value of the parameter is a number that the Magic stat will be divided into.
For example, an unit with 5 Magic and an item with the parameter {magicRange: 2} will have range 2,
because 5/2 = 2.5, and if we round it down is 2.

INCOMPATIBILITY ISSUES
This plugin is not compatible with other plugins that use the following functions:
    - BaseItemSelection.setUnitSelection from item-base.js line 218.
    - BaseItemSelection.setPosSelection from item-base.js line 229.
    - BaseItemAvailability._checkMulti from item-base.js line 835.
    - AttackChecker.getAttackIndexArray from singleton-system.js line 923.
    - AttackChecker.getFusionAttackIndexArray from singleton-system.js line 947.
    - AttackChecker.isCounterattack from singleton-system.js line 969.
    - AttackChecker.isCounterattackPos from singleton-system.js line 1000.
    - EntireRecoveryControl._isTargetAllowed from item-entirerecovery.js line 222.
    - EntireRecoveryItemInfo._drawValue from item-entirerecovery.js line 83.
