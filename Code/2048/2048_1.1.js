//在上一个代码的基础上，添加了新的功能
//添加了一些简单的撤回功能和重新开始游戏的功能
//添加了实现数字移动的动画效果

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        distance : 0,
        pos : {
            default : [],
            type : [cc.Vec2]
        },
        hasNode : {
            default : [],
            type : [cc.Node]
        },
        one : {
            default : null,
            type : cc.Prefab
        },
        two : {
            default : null,
            type : cc.Prefab
        },
        three : {
            default : null,
            type : cc.Prefab
        },
        four : {
            default : null,
            type : cc.Prefab
        },
        five : {
            default : null,
            type : cc.Prefab
        },
        six : {
            default : null,
            type : cc.Prefab
        },
        seven : {
            default : null,
            type : cc.Prefab
        },
        eight : {
            default : null,
            type : cc.Prefab
        },
        nine : {
            default : null,
            type : cc.Prefab
        },
        ten : {
            default : null,
            type : cc.Prefab
        },
        faile : {
            default : null,
            type : cc.SceneAsset
        },
        success : {
            default : null,
            type : cc.SceneAsset
        },
        goback : {
            default : null,
            type : cc.Node
        },
        restart : {
            default : null,
            type : cc.Node
        }
    },
    //初始化移动数字判断
    initMove : function() {
        //用于存放每次移动的节点，分别移动一格、两格、三格
        this.move1 = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        this.move2 = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        this.move3 = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        //每个数组的下标
        this.index1 = 0;
        this.index2 = 0;
        this.index3 = 0;
        //用于判断每帧更新时移动的距离长度
        this.Dis = 0;
    },

    //生成预制数字
    newSpanNode : function(x, y){
        let newNode;
        if(x == 1){
            newNode = cc.instantiate(this.one);
        }
        else if(x == 2){
            newNode = cc.instantiate(this.two);
        }
        else if(x == 3){
            newNode = cc.instantiate(this.three);
        }
        else if(x == 4){
            newNode = cc.instantiate(this.four);
        }
        else if(x == 5){
            newNode = cc.instantiate(this.five);
        }
        else if(x == 6){
            newNode = cc.instantiate(this.six);
        }
        else if(x == 7){
            newNode = cc.instantiate(this.seven);
        }
        else if(x == 8){
            newNode = cc.instantiate(this.eight);
        }
        else if(x == 9){
            newNode = cc.instantiate(this.nine);
        }
        else if(x == 10){
            newNode = cc.instantiate(this.ten);
        }
        this.node.addChild(newNode);      //添加到画布下的节点
        this.hasNode[y] = newNode;        //将该节点添加到hasNode中
        this.hasNode[y].position = this.pos[y];   //设置该节点的位置
    },
    //初始化，随机生成一个数字2
    init : function(){
        //canMove用于判断移动的方向，1左，2右，3上，4下;move用于判断上一次移动是否结束,1表示可以移动
        this.canMove = 0;
        this.move = 1;          
        this.initMove();
        //摧毁所有的节点
        this.desNode();
        this.nodePos = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];        //存放每一个实时的数字位置
        this.oldNodePos = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];     //存放每一次移动前的旧位置，判断是否有移动
        //生成第一个数字
        let newNode = cc.instantiate(this.one);
        let count = Math.floor(Math.random() * 16);   //获取0-15的随机整数
        let x = Math.floor(count / 4);                //求得该数字在二维数组中的位置
        let y = count % 4;
        this.nodePos[x][y] = 1;
        this.oldNodePos[x][y] = 1;
        this.node.addChild(newNode);
        this.hasNode[count] = newNode;
        this.hasNode[count].position = this.pos[count];
    },
    //获取点击时的触点位置
    touchUp : function(t){
        this.nowPos = t.getLocation();
    },
    //获取移动结束后的触点位置，判断移动方向
    touchEnd : function(t){
        let endPos = t.getLocation();    //获取离开屏幕时的触点位置
        let delX = Math.abs(endPos.x - this.nowPos.x);   //算x、y轴偏差量的绝对值
        let delY = Math.abs(endPos.y - this.nowPos.y);
        if(delX > this.distance || delY > this.distance){
            //先更新oldnodepos数组
            for(let m = 0; m < 4; m++){
                for(let n = 0; n < 4; n++){
                    this.oldNodePos[m][n] = this.nodePos[m][n];
                }
            }
            if(delX > delY){      //判断是左右移动还是上下移动
                if(endPos.x > this.nowPos.x){     //右移
                    this.right();
                }
                else{      //左移
                    this.left();
                }
            }
            else{
                if(endPos.y < this.nowPos.y){     //下移
                    this.down();
                }
                else{                      //上移
                    this.up();
                }
            }
        }
    },
    //右移
    right : function(){
        if(this.move == 1){
            //可以右移，上锁
            this.canMove = 2;
            this.move = 0;
            //对每一行数字进行判断
            for(let m = 0; m < 4; m++){    
                let arr = new Array(0,0,0,0);   //存放每一行的非零数字
                let count = 0;
                for(let n = 0; n < 4; n++){     //获取每一行非零数字
                    if(this.nodePos[m][n] != 0){
                        arr[count] = this.nodePos[m][n];
                        count++;
                    }
                }
                //判断每一个数字移动的格数,count表示本行存在的数字个数
                if(count == 3){
                    let fir = 1;
                    for(let n = 0; n < 4; n++){
                        if(this.nodePos[m][n] != 0){
                            if(n == fir){
                                break;
                            }
                            else{
                                this.move1[this.index1] = m * 4 + n + 1;
                                this.index1++;
                                fir++;
                            }
                        }
                    }
                }
                else if(count == 2){
                    let fir = 2;
                    for(let n = 0; n < 4; n++){
                        if(this.nodePos[m][n] != 0){
                            if(n == fir){
                                break;
                            }
                            else if(fir - n == 2){
                                this.move2[this.index2] = m * 4 + n + 1;
                                this.index2++;
                                fir++;
                            }
                            else{
                                this.move1[this.index1] = m * 4 + n + 1;
                                this.index1++;
                                fir++;
                            }
                        }
                    }
                }
                else if(count == 1){
                    if(this.nodePos[m][0] != 0){
                        this.move3[this.index3] = m * 4 + 1;
                        this.index3++;
                    }
                    else if(this.nodePos[m][1] != 0){
                        this.move2[this.index2] = m * 4 + 2;
                        this.index2++;
                    }
                    else if(this.nodePos[m][2] != 0){
                        this.move1[this.index1] = m * 4 + 3;
                        this.index1++;
                    }
                }
                //对数字进行合并
                for(let n = 2; n >= 0; n--){   
                    if(arr[n] == arr[n + 1] && arr[n] != 0){
                        arr[n + 1]++;
                        arr[n] = 0;
                    }
                }
                count = 3;
                for(let n = 3; n >= 0; n--){   //添加到nodePos数组上
                    this.nodePos[m][n] = 0;
                    if(arr[n] != 0){
                        this.nodePos[m][count] = arr[n];
                        count--;
                    }
                }
            }
        }
    },
    //左移
    left : function(){
        if(this.move == 1){
            //可以左移,上锁
            this.canMove = 1;
            this.move = 0;
            //对每一行数字进行判断
            for(let m = 0; m < 4; m++){
                let arr = new Array(0,0,0,0);
                let count = 0;
                //取出m行的所有数字
                for(let n = 0; n < 4; n++){
                    if(this.nodePos[m][n] != 0){
                        arr[count] = this.nodePos[m][n];
                        count++;
                    }
                }
                //判断每一个数字移动的格数,count表示本行存在的数字个数
                if(count == 3){
                    let fir = 2;
                    for(let n = 3; n >= 0; n--){
                        if(this.nodePos[m][n] != 0){
                            if(n == fir){
                                break;
                            }
                            else{
                                this.move1[this.index1] = m * 4 + n + 1;
                                this.index1++;
                                fir--;
                            }
                        }
                    }
                }
                else if(count == 2){
                    let fir = 1;
                    for(let n = 3; n >= 0; n--){
                        if(this.nodePos[m][n] != 0){
                            if(n == fir){
                                break;
                            }
                            else if(n - fir == 2){
                                this.move2[this.index2] = m * 4 + n + 1;
                                this.index2++;
                                fir--;
                            }
                            else{
                                this.move1[this.index1] = m * 4 + n + 1;
                                this.index1++;
                                fir--;
                            }
                        }
                    }
                }
                else if(count == 1){
                    if(this.nodePos[m][3] != 0){
                        this.move3[this.index3] = m * 4 + 4;
                        this.index3++;
                    }
                    else if(this.nodePos[m][2] != 0){
                        this.move2[this.index2] = m * 4 + 3;
                        this.index2++;
                    }
                    else if(this.nodePos[m][1] != 0){
                        this.move1[this.index1] = m * 4 + 2;
                        this.index1++;
                    }
                }
                //数字合并
                for(let n = 1; n < 4; n++){
                    if(arr[n] == arr[n - 1] && arr[n] != 0){
                        arr[n - 1]++;
                        arr[n] = 0;
                    }
                }
                count = 0;
                //将合并结果存入nodePos数组
                for(let n = 0; n < 4; n++){
                    this.nodePos[m][n] = 0;
                    if(arr[n] != 0){
                        this.nodePos[m][count] = arr[n];
                        count++;
                    }
                }
            }
        }
    },
    //上移
    up : function(){
        if(this.move == 1){
            //上移，上锁
            this.canMove = 3;
            this.move = 0;
            //对每一列进行判断
            for(let m = 0; m < 4; m++){     
                let arr = new Array(0,0,0,0);
                let count = 0;
                //获取每一列的非零数字
                for(let n = 0; n < 4; n++){    
                    if(this.nodePos[n][m] != 0){
                        arr[count] = this.nodePos[n][m];
                        count++;
                    }
                }
                //判断每一个数字移动的格数,count表示本列存在的数字个数
                if(count == 3){
                    let fir = 2;
                    for(let n = 3; n >= 0; n--){
                        if(this.nodePos[n][m] != 0){
                            if(n == fir){
                                break;
                            }
                            else{
                                this.move1[this.index1] = n * 4 + m + 1;
                                this.index1++;
                                fir--;
                            }
                        }
                    }
                }
                else if(count == 2){
                    let fir = 1;
                    for(let n = 3; n >= 0; n--){
                        if(this.nodePos[n][m] != 0){
                            if(n == fir){
                                break;
                            }
                            else if(n - fir == 2){
                                this.move2[this.index2] = n * 4 + m + 1;
                                this.index2++;
                                fir--;
                            }
                            else{
                                this.move1[this.index1] = n * 4 + m + 1;
                                this.index1++;
                                fir--;
                            }
                        }
                    }
                }
                else if(count == 1){
                    if(this.nodePos[3][m] != 0){
                        this.move3[this.index3] = m + 13;
                        this.index3++;
                    }
                    else if(this.nodePos[2][m] != 0){
                        this.move2[this.index2] = m + 9;
                        this.index2++;
                    }
                    else if(this.nodePos[1][m] != 0){
                        this.move1[this.index1] = m + 5;
                        this.index1++;
                    }
                }
                //进行合并
                for(let n = 1; n < 4; n++){    
                    if(arr[n] == arr[n - 1] && arr[n] != 0){
                        arr[n - 1]++;
                        arr[n] = 0;
                    }
                }
                count = 0;
                //添加到nodePos数组
                for(let n = 0; n < 4; n++){   
                    this.nodePos[n][m] = 0;
                    if(arr[n] != 0){
                        this.nodePos[count][m] = arr[n];
                        count++;
                    }
                }
            }
        }
    },
    //下移
    down : function(){
        if(this.move == 1){
            //下移，上锁
            this.canMove = 4;
            this.move = 0;
            //对每一列进行判断
            for(let m = 0; m < 4; m++){     
                let arr = new Array(0,0,0,0);
                let count = 0;
                //获取每一列的非零数字
                for(let n = 0; n < 4; n++){    
                    if(this.nodePos[n][m] != 0){
                        arr[count] = this.nodePos[n][m];
                        count++;
                    }
                }
                //判断每一个数字移动的格数,count表示本列存在的数字个数
                if(count == 3){
                    let fir = 1;
                    for(let n = 0; n < 4; n++){
                        if(this.nodePos[n][m] != 0){
                            if(n == fir){
                                break;
                            }
                            else{
                                this.move1[this.index1] = n * 4 + m + 1;
                                this.index1++;
                                fir++;
                            }
                        }
                    }
                }
                else if(count == 2){
                    let fir = 2;
                    for(let n = 0; n < 4; n++){
                        if(this.nodePos[n][m] != 0){
                            if(n == fir){
                                break;
                            }
                            else if(fir - n == 2){
                                this.move2[this.index2] = n * 4 + m + 1;
                                this.index2++;
                                fir++;
                            }
                            else{
                                this.move1[this.index1] = n * 4 + m + 1;
                                this.index1++;
                                fir++;
                            }
                        }
                    }
                }
                else if(count == 1){
                    if(this.nodePos[0][m] != 0){
                        this.move3[this.index3] = m + 1;
                        this.index3++;
                    }
                    else if(this.nodePos[1][m] != 0){
                        this.move2[this.index2] = m + 5;
                        this.index2++;
                    }
                    else if(this.nodePos[2][m] != 0){
                        this.move1[this.index1] = m + 9;
                        this.index1++;
                    }
                }
                //进行合并
                for(let n = 2; n >= 0; n--){    
                    if(arr[n] == arr[n + 1] && arr[n] != 0){
                        arr[n + 1]++;
                        arr[n] = 0;
                    }
                }
                count = 3;
                //添加到nodePos数组
                for(let n = 3; n >= 0; n--){   
                    this.nodePos[n][m] = 0;
                    if(arr[n] != 0){
                        this.nodePos[count][m] = arr[n];
                        count--;
                    }
                }
            }
        }
    },
    //将每个数字先销毁
    desNode : function(){
        for(let m = 0; m < 16; m++){
            if(this.hasNode[m] != null){      //该节点有数字则删除
                this.hasNode[m].destroy();
            }
        }
    },
    //添加一个新的数字
    addNode : function(){
        let judge = 0;
        for(let m = 0; m < 4; m++){
            for(let n = 0; n < 4; n++){
                //数字发生移动则可以生成一个新的数字
                if(this.nodePos[m][n] != this.oldNodePos[m][n]){    
                    judge = 1;
                }
            }
        }
        let randomNum = Math.floor(Math.random() * 6);
        if(judge == 1){
            while(1){
                //获取0-15的随机整数
                let count = Math.floor(Math.random() * 16);   
                let x = Math.floor(count / 4);
                let y = count % 4;
                //判断生成数字2还是数字4
                if(this.nodePos[x][y] == 0){
                    if(randomNum < 5){
                        this.nodePos[x][y] = 1;
                    }
                    else{
                        this.nodePos[x][y] = 2;
                    }
                    break;
                }
            }
        }
    },
    //失败判断
    failed : function(){
        let judge = 0;
        //有空位，或者没有空位时有相同数字相邻时，此时游戏未失败
        for(let m = 0; m < 4; m++){
            for(let n = 0; n < 4; n++){
                if(this.nodePos[m][n] == 0){    //有空位
                    judge = 1;
                    break;
                }
                else{
                    if(m == 0){      //第一行
                        if(n == 0){    //左上角
                            if(this.nodePos[m][n] == this.nodePos[m + 1][n] || this.nodePos[m][n] == this.nodePos[m][n + 1]){
                                judge = 1;
                                break;
                            }
                        }
                        else if(n == 3){    //右上角
                            if(this.nodePos[m][n] == this.nodePos[m + 1][n] || this.nodePos[m][n] == this.nodePos[m][n - 1]){
                                judge = 1;
                                break;
                            }
                        }
                        else{     //上面中间两个
                            if(this.nodePos[m][n] == this.nodePos[m + 1][n] || this.nodePos[m][n - 1] == this.nodePos[m][n] || this.nodePos[m][n] == this.nodePos[m][n + 1]){
                                judge = 1;
                                break;
                            }
                        }
                    }
                    else if(m == 3){     //第四行
                        if(n == 0){      //左下角
                            if(this.nodePos[m][n] == this.nodePos[m - 1][n] || this.nodePos[m][n] == this.nodePos[m][n + 1]){
                                judge = 1;
                                break;
                            }
                        }
                        else if(n == 3){    //右下角
                            if(this.nodePos[m][n] == this.nodePos[m - 1][n] || this.nodePos[m][n] == this.nodePos[m][n - 1]){
                                judge = 1;
                                break;
                            }
                        }
                        else{     //下面中间两个
                            if(this.nodePos[m][n] == this.nodePos[m - 1][n] || this.nodePos[m][n - 1] == this.nodePos[m][n] || this.nodePos[m][n] == this.nodePos[m][n + 1]){
                                judge = 1;
                                break;
                            }
                        }
                    }
                    else{        //中间两行
                        if(n == 0){         //左边中间两个
                            if(this.nodePos[m][n] == this.nodePos[m + 1][n] || this.nodePos[m][n] == this.nodePos[m][n + 1] || this.nodePos[m][n] == this.nodePos[m - 1][n]){
                                judge = 1;
                                break;
                            }
                        }
                        else if(n == 3){    //右边中间两个
                            if(this.nodePos[m][n] == this.nodePos[m + 1][n] || this.nodePos[m][n] == this.nodePos[m][n - 1] || this.nodePos[m][n] == this.nodePos[m - 1][n]){
                                judge = 1;
                                break;
                            }
                        }
                        else{         //中间四块
                            if(this.nodePos[m][n] == this.nodePos[m + 1][n] || this.nodePos[m][n - 1] == this.nodePos[m][n] || this.nodePos[m][n] == this.nodePos[m][n + 1] || this.nodePos[m][n] == this.nodePos[m - 1][n]){
                                judge = 1;
                                break;
                            }
                        }
                    }
                }
            }
            if(judge == 1){
                break;
            }
        }
        if(judge == 0){      //如果失败，跳转到失败界面
            cc.director.loadScene(this.faile.name);
        }
    },
    //将每个数字重新添加
    setPos : function(){
        this.failed();    //判断是否失败
        this.desNode();   //没有失败则将所有预制图片删除
        this.addNode();   //判断是否有空位，有则添加一个新的节点
        let count = -1;
        for(let m = 0; m < 4; m++){        //将每一个预制图片重新添加
            for(let n = 0; n < 4; n++){
                count++;
                if(this.nodePos[m][n] == 1){
                    this.newSpanNode(1, count);
                }
                else if(this.nodePos[m][n] == 2){
                    this.newSpanNode(2, count);
                }
                else if(this.nodePos[m][n] == 3){
                    this.newSpanNode(3, count);
                }
                else if(this.nodePos[m][n] == 4){
                    this.newSpanNode(4, count);
                }
                else if(this.nodePos[m][n] == 5){
                    this.newSpanNode(5, count);
                }
                else if(this.nodePos[m][n] == 6){
                    this.newSpanNode(6, count);
                }
                else if(this.nodePos[m][n] == 7){
                    this.newSpanNode(7, count);
                }
                else if(this.nodePos[m][n] == 8){
                    this.newSpanNode(8, count);
                }
                else if(this.nodePos[m][n] == 9){
                    this.newSpanNode(9, count);
                }
                else if(this.nodePos[m][n] == 10){      //如果出现了1024则游戏胜利
                    cc.director.loadScene(this.success.name);
                }
            }
        }
    },
    //撤回到上一步
    goBack : function() {
        if(this.move == 1){
            this.desNode();   //将所有预制图片删除
            let count = -1;
            for(let m = 0; m < 4; m++){        //将每一个预制图片重新添加,按照上一步的数组oldnodepos添加
                for(let n = 0; n < 4; n++){
                    count++;
                    if(this.oldNodePos[m][n] == 1){
                        this.newSpanNode(1, count);
                    }
                    else if(this.oldNodePos[m][n] == 2){
                        this.newSpanNode(2, count);
                    }
                    else if(this.oldNodePos[m][n] == 3){
                        this.newSpanNode(3, count);
                    }
                    else if(this.oldNodePos[m][n] == 4){
                        this.newSpanNode(4, count);
                    }
                    else if(this.oldNodePos[m][n] == 5){
                        this.newSpanNode(5, count);
                    }
                    else if(this.oldNodePos[m][n] == 6){
                        this.newSpanNode(6, count);
                    }
                    else if(this.oldNodePos[m][n] == 7){
                        this.newSpanNode(7, count);
                    }
                    else if(this.oldNodePos[m][n] == 8){
                        this.newSpanNode(8, count);
                    }
                    else if(this.oldNodePos[m][n] == 9){
                        this.newSpanNode(9, count);
                    }
                    this.nodePos[m][n] = this.oldNodePos[m][n];
                }
            }
        }
    },
    //重新开始游戏
    reStart : function() {
        this.desNode();
        this.init();
    },
    //初始化加载数据
    onLoad () {
        //初始化函数
        this.init();
        //监听触摸开始的位置和触摸结束时的位置，来判断移动方向
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchUp, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.goback.on(cc.Node.EventType.TOUCH_START, this.goBack, this);
        this.restart.on(cc.Node.EventType.TOUCH_START, this.reStart, this);
     },

    start () {

    },

    update () {
        //左移
        if(this.canMove == 1){
            //寻找所有可以移动的数字，开始移动
            for(let m = 0; m < 16; m++){
                if(this.move1[m] != 0){
                    this.hasNode[this.move1[m] - 1].x -= 10;
                }
                if(this.move2[m] != 0){
                    this.hasNode[this.move2[m] - 1].x -= 20;
                }
                if(this.move3[m] != 0){
                    this.hasNode[this.move3[m] - 1].x -= 30;
                }
            }
            //计算移动的距离
            this.Dis += 10;
        }
        //右移
        else if(this.canMove == 2){
            //寻找所有可以移动的数字，开始移动
            for(let m = 0; m < 16; m++){
                if(this.move1[m] != 0){
                    this.hasNode[this.move1[m] - 1].x += 10;
                }
                if(this.move2[m] != 0){
                    this.hasNode[this.move2[m] - 1].x += 20;
                }
                if(this.move3[m] != 0){
                    this.hasNode[this.move3[m] - 1].x += 30;
                }
            }
            //计算移动的距离
            this.Dis += 10;
        }
        //上移
        else if(this.canMove == 3){
            //寻找所有可以移动的数字，开始移动
            for(let m = 0; m < 16; m++){
                if(this.move1[m] != 0){
                    this.hasNode[this.move1[m] - 1].y += 10;
                }
                if(this.move2[m] != 0){
                    this.hasNode[this.move2[m] - 1].y += 20;
                }
                if(this.move3[m] != 0){
                    this.hasNode[this.move3[m] - 1].y += 30;
                }
            }
            //计算移动的距离
            this.Dis += 10;
        }
        //下移
        else if(this.canMove == 4){
            //寻找所有可以移动的数字，开始移动
            for(let m = 0; m < 16; m++){
                if(this.move1[m] != 0){
                    this.hasNode[this.move1[m] - 1].y -= 10;
                }
                if(this.move2[m] != 0){
                    this.hasNode[this.move2[m] - 1].y -= 20;
                }
                if(this.move3[m] != 0){
                    this.hasNode[this.move3[m] - 1].y -= 30;
                }
            }
            //计算移动的距离
            this.Dis += 10;
        }
    },

    lateUpdate () {
        if(Math.abs(this.Dis - 100) < 5){
            this.move = 1;
            this.canMove = 0;
            //重置移动参数
            this.initMove();
            //移动后的判断，如融合
            this.setPos();          
        }
    },
});
