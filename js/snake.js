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
//将欢迎界面的图片放在最后，表示会后加载成功后，其他图片已经加载完毕，无需再进行onload判断
const startImg = new Image();
startImg.src = "img/start.png";

function Snake(){
	this.canvas = $("#gameview")[0];  //canvas对象
	this.ctx = this.canvas.getContext("2d");  //画笔
	this.width = 500;  //背景（游戏屏幕）的宽度
	this.height = 500;  //背景（游戏屏幕）的高度
	this.step = 25;  //设计步长
	this.stepX = Math.floor(this.width/this.step);  //X轴的步数
	this.stepY = Math.floor(this.height/this.step); //Y轴的步数
	this.snakeBodyList = [];  //设置蛇身数组
	this.foodList = [];  //设置食物数组
	this.timer = null;  //蛇动时的定时器
	this.score = 0; //分数 +10 存入到localStorage中
	this.isDead = false; //蛇是否活着标识位
	this.isEaten = false;  //食物是否被吃掉标识位
	this.isPhone = false;  //判断设备是否为移动端 true--移动端  false--PC端
	/*
	 *1-生成初始化页面，点击该页面进入游戏
	 * */
	this.init = function(){
		this.device();//判断设备类型
		this.ctx.drawImage(startImg, 0, 0, this.width, this.height);
	}
	/*
	 * 2-游戏开始，绘制背景、蛇、食物,蛇移动
	 */
	this.start = function(){
		this.device();//判断设备类型
		this.score = 0; //积分清零
		this.paint();
		this.move();
	}
	
	/*
	 * 判断当前设备是否是移动端
	 */
	this.device = function(){
		//1-读取BOM对象navigator的userAgent信息
		var deviceInfo = navigator.userAgent;
		//2-判断是否为PC端（是否含有Windows字符串）
		if(deviceInfo.indexOf("Windows") == -1){
			this.isPhone = true;
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.width = window.innerWidth;
			this.height = window.innerHeight;
			this.stepX = this.width/this.step;
			this.stepY = this.height/this.step;
			console.log(this.width+" "+this.height);
		}
		
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
		//2.2.1循环生成snakeBodyList数组中的对象集合（默认，蛇居于中间，蛇头向西）
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
//				console.log(this.foodList);
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
//			console.log(event.key+"："+event.keyCode);
//			console.log(_this.snakeBodyList); //打印不出来--事件处理是异步的，所以无法传递this对象
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
		
		//3.1运动定时器，每隔0.2s移动蛇（蛇的坐标变化，然后重绘）
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
			//3.1.1 判断蛇移动之后新位置是否已经触边界，或触自身 true-dead（每移动一次都需判断，判断后重绘）
			_this.dead();  //判断蛇生死
			if(_this.isDead){
				//alert你的最终分数
				console.log("Your score is:"+_this.score);
				//可将下面四行新建个方法restart，添加命令按钮控制重新开始
				clearInterval(_this.timer); //如果不清楚定时器，则速度会不断加快
				_this.isDead = false; //改变isDead状态，否则，每次开始直接死掉
				_this.snakeBodyList = [];  //清除蛇身，便于重新开始游戏，重绘初始页面
				_this.start(); //游戏重新开始
			}else{
				//3.1.2 false：蛇活着，判断蛇头是否与食物的坐标点一致，如果一致，清空食物数组；多个食物时可以使用标识位
				_this.eat();  //判断食物是否被吃
				if(_this.isEaten){
					//清空食物数组
					//console.log("Eaten");
					_this.isEaten = false;
					//清空食物数组  
					_this.foodList = [];  //等于空数组相当于不要原来的空间，指向一个新的地址，产生垃圾
					//_this.foodList[0] = null; //drawFood的判断条件与该语句冲突
					//加分
					_this.score += 10;
					//蛇身长一节
					var lastNodeIndex = _this.snakeBodyList.length;
					_this.snakeBodyList[lastNodeIndex] = {
						x:-2,
						y:-2,
						img:bodyImg,
						direct:_this.snakeBodyList[lastNodeIndex-1].direct
					};
				}
			//3.1.3 否则重绘
			_this.paint();  //蛇每移动一次重绘游戏画面（若背景不重绘，原来已经绘制的点仍在，社会不断延长）
			}
		},200);
		
	}
	/*
	 *4-蛇死（碰到边界或自身--dead 弹出得分界面）
	 * */
	this.dead = function(){
//		this.isDead = true;  //测试3.1.1，游戏一开始就死掉，可以弹框，测试逻辑
		const LEFT_END = 0; //左边界
		const RIGHT_END = this.stepX; //右边界
		const NORTH_END = 0; //上边界
		const SOUTH_END = this.stepY; //下边界
		const headX = this.snakeBodyList[0].x;  //蛇头横坐标x
		const headY = this.snakeBodyList[0].y;  //蛇头纵坐标y
		//判断边界
		if(headX < LEFT_END-1 || headY < NORTH_END-1 || headX > RIGHT_END || headY > SOUTH_END){
			this.isDead = true;
			return; //精简判断过程
		}
		
		//判断是否撞到自身
		for(var k = this.snakeBodyList.length-1; k>0; k--){
			if(this.snakeBodyList[k].x == headX && this.snakeBodyList[k].y == headY){
				this.isDead = true;
			}
		}
		
	}
	/*
	 * 5-蛇吃食物（蛇头坐标与食物坐标一致）
	 */
	this.eat = function(){
//		this.isEaten = true;
		const HEAD_X = this.snakeBodyList[0].x;  //蛇头横坐标x
		const HEAD_Y = this.snakeBodyList[0].y;  //蛇头纵坐标y
		const FOOD_X = this.foodList[0].x;  //食物横坐标x
		const FOOD_Y = this.foodList[0].y;  //食物纵坐标y
		if(HEAD_X == FOOD_X && HEAD_Y == FOOD_Y){
			this.isEaten = true;
		}
	}
}
