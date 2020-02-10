cc.Class({
    extends: cc.Component,

    properties: {
        DotWaves: {
            type: cc.Node,
            default: [],
            tooltip: '光圈'
        },
        Flame: {
            type: cc.Node,
            default: null,
            tooltip: '尾焰'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        const length = this.DotWaves.length;
        this.DotWaves.forEach((item, index) => {
            cc.tween(item)
                .delay(index * 0.2)
                .to(0.4, {scale: 1})
                // .delay((length - index) * 0.2)
                .to((length - index) * 0.2, {opacity: 0})
                .to(0, {scale: 0, opacity: 255})
                .union()
                .repeatForever()
                .start();
        });
    },

    start() {

    },
    play() {
        this.node.y = -966;
        this.node.scale = 0.8;
        cc.tween(this.node)
            .to(1, {y: -432}, {easing: 'quadOut'})
            .to(0.5, {scale: 1})
            .start();
        cc.tween(this.Flame)
            .delay(1)
            .to(0.5,{scale:0.6})
            .start()
    },
    moveIn() {
        console.log(1111);
        cc.tween(this.node)
            .to(0.5,{scale:1})
            .start();
        cc.tween(this.Flame)
            .to(0.5,{scale:0.6})
            .start()
    },
    moveOut(){
        console.log(2222);
        cc.tween(this.node)
            .to(0.5,{scale:0.6})
            .start();
        cc.tween(this.Flame)
            .to(0.5,{scale:1})
            .start()
    }

    // update (dt) {},
});
