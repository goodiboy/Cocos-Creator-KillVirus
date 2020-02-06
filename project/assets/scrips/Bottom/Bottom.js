cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    moveOut() {
        cc.tween(this.node)
            .to(0.3, {y: -876, opacity: 100})
            .start()
    },
    moveIn() {
        cc.tween(this.node)
            .to(0.3, {y: -726, opacity: 255})
            .start()
    }

    // update (dt) {},
});
