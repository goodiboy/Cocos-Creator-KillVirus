cc.Class({
    extends: cc.Component,

    properties: {
        Logo:{
            type:cc.Node,
            default:null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const logoScript = this.Logo.getComponent('Logo');
        logoScript.anim0();
    },

    start () {

    },

    test(e,data){
        const logoScript = this.Logo.getComponent('Logo');
        if (data === 'reset'){
            logoScript.reset();
        }else{
            logoScript.anim0()
        }
    }


    // update (dt) {},
});
