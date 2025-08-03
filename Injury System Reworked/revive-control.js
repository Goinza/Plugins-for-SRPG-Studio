//Plugin by Goinza

var ReviveControl = {

    getReviveItem: function() {
        var id = InjurySettings.REVIVE_ITEM_ID
        var item = root.getBaseData().getItemList().getDataFromId(id)

        return item
    },

    getReviveItemCount: function() {
        var reviveItem = this.getReviveItem()
        var item

        var stockArray = StockItemControl.getStockItemArray()
        var count = 0
        for (var i=0; i<stockArray.length; i++) {
            item = stockArray[i]
            if (ItemControl.compareItem(item, reviveItem)) {
                count++
            }
        }

        var playerList = PlayerList.getAliveList()
        var playerCount = playerList.getCount()
        var unit, itemCount
        for (var i=0; i<playerCount; i++) {
            unit = playerList.getData(i)
            itemCount = UnitItemControl.getPossessionItemCount(unit)
            for (var j=0; j<itemCount; j++) {
                item = UnitItemControl.getItem(unit, j)
                if (ItemControl.compareItem(item, reviveItem)) {
                    count++
                }
            }
        }

        return count
    },

    //Assumes that getReviveItemCount() > 0
    useReviveItem: function() {
        var reviveItem = this.getReviveItem()

        var item = StockItemControl.getMatchItem(reviveItem)
        if (item != null) {
            var index = StockItemControl.getIndexFromItem(item)
            StockItemControl.cutStockItem(index)
        }
        else {
            var playerList = PlayerList.getAliveList()
            var playerCount = playerList.getCount()
            var unit, itemCount
            var found = false
            var i = 0
            var j
            while (i<playerCount && !found) {
                unit = playerList.getData(i)
                itemCount = UnitItemControl.getPossessionItemCount(unit)  
                j = 0
                while (j<itemCount && !found) {
                    item = UnitItemControl.getItem(unit, j)
                    if (ItemControl.compareItem(item, reviveItem)) {
                        found = true
                        UnitItemControl.cutItem(unit, j)
                    }
                    j++
                }
                i++
            }
        }
    }

}