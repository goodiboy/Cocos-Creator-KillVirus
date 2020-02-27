const MyGlobal = {
    ACTION_RESET: 0, //重置
    ACTION_PLAY: 1, // 开始
    ACTION_MOVE_OUT: 2, //移出
    ACTION_MOVE_IN: 3, // 移入
    bulletCount: 1, //子弹的数量
    currentLevel:1, // 当前关卡数
    /**
     * notStarted 未开始
     * isPlaying 游戏中
     * isPause 暂停中
     */
    gameStatus:'notStarted', //是否在游戏进行中
    LevelData: [
        {
            hp: [[1, 1, 1, 1, 10, 5, 1, 1, 1],
                [1, 1, 1, 1, 10, 5, 1, 1, 1],
                [1, 1, 1, 1, 10, 5, 1, 1, 1]],
            scale: {
                '1': 0.6,
                '10': 1,
                '5': 0.8,
            },
            color: {
                '1': new cc.Color(255, 255, 166),
                '5': new cc.Color(122, 255, 116),
                '10': new cc.Color(255, 116, 116),
            },
            next: 10, virus: [0]
        },
    ]

};

/**
 * 格式化数据
 */
function initMyGlobalData() {
    MyGlobal.data = {
        goldCount: 0,
        taskGold: 0
    }
}

/**
 * 金币转化
 * @param gold
 * @returns {string|*}
 */
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
        cc.sys.localStorage.removeItem('MyGlobalData');
        initMyGlobalData()
    } catch (e) {
        console.log(e);
    }
}

/**
 * 保存存储的值
 */
function storageSave() {
    try {
        cc.sys.localStorage.setItem('MyGlobalData', JSON.stringify(MyGlobal.data));
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
        data = cc.sys.localStorage.getItem('MyGlobalData');
    } catch (e) {
        console.log(e);
    }
    if (data) {
        MyGlobal.data = JSON.parse(data);
    } else {
        initMyGlobalData();
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

/**
 * 圆等分函数
 * @param rx 圆心x轴位置
 * @param ry 圆心y轴位置
 * @param radius 圆的半径
 * @param count 等分多少个
 * @returns {Array} 等分之后的点数组
 */
function getPoint(rx, ry, radius, count) {
    const point = [];
    /**
     * 求出等分之后的弧度
     *  Math.PI/180 等于1弧度
     * @type {number}
     */
    const radian = Math.PI / 180 * Math.round(360 / count);
    for (let i = 0; i < count; i++) {
        const x = rx + radius * Math.cos(i * radian);
        const y = ry + radius * Math.sin(i * radian);
        point.push({x, y});
    }
    return point;
}

/**
 * 使用对象池创建金币节点
 * @returns properties.GoldPrefab|{default, type}|cc.Node 金币节点
 * @param pool 对象池
 * @param parent 父节点
 * @param instantiateObj 实例化的对象
 */
function getPoolNode(pool, parent, instantiateObj) {
    let poolNode = null;
    if (pool.size() > 0) {
        poolNode = pool.get();
    } else {
        poolNode = cc.instantiate(instantiateObj);
    }
    poolNode.parent = parent;
    return poolNode;
}

/**
 * 把对象节点放回对象池中
 * @param pool 对象池
 * @param poolNode 需要保存的对象
 */
function killPoolNode(pool, poolNode) {
    pool.put(poolNode);
}

