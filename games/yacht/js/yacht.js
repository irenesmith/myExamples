// Global constants
const NUM_DICE = 5;
const NUM_SIDES = 6;
const MAX_MOVES = 13;
const rollButton = document.getElementById('roll-button');
const errScoreOnce = 'You can only enter a score in this box once.';
const errMustScore = 'You must select a box to post your score.';
const errRollFirst = 'You must roll the dice before you can post a score.';

// Global variables
var isPlaying = false;
var currentPlayer = 1;
var playerMoves = [0, 0, 0, 0];
var rollCount = 0;

const dice = [];

window.onload = (e) => {
  // Add listeners to the dice
  for(let i = 0; i < NUM_DICE; i++) {
    document.getElementById(i).addEventListener('click', e => {
      if (dice[e.target.id].keep) {
        dice[e.target.id].keep = false;
        e.target.setAttribute('class', '');
      } else {
        dice[e.target.id].keep = true;
        e.target.setAttribute('class', 'keep');
      }
    });
  }

  for(let i = 1; i <= 6; i++) {
    document.getElementById('s' + i).addEventListener('click', score);
  }
  document.getElementById('3kind').addEventListener('click', score);
  document.getElementById('4kind').addEventListener('click', score);
  document.getElementById('sstraight').addEventListener('click', score);
  document.getElementById('lstraight').addEventListener('click', score);
  document.getElementById('full-house').addEventListener('click', score);
  document.getElementById('yacht').addEventListener('click', score);
  document.getElementById('chance').addEventListener('click', score);  

  rollButton.addEventListener('click', function(e) {
    if (!isPlaying) {
      initGame();
    } else {
      rollDice();
    }
  });
};

function initGame() {
  isPlaying = true;
  rollButton.textContent = "Roll";
  currentPlayer = 1;
  initDice();
  clearScoreCard();
}

function initDice() {
  for(let i = 0; i < NUM_DICE; i++) {
    dice[i] = { id: i, keep: false, value: i + 1 };
  }
}

function clearScoreCard() {

}

function rollDice() {
  if(rollCount >= 3) {
    alert(errMustScore);
    return;
  }

  rollCount++;
  document.getElementById('rolls').textContent = rollCount;

  // roll the dice
  for(let i = 0; i < NUM_DICE; i++) {
    if(!dice[i].keep) {
      let dieVal = Math.floor(Math.random() * NUM_SIDES + 1);
      dice[i].value = dieVal;
      dice[i].keep = false;
      document.getElementById(dice[i].id).setAttribute('src', 'img/' + dieVal + '.png');
    }
  }
}

function score(e) {
  // Just in case the player tries to score on
  // the previous player's dice.
  if(rollCount < 1) {
    alert(errRollFirst);
    return;
  }

  let scoreVal = 0;

  // Pull of the part of the element name that
  // tells us what the player is trying to score
  let scoreStr = (e.target.id).substring(0,1) != 'p' ?
    e.target.id : (e.target.id).substring(3);
  
  // Get the score value (which could be 0) for
  // the box on which the player clicked.
  switch(scoreStr) {
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
      scoreVal = scoreNum(parseInt(scoreStr, 10));
      break;
    case '3kind':
      scoreVal = scoreThreeKind();
      break;
    case '4kind':
      scoreVal = scoreFourKind();
      break;
    case 'full-house':
      scoreVal = scoreFullHouse();
      break;
    case 'sstraight':
      scoreVal = scoreSStraight();
      break;
    case 'lstraight':
      scoreVal = scoreLStraight();
      break;
    case 'yacht':
      scoreVal = scoreYacht();
      break;
    case 'chance':
      scoreVal = scoreChance();
      break;
  }

  // It doesn't matter which of the columns the
  // player clicked on. Just select the correct
  // box to add the score for that player.
  let scoreBoxId = 'p' + currentPlayer + '-' + scoreStr;
  let scoreBox = document.getElementById(scoreBoxId);

  // If they play more than one game, the score
  // boxes will have empty strings rather than
  // undefined, so check for both.
  if(scoreBox.innerText === '' || scoreBox.innerText == undefined) {
    scoreBox.innerText = scoreVal;
    sumTop();
    sumBottom();
    sumGrandTotal();
    playerMoves[currentPlayer] += 1;

    nextPlayer();
    clearHold();
  } else {
    alert(errScoreOnce);
  }
}

function checkValue(elementId) {
  let temp = 0;
  if (document.getElementById(elementId).textContent != undefined) {
    temp = parseInt(document.getElementById(elementId).textContent);
  }
  return isNaN(temp) ? 0 : temp;
}

function sumTop() {
  let sum = 0, temp = 0;
  for(let i = 0; i < 6; i++) {
    let scoreBoxId = 'p' + currentPlayer + '-' + (i + 1);
    sum += checkValue(scoreBoxId);
  }

  // Fill in the top sub-total
  document.getElementById('p' + currentPlayer + '-sub-total').textContent = sum;

  // If the sub-total is equal to or more than 63
  // add 35 points to the top total
  if(sum >= 63) {
    document.getElementById('p' + currentPlayer + '-bonus').textContent = 35;
    sum += 35;
  }

  // Now fill in the top total
  document.getElementById('p' + currentPlayer + '-top-total').textContent = sum;
}

function sumBottom() {
  let sum = 0;

  sum = checkValue('p' + currentPlayer + '-3kind');
  sum += checkValue('p' + currentPlayer + '-4kind');
  sum += checkValue('p' + currentPlayer + '-full-house');
  sum += checkValue('p' + currentPlayer + '-sstraight');
  sum += checkValue('p' + currentPlayer + '-lstraight');
  sum += checkValue('p' + currentPlayer + '-yacht');
  sum += checkValue('p' + currentPlayer + '-chance');

  document.getElementById('p' + currentPlayer + '-bottom-total').textContent = sum > 0 ? sum : '';
}

function sumGrandTotal() {
  let sum = checkValue('p' + currentPlayer + '-top-total');
  sum += checkValue('p' + currentPlayer + '-bottom-total');

  document.getElementById('p' + currentPlayer + '-grand-total').textContent = sum;
  document.getElementById('p' + currentPlayer + 'Total').textContent = sum;
}

function countDice() {
  let diceCount = [0, 0, 0, 0, 0, 0];

  for (let i = 0; i < NUM_DICE; i++) {
    diceCount[dice[i].value - 1] += 1;
  }
  return diceCount;
}

function scoreNum(n) {
  let sum = 0;
  for(let i = 0; i < NUM_DICE; i++) {
    if(dice[i].value == n) {
      sum += n;
    }
  }
  return sum;
}

function scoreThreeKind() {
  let diceCount = countDice();

  // Looks for 3, 4, or 5 of a kind.
  let sum = 0;
  for(let i = 0; i < 6; i++) {
    if(diceCount[i] >= 3) {
      for(let i = 0; i < NUM_DICE; i++) {
        sum += dice[i].value;
      }
    }
  }
  return sum;
}

function scoreFourKind() {
  let diceCount = countDice();

  // Looks for 4 or 5 of a kind.
  let sum = 0;
  for (let i = 0; i < 6; i++) {
    if (diceCount[i] >= 4) {
      for (let i = 0; i < NUM_DICE; i++) {
        sum += dice[i].value;
      }
    }
  }
  return sum;
}

function scoreFullHouse() {
  let diceCount = countDice();

  if ((diceCount.indexOf(3) > -1) && (diceCount.indexOf(2) > -1)) {
    return 25;
  }
 
  return 0;
}

function scoreYacht() {
  let diceCount = countDice();

  // Now check for five of a kind
  if (diceCount.indexOf(5) > -1) {
    return 50;
  } else {
    return 0;
  }
}

function scoreSStraight() {
  let diceCount = countDice();
  let lower = true;
  let middle = true;
  let upper = true;

  // check lower then middle then upper
  for (let i = 1; i <= 4; i++) if (dice[i] == 0) lower = false;
  for (let i = 2; i <= 5; i++) if (dice[i] == 0) middle = false;
  for (let i = 3; i <= 6; i++) if (dice[i] == 0) upper = false;

  return upper || middle || lower ? 30 : 0;
}

function scoreLStraight() {
  let diceCount = [];
  let lower = true;
  let upper = true;

  // Assure all are ones for lower or upper
  for (let i = 1; i <= 5; i++) if (dice[i] == 0) lower = false;

  for (let i = 2; i <= 6; i++) if (dice[i] == 0) upper = false;

  return lower || upper ? 40 : 0;
}

function scoreChance() {
  let sum = 0;
  for(let i = 0; i < NUM_DICE; i++) {
    sum += dice[i].value;
  }
  return sum;
}

function nextPlayer() {
  // Clear the "active" class from the current user.
  document.getElementById('player' + currentPlayer).className = '';
  document.getElementById('scores' + currentPlayer).className = '';

  // Now increment the current player.
  currentPlayer++;
  if(currentPlayer > 4) currentPlayer = 1;

  // Now highlight the new player
  document.getElementById('player' + currentPlayer).className = 'active';
  document.getElementById('scores' + currentPlayer).className = 'active';

  // Finally, if it's next player, the rollCount needs
  // to be reset so the person has three rolls too.
  rollCount = 0;
  document.getElementById('rolls').textContent = rollCount;
}

function clearHold() {
  for(let i = 0; i < NUM_DICE; i++) {
    dice[i].keep = false;
    document.getElementById(i).className = '';
  }
}
