Changes to Damage Formula for Weapons
By Goinza
Version 1.0
February 21, 2020

This plugins changes how the damage of weapons is calculated.
By default, weapons use the Strength and Magic stats for physical and magical attacks, respectively.
But with the use of this plugin and some custom parameters on the weapon, you can change which stats are used for each weapons.
For example, you could make a Dagger use Skill instead of Strength, or use 50% of Strength and 50% of Skill.

CUSTOM PARAMETERS
There is only one obligatory parameter, which is the "alternative" parameter. It has to have the 'true' value, so
weapons can use the custom damage formula, which is described using all the other parameters. There is one parameter for
each stat, and you can use one of them or more. You can even use no parameters, so the weapon doesn't use the stats from the unit
and does fixed damage. Each parameter must have as a value the percentage that the stat will be used. For example, 100 means that it will
use the stat at its full value, 50 means half, 200 means double, and so on. Here is the list of parameters.
    -"life": Current life of the unit.
    -"hp": Max possible life of that unit. 
    -"str": Strength stat.
    -"mag": Magic stat.
    -"ski": Skill stat.
    -"spd": Speed stat.
    -"lck": Luck stat.
    -"def": Defense stat.
    -"res": Resistance stat.
    -"mov": Movement stat.
    -"wlv": Weapon Level stat.
    -"bld": Build stat.

EXAMPLES
{alternative: true, spd: 100} 100% Speed.
{alternative: true, str: 50, ski: 50} 50% Strength and 50% Skill.
{alternative: true, res: 150} 150% Resistance.
{alternative: true} Only uses the weapon's might.

INCOMPATIBILITY ISSUES
This plugin is not compatible with other plugins that use the following function:
    - AbilityCalculator.getPower from singleton-calculator.js line 3