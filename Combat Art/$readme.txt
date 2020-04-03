Combat Arts
By Goinza
Version 1.0
April 3, 2020

INTRODUCTION
This plugin allows you to use Combat Arts, which are attacks with special effect and cost more weapon uses.
For example, you can make an attack that deals more damage but cost 2 weapon uses instead of 1.
While basic bonus to stats like hit, avoid and crit are the easiests to do, you can also give the unit during the attack any other effect
through the use of other skills, like making a double attack or dealing effective damage. This also includes custom skills from other plugins.

IMPORTANT: This plugin only works for player-controlled units. AI units can't use combat arts.

HOW TO USE
To use combat arts, you need a custom skill with the keyword "CombatArt". That skill itself won't do much, it will only allow you to use the Combat Art command,
To specify what the Combat Art does, you need to use a custom parameter inside the custom skill called "artSkill".
This parameter will have a list of numbers of ID's of other skills, so while the unit is attacking someone with the combat art, it will have equipped those skills.

Note that when you use the combat art, its description will be the same as the "CombatArt" custom skill that the unit has.
 
For example, if I have a support skill (ID 4) that gives +15 Hit, then the paramter will be like this: {artSkill: [4]}.
Note that this will allow you to assign more than one skill, including custom skill from other scripts, like the extended weapon range skill.
 
There are also two other parameters for combat arts: "weaponType" and "weaponName". 
The first one is used when you want to restrict the combat art to one specific weapon type., and the second to restric to a specific weapon.
You write the name of the weapon type or the weapon in the parameters.
Note that both of this parameters are optional.
 
For example, using the example above, if you wanto to restrict the art to only swords, you would use:
    {artSkill: [4], weaponType: "Sword"}
And if you want to restrict to a specific weapon, like Steel Axe, you would use:
    {artSkill: [4], weaponName: "Steel Axe"}
 
Finally, there are three other parameters which are necessary to make the combat art work:
    -"cost" parameter, which determines how much durability it will take from the weapon when the combat art is used.
    -"startRange" and "endRange" determines the start and end of the attack range.
For example:
    {artSkill: [4], weaponType: "Sword", cost:5, startRange: 1, endRange: 1} 
Would be a combat art that only works with swords at melee range, give the skill with ID 4 and it will take 5 durability from the weapon used.
Another example: 
    {artSkill: [7, 11], weaponType: "Bow", cost:2, startRange: 2, endRange: 3}
Combat art that works with bows at range 2-3, gives the skills with IDs 7 and 11 and it takes 2 durability from the weapon. 

Note that all custom parameters are necessary to make the skill work. The only exception are "weaponType" and "weaponName", you only need one of them.

KNOWN ISSUES
    -If an unequipped weapon has a Combat Art skill assigned, it won't show up in the Combat Art command.
        You either need to equip the weapon or assign the skill to the unit and use the custom parameter "weaponName" to limit it to that weapon only.

INCOMPATIBILITY ISSUES
This plugin is not compatible with other plugins that use the following functions:
    - AttackFlow._doAttackAction from attack-flow.js line 175.