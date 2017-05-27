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
		this.ctx.drawImage(bgImg, 0, 0, this.width, this.height);
	}
	/*
	 *3-蛇动
	 * */
	this.move = function(){}
	/*
	 *3-蛇死
	 * */
	this.dead = function(){}
}
