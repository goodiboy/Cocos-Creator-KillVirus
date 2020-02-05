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
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        this.logoScript = this.Logo.getComponent('Logo');
        this.logoScript.anim0();
        this.LevelDesignScript = this.LevelDesign.getComponent('LevelDesign');
        this.LevelDesignScript.resetLevel();
        this.TopScript = this.Top.getComponent('Top');

    },

    test(e,data){
        console.log(data);
        switch(data){
            case 'reset':
                this.logoScript.reset();
                break;
            case 'play':
                this.logoScript.anim0();
                // this.LevelDesignScript.resetLevel();
                this.LevelDesignScript.changeLevel();
                // this.LevelDesignScript.currentLevel++;
                break;
            case 'moveOut':
                this.logoScript.moveOut();
                this.TopScript.moveOut();
                this.LevelDesignScript.moveOut();
                break;
            case 'moveIn':
                this.logoScript.moveIn();
                this.TopScript.moveIn();
                this.LevelDesignScript.moveIn();
                break;

        }
    }


    // update (dt) {},
});
