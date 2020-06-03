//Plugin by Goinza

var InventoryInteraction = defineObject(TopCustomInteraction, {

    getTitle: function() {
        return INVENTORY_TITLE;
    },

    getScrollbarObject: function() {
        return InventoryScrollbar;
    },

    getWindowObject: function() {
        return ItemInfoWindow;
    },
    
    _changeTopic: function() {
		var item = this._scrollbar.getObject();
		
		this._window.setInfoItem(item);
	}
})

var InventoryScrollbar = defineObject(ItemDropListScrollbar, {

    setDataScrollbar: function(unit) {
        this.setUnitItemFormation(unit);
        this.resetDropMark();
    }
    
})