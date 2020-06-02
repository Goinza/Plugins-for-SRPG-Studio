//Plugin by Goinza

//Available data for the top sections
var TOP_OPTIONS = [NullInteraction, TopRaceInteraction, TopStateInteraction, GrowthInteraction, SupportInteraction,
                    TopTraitsInteraction, CustomCombatArtsInteraction, CustomSpellsInteraction,
                    InventoryInteraction, StatsInteraction, TopWeaponTypeInteraction, TopSkillInteraction];

//Available data for the bottom sections
var BOTTOM_OPTIONS = [NullInteraction, BottomRaceInteraction, BottomStateInteraction, ClassTypeInteraction, 
                    BottomTraitsInteraction, BottomWeaponTypeInteraction, BottomSkillInteraction];

var Options = {
    //Amount of windows added to the unit menu screen
    WINDOWS_COUNT: 2,
    //Data shown in the top left section
    TOPLEFT: [InventoryInteraction, TopRaceInteraction],
    //Data shown in the top right section
    TOPRIGHT: [StatsInteraction, GrowthInteraction],
    //Data shown in the bottom left section
    BOTTOMLEFT: [BottomWeaponTypeInteraction, ClassTypeInteraction],
    //Data shown in the bottom right section
    BOTTOMRIGHT: [BottomSkillInteraction, BottomStateInteraction]
}

//Titles for each data section
var INVENTORY_TITLE = "Inventory";
var STATS_TITLE = "Stats";
var WEAPONTYPE_TITLE = "Weapon Types";
var SKILLS_TITLE = "Skills";
var RACES_TITLE = "Races";
var STATES_TITLE = "States";
var CLASSTYPE_TITLE = "Class Type";
var GROWTHS_TITLE = "Growths";
var SUPPORTS_TITLE = "Supports";