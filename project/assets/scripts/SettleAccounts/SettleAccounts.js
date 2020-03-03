cc.Class({
    extends: cc.Component,

    properties: {
        OpacityBg: {
            type: cc.Node,
            default: null
        },
        KillGold: {
            type: cc.Label,
            default: null
        },
        DoubleGold: {
            type: cc.Label,
            default: null
        },
        GoldIcon: {
            type: cc.Node,
            default: []
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.active = false;
        this.node.x = 0;
        this.OpacityBg.opacity = 0;
        MyGlobal.SettleAccounts = this;
    },

    start() {

    },

    /**
     * 显示结算页面
     * @param pass 判断是过关还是死亡
     */
    pageShow(pass) {
        this.goldValue = MyGlobal.GameControl.VirusProgressHpScript.goldValue;
        this.node.active = true;
        MyGlobal.GameControl.settleAnim();
        this.OpacityBg.runAction(cc.fadeTo(0.5, 160));
        this.KillGold.string = this.goldValue;
        this.DoubleGold.string = this.goldValue * 3;
        MyGlobal.GameControl.TopScript.moveIn();
        if (pass) {
            MyGlobal.GameControl.LevelDesignScript.changeLevel();
        }
    },


    /**
     * 点击按钮事件 => 点击领取金币还是看广告领三倍金币
     * @param event 事件对象
     * @param option 参数receive代表立即领取，否则看广告领取3倍金币
     */
    btnHandle(event, option) {
        if (this.isGetGold) {
            return;
        }
        this.isGetGold = true;
        console.log(event, option);
        if ('receive' === option) {
            this.srcNodeIndex = 0;
            this.updateGoldAccount(this.goldValue);
        } else {
            this.srcNodeIndex = 1;
            MyGlobal.Advertising.pageShow(false);
        }

    },


    /**
     * 结算金币到账户
     * @param gold 金币
     */
    updateGoldAccount(gold) {
        const Coin = MyGlobal.GameControl.TopScript.GoldIcon;
        const targetPos = convertPos(Coin, MyGlobal.GameControl.node);
        const srcPos = this.GoldIcon[this.srcNodeIndex].position.add(this.GoldIcon[this.srcNodeIndex].parent.position);
        MyGlobal.data.goldCount += gold;
        storageSave();
        MyGlobal.GameControl.createGoldAnim(srcPos, targetPos, MyGlobal.GameControl.TopScript.GoldIcon, MyGlobal.GameControl.node, 250, gold, this.finishedUpdate.bind(this));
    },

    finishedUpdate() {
        this.scheduleOnce(function(){
           this.resetStatus();
        },0.5);

    },


    /**
     * 初始化结算之后的状态
     */
    resetStatus(){
        MyGlobal.GameControl.TopScript.updateGold();
        this.node.active = false;
        MyGlobal.GameControl.VirusProgressHp.opacity = 0;
        MyGlobal.gameStatus = 'notStarted';
        MyGlobal.isGamePass = false;
        this.isGetGold = false;
        MyGlobal.GameControl.VirusProgressHpScript.goldValue = 0;
        MyGlobal.GameControl.doAction(MyGlobal.ACTION_RESET);
        MyGlobal.GameControl.doAction(MyGlobal.ACTION_MOVE_IN);
        MyGlobal.GameControl.doAction(MyGlobal.ACTION_PLAY);
        if(MyGlobal.gameOver){
            MyGlobal.gameOver = false;
            MyGlobal.AirPlane.isDeath = false;
            MyGlobal.AirPlane.node.active = true;
        }
    }

    // update (dt) {},
});
