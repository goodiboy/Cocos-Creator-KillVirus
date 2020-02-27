cc.Class({
    extends: cc.Component,

    properties: {
        VirusHp: {
            type: cc.Label,
            default: null
        },
        Back: {
            type: cc.Node,
            default: []
        },
        BootPrefab: {
            type: cc.Prefab,
            default: null
        },
        Body: {
            type: cc.Node,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.minX = this.Body.width / 2;
        this.maxX = 900 - this.minX;
        console.log(this.minX);
        this.Back[0].runAction(cc.repeatForever(cc.rotateBy(8, 360)));
        this.Back[1].runAction(cc.repeatForever(cc.rotateBy(8, -360)));
    },

    init(hp, color, scale) {
        this.setVirusHp(hp);
        this.setVirusColor(color);
        this.setVirusScale(scale);
        this.setMoveStart();
        this.randomSpeed();
    },

    /**
     * 碰撞检测
     * @param other 其他对象
     * @param self 当前对象
     */
    onCollisionEnter(other, self) {
        // 子弹会同时碰撞多个病毒，产生多个碰撞回调，所以当第一次碰撞之后设置isHit的状态，让后面的碰撞不执行回调
        const BulletScript = other.node.getComponent('Bullet');
        if (BulletScript.isHit) return;
        BulletScript.isHit = true;
        this.VirusHp.string = this.live--;
        MyGlobal.VirusMake.hit(-1);
        if (this.live <= 0) {
            this.virusDeath();
            return;
        }
        if (!this.animRun) {
            this.animRun = true;
            cc.tween(this.node)
                .by(0.1, {scale: 0.1})
                .by(0.1, {scale: -0.1})
                .call(e => {
                    this.animRun = false;
                })
                .start();
        }
    },

    /**
     * 病毒死亡的效果
     */
    virusDeath() {
        killPoolNode(MyGlobal.VirusPool, this.node);
        const Boot = getPoolNode(MyGlobal.BootPool, MyGlobal.VirusMake.node, this.BootPrefab);
        Boot.setPosition(this.node.getPosition());
        Boot.scale = this.Body.width / Boot.width;
        Boot.color = this.Body.color;
        const bootAnim = Boot.getComponent(cc.Animation);
        bootAnim.play();
        /**
         * 序列帧动画播放完成之后的回调函数
         */
        bootAnim.once('finished', function () {
            killPoolNode(MyGlobal.BootPool, Boot);
        }, this);
    },

    /**
     * 设置病毒的颜色
     * @param color
     */
    setVirusColor(color) {
        const components = this.getComponentsInChildren('setColor');
        components.forEach(component => {
            component.node.color = color;
        });
    },

    /**
     * 设置病毒的血量
     * @param hp 血量
     */
    setVirusHp(hp) {
        this.live = hp;
        this.VirusHp.string = hp;
    },

    /**
     * 设置病毒的大小
     * @param scale 比例
     */
    setVirusScale(scale) {
        this.node.scale = scale;
    },

    /**
     * 设置开始位置
     */
    setMoveStart() {
        const x = random(this.minX, this.maxX);
        this.node.setPosition(cc.v2(x, 1800));
    },

    /**
     * 随机移动的速度
     */
    randomSpeed() {
        this.rmdX = this.rmdY = random(80, 150);
        if (Math.random() >= 0.5) {
            this.rmdX *= -1;
        }
    },

    update(dt) {
        if (MyGlobal.gameStatus !== 'isPlaying') return;
        if (this.node.y < -150) {
            this.setMoveStart();
        }
        this.node.y += -this.rmdY * dt;
        if ((this.node.x <= this.minX && this.rmdX < 0) || (this.node.x >= this.maxX && this.rmdX > 0)) {
            this.rmdX *= -1;
        }
        this.node.x += this.rmdX * dt;
    },
});
