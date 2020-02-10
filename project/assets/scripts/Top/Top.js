cc.Class({
    extends: cc.Component,

    properties: {
        GoldIcon:{
            type:cc.Node,
            default:null
        },
        GoldLab:{
            type: cc.Label,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    moveOut() {
        // 753
        this.node.runAction(cc.moveTo(0.2, cc.v2(-152, 888)).easing(cc.easeBackInOut()));
    },
    moveIn() {
        // 753
        this.node.runAction(cc.moveTo(0.2, cc.v2(-152, 753)).easing(cc.easeBackInOut()));
    },

    updateGold(){
        this.GoldLab.string = goldCarry(Global.data.goldCount);
    }

    // update (dt) {},
});
