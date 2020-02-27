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
            MyGlobal.data.taskGold += 100;
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
    onClickHandle(e, data) {
        if (MyGlobal.data.taskGold < 1)return;
        const Coin = MyGlobal.GameControl.Top.getChildByName('coin');
        const coinPos = MyGlobal.GameControl.Top.convertToWorldSpaceAR(Coin.position);
        const targetPos = MyGlobal.GameControl.node.convertToNodeSpaceAR(coinPos);
        MyGlobal.data.goldCount += MyGlobal.data.taskGold;
        MyGlobal.data.taskGold = 0;
        storageSave();
        MyGlobal.GameControl.createGoldAnim(this.node.position, targetPos, Coin, 300, 18,()=>{
            MyGlobal.GameControl.TopScript.updateGold();
            this.updateGold();
        });
    },
});
