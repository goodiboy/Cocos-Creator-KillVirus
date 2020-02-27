cc.Class({
    extends: cc.Component,

    properties: {
        ProgressBar:{
            type:cc.ProgressBar,
            default:null
        },

        GoldNum:{
            type: cc.Label,
            default: null
        },
        VirusPer:{
            type:cc.Label,
            default:null
        }
    },

    // LIFE-CYCLE CALLBACKS:



    start () {

    },
    reset(){
        this.ProgressBar.progress = 1;
        this.GoldNum.string = 0;

    },

    /**
     * 修改游戏进度条
     * @param per 百分比
     */
    changeProgress(per){
        this.ProgressBar.progress = per;
        this.VirusPer.string = Math.round(per*100) +'%';
    },
    // Hp 出现
    moveOut() {
        const seq = cc.sequence(cc.delayTime(0.7),cc.fadeIn(0.5));
        this.node.runAction(seq);
    },

    // Hp 消失
    moveIn() {
       this.node.runAction(cc.fadeOut(0.5));
    }

    // update (dt) {},
});
