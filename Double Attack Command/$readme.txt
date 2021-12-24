Double Attack Command
by Goinza
Version 1.0
December 23, 2021

INTRODUCTION
This plugins adds a custom skill, which allows a unit to attack twice in one turn.
It works similar to a normal attack, but once you select the weapon and the target, you can choose again for a weapon and a target.
Both the weapons and the targets can be repetade, or you can choose to change either of them.
For example: first attack is with Iron Sword to Enemy A, and second attack is with the same Iron Sword against Enemy B.

HOW TO USE
To make a unit be able to use this command, you need to assing a custom skill with the keyword "DoubleAttack".
If the keyword is already used by some other plugin or you want to use a different keyword, you can change it in the _settings.js file

Also, you need to specify which weapon types are compatible with the skill. This means that the skill can only be used with weapons beloning to one of these weapon types.
To do this, you need to use custom parameters on said skill. For example: 
{
    weaponTypes: [ {id: 1, category: 0}, {id: 2, category: 0} ]
}
    -"weaponTypes" is the list of the compatible weapon types.
    -"id" refers to the weapon type's ID
    -"category" is the weapon category used by the engine: 0 is Fighters, 1 is Archers and 2 is Mages.
In this example, assuming that the project uses default data, this skill would be only compatible with the weapon types Lance and Axe.

SETTINGS
There are some things you can change in the _settings.js file:
    - Name of the command.
    - Name of the skill custom keyword, as explained above.
    - Messages of each information window: one for first weapon, one for first target, one for second weapon and one for second target.
    - Width of the information window. The default messages fit correctly in the window, but if you change those messages you can also
        change the width of this window to make sure the message doesn't go over the window.