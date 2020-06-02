//Plugin by Goinza

var InventoryInteraction = defineObject(TopCustomInteraction, {

    getTitle: function() {
        return INVENTORY_TITLE;
    },

    getScrollbarObject: function() {
        return InventoryScrollbar;
    }  
})

var InventoryScrollbar = defineObject(ItemDropListScrollbar, {

    setDataScrollbar: function(unit) {
        this.setUnitItemFormation(unit);
    }
    
})