Hybrid Types for Weapons
By Goinza
Version 1.0
February 22, 2020

INTRODUCTION
This plugins adds the feature of making a weapon change its type depending on the range of the attack.
For example, you can make a weapon called "Fire Sword" that acts as a "Sword" weapon type at range 1 and as a "Fire" weapon type at range 2.
You can even make the sword deal magic damage at range when is treated as a "Fire" weapon.

CUSTOM PARAMETER
Using the custom parameter "hybridAttack", you can make a weapon change the weapon type during the attack depending on the range.
The requirement to use the weapon doesn't change, so the unit must know how to use the original weapon type of the weapon,
no matter which weapon types are chosen in the parameter.
For example, a weapon with the weapon type "Sword" and the custom parameter {hybridAttack: [ ["Sword", 1, true], ["Wind", 2, false] ]}.
In each weapon type, there are three values: the first one is the weapon type name, the second one is the attack range,
and the last value is true if the the attack is phyisical, and if the value is false then it is a magic attack.
So, in this case, if the weapon attacks at range 2, it will be a Wind-based attack and it will be a magic attack.
Even if the sword have a parameter like {hybridAttack: [ ["Lance", 1, true], ["Fire", 2, false] ]}, because 
the weapon type is Sword, the unit will only need to know how to wield Sword weapons.
In this example, if the weapon can attack in a range of 3, it will use the default weapon type "Sword".

INCOMPATIBILITY ISSUES
This plugin is incompatible with other plugins that use the following functions:
    - CompatibleCalculator._getCompatible from singleton-calculator.js line 741.