var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
function paddle(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedModifier = 0;
    this.hasCollidedWith = function(ball){
        var paddleLeftWall = this.x;
        var paddleRightWall = this.x + this.width;
        var paddleTopWall = this.y;
        var paddleBottomWall = this.y + this.height;
        if(ball.x > paddleLeftWall
            && ball.x < paddleRightWall
            && ball.y > paddleTopWall
            && ball.y < paddleBottomWall
        ){
            return true;
        }
        return false;
    }
    this.move = function(keyCode){
        var nextY = this.y;
        if(keyCode == 40){
            nextY += 5;
            this.speedModifier = 1.5;
        } else if(keyCode == 38){
            nextY += -5;
            this.speedModifier = 1.5;
        } else {
            this.speedModifier = 0;
        }
        nextY = nextY < 0 ? 0 : nextY;
        nextY = nextY + this.height > 480 ? 480 - this.height : nextY;
        this.y = nextY;
    }
}
var player = new paddle(5, 200, 25, 100);
var ai = new paddle(610, 200, 25, 100);
var gamePaused = false;
var player1Score = 0;
var player2Score = 0;
var player1Hearts = 3;
var player2Hearts = 3;

function updateScoreDisplay() {
    document.getElementById("player1score").textContent = "Player 1 Score: " + player1Score;
    document.getElementById("player2score").textContent = "Player 2 Score: " + player2Score;
    document.getElementById("player1hearts").textContent = "Player 1 Hearts: " + "❤".repeat(player1Hearts);
    document.getElementById("player2hearts").textContent = "Player 2 Hearts: " + "❤".repeat(player2Hearts);
}
var ball = { 
    x: 320, y: 240, radius: 3, xspeed: 2, yspeed: 0,
    reverseX: function(){
        this.xspeed *= -1;
    },
    reverseY: function(){
        this.yspeed *= -1;
    },
    reset: function(missedPlayer){
        var gameOverMessage = document.getElementById("gameOverMessage");
        if (missedPlayer === 1) {
            player1Hearts--;
            player2Score++;
            gameOverMessage.innerText = "Player 2 scored!";
        } else {
            player2Hearts--;
            player1Score++;
            gameOverMessage.innerText = "Player 1 scored!";
        }
        
        updateScoreDisplay();
        
        if (player1Hearts === 0 || player2Hearts === 0) {
            gameOverMessage.innerText = (player1Hearts === 0 ? "Player 2" : "Player 1") + " wins the game!";
            gamePaused = true;
            setTimeout(function() {
                // Reset everything for a new game
                player1Hearts = 3;
                player2Hearts = 3;
                player1Score = 0;
                player2Score = 0;
                updateScoreDisplay();
                gameOverMessage.innerText = "";
                gamePaused = false;
            }, 5000);
        } else {
            gamePaused = true;
            setTimeout(function() {
                gameOverMessage.innerText = "";
                gamePaused = false;
            }, 5000);
        }
        
        this.x = 320;
        this.y = 240;
        this.xspeed = 2;
        this.yspeed = 0;
    },
    isBouncing : function(){
        return ball.yspeed != 0;
    },
    modifyXSpeedBy: function(modification){
        modification = this.xspeed < 0 ? modification * -1 : modification;
        var nextValue = this.xspeed + modification;
        nextValue - Math.abs(nextValue) > 9 ? 9 : nextValue;
        this.xspeed = nextValue;
    },
    modifyYSpeedBy: function(modification){
        modification = this.yspeed < 0 ? modification * -1 : modification;
        this.yspeed += modification;
    }
}
function tick(){
    if (!gamePaused) {
        updateGame();
        draw();
    }
    window.setTimeout("tick()", 1000/60);
}

// Initialize score display
updateScoreDisplay();
function updateGame(){
    ball.x += ball.xspeed;
    ball.y += ball.yspeed;
    if(ball.x <= 0){
        ball.reset(1); // Player 1 missed
    } else if(ball.x >= 640){
        ball.reset(2); // Player 2 missed
    }
    if(ball.y <= 0 || ball.y >= 480){
        ball.reverseY();
    }
    var collidedWithPlayer = player.hasCollidedWith(ball);
    var collidedWithAi = ai.hasCollidedWith(ball);
    if(collidedWithPlayer || collidedWithAi){
        ball.reverseX();
        ball.modifyXSpeedBy(0.25);
        var speedUpValue = collidedWithPlayer ? player.speedModifier : ai.speedModifier;
        ball.modifyYSpeedBy(speedUpValue);
    }
    for(var keyCode in heldDown){
        player.move(keyCode);
    }
    var aiMiddle = ai.y + (ai.height / 2);
    if(Math.random() < 0.40) {
        // Move in the wrong direction
        if(aiMiddle < ball.y){
            ai.move(38); // Move up instead of down
        } else {
            ai.move(40); // Move down instead of up
        }
    } else {
        // Normal movement
        if(aiMiddle < ball.y){
            ai.move(40);
        }
        if(aiMiddle > ball.y){
            ai.move(38);
        }
    }
}
function draw(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 640, 480);
    renderPaddle(player);
    renderPaddle(ai);
    renderBall(ball)
}
function renderPaddle(paddle){
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}
function renderBall(ball){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
}
var heldDown = {};
window.addEventListener("keydown", function(keyInfo){heldDown[event.keyCode] = true;}, false);
window.addEventListener("keyup", function(keyInfo){delete heldDown[event.keyCode];}, false);
tick();