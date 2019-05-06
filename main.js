var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width = 480;
var ch = canvas.height = 640;
/* Flappy bird image */
birdImg = new Image();
birdImg.src = "./flappy_sprite.png";
/*blocks*/
blockArray = [];
/*Keyboard events*/
var dead = false;
var score = 0;
var spacePressed = false;
var start = false;
var deadEffect = 0;
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUphandler);
function keyDownHandler(e) {

    if ( e.keyCode == 32 && !dead) {spacePressed = true; start = true;}
}
function keyUphandler (e) {
    if ( e.keyCode == 32) spacePressed = false;
}
/* Bird object */
var Bird = {
    width :40,
    height :40,
    posX :cw/2,
    posY : ch/2,
    speed : 4,
    x : 264,
    y : 64,
    w : 17,
    h: 12,
    k : 1,
    bounce : function () {
        this.posY-=this.k;
        if (this.posY > (ch/2)+20 || this.posY < (ch/2)-20) this.k = -this.k;
    },
    draw : function () {    
        ctx.beginPath();
        ctx.drawImage(birdImg, this.x, this.y, this.w, this.h, this.posX,this.posY,this.width,this.height);
        if (this.y == 64 && !dead) this.y=90;
        else if (this.y == 90 && !dead) { setTimeout(function(){Bird.y=124; Bird.x = 223;},120) }
        else if (this.y == 124 && !dead) { this.y =64; this.x = 264; }
    },
    update : function () {
        if (!start) this.bounce();
        if (this.posY + this.height <= ch-76 && start) this.posY += this.speed + deadEffect;
        if (spacePressed && this.posY>0) this.posY -= 7;
    }
}
/*block object*/
function Block(posX, posY, height, upperBlock) {
    this.width = 75;
    this.height = height;
    this.posY = posY;
    this.posX = posX;
    this.upperBlock = upperBlock;
    this.draw = function () {
        if (this.upperBlock) {
            ctx.beginPath();
            ctx.drawImage(birdImg, 302, 0, 26, 135, this.posX,this.posY,this.width,this.height);
        }
        else {
            ctx.beginPath();
            ctx.drawImage(birdImg, 330, 0, 26, 100, this.posX,this.posY,this.width,this.height);
        }
    }
    this.update = function () {
        if (!dead) this.posX--;
        if (this.posX < -this.width) this.posX = cw;
    }
}
function createBlock() { //300 185 200 295 281 205 150 352
    var i = 0;
    var posX = cw+100; 
    var gap = 100;
    while (i < 3) {
        var h = Math.floor(Math.random()*201)+100;
        var upperBlock = true;
        blockArray[i] = new Block(posX, 0, h, upperBlock);
        upperBlock = false;
        blockArray[i+1] = new Block(posX, h+gap, ch-75-h-gap, upperBlock);
        posX+=200;
        i += 2;
    }
}
function move () {
    for (var i = 0; i<4; i++) {
        blockArray[i].draw();
        blockArray[i].update();
    }
}

function collision() {
    for (var i = 0; i<4; i++) {
        if ( (Bird.posX < blockArray[i].posX+blockArray[i].width &&
       Bird.posX + (Bird.width-6) > blockArray[i].posX &&
       Bird.posY < blockArray[i].posY + blockArray[i].height &&
       (Bird.height-10) + Bird.posY > blockArray[i].posY)  || (Bird.posY-Bird.height == ch - 75) || (Bird.posY == 0) ){
            dead = true;
            document.getElementById("restart").style.display = "flex";
            document.getElementById("score").innerHTML = "score = "+score;
            spacePressed = false;
            deadEffect = 8;
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(0,0,cw,ch);
        }
        if (Bird.posX + Bird.width == blockArray[i].posX + blockArray[i].width + 15 && (i == 0 || i == 2) )score++;
    }
}
/*so frustrating...*/
var x = 0;
function drawButtom() {
    ctx.beginPath();
    /* Static bg*/
    ctx.drawImage(birdImg, 0, 0, 145, 250, 0,0,cw+5,ch);
    /*buttom*/
    ctx.drawImage(birdImg, 150, 0, 150, 50, x,ch-75,cw+50,150);
    if (!dead) x -= 3;
    if (x < -50) x=0;
}
function drawScore () {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font="bold 36px Helvetica";
    score = score;
    ctx.fillText(score,cw/2,100);
    ctx.strokeText(score,cw/2,100);
}
function draw () {
    canvas.width = canvas.width;
    drawButtom();
    if (start) move();
    Bird.draw();
    Bird.update();
    drawScore();
    if (!dead ) collision();
    requestAnimationFrame(draw);
}
createBlock();
draw();