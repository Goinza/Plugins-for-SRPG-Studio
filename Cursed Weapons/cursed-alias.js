//Plugin by Goinza
(function() {

    var alias01 = UnitCommand.Attack._checkWeaponSelectionDisabled
    UnitCommand.Attack._checkWeaponSelectionDisabled = function() {
        var unit = this.getCommandTarget()
        var hasCursedWeapon = CurseControl.hasCursedWeaponEquipped(unit)
        
        return hasCursedWeapon ? hasCursedWeapon : alias01.call(this)
    }

    var alias11 = UnitCommand.Attack._startSelection
    UnitCommand.Attack._startSelection = function(weapon) {
        alias11.call(this, weapon)
        var unit = this.getCommandTarget()
        if (CurseControl.isCursedAndEquipped(unit, weapon)) {
            this._isWeaponSelectDisabled = true
        }
    }

    var alias02 = ItemSelectMenu.isWorkAllowed 
    ItemSelectMenu.isWorkAllowed = function(index) {
        var result = alias02.call(this, index)
        var item = this._itemListWindow.getCurrentItem()

        if (CurseControl.isCursedAndEquipped(this._unit, item) && index == 1) {
            //Can't discard equipped cursed weapon
            result = false
        }
        if (CurseControl.hasCursedWeaponEquipped(this._unit) && index == 0) {
            //Can't equip another weapon
            result = false
        }

        return result
    }

    //Can't store or trade away equipped cursed weapon
    var alias03 = Miscellaneous.isTradeDisabled
    Miscellaneous.isTradeDisabled = function(unit, item) {
        var isDisabled = alias03.call(this, unit, item)

        if (CurseControl.isCursedAndEquipped(unit, item)) {
            isDisabled = true
        }

        return isDisabled
    }

    var alias04 = UnitItemTradeScreen._isTradable
    UnitItemTradeScreen._isTradable = function() {
        var isTradable = alias04.call(this)

        if (this._isSrcSelect === this._isSrcScrollbarActive) {
            var unit = this._getTargetUnit(this._isSrcSelect)
            var itemSrc = unit.getItem(this._selectIndex)
            var itemDest = unit.getItem(this._getTargetIndex())
            var isCursedEquipped = CurseControl.isCursedAndEquipped(unit, itemSrc) || CurseControl.isCursedAndEquipped(unit, itemDest)
            isTradable = !isCursedEquipped
		}

        return isTradable
    }

    ShopLayoutScreen._moveSellQuestion = function() {
        var unit = this._targetUnit
        var item = this._activeItemWindow.getShopSelectItem()
		var result = this._sellQuestionWindow.moveWindow();
			
		if (result === SellQuestionResult.SELL) {
            //Can't sell cursed equipped weapon
            var isCursedEquipped = CurseControl.isCursedAndEquipped(unit, item)
            if (isCursedEquipped) {
                this._startMessage(this._shopMessageTable.NoSell, ShopLayoutMode.SELL)
            }
            else {
                // "Sell" is selected, so sell it.
                this._startSale(false);
                if (this._buySellWindow.isPossessionItem()) {
                    this._startMessage(this._shopMessageTable.EndSell, ShopLayoutMode.SELL);
                }
                else {
                    // If there is nothing to sell, back to top.
                    this._startMessage(this._shopMessageTable.OtherMessage, ShopLayoutMode.BUYSELLSELECT);
                }
            }			
		}
		else if (result === SellQuestionResult.CANCEL) {
			this._startMessage(this._shopMessageTable.QuestionSell, ShopLayoutMode.SELL);
		}
		else if (result === SellQuestionResult.NOSELL) {
			this._startMessage(this._shopMessageTable.NoSell, ShopLayoutMode.SELL);
		}
		
		return MoveResult.CONTINUE;
    }

})()