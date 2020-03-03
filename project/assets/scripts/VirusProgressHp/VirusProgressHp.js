cc.Class({
    extends: cc.Component,

    properties: {
        ProgressBar: {
            type: cc.ProgressBar,
            default: null
        },

        GoldNum: {
            type: cc.Label,
            default: null
        },
        VirusPer: {
            type: cc.Label,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.opacity = 0;
    },

    start() {

    },
    reset() {
        this.ProgressBar.progress = 1;
        this.GoldNum.string = 0;
        this.goldValue = 0;
    },

    /**
     * 修改游戏进度条
     * @param per 百分比
     */
    changeProgress(per) {
        this.ProgressBar.progress = per;
        this.VirusPer.string = Math.round(per * 100) + '%';
    },

    cacheGoldCount(gold){
        this.goldValue += gold;
    },


    updateGold() {
        this.GoldNum.string = this.goldValue;
    },

    // Hp 出现
    moveOut() {
        this.node.y = 619;
        this.ProgressBar.progress = 1;
        this.VirusPer.string = '100%';
        const seq = cc.sequence(cc.delayTime(0.7), cc.fadeIn(0.5));
        this.node.runAction(seq);
    },

    // Hp 消失
    moveIn() {
        this.node.runAction(cc.fadeOut(0.5));
    },

    /**
     * 结算动画
     */
    settleAnim(){
        this.node.runAction(cc.moveTo(0.5,cc.v2(0,285)).easing(cc.easeBackOut()));
    },


    // update (dt) {},
});
