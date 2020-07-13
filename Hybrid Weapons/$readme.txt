Hybrid Weapons
By Goinza
Version 1.1
April 15, 2020

This plugin allows to create "hybrid weapons", which behave as different weapon types depending on the range of the attack.
For example, you can make a "Wind Sword" which acts as a Sword weapon during melee and acts as a Wind weapon during ranged attacks.
In this example, you can even make the melee attacks deal phyisical damage, while the ranged attacks deal magic damage, or make all attacks do phyisical or magic damage.

HOW TO USE
To use this plugin, you need to add the custom parameter "hybrid" to the weapon. For example:
    {hybrid: [ {type:"Sword", range: 1, physical: true}, {type:"Wind", range: 2, physical: false} ]}
This is a complex parameter, so let's analyze it part by part:
    -type: this parameter needs to be the name of the weapon type that will replace the default weapon type.
    -range: the range of the attack.
    -physical: true if you want the weapon to deal phyisical damage. False if you want the weapon to deal magic damage.
Note that if the unit attacks from a range that is not specified on the custom parameter, the weapon type and type of damage will be the default used by the weapon.

Also, in the example used above, if the weapon belongs to the Sword weapon type and deals phyisical damage by default, then the object that specifies the damage at melee was not necessary.
That means that you don't need to specify the type of weapon and damage at ranges where the weapon uses its default values.

INCOMPATIBILITY ISSUES
This plugin is not compatible with other plugins that use the following functions:
    - CompatibleCalculator._getCompatible from singleton-calculator.js line 741

VERSION HISTORY
    1.0 - February 22, 2020
            - Initial version

    1.1 - April 15, 2020
            - Changed the structure of the custom parameter for the hybrid weapons. Check the instructions for details.
            - Changed the name of the parameter from 'hybridAttack' to 'hybrid'.
