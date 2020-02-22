Weapons and Items as Skills
By Goinza
Version 1.0
February 22, 2020

This plugin allows the creation of skills that act as weapons or items.
This means that you can, for example, make a magic system where the magic is not in the inventory, but instead it is a skill from the unit.

WEAPONS AND ITEMS 
To make this system work, you need to do the following for each spell/weapon/item you create:
    -First, you need to create the weapon and add the custom parameter {magic: true}. This also applies to items.
    -Make a custom skill with the keyword "SkillAttack" for weapons or "SkillSupport" for items.
    -Add a custom parameter to the skill with the ID of the weapon/item. The parameter is called "weapon" or "item", depending on the skill.
        For example, a SkillAttack with the custom parameter {weapon:15} is assigned to the weapon with ID 15.

IMPORTANT: To make this work, you need to create a Execute Script event of the type Execute Code and write the next line of code:
    MagicAttackControl.setSpellsAllUnits();
KNOWN ISSUE: This system doesn't work on guest units. However, it does work for event guest units.
IF YOU USE GUEST UNITS THAT ARE NOT CREATED THROUGH EVENTS THE GAME WILL CRASH

BALLISTA
You can also make a unit use a specific weapon in a specific tile, like for example a ballista that is fixed in a tile and can be used by archers.
To do this, you make the same process as when you make any other skill weapon, except for this two differences:
    -The weapon must have the custom parameter {ballista:true} instead of using the "magic" custom parameter.
    -The skill kewyord must be "MapAttack". The custom parameter of the skill will still be the same "weapon" parameter.
    -You also need to add the skill to the terrain that is assigned to the ballista tile. This is done in the Optional Skills option of the terrain.
    -You also need to make a Execute Script event of the type Execute Code with the following line of code:
        BallistaControl.addBallista();
    -Finally, you need to add a custom parameter to the map, so you can specifiy which tiles will be the one to use this type of attack.
        For example: {ballista: [ {x:5, y:3, skill:32}, {x:0, y:7, skill:32} ]}
        This means that in the tiles (5, 3) and (0, 7) there are ballista tiles. Those units that can be use the weapon assigned to the skill with ID 32
        will be able to deal the attack.

INCOMPATIBILITY ISSUES
This plugin is not compatible with other plugins that use the following functions:
    - AIScorer.Weapon._setTemporaryWeapon from map-enemyturnai.js line 751.
    - AIScorer.Weapon._resetTemporaryWeapon from map-enemyturnai.js line 761.
    - WeaponSelectMenu._setWeaponbar from windowmanager-weaponselectmenu.js line 88.
    - WandSelectMenu._setWandbar from windowmanager-weaponselectmenu.js line 222.
    - ItemSelectMenu.setMenuTarget from windowmanager-itemselectmenu.js line 24.
    - ItemSelectMenu._resetItemList from windowmanager-itemselectmenu.js line 243.