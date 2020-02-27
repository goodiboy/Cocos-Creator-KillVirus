cc.Class({
    extends: cc.Component,

    properties: {
        Logo: {
            type: cc.Node,
            default: null
        },
        LevelDesign: {
            type: cc.Node,
            default: null
        },
        Top: {
            type: cc.Node,
            default: null
        },
        Setting: {
            type: cc.Node,
            default: null
        },
        ClickGet: {
            type: cc.Node,
            default: null
        },
        Bottom: {
            type: cc.Node,
            default: null
        },
        BG: {
            type: cc.Node,
            default: null
        },
        AirPlane: {
            type: cc.Node,
            default: null
        },
        GoldPrefab: {
            type: cc.Prefab,
            default: null
        },
        TouchControl: {
            type: cc.Node,
            default: null
        },
        BulletPrefab: {
            type: cc.Prefab,
            default: null
        },
        VirusProgressHp:{
            type:cc.Node,
            default:null
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        const manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        MyGlobal.GameControl = this;
        storageLoad();
        MyGlobal.GoldPool = new cc.NodePool();
        MyGlobal.BulletPool = new cc.NodePool();
        this.comArr = [];

    },

    start() {
        this.LogoScript = this.Logo.getComponent('Logo');
        this.LevelDesignScript = this.LevelDesign.getComponent('LevelDesign');
        this.TopScript = this.Top.getComponent('Top');
        this.SettingScript = this.Setting.getComponent('Setting');
        this.ClickGetScript = this.ClickGet.getComponent('ClickGet');
        this.BottomScript = this.Bottom.getComponent('Bottom');
        this.BGScript = this.BG.getComponent('BG');
        this.AirPlaneScript = this.AirPlane.getComponent('AirPlane');
        this.TouchControlScript = this.TouchControl.getComponent('TouchControl');
        this.VirusProgressHpScript = this.VirusProgressHp.getComponent('VirusProgressHp');
        this.comArr.push(this.LogoScript, this.LevelDesignScript, this.TopScript, this.SettingScript, this.ClickGetScript, this.BottomScript, this.BGScript, this.AirPlaneScript,this.VirusProgressHpScript);
        this.LogoScript.anim0();
        this.LevelDesignScript.resetLevel();
        this.TopScript.updateGold();
        this.ClickGetScript.updateGold();
        this.actionPlay();
        this.VirusProgressHpScript.reset();
    },

    doAction(action) {
        switch (action) {
            case 0:
                this.actionReset();
                break;
            case 1:
                this.actionPlay();
                break;
            case 2:
                this.actionMoveOut();
                break;
            case 3:
                this.actionMoveIn();
                break;
        }
    },

    actionReset() {

    },

    actionPlay() {
        this.comArr.forEach(item => {
            item.play && item.play();
        });
    },

    actionMoveOut() {
        this.comArr.forEach(item => {
            item.moveOut && item.moveOut();
        });
    },

    actionMoveIn() {
        this.comArr.forEach(item => {
            item.moveIn && item.moveIn();
        });
    },

    test(e, data) {
        console.log(data);
        switch (data) {
            case 'reset':
                this.LogoScript.reset();
                this.VirusHpScript.reset();
                storageDel();
                this.TopScript.updateGold();
                break;
            case 'play':
                this.LogoScript.anim0();
                this.LevelDesignScript.changeLevel();
                break;
            case 'moveOut':
                this.actionMoveOut();
                break;
            case 'moveIn':
                this.TouchControlScript.StopMask.runAction(cc.fadeOut(0.5));
                this.actionMoveIn();
                break;
        }
    },

    /**
     * 金币动画效果
     * @param srcPos 金币的出现源坐标
     * @param targetPos 需要飘到的目标坐标
     * @param targetNode 目标对象，用于做金币飘到之后的缩放效果
     * @param radius 金币出现的半径
     * @param goldCount 金币出现的数量
     * @param callback 回调函数
     */
    createGoldAnim(srcPos, targetPos, targetNode, radius, goldCount, callback) {
        // 获得每个点的数组
        const point = getPoint(srcPos.x, srcPos.y, radius, goldCount);
        // 对每个金币的距离进行随机摆放
        const rmdPoint = point.map(item => {
            item.x += random(0, 50);
            item.y += random(0, 50);
            return item;
        });

        // 排序每个金币距离目标金币的距离，从小到大进行移动
        rmdPoint.sort(((a, b) => {
            const disA = pointsDistance(a, targetPos);
            const disB = pointsDistance(b, targetPos);
            return disA - disB;
        }));
        let notPlay = false;
        for (let i = 0; i < rmdPoint.length; i++) {
            const gold = getPoolNode(MyGlobal.GoldPool,this.node,this.GoldPrefab);
            gold.setPosition(srcPos);
            cc.tween(gold)
                .to(0.3, rmdPoint[i])
                .delay(i * 0.04)
                .to(0.5, {position: targetPos})
                .call(e => {
                    if (!notPlay) {
                        notPlay = true;
                        // 对目标金币进行放大缩小
                        cc.tween(targetNode)
                            .to(0.2, {scale: 0.8})
                            .to(0.2, {scale: 0.5})
                            .call(e => {
                                notPlay = false;
                            })
                            .start()
                    }
                    killPoolNode(MyGlobal.GoldPool,gold);
                    if (i === rmdPoint.length - 1) {
                        callback && callback();
                    }
                })
                .start()
        }
    },

    /**
     * 创建子弹，并且初始化
     * @param planePos 飞机的位置
     */
    createBullet(planePos) {
        let bullet = null;
        let left = 0,
            right = 0,
            spacing = 30; //子弹得到偏移值
        // 循环全部的子弹数，对每个子弹进行位置处理
        for (let i = 0; i < MyGlobal.bulletCount; i++) {
            bullet = this.getPoolBullet();
            // 设置开始的位置
            planePos.add(cc.v2(0, 138), bullet);
            let offset = 0;
            let singular = MyGlobal.bulletCount % 2 > 0; //判断子弹是否单数
            if (singular && i === 0) {
                // 如果是子弹是单数且当i===0的时候什么也不用做，offset等于0，从中间发射
            } else {
                // 向左右两边偏移
                if (i % 2) {
                    left++;
                    offset = -left * spacing;
                    if (!singular)
                        offset += spacing / 2; //调整中间两组子弹的间距（两端都偏移30的情况下，中间的宽度就等于60了，所以两端需要各自调整15（30/2）的距离）
                } else {
                    right++;
                    offset = right * spacing;
                    if (!singular)
                        offset -= spacing / 2; //调整中间两组子弹的间距（两端都偏移30的情况下，中间的宽度就等于60了，所以两端需要各自调整15（30/2）的距离）
                }
            }
            const bulletScript = bullet.getComponent('Bullet');
            bulletScript.init();
            bulletScript.setSecondPos(bullet.position.add(cc.v2(offset, 100)));
        }
    },
    /**
     * 从子弹对象池中获取子弹
     * @returns {properties.BulletPrefab|{default, type}|cc.Node}
     */
    getPoolBullet() {
        let bullet = getPoolNode(MyGlobal.BulletPool,this.node,this.BulletPrefab);
        // 设置子弹是否可以移动的状态，（判断是否大于1个子弹）
        const bulletScript = bullet.getComponent('Bullet');
        bulletScript.initMoveState();
        return bullet;
    },
});
