cc.Class({
    extends: cc.Component,

    properties: {
        animArr: {
            type: cc.Node,
            default: []
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.anim0();
    },

    start() {

    },

    //重置所有动画属性
    reset() {
        this.animArr.forEach(item => {
            item.stopAllActions();
        });
        this.animArr[0].opacity = 0;
        this.animArr[1].opacity = 255;
        this.animArr[1].scaleX = 0;
        this.animArr[2].scale = 0.2;
        this.animArr[2].position = cc.v2(265,45);
        this.animArr[3].scale = 0.2;
        this.animArr[3].position = cc.v2(252,28);

        this.animArr[2].getComponent('LogoVirus').reset();
        this.animArr[3].getComponent('LogoVirus').reset();

    },

    // 动画一 闪烁
    anim0() {
        const fadeIn = cc.fadeIn(0.2);
        const fadeOut = cc.fadeOut(0.2);
        const rep = cc.repeat(cc.sequence(fadeIn, fadeOut), 3);
        const callback = cc.callFunc(this.anim1, this);
        const seq = cc.sequence(rep, callback);
        this.animArr[0].runAction(seq);
    },

    //动画二 进度条
    anim1() {
        const scale = cc.scaleTo(0.3, 1.15);
        const callback = cc.callFunc(this.anim2, this);
        const seq = cc.sequence(scale, callback);
        this.animArr[1].runAction(seq);
    },

    anim2() {
        this.flash(this.animArr[0]);
        this.flash(this.animArr[1]);

        //病毒一
        const move1 = cc.moveTo(0.3, cc.v2(425, 193));
        const scale1 = this.anim2ChangeScale();
        //病毒2
        const move2 = cc.moveTo(0.3, cc.v2(445, -24));
        const scale2 = this.anim2ChangeScale();

        // 病毒飞出去之后消失尾巴的回调动画
        const callback = cc.callFunc(function () {
            //获取病毒2上面的js组件
            const LogoVirus2 = this.animArr[2].getComponent('LogoVirus');
            const LogoVirus3 = this.animArr[3].getComponent('LogoVirus');
            //调用病毒组件的js方法
            LogoVirus2.begin(426, 188, 110);
            LogoVirus3.begin(446, -27, 80);
        }, this);

        const anim1seq = cc.sequence(cc.spawn(scale1, move1), callback);
        this.animArr[2].runAction(anim1seq);
        this.animArr[3].runAction(cc.spawn(scale2, move2));
    },

    moveOut(){
        cc.tween(this.node)
            .to(0.5,{y:948},{easing:'backInOut'})
            .call(this.reset.bind(this))
            .start();
    },
    moveIn(){
        cc.tween(this.node)
            .to(0.5,{y:451},{easing:'backInOut'})
            .call(this.anim0.bind(this))
            .start();

    },

    flash(node) {
        const fadeIn = cc.fadeIn(0.3);
        const fadeOut = cc.fadeOut(0.3);
        const seq = cc.sequence(fadeIn, fadeOut);
        node.runAction(seq.repeatForever());
    },

    //修改病毒缩放
    anim2ChangeScale() {
        return cc.scaleTo(0.3, 1);
    }

    // update (dt) {},
});
