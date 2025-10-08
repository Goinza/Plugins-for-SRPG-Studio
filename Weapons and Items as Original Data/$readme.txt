Weapons and Items as Original Data
By Goinza
With contributions from Repeat and Anarch16Sync
Version 2.4
October 8, 2025

This plugin allows the creation of Original Data entries that act as weapons or items.
This means that you can, for example, make a magic system where the magic is not in the inventory, but instead it is from Original Data entries.

WEAPONS AND ITEMS 
To make this system work, you need to do the following for each spell/weapon/item you create:
    -First, you need to create the weapon and add the custom parameter {magic: true}. This also applies to items.
    -Create and Original Data entry in one of the tabs. Keep in mind that all entries must be in the same tab, which will be specified in the _config.js file.
    -In the item option, select the weapon or magic that you will use.
    -Change the value in Value 1 to set the level requirement. If you leave it at zero, there is no level requirement.
    -You can also add the following requirements in the Multiple Data window: units and classes. If a unit that gains a level meets at least one of the requirements,
        on top of already meeting the level requirement, then it will be able to use that weapon or item.
    -Original data needs to have keyword "Spell"

IMPORTANT: To make this work, you need to create a Execute Script event of the type Execute Code and write the next line of code:
    MagicAttackControl.setSpellsAllUnits();
KNOWN ISSUE: This system doesn't work on guest units. However, it does work for event guest units.
IF YOU USE GUEST UNITS THAT ARE NOT CREATED THROUGH EVENTS THE GAME WILL CRASH

GAME CRASH POTENTIAL: In Database > Config, make sure "Skip weapon select menu when only have 1 weapon" is NOT checked. This option does not consider Weapon and Items as Original Data.
    The problems:
	- If you have 1 normal weapon, the game will incorrectly ignore any Original Data weapons and skip the weapon select menu.
	- If you have no normal weapons but do have Original Data weapons, the game will crash when trying to show the weapon select menu.

CONFIGURE SETTINGS
You can change some options of this plugin by opening the _config.js file with a text editor like Notepad.
There are three options to change:
    - ADD_WINDOW: If it is true, the spells window will be added to the unit menu screen. Else, it won't be added. By default it is set to true.
    - NAME: Name for the category of weapons and items used as original data. Used by the spells window. By default the value is "Spells".
    - ORIGINAL_DATA_TAB: The tab of Original Data entries. Note that the first tab has the number 0, the second tab 1, and so on. The default value is zero.

ASSIGN WEAPONS OR ITEMS TO UNITS
To make an unit start with some weapons or items as Original Data entries, you need to use the custom parameter "spells".
For example: {spells: [2]} or {spells: [0, 1, 5]}.
Each number is an ID of an Original Data entry. Keep in mind that all entries must be in the same tab, which will be specified in the _config.js file.

EVENT COMMAND TO ADD/REMOVE NEW WEAPONS OR ITEMS TO AN UNIT
You can create a Execute Script event with the type "Call Event Command". To make this work, you need to set the Object Name to "AddSpell".
Finally, you need to specifiy in the Original Data tab the unit that will receive the new weapon/item,
and also change the Value 1 to the ID of the Original Data that will be added to the unit.
It is also possible to remove spells from a unit. This is done by using the "RemoveSpell" event command,
along with the same values required by the "AddSpell" event (Unit, Value 1).

CREATE ITEM THAT GRANTS THE USER A SPELL
You can create an item that will teach a unit a specific spell if the unit has the ability to use any magic type.
    - Create an item of type Custom with the keyword "SpellItem".
    - Add custom parameters to define the weapon or item to give to the user and the prerequisites to use the teaching item. 
      teachSpell: the ID of the weapon or item to teach in Original Data.
      reqCategory*: the weapon category the user must be able to use at least one of in order to use the item (0: weapons, 1: bows, 2: magic)
      staffReq*: true or false, are staff users also allowed to use this item?
      *Optional parameters. If you leave off both optional parameters, then there is no prerequisite and any unit can use the item.
      Example: {teachSpell:2, reqCategory:1, staffReq:true} allows units who can use bows to learn the spell with ID 2. Staff users are also eligible.

BALLISTA
You can also make a unit use a specific weapon in a specific tile, like for example a ballista that is fixed in a tile and can be used by archers.
For this, instead of using Original Data, you will use skills.
To do this, you make the same process as when you make any other skill weapon, except for this two differences:
    -The weapon must have the custom parameter {ballista:true} instead of using the "magic" custom parameter.
    -The skill kewyord must be "MapAttack". The custom parameter of the skill will need to be "weapon" with the ID of the weapon to use.
    -You also need to add the skill to the terrain that is assigned to the ballista tile. This is done in the Optional Skills option of the terrain.
    -You also need to make, during an Opening event, a Execute Script event command of the type Execute Code with the following line of code:
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

VERSION HISTORY
1.0 - February 22, 2020
	- Initial version.

1.1 - April 8, 2020
	- Fixed an issue where loading a file would crash the game.

2.0 - May 17, 2020
    - Reworked the system to use Original Data instead of Skills. Ballista weapons are still using the same skill system.
    - Added an "AddSpell" event to use in the editor.

2.1 - May 26, 2020
    - Fixed an issue that would crash the game when loading a save file mid-chapter.
        Keep in mind that this update doesn't work on save files made before the update.
	
2.2 - April 5, 2022
    - Update made by Repeat
    - Added a new type of custom item that, when used, teaches a unit a spell.
    - Added an error message to let the player know about a bug when the option "Skip weapon select menu when only have 1 weapon" is selected.
    - Added missing information to the readme file.

2.3 - September 4, 2022
    - Fixed an issue where loading a save with a rescued/captured unit could crash the game.

2.4 - October 8, 2025
    - Update made by Anarch16Sync
    - Added custom event command "RemoveSpell"