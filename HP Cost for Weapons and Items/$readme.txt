HP Cost for Weapons and Items
By Goinza
Version 1.1
August 15, 2021

MAKE WEAPONS COST HP TO USE 
INTRODUCTION
With this script, you can make weapons and items cost HP to use.
You need to use the custom parameter "lifeCost" on the weapons/items and write as value the HP cost of each attack of that weapon.
For example, a weapon with {lifeCost:5} costs 5 HP for every attack, even if the unit misses.

It is important to notice that if the unit doesn't have enought HP to use a weapon that costs life, it can't initiate an attack. The unit also won't be able to counterattack.
On the other hand, if the unit had another weapon available in its inventory, it will use that second weapon to counterattack.

If the unit can make two attacks during a round of combat, but doesn't have enough HP to make the second attack, it won't do it, even if it has other available weapons.
This also applies to counterattacks: if the unit has enough HP to wield the weapon, but receives too much damage before being able to counterattack, it won't counterattack.
 
KNOWN BUG
	- During Easy Battle, the self damage animation doesn't appaer. Other than that, the battle will work correctly and the unit will have the appropiate HP after the battle.
	- This plugin doesn't work with custom items. If you are using a plugin that creates a custom plugin and you want to make that item cost life,
		then you need to modify the code. Below are instructions on how to do that.
  
IMPORTANT NOTE REGARDING CUSTOM ITEMS
This script does not work for items with the Custom type. For those items, you need to find the script that created that specific custom item type modify it to make it work.
Because this requires modifying another script, it is impossible to give the exact instructions, 
so I will make a generic explanation and then show an example of a script I made that creates a new Custom item.

EXPLANATION
First, you need to find the script that makes the creation of the custom item possible.
Inside that file, there must be a variable with a name similar to "ItemUse". That variable must start with the the following value:
"defineObject(BaseItemUse,". Once you found it, you need to search for a function named enterMainUseCycle.
Inside of that function, you need to write a line of code before the last line. As a reference the last line should start with the word "return".
The line you need to write is "this._payLife(itemUseParent.getItemTargetInfo());". Once you do it, save the file and now you will be able to make this custom item have a HP cost.

EXAMPLE USING THE "MASTERY SKILL" SCRIPT
The Mastery Skill script allows the user to create a custom type item that teaches a different skill for each unit, depending on its current class.
This script only contains one file, so it should be easy to find the necessary function. First, we find the variable that has "defineObject(BaseItemUse,".
That variable is MasteryItemUse. Inside of it, there is the function enterMainUseCylce. Before the last line, you need to write the "HPCostControl.payLife(unit, item);" line.
You have to note that by default 'unit' and 'item' are not parameters of the enterMainUseCycle function. But a way to acces both of them is by declaring the two variables this way:
	var unit = itemUseParent.getItemTargetInfo().unit;
    var item = itemUseParent.getItemTargetInfo().item;

Here is how that block of code looks like:
    var MasteryItemUse = defineObject(BaseItemUse, {

    _dynamicEvent: null,
	
	enterMainUseCycle: function(itemUseParent) {
		var generator;
		var itemTargetInfo = itemUseParent.getItemTargetInfo();
        var skill = this._getMasterySkill(itemTargetInfo.targetUnit);
        
		
		this._dynamicEvent = createObject(DynamicEvent);
		generator = this._dynamicEvent.acquireEventGenerator();
		generator.skillChange(itemTargetInfo.targetUnit, skill, IncreaseType.INCREASE, itemUseParent.isItemSkipMode());
		
		return this._dynamicEvent.executeDynamicEvent();
	},

And here is how to should look after you add the new line:

var MasteryItemUse = defineObject(BaseItemUse, {

    _dynamicEvent: null,
	
	enterMainUseCycle: function(itemUseParent) {
		var generator;
		var itemTargetInfo = itemUseParent.getItemTargetInfo();
        var skill = this._getMasterySkill(itemTargetInfo.targetUnit);
        
		
		this._dynamicEvent = createObject(DynamicEvent);
		generator = this._dynamicEvent.acquireEventGenerator();
		generator.skillChange(itemTargetInfo.targetUnit, skill, IncreaseType.INCREASE, itemUseParent.isItemSkipMode());
		
		var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

		return this._dynamicEvent.executeDynamicEvent();
	},
	
INCOMPATIBILITY ISSUES
This plugin is compatible with any other plugin.

VERSION HISTORY
1.0 - February 23, 2020
    - Initial version
    
1.1 - August 15, 2021
    - Easy battle now shows the self damage animation correctly. Thanks to Repeat for this change.
