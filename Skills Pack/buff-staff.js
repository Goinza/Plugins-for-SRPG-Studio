/**
 * Buff on Staff Use
 * By Goinza
 */
(function() {
    
    BaseItemUse._stateOnUse = function(itemTargetInfo, itemType) {
        var dynamicEvent = createObject(DynamicEvent);
        var generator = dynamicEvent.acquireEventGenerator();
        var skill = SkillControl.getPossessionCustomSkill(itemTargetInfo.unit, "BuffWand");

        if (skill!=null && itemTargetInfo.item.isWand() && itemTargetInfo.unit.getUnitType()==itemTargetInfo.targetUnit.getUnitType()) {
            var i = 0;
            var found = false;
            if (skill.custom.type==null || typeof skill.custom.type.length != 'number') {
                throwError017(skill);
            }
            while (i<skill.custom.type.length && !found) {
                found = skill.custom.type[i] == itemType;
                i++;
            }
            if (found) {            
                if (typeof skill.custom.stateID != 'number') {
                    throwError018(skill);
                }
                var state = root.getBaseData().getStateList().getDataFromId(skill.custom.stateID);
                StateControl.arrangeState(itemTargetInfo.targetUnit, state, IncreaseType.INCREASE);		
            }
        }
    }

    var rec1 = RecoveryItemUse.enterMainUseCycle;
    RecoveryItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.RECOVERY);
        return rec1.call(this, itemUseParent);
    }

    var rec2 = EntireRecoveryItemUse.enterMainUseCycle;
    EntireRecoveryItemUse.enterMainUseCycle = function(itemUseParent, animeData) {
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.ENTIRERECOVERY);
        return rec2.call(this, itemUseParent);
    }

    var rec3 = DamageItemUse.enterMainUseCycle;
    DamageItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.DAMAGE);
        return rec3.call(this, itemUseParent);
    }

    var rec4 = DopingItemUse.enterMainUseCycle;
    DopingItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.DOPING);
        return rec4.call(this, itemUseParent);
    }

    var rec5 = ClassChangeItemUse.enterMainUseCycle;
    ClassChangeItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.CLASSCHANGE);
        return rec5.call(this, itemUseParent);
    }

    var rec6 = SkillChangeItemUse.enterMainUseCycle;
    SkillChangeItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.SKILLGET);
        return rec6.call(this, itemUseParent);
    }

    var rec7 = KeyItemUse.enterMainUseCycle;
    KeyItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.KEY);
        return rec7.call(this, itemUseParent);
    }

    var rec8 = QuickItemUse.enterMainUseCycle;
    QuickItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.QUICK);
        return rec8.call(this, itemUseParent);
    }

    var rec9 = TeleportationItemUse.enterMainUseCycle;
    TeleportationItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.TELEPORTATION);
        return rec9.call(this, itemUseParent);
    }

    var rec10 = RescueItemUse.enterMainUseCycle;
    RescueItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.RESCUE);
        return rec10.call(this, itemUseParent);
    }

    var rec11 = ResurrectionItemUse.enterMainUseCycle;
    ResurrectionItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.RESURRECTION);
        return rec11.call(this, itemUseParent);
    }

    var rec12 = DurabilityChangeItemUse.enterMainUseCycle;
    DurabilityChangeItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.DURABILITY);
        return rec12.call(this, itemUseParent);
    }

    var rec13 = StealItemUse.enterMainUseCycle;
    StealItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.STEAL);
        return rec13.call(this, itemUseParent);
    }

    var rec14 = StateItemUse.enterMainUseCycle;
    StateItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.STATE);
        return rec14.call(this, itemUseParent);
    }

    var rec15 = StateRecoveryItemUse.enterMainUseCycle;
    StateRecoveryItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.STATERECOVERY);
        return rec15.call(this, itemUseParent);
    }

    var rec16 = SwitchItemUse.enterMainUseCycle;
    SwitchItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.SWITCH);
        return rec16.call(this, itemUseParent);
    }

    var rec17 = FusionItemUse.enterMainUseCycle;
    FusionItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.FUSION);
        return rec17.call(this, itemUseParent);
    }

    var rec18 = MetamorphozeItemUse.enterMainUseCycle;
    MetamorphozeItemUse.enterMainUseCycle = function(itemUseParent) {    
        this._stateOnUse(itemUseParent.getItemTargetInfo(), ItemType.METAMORPHOZE);
        return rec18.call(this, itemUseParent);
    }
}) ()