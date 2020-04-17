//Plugin by Goinza

(function() {
    //Skills and weapons can have effective damage against traits
    var alias1 = DamageCalculator.isEffective;
    DamageCalculator.isEffective = function(active, passive, weapon, isCritical, trueHitValue) {
        var effective = alias1.call(this, active, passive, weapon, isCritical, trueHitValue);

        if (!effective) {
            effective = TraitControl.isEffective(active, passive, weapon);
        }

        return effective;
    }

    //Traits can be a requirement for using weapons
    var alias2 = ItemControl.isWeaponAvailable;
    ItemControl.isWeaponAvailable = function(unit, item) {
        var available = alias2.call(this, unit, item);

        if (available) {
            available = TraitControl.canUse(unit, item);
        }

        return available;
    }

    //Traits can be a requirement for using items
    var alias3 = ItemControl.isItemUsable;
    ItemControl.isItemUsable = function(unit, item) {
        var usable = alias3.call(this, unit, item);
        if (usable) {
            usable = TraitControl.canUse(unit, item);
        }

        return usable;
    }

    //Effective UI
    ItemSentence.Effective.drawItemSentence = function(x, y, item) {
        var aggregation = this._getAggregation(item);
        var textui = ItemInfoRenderer.getTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        if (this.getItemSentenceCount(item)>0) {
            ItemInfoRenderer.drawKeyword(x, y, this._getName());
            x += ItemInfoRenderer.getSpaceX();


            var i, obj, objName, objecttype, suffix;
            var count = aggregation.getObjectCount();        
            //Normal effective data
            for (i = 0 ; i < count; i++) {
                obj = aggregation.getObjectData(i);
                objName = obj.getName();
                objecttype = obj.objecttype;
                
                if (objecttype === ObjectType.WEAPON) {
                    suffix = StringTable.Aggregation_SuffixEquipment;
                }
                else if (objecttype === ObjectType.ITEM || objecttype === ObjectType.SKILL) {
                    suffix = StringTable.Aggregation_SuffixPossession;
                }
                else if (objecttype === ObjectType.STATE) {
                    suffix = StringTable.Aggregation_SuffixAddition;
                }
                else {
                    suffix = '';
                }
                
                TextRenderer.drawKeywordText(x, y, objName + suffix, -1, color, font);
                y += ItemInfoRenderer.getSpaceY();
            }        
        
            //Effective traits
            var traitArray = TraitControl.getEffTrait(item);
            var trait;
        
            for (i=0; i<traitArray.length; i++) {
                trait = TraitControl.getTraitFromId(traitArray[i]);
                TextRenderer.drawKeywordText(x, y, trait.getName(), 10, color, font);
                y += ItemInfoRenderer.getSpaceY();
            } 
        }
    }

    ItemSentence.Effective.getItemSentenceCount = function(item) {
        var aggregationCount = this._getAggregation(item).getObjectCount();
        var traitsCount = TraitControl.getEffTrait(item).length;
        return aggregationCount + traitsCount;
    }

    //Only UI
    ItemSentence.Only.drawItemSentence = function(x, y, item) {
        var aggregation = this._getAggregation(item);
        var textui = ItemInfoRenderer.getTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        if (this.getItemSentenceCount(item)>0) {
            ItemInfoRenderer.drawKeyword(x, y, this._getName());
            x += ItemInfoRenderer.getSpaceX();


            var i, obj, objName, objecttype, suffix;
            var count = aggregation.getObjectCount();        
            //Normal requirement data
            for (i = 0 ; i < count; i++) {
                obj = aggregation.getObjectData(i);
                objName = obj.getName();
                objecttype = obj.objecttype;
                
                if (objecttype === ObjectType.WEAPON) {
                    suffix = StringTable.Aggregation_SuffixEquipment;
                }
                else if (objecttype === ObjectType.ITEM || objecttype === ObjectType.SKILL) {
                    suffix = StringTable.Aggregation_SuffixPossession;
                }
                else if (objecttype === ObjectType.STATE) {
                    suffix = StringTable.Aggregation_SuffixAddition;
                }
                else {
                    suffix = '';
                }
                
                TextRenderer.drawKeywordText(x, y, objName + suffix, -1, color, font);
                y += ItemInfoRenderer.getSpaceY();
            }        
        
            //Requirement traits
            var traitArray = TraitControl.getReqTrait(item);
            var trait;
        
            for (i=0; i<traitArray.length; i++) {
                trait = TraitControl.getTraitFromId(traitArray[i]);
                TextRenderer.drawKeywordText(x, y, trait.getName(), 10, color, font);
                y += ItemInfoRenderer.getSpaceY();
            } 
        }
    }

    ItemSentence.Only.getItemSentenceCount = function(item) {
        var aggregationCount = this._getAggregation(item).getObjectCount();
        var traitsCount = TraitControl.getReqTrait(item).length;
        return aggregationCount + traitsCount;
    }

})()