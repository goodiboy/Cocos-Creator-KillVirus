cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    moveOut(){
        // this.node.runAction(cc.moveTo(0.5,cc.v2(-493,392)))
        cc.tween(this.node)
            .to(0.3,{x:-593,opacity:100})
            .start()
    },
    moveIn(){
        cc.tween(this.node)
            .to(0.3,{x:-415,opacity:255})
            .start()
        // this.node.runAction(cc.moveTo(0.5,cc.v2(-415,392)))

    }

    // update (dt) {},
});
