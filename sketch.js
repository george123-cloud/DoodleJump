let bg;
let character;
let startbg;
let platform;
let brokenPlatform;

let buttonStart = {X:300,Y:350,W:200,H:75};
let instructionsBox = {X:150,Y:475,W:500,H:200};
let backButton = {X:650,Y:25,W:120,H:50};
let playAgainButton = {X:300,Y:450,W:200,H:75};

let player = {x:50,y:400,w:100,h:100};
let velocityY = 0;
let gravity = 0.5;
let jumpForce = -18;

let platforms = [];
let score = 0;
let highScore = 0;
let screen = "Start";

function preload(){
  bg = loadImage('background.png');
  character = loadImage('character.png');
  startbg = loadImage('START.png');
  platform = loadImage('platform.png');
  brokenPlatform = loadImage('Broken.png');
}

function setup() {
  createCanvas(800,800);
  createPlatforms();
  startOnPlatform();
}

function draw() {
  background(220);

  if (screen == "Start") startScreen();
  else if (screen == "Game") gameScreen();
  else if (screen == "End") endScreen();
}

function startScreen() {
  background(startbg);

  fill(0);
  textSize(50);
  textAlign(CENTER,CENTER);
  textFont("Oswald");
  text("Doodle Jump", width/2, 200);

  fill(255);
  rect(buttonStart.X,buttonStart.Y,buttonStart.W,buttonStart.H,10);

  fill(0);
  textSize(40);
  text("Start", buttonStart.X + buttonStart.W/2, buttonStart.Y + buttonStart.H/2);

  fill(255);
  rect(instructionsBox.X,instructionsBox.Y,instructionsBox.W,instructionsBox.H,15);

  fill(0);
  textSize(28);
  text("How To Play:", instructionsBox.X + instructionsBox.W/2, instructionsBox.Y + 35);

  textSize(18);
  text(
    "Use LEFT and RIGHT arrow keys to move.\nJump on platforms.\nAvoid broken platforms!\nScore increases the higher you go.",
    instructionsBox.X + instructionsBox.W/2,
    instructionsBox.Y + 120
  );
}

function gameScreen() {
  background(bg);

  movePlayer(7);

  velocityY += gravity;
  player.y += velocityY;

  if (player.y < height/2) {
    let diff = height/2 - player.y;
    score += diff/2;
    player.y = height/2;

    for (let p of platforms) p.y += diff;
  }

  updatePlatforms(platforms);

  for (let p of platforms) {
    if (
      player.x + player.w > p.x &&
      player.x < p.x + p.w &&
      player.y + player.h >= p.y &&
      player.y + player.h <= p.y + p.h
    ) {
      if (!p.broken) {
        player.y = p.y - player.h;
        velocityY = jumpForce;
      } else {
        if (!p.falling) {
          p.falling = true;
          p.fallTime = millis();
        }

        if (millis() - p.fallTime < 500) {
          player.y = p.y - player.h;
          velocityY = 0;
        }
      }
    }
  }

  for (let p of platforms) {
    if (p.broken) image(brokenPlatform,p.x,p.y,p.w,p.h);
    else image(platform,p.x,p.y,p.w,p.h);
  }

  image(character, player.x, player.y, player.w, player.h);

  fill(0);
  textSize(30);
  textAlign(LEFT,TOP);
  text("Score: " + floor(score), 20,20);
  text("High Score: " + floor(highScore), 20,60);

  if (player.y > height) screen = "End";

  fill(255,0,0);
  rect(backButton.X,backButton.Y,backButton.W,backButton.H,10);

  fill(0);
  textAlign(CENTER,CENTER);
  textSize(20);
  text("Back", backButton.X + backButton.W/2, backButton.Y + backButton.H/2);

  if (player.x < 0) player.x = 0;
  if (player.x + player.w > width) player.x = width - player.w;
}

function endScreen() {
  background(0);

  if (score > highScore) highScore = score;

  fill(255);
  textAlign(CENTER,CENTER);
  textSize(60);
  fill('red');
  text("Game Over", width/2,250);

  fill(255);
  textSize(40);
  text("Score: " + floor(score), width/2,350);
  text("High Score: " + floor(highScore), width/2,400);

  fill('red');
  rect(playAgainButton.X,playAgainButton.Y,playAgainButton.W,playAgainButton.H,10);

  fill(0);
  textSize(30);
  text("Play Again", playAgainButton.X + playAgainButton.W/2, playAgainButton.Y + playAgainButton.H/2);
}

function movePlayer(speed) {
  if (keyIsDown(LEFT_ARROW)) player.x -= speed;
  if (keyIsDown(RIGHT_ARROW)) player.x += speed;
}

function updatePlatforms(list) {
  for (let p of list) {

    if (p.broken && p.falling) {
      p.y += 5;
    }

    if (p.y > height) {
      p.y = random(-100,-50);
      p.x = random(50,width-100);
      p.falling = false;
      p.fallTime = 0;
    }
  }
}

function createPlatforms() {
  platforms = [];

  for (let i = 0; i < 6; i++) {
    platforms.push({
      x: random(50,650),
      y: i * 120,
      w: 100,
      h: 20,
      broken: false
    });
  }

  for (let i = 0; i < 3; i++) {
    platforms.push({
      x: random(50,650),
      y: random(0,height/2),
      w: 150,
      h: 30,
      broken: true,
      falling: false,
      fallTime: 0
    });
  }
}

function startOnPlatform() {
  let lowest = platforms[0];

  for (let p of platforms) {
    if (p.y > lowest.y && !p.broken) lowest = p;
  }

  player.x = lowest.x;
  player.y = lowest.y - player.h;
}

function mousePressed() {
  if (
    mouseX > buttonStart.X && mouseX < buttonStart.X + buttonStart.W &&
    mouseY > buttonStart.Y && mouseY < buttonStart.Y + buttonStart.H
  ) screen = "Game";

  if (screen === "Game") {
    if (
      mouseX > backButton.X && mouseX < backButton.X + backButton.W &&
      mouseY > backButton.Y && mouseY < backButton.Y + backButton.H
    ) screen = "Start";
  }

  if (screen === "End") {
    if (
      mouseX > playAgainButton.X && mouseX < playAgainButton.X + playAgainButton.W &&
      mouseY > playAgainButton.Y && mouseY < playAgainButton.Y + playAgainButton.H
    ) {
      score = 0;
      velocityY = 0;
      player.x = 50;
      createPlatforms();
      startOnPlatform();
      screen = "Game";
    }
  }
}