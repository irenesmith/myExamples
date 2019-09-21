const NUM_SIDES = 6;
var picPath = '';

export class Dice {
// Initialize the dice
  constructor(numDice) {
    // ------------------------------------
    // dice is an array of objects.
    // Each object has three fields:
    //   id -    a number from 0 to 4
    //   keep -  a boolean value which,
    //           if true, means the user
    //           doesn't want to roll this
    //           die again.
    //   value - The value from 1 to 6
    // ------------------------------------
    let dice = [];

    for (let i = 0; i < numDice; i++) {
      dice[i] = { id: i, keep: false, value: i + 1 };
    }
    return dice;
  }

  rollDice(path, dice) {
    // roll the dice but only those not marked to keep
    for (let i = 0; i < dice.length; i++) {
      if (!dice[i].keep) {
        let dieVal = Math.floor(Math.random() * NUM_SIDES + 1);
        dice[i].value = dieVal;
        dice[i].keep = false;
        document.getElementById(dice[i].id).setAttribute('src', path + dieVal + '.png');
      }
    }
  }
}
