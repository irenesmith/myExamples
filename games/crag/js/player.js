export class Player {
  constructor(name) {
    this.name = name;
    this.scores = new Array(13);
  }

  initScores() {
    for (let i = 0; i < this.scores.length; i++) {
      this.scores[i] = 0;
    }
  }

  getTotal() {
    let sum = 0;
    for (let i = 0; i < this.scores.length; i++) {
      sum += this.scores[i];
    }

    return sum;
  }
}
