cc.Class({
    extends: cc.Component,

    properties: {
        circle: {
            type: cc.Node,
            default: null
        },
        tail: {
            type: cc.Node,
            default: null
        },
        virus: {
            type: cc.Node,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    // },
    //
    // start() {
    //
    // },

    /**
     * 病毒动画
     * @param x 病毒的x轴
     * @param y 病毒的y轴
     * @param width 随意移动的范围
     */
    begin(x, y, width) {
        //拖尾动画开始
        this.tail.runAction(cc.fadeOut(0.1));
        //拖尾动画结束

        //圆圈动画开始
        const fadeIn = cc.fadeIn(0.3);
        const fadeOut = cc.fadeOut(0.3);
        const delayTime = cc.delayTime(0.1);
        const seq = cc.sequence(fadeOut, delayTime, fadeIn, delayTime);
        this.circle.runAction(seq.repeatForever());
        //圆圈动画结束

        this.animMove(x, y, width);

    },
    /**
     * 病毒移动动画
     * @param x 病毒的x轴
     * @param y 病毒的y轴
     * @param width 随意移动的范围
     */
    animMove(x, y, width) {
        const min = -width / 2;
        const max = width / 2;
        const rx = random(min, max);
        const ry = random(min, max);
        const v2 = cc.v2(x + rx, y + ry);
        const move = cc.moveTo(.6, v2);
        const seq = cc.sequence(move, cc.callFunc(function () {
            this.animMove(x, y, width)
        }, this));

        this.node.runAction(seq)
    },

    reset() {
        this.tail.opacity = 255;
        this.circle.opacity = 255;
        this.tail.stopAllActions();
        this.circle.stopAllActions();
    },


    // update (dt) {},
});
