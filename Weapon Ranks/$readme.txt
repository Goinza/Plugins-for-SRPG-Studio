Weapon Ranks System
By Goinza
Version 1.0
February 11, 2020.

This plugin allows you to make individual ranks for each weapon type, without having to edit anything on the code itself.
To make this work, is necessary to make several custom parameters on units, classes, weapons and staves.

CUSTOM PARAMETER "rank"
The parameter "rank" is used primarly for units, so they can have a base rank. 
It can also be used on: classes, weapons (only the equipped weapon), items, skills (only if they are part of the "Parameter Bonus" category)
and states to give an additional bonus to the weapon ranks.
This parameter will have an array, with each element containing the name of a weapon type and the value associated with that rank.
For example, an unit with {rank: [["Sword", 31], ["Axe", 71]]}. In this case, the unit will have a D rank on swords and C rank on axes.
The values in the example are the default one used by rank-config-option.js (more details on this later).
If the unit does not have a parameter of a certain weapon, the default value is 0, meaning no rank on that weapon.
Even if the unit's class can use that weapon, if the unit doesn't have any rank on that weapon type, it can't use it.
It happens the same in the reverse case: if the unit has a parameter for a rank but their class can't use that weapon type, the unit won't be able to use it.
This can be a interesting feature if you want a unit to learn a new weapon type without changing class.
Note: It is very important that the name of the weapon type on the parameter matches exactly the name of the actual weapon type, otherwise it won't work.

CLASS PARAMETERS
The two parameters used by the class are "minRank" and "maxRank". "minRank" makes a certain rank the minimun rank obtained by a class, 
while "maxRank" is the maximum rank obtainable by that class. For example, a class with {minRank: [ ["Axe", 31] ], maxRank: [ ["Sword", 181] ]},
will always have at least a D rank with axes, and won't be able to go beyond A rank with swords. If there is not a parameter on a certain weapon, 
then there is no min and no max. In this example, it means this class doesn't have any minimun on swords, so it starts with E rank, and doesn't have
any maximum on axes, so it can reach S rank. This also applies to the other weapon types that this class can potentially use but are not in the custom parameters.

WEAPON/STAFF PARAMETERS
There are two custom parameter for weapons and staves: they use parameter "req". This is the requirement to use that item.
They also use the parameter "wexp", that dictates how much weapon experience the unit earns by each use. 
If the item is a weapon, they earn experience for each time they engage in combat with an enemy unit.
For example, a weapon with the parameters {req:"D", wexp:2}, would need a unit with a D rank on that weapon, 
and that unit would gain 2 weapon experience.

GAINING SKILLS WHEN A WEAPON RANKS UP
You can make a unit gain a skill whenever it gets a rank up in a specific weapon type. 
To do this, you use the custom parameter "rankSkills". For example:
    {rankSkills: [ ["Sword", "D", 15], ["Sword", "C", 20], ["Lance", "C", 23] ] }
    This makes the unit gain three different skills. First, it obtains the skill with ID 15 when it gets to rank D in swords.
    Next, when it gets to C rank it obtains the skill with ID 20, and finally it obtains the skill with ID 23 when it gets to rank C in lances.
You assing the custom parameter to the unit, but if you want the skill to be earned universally, you assign them to the weapon type instead.
Note that the version of the weapon type uses the same name for the parameter, but it works differently. For example:
    {rankSkills: [ ["D", 15], ["C", 20] ] }
    In this case, every unit that reaches D rank with this weapon type will gain the skill with ID 15, and when it reaches C rank it will gain the skill with ID 20.
    As you can probably tell, the difference is that you don't need to specify the weapon type.

EARNING MORE WEAPON EXPERIENCE WITH A CUSTOM SKILL
An unit with a custom skill with the "Discipline" custom keyword will be able to earn more weapon experience.
The amount of extra experience is defined with a custom parameter of the skill called "multiplier".
For example, if you want the unit to earn double the experience, you must write this in the skill: {multiplier:2}

STAT BOOSTING ITEMS
There are 2 custom parameters that can only be used by Stat Boosting items. It won't work on any other type of items.
The first parameter is "rankUp". With this, you can increase the rank of one or more weapon types of a unit.
For example, a item with {rankUp: ["Sword", "Lance"]} will increase the rank of both weapon ranks by 1.
If the unit had C rank with swords and D rank with lances, it will have now B ranks with swords and C rank with lances.
The other parameter is "rankNew". If the unit doesn't know a weapon type, this adds the lowest rank possible to that weapon type.
For example, if a unit that only uses axes uses a item with {rankNew: ["Bow", "Magic"]} will get a E rank with bows and magic tomes.
Both of these parameter can be used at the same time with the same item, but if you have something like {rankUp: ["Sword"], rankNew: ["Sword"]},
then the units that don't use sword will only get E rank with swords. You can't make a unit learn a weapon type and increase their rank with the same item use.

EDTABLE VALUES
There is a file called rank-config-options that cointain some editable variables. This can be edited without code knowledge.
The options that can be edited are the values necessary to reach every weapon rank, the possibility to add more custom ranks, 
and an option to remove from the weapon ranks window all the ranks unused by the unit.

ABOUT ITEMS TYPES
This script considers item types the same as weapon types, so you can make your own item types besides the staff type, and they will work just like the others types.
But the item type called "Item" will never have a rank, so they can be used by anyone.
Also, if you have a weapon type and an item type have the same name, they will be considered to share the same rank.
This can be useful if, for example, you want some sort of magic that can attack with a weapon and heal with an item.

CHANGING THE WEAPON EXPERIENCE GAUGE
By default, the gauge used in this script is one of the default assets. If you want to change that, you can either use another of the default assets of the software, 
or you can use a custom gauge, as long as it has the same size and format than the default gagues.
To change it, you must use 2 global parameters. This can be done going to Databe->Config->Script->Global Parameters.
The parameters are "weaponRankGauge" and "isRuntimeGauge". The first one has as value the id of the desired gauge.
The second parameter has as value true if the gauge is a default asset, or false if the gauge is a custom asset.
For example, {weaponRankGauge:0, isRuntimeGauge:true} uses the default gauge used for the HP bar on the unit screen.

INCOMPATIBILITY ISSUES
This plugin is not compatible with other plugins that use the following functions:
    - ItemListScrollbar.setStockItemFormationFromWeaponType from window-itemlist.js line 202
    - UnitMenuBottomWindow._drawWeaponTypeArea from screen.unitmenu.js line 600