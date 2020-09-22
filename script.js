var marioSize = 60;
var marioX;
var marioY;
var marioVelocity;
var marioXSpeed = 4;
var platformWidth = 85;
var platformHeight = 15;
var numOfPlatforms = 5;
var platformList = [];
var platYChange = 0;
var gameStarted;
var score = 0;
var highScore = 0;
var marioLeftImg;
var marioRightImg;
var platformImg;
var backgroundImg;

//  Preload the Image Sprites

function preload() {
  backgroundImg = loadImage("images/bg.jpg");
  marioLeftImg = loadImage("images/marleft.png");
  marioRightImg = loadImage("images/marright.png");
  platformImg = loadImage("images/brick.png");
}

//  Controllers

function setup() {
  createCanvas(400, 600);
  frameRate(60);
  gameStarted = false;
}

function draw() {
  background(247, 239, 231);
  image(backgroundImg, 0, 0, 400, 600);
  if (gameStarted == true) {
    //Set up and draw the game
    drawPlatforms();
    drawmario();
    checkCollision();
    movemario();
    moveScreen();
  } else {
    // Start menu
    fill(0);
    textSize(60);
    text("Start", 140, 275);
    textSize(30);
    text("Score: " + score, 150, 325);
    textSize(20);
    text("High Score: " + highScore, 150, 360);
  }
}

function moveScreen() {
  if (marioY < 250) {
    platYChange = 3;
    marioVelocity += 0.25;
  } else {
    platYChange = 0;
  }
}

// Start Game
function mousePressed() {
  if (gameStarted == false) {
    score = 0;
    setupPlatforms();
    marioY = 350;
    marioX = platformList[platformList.length - 1].xPos + 15;
    marioVelocity = 0.1;
    gameStarted = true;
  }
}

//  mario

function drawmario() {
  fill(204, 200, 52);
  image(marioLeftImg, marioX, marioY, marioSize, marioSize);
}

function movemario() {
  // mario falls with gravity
  marioVelocity += 0.2;
  marioY += marioVelocity;

  if (keyIsDown(LEFT_ARROW)) {
    marioX -= marioXSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    marioX += marioXSpeed;
  }
}

//  Platforms

function setupPlatforms() {
  for (var i = 0; i < numOfPlatforms; i++) {
    var platGap = height / numOfPlatforms;
    var newPlatformYPosition = i * platGap;
    var plat = new Platform(newPlatformYPosition);
    platformList.push(plat);
  }
}

function drawPlatforms() {
  fill(106, 186, 40);
  platformList.forEach(function (plat) {
    // move all platforms down
    plat.yPos += platYChange;
    image(platformImg, plat.xPos, plat.yPos, plat.width, plat.height);

    if (plat.yPos > 600) {
      score++;
      platformList.pop();
      var newPlat = new Platform(0);
      platformList.unshift(newPlat); // add to front
    }
  });
}

function Platform(newPlatformYPosition) {
  this.xPos = random(15, 300);
  this.yPos = newPlatformYPosition;
  this.width = platformWidth;
  this.height = platformHeight;
}

//  Collisions

function checkCollision() {
  platformList.forEach(function (plat) {
    if (
      marioX < plat.xPos + plat.width &&
      marioX + marioSize > plat.xPos &&
      marioY + marioSize < plat.yPos + plat.height &&
      marioY + marioSize > plat.yPos &&
      marioVelocity > 0
    ) {
      marioVelocity = -10;
    }
  });

  if (marioY > height) {
    if (score > highScore) {
      highScore = score;
    }
    gameStarted = false;
    platformList = [];
  }

  // screen wraps from left to right
  if (marioX < -marioSize) {
    marioX = width;
  } else if (marioX > width) {
    marioX = -marioSize;
  }
}
