import {Player} from './player.js';
import {Dice} from './dice.js';

// Global constants
const NUM_DICE = 3;
const MAX_MOVES = 13;
const MAX_ROLLS = 2;
const rollButton = document.getElementById('roll-button');
const ERR_SCORE_ONCE = 'You can only enter a score in this box once.';
const ERR_MUST_SCORE = 'You must select a box to post your score.';
const ERR_ROLL_FIRST = 'You must roll the dice before you can post a score.';
const PLEASE_ROLL = 'Please roll the dice.';
const ROLL_AGAIN = 'Please roll again or select the item you wish to score.';
const SELECT_SCORE = 'Please select the item you wish to score.';

// Global variables
var isPlaying = false;
var currentPlayer = 1;
var playerMoves = [0, 0, 0, 0];
var rollCount = 0;
var numPlayers = 4;

var dice = [];

var players = [];

window.onload = (e) => {
  // Initialize the dice
  dice = new Dice(NUM_DICE);

  // Add listeners for the dice UI
  for (let i = 0; i < NUM_DICE; i++) {
    document.getElementById(i).addEventListener('click', e => {
      if (dice[e.target.id].keep) {
        dice[e.target.id].keep = false;
        e.target.setAttribute('class', 'die');
      } else {
        dice[e.target.id].keep = true;
        e.target.setAttribute('class', 'keep');
      }
    });
  }

  // Add a listener to the Roll button.
  document.getElementById('btn-roll').addEventListener('click', rollClick);
};

function init_game() {
  for (let i = 0; i < 4; i++) {
    var player = new Player('Player ' + i.toString());
    document.getElementById('player' + i.toString()).textContent = player.name;
  }
}

function rollClick() {
  if (rollCount >= MAX_ROLLS) {
    alert(ERR_MUST_SCORE);
    return;
  }

  rollDice('../img/dice', NUM_DICE, dice);
  rollCount++;

  rollCount === MAX_ROLLS ? document.getElementById('rolls').textContent = SELECT_SCORE : document.getElementById('rolls').textContent = ROLL_AGAIN;

}
