//Plugin by Goinza

var TOP_OPTIONS = [NullInteraction, TopRaceInteraction, TopStateInteraction, GrowthInteraction, SupportInteraction,
                    TopTraitsInteraction, CustomCombatArtsInteraction, CustomSpellsInteraction]

var BOTTOM_OPTIONS = [NullInteraction, BottomRaceInteraction, BottomStateInteraction, ClassTypeInteraction, 
                    BottomTraitsInteraction]

var Options = {
    TOPLEFT: TopRaceInteraction,
    TOPRIGHT: GrowthInteraction,
    BOTTOMLEFT: ClassTypeInteraction,
    BOTTOMRIGHT: BottomStateInteraction
}

var RACES_TITLE = "Races";
var STATES_TITLE = "States";
var CLASSTYPE_TITLE = "Class Type";
var GROWTHS_TITLE = "Growths";
var SUPPORTS_TITLE = "Supports";