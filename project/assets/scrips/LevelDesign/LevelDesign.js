cc.Class({
    extends: cc.Component,

    properties: {
        LevelItems: {
            type: cc.Node,
            default: []
        },
        FireTips: {
            type: cc.Node,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.currentLevel = 1;
        this.LevelBasePos = [];
        // 记录全部关卡列表的初始位置
        this.LevelItems.forEach((item, index) => {
            this.LevelBasePos[index] = item.getPosition();
        });

        this.fireTipsAnim();
    },

    start() {
    },

    /**
     * 初始化关卡列表
     */
    resetLevel() {
        // 从左边第开始排序关卡，当前关卡在第三个，所以要减去前面2个
        const startLevel = this.currentLevel - 2;
        for (let i = 0; i < this.LevelItems.length; i++) {
            const level = i + startLevel;
            const item = this.LevelItems[i];
            // 重置所有的item位置
            item.setPosition(this.LevelBasePos[i]);
            // 重置所有的缩放0.6倍大小
            item.setScale(0.6);
            // 重置透明度
            item.opacity = 255;
            // 获取当前LevelItem的js代码组件
            const levelItemScript = item.getComponent('LevelItem');
            //关卡小于1或者是第一个和最后一个隐藏
            if (level <= 0 || i === 4 || i === 0) {
                item.opacity = 0;
            } else if (i === 3) {
                // 如果是第三个则隐藏箭头
                levelItemScript.Point[0].opacity = 0;
                levelItemScript.Point[1].opacity = 0;
            } else if (i === 2) {
                //设置好当前关卡为1倍大小
                item.setScale(1);
                // 设置显示箭头
                levelItemScript.Point[1].opacity = 255;
                levelItemScript.Point[0].opacity = 0;
            } else if (i === 1) {
                // 设置显示一杆
                levelItemScript.Point[0].opacity = 255;
                levelItemScript.Point[1].opacity = 0;
            }
            if (level === this.currentLevel) {
                levelItemScript.setBossVisible(true);
            } else {
                levelItemScript.setBossVisible(false);
            }
            levelItemScript.setLevel(level);
        }
    },

    /**
     * 切换关卡动画
     */
    changeLevel() {
        for (let i = 1; i < this.LevelItems.length; i++) {
            const levelItemScript = this.LevelItems[i].getComponent('LevelItem');
            // 设置是否显示箭头杆
            levelItemScript.setPointVisible(i);
            switch (i) {
                case 1:
                    // 向左移动，同时设置透明为0
                    cc.tween(this.LevelItems[i])
                        .to(0.5, {position: this.LevelBasePos[i - 1], opacity: 0})
                        .start();
                    break;
                case 2:
                    // 向左移动，同时设置缩放0.6
                    cc.tween(this.LevelItems[i])
                        .to(0.5, {position: this.LevelBasePos[i - 1], scale: 0.6})
                        .start();
                    // boss 渐隐
                    // cc.tween(levelItemScript.Boss).to(0.5, {opacity: 0}).start();
                    levelItemScript.Boss.runAction(cc.fadeOut(0.5));
                    break;
                case 3:
                    cc.tween(this.LevelItems[i])
                        .to(0.5, {position: this.LevelBasePos[i - 1], scale: 1})
                        .start();
                    // cc.tween(levelItemScript.Boss).to(0.5, {opacity: 255}).start();
                    levelItemScript.Boss.runAction(cc.fadeIn(0.5));
                    break;
                case 4:
                    cc.tween(this.LevelItems[i])
                        .to(0.5, {position: this.LevelBasePos[i - 1], opacity: 255})
                        .call(e => {
                            // 动画结束之后，关卡加一，重置列表位置
                            this.currentLevel++;
                            this.resetLevel();
                        })
                        .start();
                    break;
            }
        }
    },

    fireTipsAnim(){
        this.FireTips.angle = 0;
        // const seq = cc.sequence(cc.rotateTo(1, 10), cc.rotateTo(1, -10)).repeatForever();
        // this.FireTips.runAction(seq);
        cc.tween(this.FireTips)
            .to(.3,{angle:-12})
            .to(.3,{angle:12})
            .union()
            .repeat(2)
            .to(.3,{angle:0})
            .delay(1)
            .union()
            .repeatForever()
            .start();
    },

    // logo 移动到顶部
    moveOut() {
        this.FireTips.stopAllActions();
        this.FireTips.runAction(cc.fadeOut(0.3));
        cc.tween(this.node)
            .to(.5, {scale: 0.4, y: 660}, {easing: 'backIn'})
            .start();
    },

    // logo 移动回到原位
    moveIn() {
        this.FireTips.runAction(cc.fadeIn(0.3));
        this.fireTipsAnim();
        cc.tween(this.node)
            .to(0.5, {scale: 1, y: 166}, {easing: 'backOut'})
            .start();
    }
    // update (dt) {},
});
