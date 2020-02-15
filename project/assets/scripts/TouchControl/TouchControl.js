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
        // 是否可以触摸
        this.isCanTouchMove = false;
        // 是否再游戏中
        this.isPlaying = false;

        // 事件绑定
        this.node.on(cc.Node.EventType.TOUCH_START, this.TouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.TouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.TouchEnd, this);
    },

    TouchStart(event) {
        console.log('touchstart');
        if (!this.isCanTouchMove) return;
        if (!this.isPlaying) {
            this.StopMask.runAction(cc.fadeOut(0.5));
            this.isPlaying = true;
            Global.GameControl.AirPlaneScript.beginFire();
            Global.GameControl.doAction(Global.ACTION_MOVE_OUT);
        }
    },
    TouchMove(event) {
        if (!this.isPlaying) return;
        const pos = event.getDelta();
        Global.GameControl.AirPlaneScript.movePlane(pos);
    },
    TouchEnd(event) {
        console.log('touchend');
        this.isPlaying = false;
        Global.GameControl.AirPlaneScript.endFire();
        this.StopMask.runAction(cc.fadeIn(0.5));
    },
});
