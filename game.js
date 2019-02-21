const panSpeed = 4;
const gravity = 1;

let player;
let pipes;
let pipes2;
let ground;

let end = false;
let pipeCount = 0;
let randomPipeHeights = [];

function setup() {
  window.canvas = createCanvas(600,800);
  player = new Player();
  pipes = new Pipes(true);
  pipes2 = new Pipes(false, pipes, pipeRandomNo);
  pipes2.setX(1.5 * canvas.width + pipes2.topPipe.width/2);
  ground = new Ground();
  end = false;
}

function draw() {
  background(135,206,250); // blue sky!
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
}

function writeInfo() {
  fill(255);
  stroke(255);
  textSize(50);
  textAlign(CENTER);
  text(player.score, canvas.width / 2, 50);
}

function keyPressed() {
  console.log(key);
  switch (key) {
    case ' ': //play
      player.flap();
      break;
    case 'Enter': //new game
      setup();
      break;
  }
}

function showAll() {
  pipes.show();
  pipes2.show();
  player.show();
  ground.show();
}

function updateAll() {
  if (!end) {
    pipes.update();
    pipes2.update();
    ground.update();
  }
  player.update();
}
