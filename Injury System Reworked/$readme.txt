Injury System Reworked
by Goinza
Commissioned by Sinthaster
Version 1.1
August 4, 2025

The injury system refers to the mechanic present in SRPG Studio where the game difficulty has the option "Allow Injury" activated.
This means that when player units are defeated in combat, they are not permanently killed. Instead, they come back in the next chapter.

This plugin modifies the injury system. Now, a unit that is defeated in combat returns with a injured status, and is not allowed to 
participate in future chapters. In the Units screen, units that are injured are highlighted in a different color and can't be selected.

If the player wants to use that unit, they must use a new healing item that removes the injured status. Note that the healing item is unusable,
meaning that another unit can't use it to heal an injured unit. Instead, there is a new window in the Manage screen 
that allows the player to use the healing item on injured units. By default, this option is called "Infirmary", but this can be modified, 
along with its description, and the text used for the confirmation window (the default question is "Do you want to heal this unit?")

HOW TO USE
The injury system works by itself without any custom parameters, as long as the "Allow Injury" options is used for all difficulties of the game.

NOTE: if you want to create an event command that injures the unit without combat you need to use two event commands:
First, create the custom event command "SetInjury", which is explained below. Then, the second event must be
the normal "Remove Unit" event command. The "Remove Type" must be set to "Injured".

CUSTOM EVENT COMMANDS
There are two new event commands:
    -"SetInjury": sets the injured status to the unit selected in the Original Data tab.
        The event command has no effect on units that were already injured.
        The event doesn't remove the unit from the map, it only sets the injured status so the unit can't be fielded in the future.
        If you want the unit to be removed from the current map, in addition to use this event, use the normal "Remove Unit" event command, as explained above.
    -"RemoveInjury": removes the injured status to the unit selected in the Original Data tab.
        The event command has no effect on units that didn't have the injured status.

SETTINGS FILE
There is a file called _settings.js. This file contains all the options that can be modified.
This includes the color of units' name that are injured (used in the Units screen), the ID of the healing item,
and other data for the new window in the Manage screen (name, description, and text for the confirmation window)

VERSION HISTORY
1.0 - August 3, 2025
    - Initial version

1.1 - August 4, 2025
    - Added sound effect when healing an injured unit
    - The default sound effect is "itemuse". A different one can be selected in _settings.js