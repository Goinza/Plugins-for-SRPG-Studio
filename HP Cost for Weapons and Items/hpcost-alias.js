// Plugin by Goinza

(function () {
    // Weapon can only be used if unit has more HP than the cost to wield said weapon
    var alias1 = ItemControl.isWeaponAvailable;
    ItemControl.isWeaponAvailable = function (unit, item) {
        var available = alias1.call(this, unit, item);

        if (available && HPCostControl.hasCost(item)) {
            var cost = item.custom.lifeCost;
            available = unit.getHp() > cost;
        }

        return available;
    }

    // Item can only be used if unit has more HP than the cost to wield said item
    var alias2 = ItemControl.isItemUsable;
    ItemControl.isItemUsable = function (unit, item) {
        var available = alias2.call(this, unit, item);

        if (available && HPCostControl.hasCost(item)) {
            var cost = item.custom.lifeCost;
            available = unit.getHp() > cost;
        }

        return available;
    }

    // Both the doHitAction and the setCostHP functions work together to reduce the HP gauge during the Real Battle animations
    var alias3 = RealBattle.doHitAction;
    RealBattle.doHitAction = function () {
        var hit = alias3.call(this);
        var damage = BattlerChecker.getBaseWeapon(this._order.getActiveUnit()).custom.lifeCost;

        if (damage) {
            this._uiBattleLayout.setCostHP(this.getActiveBattler(), damage);
        }

        return hit;
    }
    UIBattleLayout.setCostHP = function (battler, damage) {
        var gauge;

        if (battler === this._battlerRight) {
            gauge = this._gaugeRight;
        }
        else {
            gauge = this._gaugeLeft;
        }
        gauge.startMove(damage * -1);
        this._showDamagePopup(battler, damage, false);
    }


    var alias28 = EasyMapUnit._doHitAction;
    EasyMapUnit._doHitAction = function () {
        alias28.call(this);

        var order = this._order;
        var damage = BattlerChecker.getBaseWeapon(order.getActiveUnit()).custom.lifeCost;

        if (damage) {
            this._showHpCostDamagePopup(order.getActiveUnit(), damage, false);
        }
    }

    // The vanilla EasyMapUnit._showDamagePopup function only shows popups for the unit being attacked.
    // This new method adds a 'unit' argument to allow the target of the popup to be specified.
    EasyMapUnit._showHpCostDamagePopup = function (unit, damage, isCritical) {
        var xPixel = LayoutControl.getPixelX(unit.getMapX());
        var yPixel = LayoutControl.getPixelY(unit.getMapY());

        var effect = createObject(DamagePopupEffect);
        var dx = Math.floor((DamagePopup.WIDTH - GraphicsFormat.CHARCHIP_WIDTH) / 2);
        var dy = Math.floor((DamagePopup.HEIGHT - GraphicsFormat.CHARCHIP_HEIGHT) / 2);

        if (this._direction === DirectionType.TOP || this._direction === DirectionType.BOTTOM) {
            if (xPixel >= root.getGameAreaWidth() - 64) {
                dx -= 64;
            }
        }
        else if (this._direction === DirectionType.LEFT || this._direction === DirectionType.RIGHT) {
            if (yPixel >= root.getGameAreaHeight() - 32) {
                dy -= 32;
            }
            else {
                dy += 32;
            }

            dx -= 32;
        }

        effect.setPos(xPixel + dx, yPixel + dy, damage);
        effect.setAsync(true);
        effect.setCritical(isCritical);
        this._easyBattle.pushCustomEffect(effect);
    }

    // Now calls startDamageAnimation even in the event of a miss, to account for self-harm.
    // The two below functions reduce the HP gauge during easy battle.
    var alias29 = EasyMapUnit._startDamage;
    EasyMapUnit._startDamage = function () {
        alias29.call(this);
        this._easyBattle.startDamageAnimation();
    }
    var alias30 = EasyBattle.startDamageAnimation;
    EasyBattle.startDamageAnimation = function () {
        // NOTE: alias30.call isn't actually doing anything; later calls of startDamageAnimation seem to override earlier calls. 
        // The purpose of this alias is only for compatibility with any other plugins adding new functionality to startDamageAnimation.
        alias30.call(this);
        var order = this._order;
        var damageActive;
        var damagePassive = order.getPassiveDamage() * -1;
        var hpCostDamage = BattlerChecker.getBaseWeapon(order.getActiveUnit()).custom.lifeCost;

        if (hpCostDamage) {
            damageActive = hpCostDamage * -1;
        } else {
            damageActive = order.getActiveDamage() * -1;
        }

        if (this._isPosMenuDisplayable()) {
            if (this._battlerRight.getUnit() === order.getActiveUnit()) {
                this._easyMenu.startAnimation(damageActive, damagePassive);
            }
            else {
                this._easyMenu.startAnimation(damagePassive, damageActive);
            }
        }
    }

    // Reduces the actual HP of the unit to reflect the self damage after the battle
    var alias4 = AttackFlow._doAttackAction;
    AttackFlow._doAttackAction = function () {
        alias4.call(this);

        var active = this._order.getActiveUnit();
        var passive = this._order.getPassiveUnit();
        var activeWeapon = BattlerChecker.getBaseWeapon(active);

        if (HPCostControl.hasCost(activeWeapon)) {
            var activeCost = BattlerChecker.getBaseWeapon(active).custom.lifeCost;

            DamageControl.reduceHp(active, activeCost);
            DamageControl.checkHp(active, passive);
        }

    }

    // Changes the UI to show how many attacks are possible.
    // This is because the life cost of a weapon can reduce the amount of attacks an unit can do.
    var alias5 = PosAttackWindow.setPosTarget;
    PosAttackWindow.setPosTarget = function (unit, item, targetUnit, targetItem, isSrc) {
        alias5.call(this, unit, item, targetUnit, targetItem, isSrc);

        // This only works for the UI. It doesn't change anything about the actual battle
        var weapon = ItemControl.getEquippedWeapon(unit);

        if (HPCostControl.hasCost(weapon)) {
            var lifeCost = weapon.custom.lifeCost;
            var maxAttackCount = lifeCost != null ? Math.floor(unit.getHp() / lifeCost) : this._roundAttackCount;
            this._roundAttackCount = Math.min(maxAttackCount, this._roundAttackCount);
        }

    }

    // Stops the unit from attacking if the unit ends up without enough hp to attack in the middle of combat.
    // This also works to avoid counterattacks from the passive unit if that unit can die from the cost of its weapon.
    var alias6 = NormalAttackOrderBuilder._isAttackContinue;
    NormalAttackOrderBuilder._isAttackContinue = function (virtualActive, virtualPassive) {
        var canContinue = alias6.call(this, virtualActive, virtualPassive);

        if (canContinue) {
            var weapon = virtualActive.weapon;
            if (HPCostControl.hasCost(weapon)) {
                var lifeCost = weapon.custom.lifeCost;
                var ownDamage = virtualActive.ownDamage != null ? virtualActive.ownDamage : 0;
                var receivedDamaged = virtualActive.damageTotal;
                var staticHp = virtualActive.unitSelf.getHp();
                var currentHP = staticHp - ownDamage - receivedDamaged;
                if (currentHP < lifeCost) {
                    canContinue = false;
                }
            }
        }

        return canContinue;
    }

    // Keeps track of the self damage done by the weapon.
    // This is used during the function alias6 to determine when the unit has to stop attacking
    var alias7 = AttackEvaluator.ActiveAction.evaluateAttackEntry;
    AttackEvaluator.ActiveAction.evaluateAttackEntry = function (virtualActive, virtualPassive, attackEntry) {
        var damageActive = alias7.call(this, virtualActive, virtualPassive, attackEntry);

        var weapon = virtualActive.weapon;
        if (HPCostControl.hasCost(weapon)) {
            var lifeCost = weapon.custom.lifeCost;
            if (virtualActive.ownDamage == null) {
                virtualActive.ownDamage = lifeCost;
            }
            else {
                virtualActive.ownDamage += lifeCost;
            }
        }

        return damageActive;
    }

    var alias8 = RecoveryItemUse.enterMainUseCycle;
    RecoveryItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias8.call(this, itemUseParent);
    }

    var alias9 = EntireRecoveryItemUse.enterMainUseCycle;
    EntireRecoveryItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias9.call(this, itemUseParent);
    }

    var alias10 = DamageItemUse.enterMainUseCycle;
    DamageItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias10.call(this, itemUseParent);
    }

    var alias11 = DopingItemUse.enterMainUseCycle;
    DopingItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias11.call(this, itemUseParent);
    }

    var alias12 = SkillChangeItemUse.enterMainUseCycle;
    SkillChangeItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias12.call(this, itemUseParent);
    }

    var alias13 = KeyItemUse.enterMainUseCycle;
    KeyItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias13.call(this, itemUseParent);
    }

    var alias14 = QuickItemUse.enterMainUseCycle;
    QuickItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias14.call(this, itemUseParent);
    }

    var alias15 = TeleportationItemUse.enterMainUseCycle;
    TeleportationItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias15.call(this, itemUseParent);
    }

    var alias16 = RescueItemUse.enterMainUseCycle;
    RescueItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias16.call(this, itemUseParent);
    }

    var alias17 = ResurrectionItemUse.enterMainUseCycle;
    ResurrectionItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias17.call(this, itemUseParent);
    }

    var alias18 = DurabilityChangeItemUse.enterMainUseCycle;
    DurabilityChangeItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias18.call(this, itemUseParent);
    }

    var alias19 = StealItemUse.enterMainUseCycle;
    StealItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias19.call(this, itemUseParent);
    }

    var alias20 = StateItemUse.enterMainUseCycle;
    StateItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias20.call(this, itemUseParent);
    }

    var alias21 = StateRecoveryItemUse.enterMainUseCycle;
    StateRecoveryItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias21.call(this, itemUseParent);
    }

    var alias22 = SwitchItemUse.enterMainUseCycle;
    SwitchItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias22.call(this, itemUseParent);
    }

    var alias23 = FusionItemUse.enterMainUseCycle;
    FusionItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias23.call(this, itemUseParent);
    }

    var alias24 = MetamorphozeItemUse.enterMainUseCycle;
    MetamorphozeItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias24.call(this, itemUseParent);
    }

    var alias25 = ClassChangeItemUse.enterMainUseCycle;
    ClassChangeItemUse.enterMainUseCycle = function (itemUseParent) {
        var unit = itemUseParent.getItemTargetInfo().unit;
        var item = itemUseParent.getItemTargetInfo().item;
        HPCostControl.payLife(unit, item);

        return alias25.call(this, itemUseParent);
    }

    var alias26 = ItemInfoWindow._configureWeapon;
    ItemInfoWindow._configureWeapon = function (groupArray) {
        alias26.call(this, groupArray);
        groupArray.appendObject(ItemSentence.LifeCost);
    }

    var alias27 = ItemInfoWindow._configureItem;
    ItemInfoWindow._configureItem = function (groupArray) {
        alias27.call(this, groupArray);
        groupArray.appendObject(ItemSentence.LifeCost);
    }
})()
