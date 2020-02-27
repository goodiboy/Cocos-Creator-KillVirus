cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    play(){
        cc.tween(this.node)
            .delay(1)
            .to(0.5,{scale:1.2})
            .call(e=>{
                MyGlobal.GameControl.TouchControl.active = true;
                MyGlobal.GameControl.TouchControlScript.isCanTouchMove = true;
            })
            .start()
    },
    moveOut(){
        // cc.tween(this.node)
        this.node.runAction(cc.scaleTo(0.5,1,1));

    },
    moveIn(){
        cc.tween(this.node)
            .to(0.5,{scale:1.2})
            .start()
        // this.node.runAction(cc.scaleTo(0.5,1.2,1.2));
    }

    // update (dt) {},
});
