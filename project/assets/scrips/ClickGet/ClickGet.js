
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    moveOut() {
        cc.tween(this.node)
            .to(0.3, {x: 520, opacity: 100})
            .start()
    },
    moveIn() {
        cc.tween(this.node)
            .to(0.3, {x: 373, opacity: 255})
            .start()
    }

    // update (dt) {},
});
