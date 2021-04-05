// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        times : 0,
        canMove : 0,
        num : {
            default : [],
            type : [cc.Node]
        },
        pos : {
           default : [],
           type : [cc.Vec2]
        },
        pos16 : {
            default : [],
            type : [cc.Vec2]
        },
        fresh:{
            default: null,
            type: cc.Node
        },
        newGame:{ 
            default: null,
            type: cc.Node
        },
        scene:{
            default: null, 
            type: cc.SceneAsset
        } 
    },

    //洗牌算法对数字进行随机排序
    shuffle : function() { 
        for (let i = this.value.length - 2; i >= 0; i--) { 
            var randomIndex = Math.floor(Math.random() * (i + 1));   //随机数下取整
            var itemAtIndex = this.value[randomIndex]; 
            this.value[randomIndex] = this.value[i]; 
            this.oldValue[randomIndex] = this.oldValue[i];
            this.value[i] = itemAtIndex; 
            this.oldValue[i] = itemAtIndex;
        }  
    },
    //暴力计算逆序对
    calReverse : function(){
        let count = 0;
        for(let m = 0; m < this.value.length - 2; m++){
            for(let n = m + 1; n < this.value.length - 1; n++){
                if(this.value[m] > this.value[n]){
                    count++;
                }
            }
        }
        return count;
    },
    //将每个数字的图片添加到对应位置的函数
    addN : function(x){
        let y = -1;
        y = this.getOldN(x);
        if(this.times == 1){
            this.num[x - 1].position = this.pos[y - 1];
        }
        else{
            this.num[x - 1].position = this.pos16[y - 1];
        }
    },
    //重新开始本游戏
    refresh : function() {
        //用于判断那一块被点击、每次交换的位置、是否可以移动下一块方块、空白实时位置
        this.click = -1;
        this.change = -1;
        this.move = 1;
        this.blank = this.value.length - 1;
        //将最初的图片加上
        for(let m = 1; m < this.value.length; m++){
            this.addN(m);
        }
        for(let m = 0; m < this.value.length; m++){
            this.value[m] = this.oldValue[m];
        }
    },
    //初始化数字序列并添加图片的函数
    init : function(){
        //用于判断那一块被点击、每次交换的位置、是否可以移动下一块方块
        this.click = -1;
        this.change = -1;
        this.move = 1;
        //如果逆序对个数为偶数则九宫格有解
        for(;;){
            let count = 1; //计算逆序对个数
            //存放每一块对应的数字 、存放每次最开始的数组用于重新开始
            if(this.times == 1){
                this.value = new Array(8,7,6,5,4,3,2,1,0);
                this.oldValue = new Array(8,7,6,5,4,3,2,1,0);
            }
            else if(this.times == 2){
                this.value = new Array(15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0);
                this.oldValue = new Array(15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0);
            }
            this.shuffle();
            count = this.calReverse();
            count = count % 2;
            if(count == 0){
                break;
            }
        }
        //空白格位置
        this.blank = this.value.length - 1;
        //设置4*4多余组件不可见
        if(this.times == 1){
            for(let m = 8; m < 15; m++){
                this.num[m].active = false;
            }
        }
        else{
            for(let m = 8; m < 15; m++){
                this.num[m].active = true;
            }
        }
        //将每一个数字对应的图片加上
        for(let m = 1; m < this.value.length; m++){
            this.addN(m);
        }

    },
    //判断是否成功
    victory : function(){
        let judge = 1;
        for(let m = 0; m < this.value.length - 1; m++){
            if(this.value[m] != m + 1){
                judge = 0;
            }
        }
        if(judge == 1){
            this.times++;
            if(this.times == 2){
                this.init();
            }
            else if(this.times == 3){
                cc.director.loadScene(this.scene.name);
            }
        }
    },
    //获取最初的x数字位置
    getOldN : function(x){
        for(let m = 0; m < this.value.length; m++){
            if(this.oldValue[m] == x){
                return m + 1;    //按九宫格1,2,3 || 4,5,6 || 7,8,9 排列输出
            }
        }
    },
    //获取X节点的位置   按九宫格1,2,3 || 4,5,6 || 7,8,9 排列输出
    getN : function(x){
        for(let m = 0; m < this.value.length; m++){
            if(this.value[m] == x){
                return m + 1;    
            }
        }
    },
    //判断两个节点是否是相邻的，从而判断是否可以移动,返回2表示左右移动，1表示上下移动
    judgeMove : function(x,y){
        if(this.times == 1){
            if(x == 1){
                if(y == 4){
                    return 1;
                }
                else if(y == 2){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 2){
                if(y == 1 || y == 3){
                    return 2;
                }
                else if(y == 5){
                    return 1;
                }
                else{
                    return 0;
                }
            }
            else if(x == 3){
                if(y == 6){
                    return 1;
                }
                else if(y == 2){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 4){
                if(y == 1 || y == 7){
                    return 1;
                }
                else if(y == 5){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 5){
                if(y == 2 || y == 8){
                    return 1;
                }
                else if(y == 4 || y == 6){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 6){
                if(y == 3 || y == 9){
                    return 1;
                }
                else if(y == 5){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 7){
                if(y == 4){
                    return 1;
                }
                else if(y == 8){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 8){
                if(y == 7 || y == 9){
                    return 2;
                }
                else if(y == 5){
                    return 1;
                }
                else{
                    return 0;
                }
            }
            else if(x == 9){
                if(y == 6){
                    return 1;
                }
                else if(y == 8){
                    return 2;
                }
                else{
                    return 0;
                }
            }
        }
        else{
            if(x == 1){
                if(y == 2){
                    return 2;
                }
                else if(y == 5){
                    return 1;
                }
                else{
                    return 0;
                }
            }
            else if(x == 2){
                if(y == 1 || y == 3){
                    return 2;
                }
                else if(y == 6){
                    return 1;
                }
                else{
                    return 0;
                }
            }
            else if(x == 3){
                if(y == 2 || y == 4){
                    return 2;
                }
                else if(y == 7){
                    return 1;
                }
                else{
                    return 0;
                }
            }
            else if(x == 4){
                if(y == 3){
                    return 2;
                }
                else if(y == 8){
                    return 1;
                }
                else{
                    return 0;
                }
            }
            else if(x == 5){
                if(y == 6){
                    return 2;
                }
                else if(y == 1 || y == 9){
                    return 1;
                }
                else{
                    return 0;
                }
            }
            else if(x == 6){
                if(y == 2 || y == 10){
                    return 1;
                }
                else if(y == 5 || y == 7){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 7){
                if(y == 3 || y == 11){
                    return 1;
                }
                else if(y == 6 || y == 8){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 8){
                if(y == 4 || y == 12){
                    return 1;
                }
                else if(y == 7){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 9){
                if(y == 5 || y == 13){
                    return 1;
                }
                else if(y == 10){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 10){
                if(y == 6 || y == 14){
                    return 1;
                }
                else if(y == 9 || y== 11){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 11){
                if(y == 7 || y == 15){
                    return 1;
                }
                else if(y == 10 || y == 12){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 12){
                if(y == 8 || y == 16){
                    return 1;
                }
                else if(y == 11){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 13){
                if(y == 9){
                    return 1;
                }
                else if(y == 14){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 14){
                if(y == 10){
                    return 1;
                }
                else if(y == 13 || y == 15){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 15){
                if(y == 11){
                    return 1;
                }
                else if(y == 14 || y == 16){
                    return 2;
                }
                else{
                    return 0;
                }
            }
            else if(x == 16){
                if(y == 12){
                    return 1;
                }
                else if(y == 15){
                    return 2;
                }
                else{
                    return 0;
                }
            }
        }
    },
    //不同数字点击后的事件函数
    OneUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(1);
            //判断是否可以移动，可以返回1或2，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                //上锁防止其他方块移动
                this.move = 0;
                //点击的是数字1
                this.click = 0;
                //获取空白方块位置
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 1;
                this.blank = x - 1;
            }
        }
        
    },
    TwoUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(2);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 1;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 2;
                this.blank = x - 1;
            }
        }
        
    },
    ThreeUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(3);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 2;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 3;
                this.blank = x - 1;
            }
        }
    },
    FourUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(4);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 3;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 4;
                this.blank = x - 1;
            }
        }
    },
    FiveUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(5);
            //判断是否可以移动，可以返回1，不可以返回0
            this. canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 4;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 5;
                this.blank = x - 1;
            }
        }
    },
    SixUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(6);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 5;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 6;
                this.blank = x - 1;
            }
        }
    },
    SevenUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(7);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 6;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 7;
                this.blank = x - 1;
            }
        }
    },
    EightUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(8);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 7;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 8;
                this.blank = x - 1;
            }
        }
    },
    NineUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(9);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 8;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 9;
                this.blank = x - 1;
            }
        }
    },
    TenUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(10);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 9;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 10;
                this.blank = x - 1;
            }
        }
    },
    ElevenUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(11);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 10;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 11;
                this.blank = x - 1;
            }
        }
    },
    TwelveUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(12);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 11;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 12;
                this.blank = x - 1;
            }
        }
    },
    ThirteenUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(13);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 12;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 13;
                this.blank = x - 1;
            }
        }
    },
    FourteenUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(14);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 13;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 14;
                this.blank = x - 1;
            }
        }
    },
    FifteenUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(15);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 14;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 15;
                this.blank = x - 1;
            }
        }
    },
    SixteenUp : function(){
        if(this.move == 1){
            let x = -1;  //获取当前节点的位置
            x = this.getN(16);
            //判断是否可以移动，可以返回1，不可以返回0
            this.canMove = this.judgeMove(x, this.blank + 1);
            //根据空表格的位置进行移动
            if(this.canMove != 0){
                this.move = 0;
                this.click = 15;
                this.change = this.blank;
                this.value[x - 1] = 0;
                this.value[this.blank] = 16;
                this.blank = x - 1;
            }
        }
    },
        
    onLoad () {
        //初始化，同时数字序列是随机的
        this.init();
        //监听重新开始游戏和开始新的游戏的点击
        this.fresh.on(cc.Node.EventType.TOUCH_START, this.refresh, this);
        this.newGame.on(cc.Node.EventType.TOUCH_START, this.init, this);
        //设置监听来监听每个数字被点击
        this.num[0].on(cc.Node.EventType.TOUCH_START, this.OneUp, this);
        this.num[1].on(cc.Node.EventType.TOUCH_START, this.TwoUp, this);
        this.num[2].on(cc.Node.EventType.TOUCH_START, this.ThreeUp, this);
        this.num[3].on(cc.Node.EventType.TOUCH_START, this.FourUp, this);
        this.num[4].on(cc.Node.EventType.TOUCH_START, this.FiveUp, this);
        this.num[5].on(cc.Node.EventType.TOUCH_START, this.SixUp, this);
        this.num[6].on(cc.Node.EventType.TOUCH_START, this.SevenUp, this);
        this.num[7].on(cc.Node.EventType.TOUCH_START, this.EightUp, this);
        this.num[8].on(cc.Node.EventType.TOUCH_START, this.NineUp, this);
        this.num[9].on(cc.Node.EventType.TOUCH_START, this.TenUp, this);
        this.num[10].on(cc.Node.EventType.TOUCH_START, this.ElevenUp, this);
        this.num[11].on(cc.Node.EventType.TOUCH_START, this.TwelveUp, this);
        this.num[12].on(cc.Node.EventType.TOUCH_START, this.ThirteenUp, this);
        this.num[13].on(cc.Node.EventType.TOUCH_START, this.FourteenUp, this);
        this.num[14].on(cc.Node.EventType.TOUCH_START, this.FifteenUp, this);
        this.num[15].on(cc.Node.EventType.TOUCH_START, this.SixteenUp, this);

    },

    start () {

    },

    //每帧更新方块位置
    update (dt) {
        //1表示上下移，2表示左右移
        if(this.canMove == 1){
            if(this.click != -1){
                if(this.times == 1){
                    var delY = this.pos[this.change].y - this.num[this.click].y;
                    this.num[this.click].y += delY * 0.4;
                }
                else{
                    var delY = this.pos16[this.change].y - this.num[this.click].y;
                    this.num[this.click].y += delY * 0.4;
                }
            }
        }
        else if(this.canMove == 2){
            if(this.click != -1){
                if(this.times == 1){
                    var delX = this.pos[this.change].x - this.num[this.click].x;
                    this.num[this.click].x += delX * 0.4;
                }
                else{
                    var delX = this.pos16[this.change].x - this.num[this.click].x;
                    this.num[this.click].x += delX * 0.4;
                }
            }
        }
    },
    //更新方块位置到达以后停止移动
    lateUpdate () {
        if(this.canMove == 1){
            if(this.click != -1){
                if(this.times == 1){
                    if(Math.abs(this.pos[this.change].y - this.num[this.click].y) < 10){  //计算与目的位置的差值，小于5即可忽略
                        this.num[this.click].position = this.pos[this.change];
                        this.canMove = 0;
                        this.move = 1;
                        this.click = -1;
                    }
                }
                else{
                    if(Math.abs(this.pos16[this.change].y - this.num[this.click].y) < 10){  //计算与目的位置的差值，小于5即可忽略
                        this.num[this.click].position = this.pos16[this.change];
                        this.canMove = 0;
                        this.move = 1;
                        this.click = -1;
                    }
                }
                
            }
        }
        else if(this.canMove == 2){
            if(this.click != -1){
                if(this.times == 1){
                    if(Math.abs(this.pos[this.change].x - this.num[this.click].x) < 10){
                        this.num[this.click].position = this.pos[this.change];
                        this.canMove = 0;
                        this.move = 1;
                        this.click = -1;
                        this.victory();
                    }
                }
                else{
                    if(Math.abs(this.pos16[this.change].x - this.num[this.click].x) < 10){
                        this.num[this.click].position = this.pos16[this.change];
                        this.canMove = 0;
                        this.move = 1;
                        this.click = -1;
                        this.victory();
                    }
                }
            }
        }
    },
});
