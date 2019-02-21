class Player {

  constructor(){
    this.x = canvas.width/3;
    this.y = canvas.height/2;
    this.velY = 0;
    // this.velX = 0;
    this.velX = panSpeed;
    this.size = 40;
    this.hs = this.size/2;
    this.dead = false;
    this.isOnGround = false;
    this.deadCount = 0;
    this.score = 0;

    //Genomesjs
    // this.fitness = 0;
    // this.vision = [];
    // this.decision = [];
    // this.unadjustedFitness;
    // this.lifespan = 0;
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
    noStroke();
    fill(255,255,0);
    ellipse(this.x, this.y, this.size);
  }

  move() {

  }

  update() {
    if (pipes.playerPassed(this.x - this.hs) || pipes2.playerPassed(this.x - this.hs)) {
      this.score++;
    }

    this.velY += gravity;
    if (!this.dead) {
      this.velY = constrain(this.velY, -9999, 30);
    } else {
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

  flap() {
    if (!this.dead && !this.isOnGround) {
      this.velY = -17;
    }
  }

  checkCollisions() {
    if (!this.dead) {
      end = false;
    }
    if (pipes.collided(this)) {
      // print('pipe collosion');
      this.dead = true;
      end = true;
    }
    if (pipes2.collided(this)) {
      // print('pipe collosion');
      this.dead = true;
      end = true;
    }
    if (ground.collided(this)) {
      // print('ground collosion');
      this.dead = true;
      this.isOnGround = true;
      end = true;
    }
    if (this.dead && this.velY<0) {
      this.velY = 0;
    }
  }

}
