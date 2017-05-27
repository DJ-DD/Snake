//ES6 全局变量使用const关键字定义--只读
const northImg = new Image();
northImg.src = "img/north.png";
const southImg = new Image();
southImg.src = "img/south.png";
const eastImg = new Image();
eastImg.src = "img/east.png";
const westImg = new Image();
westImg.src = "img/west.png";
const bodyImg = new Image();
bodyImg.src = "img/body.png";
const foodImg = new Image();
foodImg.src = "img/food.png";
const bgImg = new Image();
bgImg.src = "img/background.png";
//将欢迎界面的图片放在最后，表示会后加载成功
const startImg = new Image();
startImg.src = "img/start.png";

function Snake(){
	this.canvas = $("#gameview")[0];  //canvas对象
	this.ctx = this.canvas.getContext("2d")  //画笔
	this.width = 500;  //背景（游戏屏幕）的宽度
	this.height = 500;  //背景（游戏屏幕）的高度
	this.step = 25;  //设计步长
	this.stepX = Math.floor(this.width/this.step);  //X轴的步数
	this.stepY = Math.floor(this.height/this.step); //Y轴的步数
	this.snakeBodyList = [];  //设置蛇身数组
	this.foodList = [];  //设置食物数组
	this.timer = null;  //蛇动时的定时器
	this.score = 0; //分数 +10 存入到localStorage中
	/*
	 *1-生成初始化页面，点击该页面进入游戏
	 * */
	this.init = function(){
		this.ctx.drawImage(startImg, 0, 0, this.width, this.height);
	}
	/*
	 * 2-游戏开始，绘制背景、蛇、食物,蛇移动
	 */
	
	this.start = function(){
		this.paint();
		this.move();
	}
	/*
	 * 绘制背景、蛇、食物
	 */
	this.paint = function() {
		//2.1 画出背景
		this.ctx.drawImage(bgImg, 0, 0, this.width, this.height);
		//2.2 画蛇
		this.drawSnake();
		//2.3 随机画出食物
		this.drawFood();
	}
	
	/*
	 *2.2画蛇--算法：[{x:横坐标，y:纵坐标，img:图片，direct：运动方向，......}]
	 * */
	this.drawSnake = function(){
		//2.2.1循环生成snakeBodyList数组中的对象集合（默认，蛇居于中间，舌头向西）
		if(this.snakeBodyList.length<5){
			for(var i=0;i<5;i++){
				//{x:横坐标，y:纵坐标，img:图片，direct：运动方向，......}蛇的节点设计
				this.snakeBodyList.push({
					x:Math.floor(this.stepX/2)+i-2,  //注意：x不是px像素坐标点，而是x轴步数
					y:Math.floor(this.stepY/2),   //注意：y不是px像素坐标点，而是y轴步数
					img:bodyImg,
					direct:"west"
				});
			}
	//		console.log(this.snakeBodyList);
			//2.2.2替换snakeBodyList数组第一个元素的img，替换成westImg蛇头图片
			this.snakeBodyList[0].img = westImg;
		}
		//2.2.3遍历snakeBodyList数组，并画出蛇的初始状态
		for(var i = 0;i<this.snakeBodyList.length;i++){
			var sNode = this.snakeBodyList[i];
			this.ctx.drawImage(sNode.img, sNode.x*this.step, sNode.y*this.step,this.step,this.step);
		}
	}
	/*
	 *2.3画食物
	 * */
	this.drawFood = function(){
		
		//2.3.1当食物已经存在的时候，画面刷新时食物在原有位置重绘
		if(this.foodList.length>0){  //长度大于0就有食物
			var fnode = this.foodList[0];  //重绘
			this.ctx.drawImage(fnode.img, fnode.x*this.step, fnode.y*this.step, this.step, this.step);
			return;
		}
		//2.3.2如果食物没有（食物被吃或游戏初始化），生成x,y随机坐标，判断是否与蛇神重复
		//如果重复，重绘，调drawfood（），否则，按照随机生成的点push到数组中，绘制图案
			var foodX = Math.floor(Math.random()*this.stepX);
			var foodY = Math.floor(Math.random()*this.stepY);
			var foodFlag = false;  //判断食物与蛇身是否重复的标识位，true重复，false不重复
			for(var i=0;i<this.snakeBodyList.length;i++){
				var snode1 = this.snakeBodyList[i];
				if(foodX == snode1.x && foodY == snode1.y){
					foodFlag = true;
				}
			}
			if(foodFlag){
				this.drawFood();  //如果重复，则重绘
			}else{
				this.foodList.push({
					x:foodX,
					y:foodY,
					img:foodImg
				});   //否则，新生成一个食物
				console.log(this.foodList);
				var fnode = this.foodList[0];
				this.ctx.drawImage(fnode.img, fnode.x*this.step, fnode.y*this.step, this.step, this.step);
			}
		
	}
	/*
	 *3-蛇动（键盘事件改变蛇移动方向，判断蛇是否死掉，然后判断蛇是否吃了食物，然后蛇移动）
	 */
	this.move = function(){
		var _this = this;//解决办法：定义变量保存
		document.onkeydown = function(event){
			var event = event || window.event;
			console.log(event.key+"："+event.keyCode);
			console.log(_this.snakeBodyList); //打印不出来--事件处理是异步的，所以无法传递this对象
			switch(event.keyCode){
				case 37:  //向左
					_this.snakeBodyList[0].img = westImg;
					_this.snakeBodyList[0].direct = "west";
				break;
				case 38:  //向上
					_this.snakeBodyList[0].img = northImg;
					_this.snakeBodyList[0].direct = "north";
				break;
				case 39:  //向右
					_this.snakeBodyList[0].img = eastImg;
					_this.snakeBodyList[0].direct = "east";
				break;
				case 40:  //向下
					_this.snakeBodyList[0].img = southImg;
					_this.snakeBodyList[0].direct = "south";
				break;
			}
		}
		
		//运动定时器，每隔0.2s移动蛇（蛇的坐标变化，然后重绘）
		this.timer = setInterval(function(){   //先注释，怕0.2s一执行，好测试
			//蛇头的坐标变化，并且蛇身跟随，移动
			//首先，解决蛇身跟随的问题
			for(var i = _this.snakeBodyList.length-1;i>0;i--){ //定时器也是异步，所以_this
				_this.snakeBodyList[i].x = _this.snakeBodyList[i-1].x;
				_this.snakeBodyList[i].y = _this.snakeBodyList[i-1].y;
			};
			//其次，根据方向及坐标，处理蛇头的移动新坐标
			var shead = _this.snakeBodyList[0];
			switch(shead.direct){
				case 'north':
					shead.y--;
				break;
				case 'south':
					shead.y++;
				break;
				case 'west':
					shead.x--;
				break;
				case 'east':
					shead.x++;
				break;
			}
			_this.paint();  //蛇每移动一次重绘游戏画面
		},1000);
		
	}
	/*
	 *4-蛇死（碰到边界或自身--dead 弹出得分界面）
	 * */
	this.dead = function(){}
}
