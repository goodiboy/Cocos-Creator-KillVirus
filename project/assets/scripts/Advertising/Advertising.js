cc.Class({
    extends: cc.Component,

    properties: {
        TimeDown: {
            type: cc.Label,
            default: null
        },
        BtnClose: {
            type: cc.Node,
            default: null
        },
        WebView: {
            type: cc.WebView,
            default: null
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        MyGlobal.Advertising = this;
        this.node.active = false;
        this.node.x = 0;
    },


    start() {

    },

    /**
     * 显示广告页面
     * @param revival 判断是复活还是领3倍金币
     */
    pageShow(revival = true) {
        this.revival = revival;
        this.BtnClose.active = false;
        this.node.active = true;
        this.adTime = MyGlobal.adTime;
        this.TimeDown.string = this.adTime;
        // this.WebView.url = 'https://www.baidu.com/';
        this.schedule(this.timeDownHandle, 1, MyGlobal.adTime - 1);
    },

    /**
     * 倒计时
     */
    timeDownHandle() {
        this.TimeDown.string = --this.adTime;
        if (0 >= this.adTime) {
            this.BtnClose.active = true;
        }
    },

    /**
     * 关闭广告
     */
    closeHandle() {
        if (this.revival) {
            const AriPlane = MyGlobal.AirPlane;
            AriPlane.Invincible.active = true;
            AriPlane.isDeath = false;
            AriPlane.beginFire();
            AriPlane.invincibleDieAway();
            MyGlobal.gameStatus = 'isPlaying';
            MyGlobal.isCanTouch = true;
            this.node.active = false;
        } else {
            this.node.active = false;
            const SettleAccounts = MyGlobal.SettleAccounts;
            SettleAccounts.updateGoldAccount(SettleAccounts.goldValue * 3);
        }


    },

    // update (dt) {},
});
