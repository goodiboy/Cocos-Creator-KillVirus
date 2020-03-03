cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    /**
     * 初始化
     */
    init() {
        this.isHit = false;
    },

    onCollisionEnter(other, self) {
        killPoolNode(MyGlobal.BulletPool, this.node);
    },

    /**
     * 初始化是否可以移动
     */
    initMoveState() {
        this.upMove = MyGlobal.bulletCount <= 1;
    },

    /**
     * 多颗子弹的时候，先进行移动排好位置再进行向上移动
     * @param pos 需要移动到的目标位置
     */
    setSecondPos(pos) {
        // 用0.1秒的时候移动到需要排列的目标位置，然后进行向上移动
        const moveTo = cc.moveTo(0.1, pos);
        const callFunc = cc.callFunc(function () {
            this.upMove = true;
        }, this);
        const seq = cc.sequence(moveTo, callFunc);
        this.node.runAction(seq);
    },

    /**
     * 子弹向上移动
     * @param dt 距离上次刷新的时间
     */
    update(dt) {
        // 如果是游戏结束或者是游戏通过，则移除子弹
        if (MyGlobal.gameOver || MyGlobal.isGamePass) {
            MyGlobal.BulletPool.put(this.node);
            return;
        }
        if (!this.upMove || MyGlobal.gameStatus !== 'isPlaying') return;
        this.node.y += 1000 * dt;
        if (this.node.y > 900) {
            MyGlobal.BulletPool.put(this.node);
        }
    },
});
