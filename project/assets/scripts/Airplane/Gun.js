cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log('gun');
        console.log(this.node);
        cc.tween(this.node)
            .to(0.1,{scale:0})
            .to(0.1,{scale:0.8})
            .union()
            .repeatForever()
            .start();
    },

    start () {

    },


    // update (dt) {},
});
