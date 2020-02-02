// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        Bar: {
            type: cc.Sprite,
            default: null
        },
        activeTime: 15

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log(this.node);
        console.log(this.Bar);
        console.log(2);
        this.nowTime = 0;
    },

    start() {
        console.log(11);
        console.log(this.nowTime);
        cc.log('1111')
    },

    update(dt) {
        this.nowTime += dt;
        let pre = this.nowTime / this.activeTime;
        if (pre > 1){
            pre = 1;
            this.nowTime = 0;
        }
        this.Bar.fillRange = -pre;
    },
});
