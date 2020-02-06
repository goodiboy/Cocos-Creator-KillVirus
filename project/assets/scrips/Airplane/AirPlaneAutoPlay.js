cc.Class({
    extends: cc.Component,

    properties: {
        DotWaves: {
            type: cc.Node,
            default: [],
            tooltip: '光圈'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    play() {
        this.moveIn();

        const length = this.DotWaves.length;
        this.DotWaves.forEach((item, index) => {
            cc.tween(item)
                .delay(index * 0.2)
                .to(0.4, {scale: 1})
                // .delay((length - index) * 0.2)
                .to((length - index) * 0.2,{opacity:0})
                .to(0, {scale: 0,opacity:255})
                .union()
                .repeatForever()
                .start();
        });
    },
    moveIn(){
        this.node.y = -966;
        this.node.scale = 0.8;
        // this.node.runAction(cc.moveTo(1,cc.v2(0,-432)));
        cc.tween(this.node)
            .to(1.4,{y:-432,scale:1},{easing:'quadOut'})
            .start();
    },

    // update (dt) {},
});
