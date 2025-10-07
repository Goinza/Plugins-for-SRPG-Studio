//Plugin by Goinza

var ReviveItemWindow = defineObject(BaseWindow, {

    _item: null,
    _itemCount: 0,

    initialize: function() {
        this._item = ReviveControl.getReviveItem()
        this._itemCount = ReviveControl.getReviveItemCount()
    },

    drawWindowContent: function(x, y) {
        y -= this.getWindowYPadding() - 5
        var textui = this.getWindowTextUI()
        var color = textui.getColor()
        var font = textui.getFont()

        ItemRenderer.drawItem(x, y, this._item, color, font, false)
        this._drawAmount(x, y)
    },

    getWindowHeight: function() {
        return ItemRenderer.getItemHeight() + 5
    },

    getWindowWidth: function() {
        return ItemRenderer.getItemWidth()
    },

    _drawAmount: function(x, y) {
        x += 5 + ItemRenderer._getItemNumberInterval()
        NumberRenderer.drawNumberColor(x, y, this._itemCount, 0, 255)
    },

    updateWindow: function() {
        this._itemCount = ReviveControl.getReviveItemCount()
    }

})