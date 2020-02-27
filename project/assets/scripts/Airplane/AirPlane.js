cc.Class({
    extends: cc.Component,

    properties: {
        DotWaves: {
            type: cc.Node,
            default: [],
            tooltip: '光圈'
        },
        Flame: {
            type: cc.Node,
            default: null,
            tooltip: '尾焰'
        },
        Gun: {
            type: cc.Node,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        const length = this.DotWaves.length;
        this.DotWaves.forEach((item, index) => {
            cc.tween(item)
                .delay(index * 0.2)
                .to(0.4, {scale: 1})
                .to((length - index) * 0.2, {opacity: 0})
                .to(0, {scale: 0, opacity: 255})
                .union()
                .repeatForever()
                .start();
        });
    },

    start() {

    },

    /**
     * 发射子弹
     */
    beginFire() {
        this.Gun.active = true;
        this.fireBullet();
        this.schedule(this.fireBullet,0.15);
    },
    /**
     * 结束发射子弹
     */
    endFire() {
        this.Gun.active = false;
        this.unschedule(this.fireBullet);
    },
    /**
     * 发射子弹函数
     */
    fireBullet(){
        const planePos = this.node.position;
        MyGlobal.GameControl.createBullet(planePos);
    },

    /**
     * 移动飞机的位置
     * @param pos 移动的距离
     */
    movePlane(pos) {
        const nowPos = this.node.getPosition(new cc.Vec2());
        const targetPos = nowPos.add(pos);
        if (targetPos.x > 420){
            targetPos.x = 420;
        }else if (targetPos.x < - 420){
            targetPos.x = -420;
        }

        if (targetPos.y < -700){
            targetPos.y = -700
        }else if (targetPos.y > 700){
            targetPos.y = 700;
        }

        this.node.setPosition(targetPos);
    },
    /**
     * 飞机自动移入函数
     */
    play() {
        this.node.y = -966;
        this.node.scale = 0.8;
        cc.tween(this.node)
            .to(1, {y: -432}, {easing: 'quadOut'})
            .to(0.5, {scale: 1})
            .start();
        cc.tween(this.Flame)
            .delay(1)
            .to(0.5, {scale: 0.6})
            .start()
    },
    /**
     * 飞机停止移动
     */
    moveIn() {
        cc.tween(this.node)
            .to(0.5, {scale: 1})
            .start();
        cc.tween(this.Flame)
            .to(0.5, {scale: 0.6})
            .start()
    },
    /**
     * 飞机开始移动
     */
    moveOut() {
        cc.tween(this.node)
            .to(0.5, {scale: 0.6})
            .start();
        cc.tween(this.Flame)
            .to(0.5, {scale: 1})
            .start()
    }

    // update (dt) {},
});
