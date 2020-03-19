Automatic Stats for Enemy Unitsç
By Goinza
Version 1.0
March 19, 2020

This plugin sets the stats of every "Mob" enemy on the game automatically.
You only need to add a custom parameter on each class for the class growths,
and a optional global parameter for random variance, if you choose to add that to your game.
Note that 'Subleader' and 'Leader' enemy units will have to be set up its stats manually.

HOW TO USE
First, you need to add a custom parameter called 'growths' to each class to define the base growths used by enemy units.
This parameter contains as a value an object that has more custom parameters. For example:
{growths: {all: 50, str:100, mag: 25, mov:0}}
This means that the units of that class with have a growth of 100% on Str, 25% on Mag, 0% on Mov, and 50% on every other stat.
Basically, you have a custom paramete for each stat, and the custom parameter 'all' that is used when some of the other parameters are not present.
All of those parameters are optional, if they are not present, they use the 'all' value, and if that is not present either, it will have the default value of 0.
The custom parameters used are: all - mhp - str - mag - ski - spd - luk - def - res - bld - mov - wlv

RANDOM VARIANCE
By default, this system makes every unit with the same level and class have the exact same stats.
If you want to add some random variance, you can do it with the global parameter 'variance'.
(To access global parameters, go to Database->Config->Script->Global Parameters)
This parameter uses the same parameters as the 'growths' parameter. For example:
{variance: {all:1, ski: 2, spd:0, bld:0, mov:0}}
This means that the units will have a variance of 2 on Ski, 0 on Spd, Bld and Mov, and 1 in every other stat.
Note that a variance of 2 means that the stat can be modified from -2 to 2. So for example, if a unit has 10 on a certain stat
and there is a variance of 2 in that stat, the possible values are 8, 9, 10, 11 and 12.

ADDITIONAL FEATURE WITH THE WEAPON RANKS PLUGIN
If you are using the plugin for Weapon Ranks, this plugin will also update the ranks of every "Mob" enemy unit, 
setting them with the necessary ranks to use every weapon and item in their inventory.

INCOMPATIBILITY ISSUES
This plugin is not compatbile with other plugins that use the following functions:
    - ReinforcementChecker._appearUnit from map-turnchange.js line 1099.