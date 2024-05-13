const canvas =document.getElementById('game')
const context = canvas.getContext('2d')
const grid = 15
const paddleHeight = grid * 5
const maxPaddleYR = canvas.height - grid - paddleHeight
const maxPaddleYL = canvas.height - grid - paddleHeight * 2

let speed = 0
let paddleSpeed = 8;
let ballSpeed = 6;
let record = 0
let count = 0
let StorageSize = localStorage.length 
let secret = false
let secret_count = 0
let ballColor = "#fff"

    

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    width: grid,
    height: grid,
    resetting: false,
    dx: ballSpeed,
    dy: -ballSpeed,
};

const leftPaddle = {
    x: grid * 2,
    y: canvas.height/2 - paddleHeight/2,
    width: grid,
    height:paddleHeight * 2,
    dy: paddleSpeed
}

const rightPaddle = {
    x: canvas.width - grid*3,
    y: canvas.height/2 - paddleHeight/2,
    width: grid,
    height:paddleHeight,
    dy:0,
}

function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

if(StorageSize>0){
        record = localStorage.getItem('record')
    }
    else{
        localStorage.setItem('record',0)
}

function loop(){
    requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);
    leftPaddle.y+=leftPaddle.dy;
    rightPaddle.y+=rightPaddle.dy;
    //левая ракетка

    if (leftPaddle.y < grid){
        leftPaddle.y = grid

    }
    else if (leftPaddle.y > maxPaddleYL){
         leftPaddle.y = maxPaddleYL;
    
    } 
    //правая ракетка
    if (rightPaddle.y < grid){
        rightPaddle.y = grid
    }
    else if (rightPaddle.y > maxPaddleYR){
        rightPaddle.y = maxPaddleYR;
    } 
    context.fillStyle = 'pink';
    context.fillRect(leftPaddle.x,leftPaddle.y,leftPaddle.width,leftPaddle.height)
    context.fillRect(rightPaddle.x,rightPaddle.y,rightPaddle.width,rightPaddle.height)
    ball.x += ball.dx
    ball.y += ball.dy 
    leftPaddle.dy = ball.dy
    if (ball.y < grid){
        ball.y = grid;
        ball.dy *= -1;
    }
    else if (ball.y + grid > canvas.height - grid){
        ball.y = canvas.height - grid *2
        ball.dy *= -1
    }
    //
    if ( (ball.x < grid || ball.x > canvas.width) && !ball.resetting){
        ball.resetting = true
        if(count>record){
            record=count;}
        count = 0;
        
        localStorage.setItem('record',record);
        setTimeout(() => {
            ball.resetting = false
            ball.x = canvas.width/2
            ball.y = canvas.height/2
        },1000)
    }
    if (collides(ball,leftPaddle)){
        ball.dx *= -1
        ball.x = leftPaddle.x + leftPaddle.width
    }
    else if (collides(ball,rightPaddle)){
        ball.dx *= -1
        ball.x = rightPaddle.x - ball.width
        count ++
        if(count>=3){
            secret = true
        }
        if(secret){
        secret_count+=1
        if(secret_count%3===0){
            if(ball.dx>0) {ball.dx+=1}
                else {ball.dx-=1}
            if(ball.dy>0) {ball.dy+=1} else {ball.dy-=1}
            ballColor = '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase();

        }
    }
    }   
    //
    context.fillRect(0,0,canvas.width,grid)
    context.fillRect(0,canvas.height-grid,canvas.width,canvas.height)
    context.fillStyle=ballColor;
    context.fillRect(ball.x, ball.y, ball.height, ball.width)  
    for (let i = grid; i<canvas.height - grid; i+= grid *2){
        context.fillRect(canvas.width/2 - grid/2, i ,grid,grid)
    }

    document.addEventListener('keydown', function (e) {
        if (e.which === 38) {
          rightPaddle.dy = -paddleSpeed;
        }
        else if (e.which === 40) {
          rightPaddle.dy = paddleSpeed;
        }
    });
    document.addEventListener('keyup', function (e) {
        if (e.which === 38 || e.which === 40) {
          rightPaddle.dy = 0;
        }
    });
      context.fillStyle = "#f00";
      context.font = "20pt Courier";
      context.fillText('Рекорд: ' + record, 150, 550);
      context.fillText(count, 450, 550);
}

requestAnimationFrame(loop);