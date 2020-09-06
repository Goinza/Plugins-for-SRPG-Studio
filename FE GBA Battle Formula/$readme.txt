FE GBA Battle Formula
By Goinza
Version 1.1
September 6, 2020

This plugin changes the battle formulas used by the engine to match the ones used in the Fire Emblem games for the Game Boy Advance.
To use it, you just need to drag this folder into the Plugin folder of your project.

OPTIONAL CHANGES
You can modify some things by modifying the formula-settings.js file. You don't need programming knowledge to use that file.
In there, you will find two variables. These variables are already set up in the same way as the FE GBA games, but you can change them
if you want to have some difference from those games.
    -MAGIC_ENABLED: This enables ('true') or disables ('false') the Magic stat. By default, the value is false.
        If you set it up as true, the Magic stat will be added to the game, so magic attacks and staves will use that stat.
    -TWO_RN_ENABLED: This adds the option to use 2RN for the hit calculations. By default, the value is true.
        If you set it up as false, the hit calculations will use 1RN.

There is also the experience calculations, which are handled by the file exp-formula.js.
If you don't want to use those formulas, remove that file from your project.

INCOMPATIBILITY ISSUES
This plugin has some functions that are incompatible with other plugins.
Note that some of them are compatible if the options explained above are enabled or disabled.
    The following functions are always incompatible:
        - AbilityCalculator.getHit from singleton-calculator.js line 19.
        - AbilityCalculator.getAvoid from singleton-calculator.js line 24.
        - AbilityCalculator.getCritical from singleton-calculator.js line 42.
        - AbilityCalculator.getAgility from singleton-calculator.js line 52.
        - DamageCalculator.calculateAttackPower from singleton-calculator.js line 112.
    The following functions are incompatible if the Magic stat is disabled:
        - AbilityCalculator.getPower from singleton-calculator.js line 3.
        - Calculator.calculateRecoveryItemPlus from singleton-calculator.js line 371.
        - Calculator.calculateDamageItemPlus from singleton-calculator.js line 404.
        - UnitParameter.MAG.isParameterDisplayable. This function is not directly used by the engine. 
            Instead, it uses BaseUnitParameter.isParameterDisplayable from singleton-paramgroup.js line 192.        
    The following functions are incompatible if the 2RN hit calculation is enabled:
        - AttackEvaluator.HitCritical.calculateHit from attack_order.js line 618.
    The following functions are incompatible if you keep the exp-formula.js file:
        - ExperienceCalculator._getNoDamageExperience from singleton-calculator.js line 814.
        - ExperienceCalculator._getNormalValue from singleton-calculator.js line 847.
        - ExperienceCalculator._getVictoryExperience from singleton-calculator.js line 820.


VERSION HISTORY
1.0 - February 22, 2020
    - Initial version.

1.1 - September 6, 2020
    - Added the GBA formula for the experience calculations.