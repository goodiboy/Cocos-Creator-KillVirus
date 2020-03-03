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

        this.initAngle();
    },

    initAngle() {
        this.Back.forEach((item, index) => {
            item.angle = Math.floor(Math.random() * 360);
            if (index === 0)
                item.runAction(cc.repeatForever(cc.rotateBy(8, 360)));
            else
                item.runAction(cc.repeatForever(cc.rotateBy(8, -360)));
        });
    },

    init(hp, color, scale) {
        this.setVirusHp(hp);
        this.setVirusColor(color);
        this.setVirusScale(scale);
        this.setMoveStart();
        this.randomSpeed();
        this.addGoldNum = hp;
        this.goldRadius = this.Body.width * (scale ? scale : 0.8);
        this.node.active = true;
    },

    /**
     * 碰撞检测
     * @param other 其他对象
     * @param self 当前对象
     */
    onCollisionEnter(other, self) {
        if (other.tag === 100)
            this.bulletCollision(other);
        else
            this.planeCollision(other);
    },

    bulletCollision(other) {
        // 当病毒只有1学，但同时被多个子弹打中，会执行多次碰撞回调，因此需要判断下血量<=0的时候不再执行下面的逻辑
        if (this.live <= 0) return;
        // 子弹会同时碰撞多个病毒，产生多个碰撞回调，所以当第一次碰撞之后设置isHit的状态，让后面的碰撞不执行回调
        const BulletScript = other.node.getComponent('Bullet');
        if (BulletScript.isHit) return;
        BulletScript.isHit = true;
        this.VirusHp.string = --this.live;
        MyGlobal.VirusMake.hit(-1);
        if (this.live <= 0) {
            MyGlobal.GameControl.VirusProgressHpScript.cacheGoldCount(this.addGoldNum);
            if (MyGlobal.VirusMake.currentHp <= 0) {
                MyGlobal.isGamePass = true;
                MyGlobal.AirPlane.endFire();
                MyGlobal.AirPlane.stopOperation();
                // 当前组件无法使用定时器，因为会在执行之前被回收了
                MyGlobal.GameControl.scheduleOnce(function(){
                    MyGlobal.AirPlane.moveOutScreen()
                },1);
            }
            this.virusDeath();
            this.goldAnim();
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

    planeCollision(other) {

    },


    /**
     * 病毒死亡的效果
     */
    virusDeath() {
        // 先离职禁止组件，然后等爆炸动画结束之后再删除节点，避免当前节点回到池里，再取出来的时候，血量已经发生变化了，
        // 然后设置血量还没有执行完成，导致之前爆炸的病毒设置了从池里取出来重置之后的血量
        this.node.active = false;
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
            killPoolNode(MyGlobal.VirusPool, this.node);
        }, this);
    },

    /**
     * 金币动画
     */
    goldAnim() {
        const Coin = MyGlobal.GameControl.VirusProgressHp.getChildByName('coin');
        // 坐标转换
        const targetPos = convertPos(Coin, MyGlobal.VirusMake.node);
        MyGlobal.GameControl.createGoldAnim(this.node.position, targetPos, Coin, MyGlobal.VirusMake.node, this.goldRadius, this.addGoldNum, () => {
            MyGlobal.GameControl.VirusProgressHpScript.updateGold();
        });
    },

    /**
     * 设置病毒的颜色
     * @param color
     */
    setVirusColor(color) {

        const components = this.getComponentsInChildren('setColor');
        components.forEach(component => {
            component.node.color = color || new cc.Color(255, 155, 166);
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
        this.node.scale = scale || 0.8;
    },

    /**
     * 设置开始位置
     */
    setMoveStart() {
        const x = random(this.minX, this.maxX);
        this.node.setPosition(cc.v2(x, 1700));
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
        // 如果是游戏结束，则立即删除病毒
        if (MyGlobal.gameOver ){
            killPoolNode(MyGlobal.VirusPool, this.node);
            return;
        }
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
