export class Character {
  constructor(tileW, tileH) {
    this.tileFrom = [1, 1];
    this.tileTo = [1, 2];
    this.timeMoved = 0;
    this.dimensions = [30, 30];
    this.position = [45, 45];
    this.delayMove = 700;
    this.tileW = tileW;
    this.tileH = tileH;
  }

  placeAt(x, y) {
    this.tileFrom = [x, y];
    this.tileTo = [x, y];
    this.position = [
      ((this.tileW * x) + ((this.tileW - this.dimensions[0]) / 2)),
      ((this.tileH * y) + ((this.tileH - this.dimensions[1]) / 2))
    ];
  }

  processMovement(t) {
    if(this.tileFrom[0] === this.tileTo[0] &&
      this.tileFrom[1] === this.tileTo[1]) {
        return false;
      } else {
        if((t - this.timeMoved) >= this.delayMove) {
          this.placeAt(this.tileTo[0], this.tileTo[1]);
        } else {
          this.position[0] = (this.tileFrom[0] * this.tileW) +
            ((this.tileW - this.dimensions[0]) / 2);
          this.position[1] = (this.tileFrom[1] * this.tileH) +
            ((this.tileH - this.dimensions[1]) / 2);

          if(this.tileTo[0] != this.tileFrom[0]) {
            // Character is moving on the x axis.
            let diff = (this.tileW / this.delayMove) * (t - this.timeMoved);
            this.position[0] += (this.tileTo[0] < this.tileFrom[0] ?
              0 - diff : diff);
          }

          if (this.tileTo[1] != this.tileFrom[1]) {
            // Character is moving on the x axis.
            let diff = (this.tileH / this.delayMove) * (t - this.timeMoved);
            this.position[1] += (this.tileTo[1] < this.tileFrom[1] ?
              0 - diff : diff);
          }

          // Round values to the nearest tile
          this.position[0] = Math.round(this.position[0]);
          this.position[1] = Math.round(this.position[1]);

        }

        return true;
      }
  }

}