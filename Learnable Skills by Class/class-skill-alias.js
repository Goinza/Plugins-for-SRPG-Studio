//Plugin by Goinza

(function() {
    var alias1 = ExperienceControl.obtainData;
    ExperienceControl.obtainData = function(unit) {    
        alias1.call(this, unit);
        root.msg(unit.getName());
        SkillGranter.checkCustomSkills(unit);    
    }

    var alias2 = ClassChangeItemUse.mainAction;
    ClassChangeItemUse.mainAction = function() {
        alias2.call(this);
        var itemTargetInfo = this._itemUseParent.getItemTargetInfo();
        SkillGranter.checkCustomSkills(itemTargetInfo.unit);
    }
})()