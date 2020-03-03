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
        },
        PlaneHead: {
            type: cc.Node,
            default: null
        },
        FlashDot: {
            type: cc.Node,
            default: null
        },
        Invincible: {
            type: cc.Node,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        const length = this.DotWaves.length;
        MyGlobal.AirPlane = this;
        this.Invincible.active = false;
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


    onCollisionEnter(other, self) {
        if (other.tag === 300) {
            console.log('hit');
            // 如果是无敌或者已经死亡的状态，则不再检测碰撞
            if (this.Invincible.active || this.isDeath) return;
            this.planDeath();
        }
    },

    /**
     * 飞机碰撞到病毒
     */
    planDeath() {
        this.isDeath = true;
        this.stopOperation();
        this.setHitColor(new cc.Color(255, 100, 100));
        cc.tween(this.PlaneHead)
            .to(0.2, {color: cc.Color.RED})
            .to(0.2, {color: cc.Color.WHITE})
            .union()
            .repeat(4)
            .call(e => {
                this.setHitColor(cc.Color.WHITE);
                MyGlobal.ResurgenceNode.pageShow();
            })
            .start()
    },

    /**
     * 飞机飞出屏幕
     */
    moveOutScreen() {
        const s = (1000 - this.node.y) / 1000 * 0.6;
        cc.tween(this.node)
            .to(s, {y: 1000})
            .call(e=>{
                MyGlobal.SettleAccounts.pageShow(true);
            })
            .start();
    },


    /**
     * 禁止一系列的操作
     */
    stopOperation() {
        MyGlobal.isCanTouch = false;
        MyGlobal.gameStatus = 'isPause';
        this.endFire();
    },

    /**
     * 设置碰撞时的飞机颜色
     * @param color 颜色
     */
    setHitColor(color) {
        this.DotWaves.forEach((item, index) => {
            item.color = color;
        });
        this.FlashDot.color = color;
    },

    /**
     * 无敌逐渐衰弱，变回正常状态
     */
    invincibleDieAway() {
        cc.tween(this.Invincible)
            .delay(3)
            .repeat(
                5,
                cc.tween()
                    .to(0.2, {opacity: 0})
                    .to(0.2, {opacity: 255})
            )
            .call(e => {
                this.Invincible.active = false;
            })
            .start();
    },

    /**
     * 发射子弹
     */
    beginFire() {
        this.Gun.active = true;
        this.fireBullet();
        this.schedule(this.fireBullet, 0.15);
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
    fireBullet() {
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
        if (targetPos.x > 420) {
            targetPos.x = 420;
        } else if (targetPos.x < -420) {
            targetPos.x = -420;
        }

        if (targetPos.y < -700) {
            targetPos.y = -700
        } else if (targetPos.y > 700) {
            targetPos.y = 700;
        }

        this.node.setPosition(targetPos);
    },
    /**
     * 飞机自动移入函数
     */
    play() {
        this.node.y = -966;
        this.node.x = 21;
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
