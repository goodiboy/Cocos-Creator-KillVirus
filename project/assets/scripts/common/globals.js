window.Global = {};

function initGlobalData() {
    window.Global.data = {
        goldCount: 0,
        taskGold: 0
    }
}

function goldCarry(gold) {
    const array = [
        // [10000000, 'N'],
        // [1000000, 'T'],
        // [100000, 'G'],
        // [10000, 'M'],
        [1000, 'K'],
    ];
    for (let i = 0; i < array.length; i++) {
        const val = gold / array[i][0];
        if (val >= 1) {
            return val.toFixed(1) + array[i][1];
        }
    }
    return gold;

}

/**
 * 删除存储的值
 */
function storageDel() {
    try {
        cc.sys.localStorage.removeItem('globalData');
        initGlobalData()
    } catch (e) {
        console.log(e);
    }
}

/**
 * 保存存储的值
 */
function storageSave() {
    try {
        cc.sys.localStorage.setItem('globalData', JSON.stringify(Global.data));
    } catch (e) {
        console.log(e);
    }
}

/**
 * 获取存储的值
 */
function storageLoad() {
    let data;
    try {
        data = cc.sys.localStorage.getItem('globalData');
    } catch (e) {
        console.log(e);
    }
    if (data) {
        Global.data = JSON.parse(data);
    } else {
        initGlobalData();
    }
}


/**
 * 获得一个随机值
 * @param min 最小值
 * @param max 最大值
 * @returns {number} 随机数
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 求出亮点之间的距离
 * @param point1 点1
 * @param point2 点2
 * @returns {number} 距离
 */
function pointsDistance(point1, point2) {
    const dx = Math.abs(point1.x - point2.x);
    const dy = Math.abs(point1.y - point2.y);
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}