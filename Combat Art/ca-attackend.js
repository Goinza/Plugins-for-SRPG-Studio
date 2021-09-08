//Plugin by Goinza

(function() {

    var alias1 = MapSequenceCommand._pushFlowEntries;
    MapSequenceCommand._pushFlowEntries = function(straightFlow) {
        alias1.call(this, straightFlow);
        this._straightFlow.pushFlowEntry(EndCombatArtFlowEntry);
    }

})()

var EndCombatArtFlowEntry = defineObject(BaseFlowEntry, {

    enterFlowEntry: function(flowData) {
        if (CombatArtAttack.isCombatArtAttack()) {
            CombatArtAttack.endCombatArtAttack();
        }        
        return EnterResult.NOTENTER;
    }

})