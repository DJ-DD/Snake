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
	/*
	 *1-生成初始化页面，点击该页面进入游戏
	 * */
	this.init = function(){
		this.ctx.drawImage(startImg, 0, 0, this.width, this.height);
	}
	/*
	 *2-游戏开始，绘制背景、蛇、食物
	 * */
	this.start = function(){
		//2.1 画出背景
		this.ctx.drawImage(bgImg, 0, 0, this.width, this.height);
		//2.2 画蛇
		this.drawSnake();
		//2.3随机画出食物
		this.drawFood();
	}
	/*
	 *2.2画蛇--算法：[{x:横坐标，y:纵坐标，img:图片，direct：运动方向，......}]
	 * */
	this.drawSnake = function(){
		//2.2.1循环生成snakeBodyList数组中的对象集合（默认，蛇居于中间，舌头向西）
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
		//2.2.3遍历snakeBodyList数组，并画出蛇的初始状态
		for(var i = 0;i<this.snakeBodyList.length;i++){
			var sNode = this.snakeBodyList[i];
			this.ctx.drawImage(sNode.img, sNode.x*this.step, sNode.y*this.step,this.step,this.step);
		}
	}
	/*
	 *2.3画食物
	 * */
	this.drawFood = function(){}
	/*
	 *3-蛇动
	 * */
	this.move = function(){}
	/*
	 *3-蛇死
	 * */
	this.dead = function(){}
}
