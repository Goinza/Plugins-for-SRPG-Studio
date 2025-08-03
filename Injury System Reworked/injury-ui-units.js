//Plugin by Goinza

(function() {

    var alias01 = UnitSortieListScrollbar._getSortieColorAndAlpha
    UnitSortieListScrollbar._getSortieColorAndAlpha = function(object) {
        if (!InjuryControl.isInjured(object)) {
            return alias01.call(this, object)
        }
        var color = InjurySettings.NAME_COLOR
        var alpha = 255

        return {
            color: color,
            alpha: alpha
        }
    }

    UnitSortieListScrollbar.playSelectSound = function() {
		var object = this.getObject();
		var isSelect = true;
		
		if (this._isForceSortie(object)) {
			isSelect = false;
		}
		else if (!this._isSortie(object)) {
			isSelect = false;
		}
        else if (InjuryControl.isInjured(object)) {
            isSelect = false
        }
		else if (SceneManager.getActiveScene().getSortieSetting().getSortieCount() === SceneManager.getActiveScene().getSortieSetting().getDefaultSortieMaxCount()) {
			if (object.getSortieState() === SortieType.SORTIE) {
				isSelect = true;
			}
			else {
				isSelect = false;
			}
		}
		
		if (isSelect) {
			MediaControl.soundDirect('commandselect');
		}
		else {
			MediaControl.soundDirect('operationblock');
		}
	}

})()