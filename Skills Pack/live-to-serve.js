//Plugin by Goinza

(function() {    
    var alias1 = RecoveryItemUse.enterMainUseCycle;
    RecoveryItemUse.enterMainUseCycle = function(itemUseParent) {
        var itemTargetInfo = itemUseParent.getItemTargetInfo();
        this._itemTargetInfo = itemUseParent.getItemTargetInfo();        

        return alias1.call(this, itemUseParent);
    }

    var alias2 = RecoveryItemUse.moveMainUseCycle;
    RecoveryItemUse.moveMainUseCycle = function() {
        var result = alias2.call(this);
        if (result==MoveResult.END) {
            //Healing is done, now check for skill
            var unit = this._itemTargetInfo.unit;
            var skill = SkillControl.getPossessionCustomSkill(unit, "LiveToServe");
            
            if(skill!=null) {
                var item = this._itemTargetInfo.item;    
                var dynamicEvent = createObject(DynamicEvent);
                var generator = dynamicEvent.acquireEventGenerator();

                var recoveryInfo = item.getRecoveryInfo();
                var plus = Calculator.calculateRecoveryItemPlus(unit, unit, item);
                
                generator.hpRecovery(unit, item.getItemAnime(), recoveryInfo.getRecoveryValue() + plus, recoveryInfo.getRecoveryType(), false);
                
                dynamicEvent.executeDynamicEvent();
            }  
        }

        return result;
    }

}) ()