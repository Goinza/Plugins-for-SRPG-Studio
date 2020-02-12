Skills Pack
By Goinza
Version 1.0
February 12, 2020
 
 This plugin contains a collection of custom skills. 
 All of the skills are compatible with any other plugin, so even if you don't use some of them, they won't be a problem.
 
 Here is a list of all the skills, along with their descriptions, custom keyword and custom parameters (if there are any):
  Live to Serve:
      When healing an ally, the skill's user recovers the same amount of HP.
      -Custom keyword: "LiveToServe".
      -Custom parameters: none.
 
  Critical Factor:
      Normally, the critical multiplier is the same for all the critical hits of all the units.
      With this skill, a unit can have a different critical multiplier that the rest of the units.
      -Custom keyword: "CritFactor".
      -Custom parameters: 
          "critFactor": The critical multiplier for the unit. For example: {critFactor: 4}.
 
  Wary Fighter:
      A unit with this skill can't double or be doubled. The exception are weapons that can attack more than once for round, like the Brave weapon from FE.
      -Custom keyword: "WaryFighter".
      -Custom parameters: none.
 
  Extra Healing:
      A healer unit with this skill has bonus to all healing done. You can choose to make this skill work on all items or staves only.
      -Custom keyword: "ExtraHeal".
      -Custom parameters:
          "wand": if this value is true, then the skill only works on staves. Otherwise, it works on all items.
          "heal": the bonus healing for this unit. Example of this two parameters: {wand: true, heal: 5}.
        IMPORTANT: There is a graphical bug with this skill. If the healing item has the scope Self (also known as Single),
        then the extra healing value will not be displayed correctly. The healing animations will still show the correct healing.
 
  Movements Skills: All these skills work similar, they all involve the skill user being adjancet to another unit and
  changing the position of both or one of them. This skills only work for interacting between player's units, not for enemies or allies.
  The list of skills is: Shove - Swap - Smite - Draw Back - Pivot - Reposition
 
  Shove:
      A unit can move another adjacent unit one space away from it.
      -Custom keyword: "Shove".
      -Custom parameters: 
          "name": The name of the skill command. If this parameter is not used, the command will be called "Shove".
 
  Swap:
      Swaps the position between the skill user and another adjacent unit.
      -Custom keyword: "Swap".
      -Custom parameters: 
          "name": The name of the skill command. If this parameter is not used, the command will be called "Swap".
 
  Smite:
      A unit can move another adjacent unit two spaces away from it.
      -Custom keyword: "Smite".
      -Custom parameters: 
          "name": The name of the skill command. If this parameter is not used, the command will be called "Smite".
 
  Draw Back:
      Moves the skill's user one space away from the other unit. The other unit moves one space too, in the direction that makes both units keep being adjacent.
      -Custom keyword: "Draw Back".
      -Custom parameters: 
          "name": The name of the skill command. If this parameter is not used, the command will be called "Draw Back".
 
  Pivot:
      Skill's user moves to the opposite side of target unit. 
      -Custom keyword: "Pivot".
      -Custom parameters: 
          "name": The name of the skill command. If this parameter is not used, the command will be called "Pivot".
 
  Reposition:
      The target unit moves to the opposite side of the skill's user.
      -Custom keyword: "Reposition".
      -Custom parameters: 
          "name": The name of the skill command. If this parameter is not used, the command will be called "Reposition".
 
  Sacrifice:
      The skill's user can sacrifice its own HP to heal an adjacent unit. The amount of healing depends on the custom parameter.
      If the unit doesn't have enought HP to sacrifice, it heals as much as possible, staying at 1 HP.
      -Custom keyword: "Sacrifice".
      -Custom parameters: 
          "name": The name of the skill command. If this parameter is not used, the command will be called "Sacrifice".
          "healing": The amount of healing done.
 
  Buff on Staff:
      A staff user with this skill can give a buff (state) to the units, when using staves over them.
      You can choose which type of staff give this boost. For example, make healing staves and staves that cure states give the buff.
      -Custom keyword: "BuffWand".
      -Custom parameters: 
          "stateID": The ID of the state that represents the buff.
          "type": a list of numbers, with each number being the type of staff that can give the buff. Here is the list of all the numbers and their meaning.
              1: HP Recovery.
              2: Full Recovery.
              3: Damage.
              4: Stat Boosting.
              5: Class Change.
              6: Learn Skill.
              7: Unlock.
              8: Again.
              9: Teleportation.
              10: Rescue.
              11: Resurrection.
              12: Repair.
              13: Steal.
              14: Inflict State.
              15: Cure State.
              16: Switch.
              17: Fusion.
              18: Transform.
          Example: {stateID:5, type:[1, 2, 8, 15]}. 

INCOMPATIBILITY ISSUES
This plugin has no function that makes it incompatible with other plugins