cc.Class({
    extends: cc.Component,

    properties: {
        ProgressBar: {
            type: cc.Sprite,
            default: null
        },
        taskGold: {
            type: cc.Label,
            default: null
        },
        _needTime: 5,
        _nowTime: 0,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {

    },
    update(dt) {
        this._nowTime += dt;
        let pre = this._nowTime / this._needTime;
        if (pre > 1) {
            pre = 1;
            MyGlobal.data.taskGold += MyGlobal.cycleGold;
            this.updateGold();
            storageSave();
            this._nowTime = 0;
        }
        this.ProgressBar.fillRange = -pre;
    },

    updateGold() {
        this.taskGold.string = goldCarry(MyGlobal.data.taskGold);
    },

    moveOut() {
        cc.tween(this.node)
            .to(0.3, {x: 620, opacity: 100})
            .start()
    },
    moveIn() {
        cc.tween(this.node)
            .to(0.3, {x: 373, opacity: 255})
            .start()
    },

    /**
     * 点击领取金币
     */
    onClickHandle() {
        if (MyGlobal.data.taskGold < 1) return;
        const Coin = MyGlobal.GameControl.TopScript.GoldIcon;
        const targetPos = convertPos(Coin,MyGlobal.GameControl.node);
        const addGold = MyGlobal.data.taskGold;
        MyGlobal.data.goldCount += MyGlobal.data.taskGold;
        MyGlobal.data.taskGold = 0;
        storageSave();
        MyGlobal.GameControl.createGoldAnim(this.node.position, targetPos, Coin, MyGlobal.GameControl.node, 300, addGold, () => {
            MyGlobal.GameControl.TopScript.updateGold();
            this.updateGold();
        });
    },
});
