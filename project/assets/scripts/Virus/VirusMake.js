cc.Class({
    extends: cc.Component,

    properties: {
        Virus: {
            type: cc.Prefab,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        MyGlobal.VirusMake = this;
        MyGlobal.VirusPool = new cc.NodePool();
        MyGlobal.BootPool = new cc.NodePool();
    },


    init() {
        this.level = MyGlobal.currentLevel - 1; // 当前等级下标
        this.currentData = MyGlobal.LevelData[this.level]; // 当前等级的数据
        this.currentPart = 0; // 第几波病毒（根据数组长度）
        this.nextPartValue = this.currentData.next; // 获取下一波的需要打到的值
        this.allHp = 0; // 全部的hp
        this.wipeOutHp = 0; // 当前已消灭的hp
        this.begin();
    },

    /**
     * 初始化，获取所有病毒的总血量和修改进度条
     */
    begin() {
        for (let i = 0; i < this.currentData.hp.length; i++) {
            for (let j = 0; j < this.currentData.hp[i].length; j++) {
                this.allHp += this.currentData.hp[i][j];
            }
        }
        this.currentHp = this.allHp;
        MyGlobal.GameControl.VirusProgressHpScript.changeProgress(1);
        this.nextPart();
    },

    /**
     * 子弹与病毒碰撞的时的回调，对进度条等一系列进行修改
     * @param value 减少的血量
     */
    hit(value) {
        this.currentHp += value;
        this.wipeOutHp -= value;
        if (this.wipeOutHp >= this.nextPartValue) {
            this.wipeOutHp = 0; // 当前已消灭的hp
            this.nextPart();
        }
        const per = this.currentHp / this.allHp;
        MyGlobal.GameControl.VirusProgressHpScript.changeProgress(per);
    },

    /**
     * 下一波病毒出现
     */
    nextPart() {
        if (this.currentPart >= this.currentData.hp.length) return;
        const hp = this.currentData.hp[this.currentPart];
        const scale = this.currentData.scale;
        const color = this.currentData.color;
        for (let i = 0; i < hp.length; i++) {
            const itemHp = hp[i];
            const Virus = getPoolNode(MyGlobal.VirusPool, this.node, this.Virus);
            const virusScript = Virus.getComponent('Virus0');
            virusScript.init(itemHp, color['' + itemHp], scale['' + itemHp])
        }
        this.currentPart++;
    },

    /**
     * 延迟创建病毒
     */
    createVirus() {
        this.scheduleOnce(this.init, 1.5);
    }
});
