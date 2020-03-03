cc.Class({
    extends: cc.Component,

    properties: {
        OpacityBg: {
            type: cc.Node,
            default: null
        },
        TimeDown: {
            type: cc.Label,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        MyGlobal.ResurgenceNode = this;
        this.node.x = 0;
        this.node.active = false;

    },


    init() {
        this.timeValue = MyGlobal.timeDownValue;
        this.TimeDown.string = this.timeValue;
        this.OpacityBg.opacity = 0;
    },

    /**
     * 显示当前页面，复活页
     */
    pageShow() {
        this.node.active = true;
        this.init();
        this.OpacityBg.runAction(cc.fadeTo(0.5, 160));
        this.schedule(this.timeDownHandle, 1, MyGlobal.timeDownValue - 1);
    },

    /**
     * 倒计时
     */
    timeDownHandle() {
        this.TimeDown.string = --this.timeValue;
        if (this.timeValue <= 0) {
            this.node.active = false;
            MyGlobal.gameOver = true;
            MyGlobal.GameControl.planeDeathHandle();
            MyGlobal.SettleAccounts.pageShow()
        }
    },


    /**
     * 按钮事件 => 显示广告
     */
    showAdPage() {
        this.node.active = false;
        this.unschedule(this.timeDownHandle);
        MyGlobal.Advertising.pageShow();
    }

    // update (dt) {},
});
