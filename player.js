class Player {

  constructor(genome){
    this.x = canvas.width/3;
    this.y = canvas.height/2;
    this.velY = 0;
    // this.velX = 0;
    this.velX = panSpeed;
    this.size = 40;
    this.hs = this.size/2;
    this.dead = false;
    this.isOnGround = false;
    this.lifespan = 0;
    this.score = 0;

    this.brain = genome;
    this.brain.score = 0;
    //Genomesjs
    // this.fitness = 0;
    // this.vision = [];
    // this.decision = [];
    // this.unadjustedFitness;
    // this.bestScore = 0;
    // this.dead = false;
    // this.score = 0;
    // this.gen = 0;
    //
    // this.genomeInputs = 5;
    // this.genomeOutputs = 2;
    // this.brain = new Genome(this.genomeInputs, this.genomeOutputs);
  }

  show() {
    // noStroke();
    // fill(255,255,0);
    // ellipse(this.x, this.y, this.size);
    image(birdSprite, this.x, this.y, this.size, this.size);
  }

  update() {
    if (pipes.playerPassed(this.x - this.hs) || pipes2.playerPassed(this.x - this.hs)) {
      this.score++;
      if (this.score > highscore) {
        highscore = this.score;
      }
    }

    this.velY += gravity;

    let input = this.intel();
    let output = this.brain.activate(input);

    this.flap(output);

    if (!this.dead) {
      this.lifespan++;
      this.brain.score = this.lifespan;
      this.velY = constrain(this.velY, -9999, 30);
    } else {
      this.x -= panSpeed;
      // slow fall punishment ψ(｀∇´)ψ
      this.velY = constrain(this.velY, -9999, 10);
    }
    if (!this.isOnGround) {
      this.y += this.velY;
    }
    if (!this.isOnGround) {
      this.checkCollisions();
    }

  }

  flap(output=1) {
    if(output > 0) {
      if (!this.dead && !this.isOnGround) {
        this.velY = -17;
      }
    }
  }

  checkCollisions() {
    if (!this.dead) {
      gameEnd = false;
      if (pipes.collided(this)) {
        // print('pipe collosion');
        this.dead = true;
        deadCount++;
      }
      if (pipes2.collided(this)) {
        // print('pipe collosion');
        this.dead = true;
        deadCount++;
      }
      if (ground.collided(this)) {
        // print('ground collosion');
        this.dead = true;
        this.isOnGround = true;
        deadCount++;
      }
    }

    if (this.dead && this.velY<0) {
      this.velY = 0;
    }
  }


  intel() {
    let closestPipes = ((pipes.x < pipes2.x && this.x < pipes.x) || this.x > pipes2.x) ? pipes : pipes2;
    let distanceToNextPipe = closestPipes.x - this.x;
    let distanceToTopPipe = this.y - closestPipes.topPipe.bottomy;
    let distanceToBottomPipe =  closestPipes.bottomPipe.topy - this.y;
    return [distanceToNextPipe, distanceToTopPipe, distanceToBottomPipe];
  }
}
