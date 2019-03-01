class Pipe {
  constructor(isTop, height) {
    this.width = 85;
    this.height = height;
    this.isTop = isTop;
    this.x = canvas.width;
    if(isTop){
      this.topy = 0;
      this.bottomy = this.height;
    } else {
      this.topy = canvas.height - this.height;
      this.bottomy = canvas.height;
    }
  }

  show() {
    // noStroke();
    // fill(0, 204, 0);
    // rect(this.x, this.topy, this.width, this.height);
    // image(bottomPipeSprite, this.x, this.topy, this.width, this.height);
    if(this.isTop) {
      image(topPipeSprite, this.x, this.topy, this.width, this.height);
    } else {
      image(bottomPipeSprite, this.x, this.topy, this.width, this.height);
    }
  }

  update() {
    this.x -= panSpeed;
  }

  collided(p) {
    if(p.x + p.hs >= this.x && p.x - p.hs <= this.x+this.width) {
      if (!this.isTop && p.y + p.hs >= this.topy) {
        return true;
      }
      if (this.isTop && p.y - p.hs <= this.bottomy) {
        return true;
      }
    }
    return false;
  }

}


class Pipes {
  constructor(firstPipe, previousPipe, upToRandNo) {
    const gap = 215;
    const minDistFromEdge = 100;
    const minDistFromBotEdge = canvas.height - minDistFromEdge - gap - 30;
    const maxPipeDifference = 300;
    this.passed = false;
    if (firstPipe) {
      //first pipes to be in center considering 30 pixels of ground
      this.topHeight = (canvas.height - 30) / 2 - gap/2;
    } else {
      if (randomPipeHeights.length >= upToRandNo) {
        randomPipeHeights.push(floor(random(minDistFromEdge, minDistFromBotEdge)));
      }
      this.topHeight = randomPipeHeights[upToRandNo];
      if (previousPipe) {
        // keep holes possible
        while (abs(this.topHeight - previousPipe.topHeight) > maxPipeDifference) {
          randomPipeHeights[upToRandNo] = floor(random(minDistFromEdge, minDistFromBotEdge));
          this.topHeight = randomPipeHeights[upToRandNo];
        }
      }
    }
    this.bottomHeight = canvas.height - this.topHeight - gap;
    this.bottomPipe = new Pipe(false, this.bottomHeight);
    this.topPipe = new Pipe(true, this.topHeight);
  }

  show() {
    this.bottomPipe.show();
    this.topPipe.show();
  }

  update() {
    this.bottomPipe.update();
    this.topPipe.update();
    this.x = this.topPipe.x + this.topPipe.width;
  }

  offScreen() {
    return this.bottomPipe.x + this.bottomPipe.width < 0;
  }

  playerPassed(px) {
    if(!this.passed && px > this.bottomPipe.x + this.bottomPipe.width) {
      this.passed = true;
      return true;
    }
    return false;
  }

  collided(p) {
    return this.bottomPipe.collided(p) || this.topPipe.collided(p);
  }

  setX(newX) {
    this.bottomPipe.x = newX;
    this.topPipe.x = newX;
  }

}
