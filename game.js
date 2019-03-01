const panSpeed = 4;
const gravity = 1;


let player;
let pipes;
let pipes2;
let ground;

let timestep
  ,highscore
  ,players
  ,deadCount
  ,gameEnd
  ,pipeCount
  ,randomPipeHeights;

let birdSprite
  ,backgroundSprite
  ,topPipeSprite
  ,bottomPipeSprite;

function preload() {
  birdSprite = loadImage("img/bird.png");
  topPipeSprite = loadImage("img/pipetop.png");
  bottomPipeSprite = loadImage("img/pipebottom.png");
  backgroundSprite = loadImage("img/background.png");
}

initNeat();

function setup() {
  let myCanvas = createCanvas(600,800);
  myCanvas.parent('game'); 
  gameEnd = false;
  highscore = 0;
  timestep = 0;
  pipeCount = 0;
  deadCount = 0;
  randomPipeHeights = [];

  pipes = new Pipes(true);
  pipes2 = new Pipes(false, pipes, pipeCount);
  pipes2.setX(1.5 * canvas.width + pipes2.topPipe.width/2);
  ground = new Ground();

  startEvaluation();
}

function draw() {
  // background(135,206,250); // blue sky!
  image(backgroundSprite, 0, 0, canvas.width, canvas.height);
  showAll();
  updateAll();
  writeInfo();

  if (pipes.offScreen()) {
    pipes = new Pipes(false, pipes2, pipeCount);
    pipeCount++;
  }
  if (pipes2.offScreen()) {
    pipes2 = new Pipes(false, pipes, pipeCount);
    pipeCount++;
  }

  timestep++;

  if(gameEnd) {
    endEvaluation();
    setup();
  }
}

function writeInfo() {
  fill(255);
  stroke(255);
  textSize(50);
  textAlign(CENTER);
  text(highscore, canvas.width / 2, 50);
}

// function keyPressed() {
//   console.log(key);
//   switch (key) {
//     case ' ': //play
//       player.flap();
//       break;
//     case 'Enter': //new game
//       setup();
//       break;
//   }
// }

function showAll() {
  pipes.show();
  pipes2.show();
  ground.show();
  showPlayers();
}

function updateAll() {
  if (!gameEnd) {
    pipes.update();
    pipes2.update();
    ground.update();
  }
  updatePlayers();
}

function updatePlayers() {
  players.map( player => {
    player.update();
  });
  if(deadCount >= players.length) {
    gameEnd = true;
  }
}

function showPlayers() {
  players.map( player => {
    player.show();
  });
}
