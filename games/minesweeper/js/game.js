var ctx = null;
var gameTime = 0, lastFrameTime = 0;
var currentSecond = 0, frameCount = 0, framesLastSecond = 0;

var offsetX = 0, offsetY = 0;
var grid = [];

var mouseState = {
  x: 0,
  y: 0,
  click: null
};

var gameState = {
  difficulty: "easy",
  screen: "menu",
  newBest: false,
  timeTaken: 0,
  tileW: 20,
  tileH: 20
};

var difficulties = {
  easy: {
    name: 'Easy',
    width: 10,
    height: 10,
    mines: 10,
    bestTime: 0,
    menuBox: [0,0]
  },
  medium: {
    name: 'Medium',
    width: 12,
    height: 12,
    mines: 20,
    bestTime: 0,
    menuBox: [0,0]
  },
  hard: {
    name: 'Hard',
    width: 15,
    height: 15,
    mines: 50,
    bestTime: 0,
    menuBox: [0,0]
  }
};


class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.hasMine = false;
    this.danger = 0;
    currentState = hidden;
  }

  calcDanger() {
    let cDiff = difficulties[gameState.difficulty];

    for(let py = this.y - 1; py <= this.y + 1; py++) {
      for(let px = this.x - 1; px <= this.x + 1; px++) {
        if(px == this.x && py == this.y) { continue; }
        if(px < 0 || py < 0 ||
          px >= cDiff.width ||
          py >= cDiff.height) {
            continue;
        }

        if(grid[((py * cDiff.width) + px)].hasMine) {
          this.danger++;
        }
      }
    }
  }

  flag() {
    if(this.currentState == 'hidden') { this.currentState = 'flagged'; }
    else if(this.currentState == 'flagged') { this.currentState = 'hidden'; }
  }

  click() {
    if(this.currentState != 'hidden') { return; }

    if(this.hasMine) { gameOver(); }
    else if(this.danger > 0) { this.currentState = 'visible'; }
    else {
      this.currentState = 'visible';
      this.revealNeighbors();
    }

    checkState();
  }

  revealNeighbors() {
    let cDiff = difficulties[gameState.difficulty];
    for(let py = this.y - 1; py <= this.y + 1; py++) {
      for(let px = this.x - 1; px <= this.x + 1; px++) {
        if(px == this.x && py == this.y) { continue; }
          if(px < 0 || py < 0 ||
            px >= cDiff.width ||
            py >= cDiff.height) {
              continue;
          }

        var idx = ((py * cDiff.width) + px);

        if(grid[idx].currentState == 'hidden') {
          grid[idx].currentState = 'visible';
          if(grid[idx].danger == 0) {
            grid[idx].revealNeighbors();
          }
        }
      }
    }
  }
}

function checkState() {
  for(let i in grid) {
    if(grid[i].hasMine == false && grid[i].currentState != 'visible')
      return;
  }

  gameState.timeTaken = gameTime;
  let cDiff = difficulties[gameState.difficulty];

  if(cDiff.bestTime == 0 || gameTime < cDiff.bestTime) {
    gameState.newBest = true;
    cDiff.bestTime = gameTime;
  }

  gameState.screen = 'won';
}

function gameOver() {
  gameState.screen = 'lost';
}

function startLevel(diff) {
  gameState.newBest = false;
  gameState.timeTaken = 0;
  gameState.difficulty = diff;
  gameState.screen = 'playing';

  gameTime = 0;
  lastFrameTime = 0;

  var cDiff = difficulties[diff];

  offsetX = Math.floor((document.getElementById('game').width -
    (cDiff.width * gameState.tileW)) / 2);

  offsetY = Math.floor((document.getElementById('game').height -
    (cDiff.height * gameState.tileH)) / 2);

  for(let py = 0; py < cDiff.height; py++) {
    for(let px = 0; px < cDiff.width; px++) {
      grid.push(new Tile(px, py));
    }
  }

  let minesPlaced = 0;
  while(minesPlaced < cDiff.mines) {
    let idx = Math.floor(Math.random() * grid.length);

    if(grid[idx].hasMine) { continue; }

    grid[idx].hasMine = true;
    minesPlaced++;
  }

  for(let i in grid) { (grid[i].calcDanger()); }
}

function updateGame() {
  if(gameState.screen == 'menu') {
    if(mouseState.click != null) {
      for(let i in difficulties) {
        if(mouseState.y >= difficulties[i].menuBox[0] &&
          mouseState.y <= difficulties[i].menuBox[1]) {
            startLevel(i);
            break;
          }
      }

      mouseState.click = null;

    }
  } else if(gameState.screen == 'won' || gameState.screen == 'lost') {
    if(mouseState.click != null) {
      gameState.screen = 'menu';
      mouseState.click = null;
    } else {
      if(mouseState.click != null) {
        let cDiff = difficulties[gameState.difficulty];

        if(mouseState.click[0] >= offsetX &&
          mouseState.click[1] >= offsetY &&
          mouseState.click[0] < (offsetX + (cDiff.width * gameState.tileW)) &&
          mouseState.click[1] < (offsetY + (cDiff.height * gameState.tileH))) {
            let tile = [
              Math.floor((mouseState.click[0] - offsetX) / gameState.tileW),
              Math.floor((mouseState.click[1].offsetY) / gameState.tileH)
            ];

            if(mouseState.click[2] == 1) {
              grid[((tile[1] * cDiff.width) + tile[0])].click();
            } else {
              grid[((tile[1] * cDiff.width) + tile[0])].flag();
            }
        } else if(mouseState.click[1] >= 380) {
          gameState.screen = 'menu';
        }

        mouseState.click = null;
      }
    }
  }
}

window.onload = function() {
  ctx = document.getElementById('game').getContext('2d');

  // Event listeners
  let gameBox = document.getElementById('game');
  gameBox.addEventListener('click', e => {
    let pos = realPos(e.pageX, e.pageY);
    mouseState.click = [pos[0], pos[1], 1];
  });

  gameBox.addEventListener('mousemove', e => {
    let pos = realPos(e.pageX, e.pageY);
    mouseState.x = pos[0];
    mouseState.y = pos[1];
  });

  gameBox.addEventListener('contextmenu', e => {
    e.preventDefault();
    let pos = realPos(e.pageX, e.pageY);
    mouseState.click = [pos[0], pos[1], 2];
    return false;
  });

  requestAnimationFrame(drawGame);
};

function drawMenu() {
  ctx.textAlign = 'center';
  ctx.font = 'bold 20pt sans-serif';
  ctx.fillStyle = '#000';

  let y = 100;

  for(let d in difficulties) {
    let moveOver = (mouseState.y >= (y - 20) && mouseState.y <= (y + 10));

    if(mouseOver) { ctx.fillStyle = '#009'; }

    difficulties[d].menuBox = [y - 20, y + 10];
    ctx.fillText(difficulties[d].name, 150, y);
    y += 80;

    if(mouseOver) { ctx.fillStyle = '#000'; }
  }

  y = 120;
  ctx.font = 'italic 12pt sans-serif';

  for(let d in difficulties) {
    if(difficulties[d].bestTime == 0) {
      ctx.fillText('No best time', 150, y);
    } else {
      let t = difficulties[d].bestTime;
      let bestTime = '';
      if((t/1000) >= 60) {
        bestTime = Math.floor((t/1000)/60) + ':';
        t %= 60000;
      }
      bestTime += Math.floor(t/1000) + '.' + (t%1000);
      ctx.fillText(`Best time ${bestTime}`, 150, y);
    }

    y += 80;
  }
}

function drawPlaying() {
  let halfW = gameState.tileW / 2;
  let halfH = gameState.tileH / 2;

  let cDiff = difficulties[gameState.difficulty];

  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  ctx.fillStyle = '#000';
  ctx.font = '12px sans-serif';
  ctx.fillText(cDiff.name, 150, 20);

  ctx.fillText('Return to menu', 150, 390);

  if(gameState.screen != 'lost') {
    ctx.fillText(`Mines: ${cDiff.mines}`, 10, 40);

    let whichT = (gameState.screen == 'won' ?
      gameState.timeTaken : gameTime);
      let t = '';
      if((gameTime / 1000) > 60) {
        t = Math.floor((whichT / 1000) / 60) + ':';
      }
      let s = Math.floor((whichT / 1000) % 60);
      t += (s > 9 ? s : '0' + s);

      ctx.textAlign = 'right';
      ctx.fillText('Time: ' + t, 290, 40);      
  }

  if(gameState.screen == 'lost' || gameState.screen == 'won') {
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(
      (gameState.screen == 'lost' ? 'Game Over' : 'Cleared!'), 150, offsetY - 15
    );   
  }
}