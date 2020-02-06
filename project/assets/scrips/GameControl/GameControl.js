cc.Class({
    extends: cc.Component,

    properties: {
        Logo:{
            type:cc.Node,
            default:null
        },
        LevelDesign:{
            type: cc.Node,
            default: null
        },
        Top:{
            type:cc.Node,
            default:null
        },
        Setting:{
            type:cc.Node,
            default:null
        },
        ClickGet:{
            type:cc.Node,
            default:null
        },
        Bottom:{
            type:cc.Node,
            default:null
        },
        BG:{
            type:cc.Node,
            default:null
        },
        AirPlane:{
            type:cc.Node,
            default:null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.comArr = [];
    },

    start () {
        this.logoScript = this.Logo.getComponent('Logo');
        this.logoScript.anim0();
        this.LevelDesignScript = this.LevelDesign.getComponent('LevelDesign');
        this.LevelDesignScript.resetLevel();
        this.TopScript = this.Top.getComponent('Top');
        this.SettingScript = this.Setting.getComponent('Setting');
        this.ClickGetScript = this.ClickGet.getComponent('ClickGet');
        this.BottomScript = this.Bottom.getComponent('Bottom');
        this.BGScript = this.BG.getComponent('BG');
        this.BGScript.play();
        this.AirPlaneScript = this.AirPlane.getComponent('AirPlaneAutoPlay');
        this.AirPlaneScript.play();
        this.comArr.push(this.logoScript,this.LevelDesignScript,this.TopScript,this.SettingScript,this.ClickGetScript,this.BottomScript,this.BGScript);
    },

    test(e,data){
        console.log(data);
        switch(data){
            case 'reset':
                this.logoScript.reset();
                break;
            case 'play':
                this.logoScript.anim0();
                this.LevelDesignScript.changeLevel();
                break;
            case 'moveOut':
                this.allMoveOut();
                break;
            case 'moveIn':
                this.allMoveIn();
                break;

        }
    },

    allMoveOut(){
        this.comArr.forEach(item=>{
            item.moveOut && item.moveOut();
        });
    },
    allMoveIn(){
        this.comArr.forEach(item=>{
            item.moveIn && item.moveIn();
        });
    }





    // update (dt) {},
});
