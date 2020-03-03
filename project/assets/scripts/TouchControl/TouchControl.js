cc.Class({
    extends: cc.Component,

    properties: {
        StopMask: {
            type: cc.Node,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 事件绑定
        this.node.on(cc.Node.EventType.TOUCH_START, this.TouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
    },

    TouchStart(event) {
        console.log('touchstart');
        // 前置动画还没有完成之前，不能开始游戏
        if (!MyGlobal.isCanTouch || MyGlobal.gameStatus === 'isPlaying') return;
        // 如果游戏是从未开始变成开始的情况，需要执行的动画
        if (MyGlobal.gameStatus === 'notStarted') {
            MyGlobal.GameControl.doAction(MyGlobal.ACTION_MOVE_OUT);
            MyGlobal.VirusMake.createVirus();
        }
        MyGlobal.gameStatus = 'isPlaying';
        this.StopMask.runAction(cc.fadeOut(0.5));
        this.scheduleOnce(this.planeFire, 0.1);
    },

    TouchMove(event) {
        if (MyGlobal.gameStatus !== 'isPlaying') return;
        const pos = event.getDelta();
        MyGlobal.GameControl.AirPlaneScript.movePlane(pos);
    },

    TouchEnd(event) {
        console.log('touchend');
        if (MyGlobal.gameStatus !== 'isPlaying') return;
        this.unschedule(this.planeFire);
        MyGlobal.gameStatus = 'isPause';
        MyGlobal.GameControl.AirPlaneScript.endFire();
        this.StopMask.runAction(cc.fadeIn(0.5));
    },

    planeFire() {
        MyGlobal.GameControl.AirPlaneScript.beginFire();
    },

});
