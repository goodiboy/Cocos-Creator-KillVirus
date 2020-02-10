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
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.GameControl = this;
        storageLoad();
        this.GoldPool = new cc.NodePool();
        this.comArr = [];
        // const gold = cc.instantiate(this.goldPrefab);
        // gold.parent = this.node;


    },

    start() {


        this.logoScript = this.Logo.getComponent('Logo');
        this.logoScript.anim0();
        this.LevelDesignScript = this.LevelDesign.getComponent('LevelDesign');
        this.LevelDesignScript.resetLevel();
        this.TopScript = this.Top.getComponent('Top');
        this.SettingScript = this.Setting.getComponent('Setting');
        this.ClickGetScript = this.ClickGet.getComponent('ClickGet');
        this.BottomScript = this.Bottom.getComponent('Bottom');
        this.BGScript = this.BG.getComponent('BG');
        this.BGScript.play();
        this.AirPlaneScript = this.AirPlane.getComponent('AirPlaneAutoPlay');
        this.AirPlaneScript.play();
        this.comArr.push(this.logoScript, this.LevelDesignScript, this.TopScript, this.SettingScript, this.ClickGetScript, this.BottomScript, this.BGScript,this.AirPlaneScript);
        this.TopScript.updateGold();
        this.ClickGetScript.updateGold();

    },

    test(e, data) {
        console.log(data);
        switch (data) {
            case 'reset':
                this.logoScript.reset();
                storageDel();
                this.TopScript.updateGold();
                break;
            case 'play':
                this.logoScript.anim0();
                this.LevelDesignScript.changeLevel();
                break;
            case 'moveOut':
                this.allMoveOut();
                break;
            case 'moveIn':
                this.allMoveIn();
                break;

        }
    },

    allMoveOut() {
        this.comArr.forEach(item => {
            item.moveOut && item.moveOut();
        });
    },
    allMoveIn() {
        this.comArr.forEach(item => {
            item.moveIn && item.moveIn();
        });
    },
    /**
     * 金币动画效果
     * @param srcPos 金币的出现源坐标
     * @param targetPos 需要飘到的目标坐标
     * @param targetNode 目标对象，用于做金币飘到之后的缩放效果
     * @param radius 金币出现的半径
     * @param goldCount 金币出现的数量
     */
    createGoldAnim(srcPos, targetPos,targetNode, radius, goldCount,callback) {
        // 获得每个点的数组
        const point = this.getPoint(srcPos.x, srcPos.y, radius, goldCount);
        const rmdPoint = point.map(item => {
            item.x += random(0, 50);
            item.y += random(0, 50);
            return item;
        });
        rmdPoint.sort(((a,b)=>{
            const disA = pointsDistance(a,targetPos);
            const disB = pointsDistance(b,targetPos);
            return disA - disB;
        }));
        let notPlay = false;
        for (let i = 0; i < rmdPoint.length; i++) {
            const gold = this.createGold(this.node);
            gold.setPosition(srcPos);
            cc.tween(gold)
                .to(0.3,  rmdPoint[i])
                .delay(i*0.04)
                .to(0.5,{position:targetPos})
                .call(e=>{
                    if (!notPlay){
                        notPlay = true;
                        // 对目标金币进行放大缩小
                        cc.tween(targetNode)
                            .to(0.2,{scale:0.8})
                            .to(0.2,{scale:0.5})
                            .call(e=>{
                                notPlay = false;
                            })
                            .start()
                    }
                    this.killGold(gold);
                    if (i === rmdPoint.length - 1){
                        callback && callback();
                    }
                })
                .start()
        }
    },



    /**
     * 使用对象池创建金币节点
     * @param parentNode
     * @returns properties.GoldPrefab|{default, type}|cc.Node 金币节点
     */
    createGold(parentNode) {
        let gold = null;
        if (this.GoldPool.size() > 0) {
            gold = this.GoldPool.get();
        } else {
            gold = cc.instantiate(this.GoldPrefab);
        }
        gold.parent = parentNode;
        return gold;
    },

    killGold(gold){
      this.GoldPool.put(gold);
    },


    /**
     * 圆等分函数
     * @param rx 圆心x轴位置
     * @param ry 圆心y轴位置
     * @param radius 圆的半径
     * @param count 等分多少个
     * @returns {Array} 等分之后的点数组
     */
    getPoint(rx, ry, radius, count) {
        const point = [];
        /**
         * 求出等分之后的弧度
         *  Math.PI/180 等于1弧度
         * @type {number}
         */
        const radian = Math.PI / 180 * Math.round(360 / count);
        for (let i = 0; i < count; i++) {
            const x = rx + radius * Math.cos(i * radian);
            const y = ry + radius * Math.sin(i * radian);
            point.push({x, y});
        }
        return point;
    }





    // update (dt) {},
});
