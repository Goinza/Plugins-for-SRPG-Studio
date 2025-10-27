Critical On Last Hit
by Goinza
Version 1.0
October 27, 2025

Adds a new mechanic for weapons that forces a critical hit if the next attack would break the weapon.

This does not change how the hit chances work, meaning that if the last attack would miss, then the critical hit is not triggered.

The critical hit is not triggered if the defending unit has the Invalidate Critical skill.

If the game requires that units have the Critical skill in order to do critical hits, then this mechanica can potentially ignore that setting.
This rule can be toggled on/off in the _settings.js file.

The plugin is compatible with the Combat Arts plugin. If a combat art would deplete all the uses from a weapon, then that attack will be a critical hit.

INSTRUCTIONS
To apply critical on last hit weapon must have the custom parameter {lastHitCrit: true}

Additionally, in the _settings.js file, there is an option to toggle whether the unit needs the Critical skill in order to trigger a critical on last hit. 