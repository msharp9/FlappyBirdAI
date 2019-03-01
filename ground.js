class Ground {
  constructor() {
    this.width = canvas.width;
    this.height = 30;
    this.x = 0;
    this.y = canvas.height - this.height;
  }

  show() {
    fill(130, 102, 68); //brown dirt
    rect(this.x, this.y, this.width, this.height);
  }

  update() {
    //pass
  }

  collided(p) {
    return p.y + p.hs >= this.y;
  }
}
