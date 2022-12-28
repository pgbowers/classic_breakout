// Nov 25,2022: from the MDN game tutorial at 
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
// and from Chris DeLeon's tutorial.
// Game over routines are mine.
// Finished for now and playable on Dec 28, 2022.

//todo 1 - Make modal windows for the Startup, Quit and Game Over screens
//todo 2 - Make some bricks a different colour with higher score
//todo 3 - Add sounds

var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');

// This sets the canvas size to the entire window size.
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

var x = canvas.width/2;
var y = canvas.height/2;
var ball_speed = 7;

// dx and dy are the speed and angle of the ball movement
var dx = ball_speed * (Math.random() * 2 - 1); //Random upward trajectory
var dy = -5.0;
var ballRadius = 12;
var paddleHeight = 24;
var paddleWidth = 104;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var paddleSpeed = 7;
var score = 0;
var lives = 3;
var playing = false;
var requestId = undefined;

// Defining the bricks
var brickRowCount = 9;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 40;
var brickOffsetLeft = 35;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);

function play() {  
    //! Dec 27 - clear the canvas before starting
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!playing){
        score = 0;
        lives = 3;

        //! Starting position of the ball
        x = canvas.width/2;
        y = canvas.height/2;      
        
        //! Dec 27 reset the bricks properly
        for ( var c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x:0, y: 0, status: 1 };
            }
        }
        draw();     
    };
    playing = true;
}

function stopGame() {
    // Erase the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Stop all motion
    if (requestId) {        
        window.cancelAnimationFrame(requestId);
        requestId = undefined;
    } 
    playing = false;  
}

function quit(){    
    score = 0;
    lives = 3;

    stopGame();    
   
    ctx.fillStyle = 'blue';
    ctx.font = "50px serif";                    
    ctx.textAlign = 'center'; 
    ctx.fillText("THANKS FOR PLAYING!", canvas.width/2, canvas.height/2);  
}

function mouseMoveHandler(event) {
    // offsetLeft: number of pixels that canvas is offset to the left from the parent.
    var relativeX = event.clientX - canvas.offsetLeft;               
    if (relativeX > 0 && relativeX < canvas.width) {   
        paddleX = relativeX - paddleWidth/2;
    }
}

var bricks = [];
for ( var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x:0, y: 0, status: 1 };
    }
}

function drawLives(){
    ctx.font = "24px Arial";
    ctx.fillStyle = "red";
    ctx.fillText('Lives: ' + lives, canvas.width - (canvas.width -700), canvas.height - 570);    
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            // Don't draw a brick if the ball is in collision
            if (bricks[c][r].status == 1) {
            // Calculate position to draw each new brick
            var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;            
            var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;

            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;

            // Draw a brick            
            var brick = new Image();
            brick.src = "assets/PURPLEBRICK.png";
            ctx.drawImage(brick, brickX, brickY);            
            }
        }
    }
}

function keyDownHandler(event) {
    if (event.key === 'Right' || event.key === "ArrowRight"){
        rightPressed = true;
    } else if ( event.key === "Left" || event.key === "ArrowLeft"){
        leftPressed = true;
    }     
}

function keyUpHandler(event) {
    if (event.key === 'Right' || event.key === "ArrowRight"){
        rightPressed = false;
    } else if ( event.key === "Left" || event.key === "ArrowLeft"){
        leftPressed = false;
    }
}

function drawBall(){
    //var ball = new Image();
    //ball.src = "assets/PURPLEBALL.png";
    //ctx.drawImage(ball, x, y);
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath(); 
}

function drawPaddle(){    
    var paddle = new Image();
    paddle.src = "assets/REDPADDLEM.png";
    ctx.drawImage(paddle, paddleX, canvas.height - paddleHeight);   
}

function drawScore() {    
    ctx.font = "24px Arial";
    ctx.fillStyle = "red";

    //! Dec27 - added this line to stop the score and lives from shifting left when restarting
    ctx.textAlign = "left"

    ctx.fillText('Score: ' + score, canvas.width - 780, canvas.height - 570);
}

function brickCollision(){
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            // Calculations
            if (b.status == 1) {
                if (x > b.x && 
                    x < b.x + brickWidth && 
                    y > b.y && 
                    y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                }   
            if (score == brickRowCount * brickColumnCount){                
                stopGame();
               
                ctx.fillStyle = 'blue';
                ctx.font = "50px serif";                    
                ctx.textAlign = 'center'; 
                ctx.fillText("WINNER!", canvas.width/2, canvas.height/2);                                                           
            }
                
            }
        }
    }
}

function bouncing(){
    // Bounce off both sides
    if( x + dx > canvas.width - ballRadius || x + dx < ballRadius){    
        dx = -dx; 
    }
    // Bounce off the top
    if (y + dy < 0){
        dy = -dy;     
    }    
    // If the ball gets near the bottom of the canvas
    else if (y + dy > canvas.height - paddleHeight){         
        // and the ball is over the paddle   
        if( x > paddleX && x < paddleX + paddleWidth && y + dy > canvas.height - paddleHeight *2){
            // bounce off the top of the paddle           
            dy = -ball_speed;

            //! Dec 21. 2022 - copied from Deleon's code, finally working!
            // bounce left or right depending on where the ball hits the paddle
            var centerOfPaddleX = paddleX + paddleWidth/2;
            var ballDistFromPaddleCenterX = x - centerOfPaddleX;
            dx = ballDistFromPaddleCenterX * 0.25;

        }else{
            // If the ball missed the paddle            
            if(lives > 1) {
                // Spawn a new ball and play again
                x = canvas.width / 2;
                y = canvas.height / 2;
                dx = ball_speed * (Math.random() * 2 - 1); //Random upward trajectory                
                dy = -5.0;
                paddleX = (canvas.width - paddleWidth) / 2; 
                lives--;      
                        
            }else{               
                stopGame();           
                
                ctx.fillStyle = 'red';
                ctx.font = "50px Arial";                    
                ctx.textAlign = 'center'; 
                ctx.fillText("GAME OVER!", canvas.width/2, canvas.height/2); 
                ctx.fillText("Your score was: " + score, canvas.width/2, canvas.height/2 + 60);                                                            
                                      
            }                
        }               	            
       
    }    

}
function draw() {
    // Drawing code
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();    
    drawLives();
    drawBricks();
    drawBall();
    drawPaddle(); 
         
    // Move the ball every frame
    if (rightPressed) {
        paddleX = Math.min(paddleX + paddleSpeed, canvas.width - paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - paddleSpeed, 0);
    } 
    x += dx;
    y += dy;  
    // Start moving
    requestId = requestAnimationFrame(draw);
    
    bouncing();
    //! Dec 27 - moved brickcCollision down here
    brickCollision();
}     