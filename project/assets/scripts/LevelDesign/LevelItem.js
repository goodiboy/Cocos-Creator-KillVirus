cc.Class({
    extends: cc.Component,

    properties: {
        Level: {
            type: cc.Label,
            default: null
        },
        Boss: {
            type: cc.Node,
            default: null
        },
        Point: {
            type: cc.Node,
            default: []
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {
    },
    /**
     * 设置当前Item的等级
     * @param level
     */
    setLevel(level) {
        this.Level.string = level;
    },
    /**
     * 设置当前Item的的Boss是否显示
     * @param show
     */
    setBossVisible(show) {
        this.Boss.opacity = show ? 255 : 0;
    },
    /**
     * 设置显示箭头
     * @param index 下标
     */
    setPointVisible(index) {
        switch (index) {
            case 2:
                this.Point[0].runAction(cc.fadeIn(0.5));
                this.Point[1].runAction(cc.fadeOut(0.5));
                break;
            case 3:
                this.Point[1].runAction(cc.fadeIn(0.5));
                break;
            default:
                this.Point[1].runAction(cc.fadeOut(0.5));
                this.Point[0].runAction(cc.fadeOut(0.5));
        }
    },
    // update (dt) {},
});
