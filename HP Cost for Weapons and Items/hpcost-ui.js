//Plugin by Goinza

ItemSentence.LifeCost = defineObject(BaseItemSentence, {

    drawItemSentence: function(x, y, item) {
        if (HPCostControl.hasCost(item)) {
            var text, cost;
            text = root.queryCommand('hp_param') + " cost";
            cost = item.custom.lifeCost;
            ItemInfoRenderer.drawKeyword(x, y, text);
		    x += ItemInfoRenderer.getSpaceX();
		    NumberRenderer.drawRightNumber(x, y, cost);
        }         
    },

    getItemSentenceCount: function(item) {
        return HPCostControl.hasCost(item) ? 1 : 0;
    }

})