import {
  Character
} from "./character.js";

// Constants for the up, down, left, and right arrow keys
const UP_ARROW = 'ArrowUp';
const DOWN_ARROW = 'ArrowDown';
const LEFT_ARROW = 'ArrowLeft';
const RIGHT_ARROW = 'ArrowRight';

var ctx = null;
var tileW = 40, tileH = 40;
var mapW = 20, mapH = 20;

var currentSecond = 0, frameCount = 0, framesLastSecond = 0;
var lastFrameTime = 0;

var keysDown = {
  'ArrowLeft': false,
  'ArrowUp': false,
  'ArrowRight': false,
  'ArrowDown': false
};

var player = new Character(tileW, tileH);

var gameMap = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
	0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0,
	0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0,
	0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0,
	0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
	0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
	0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0,
	0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

var viewport = {
  screen: [0, 0],
  startTile: [0, 0],
  endTile: [0, 0],
  offset: [0, 0],
  update: function(px, py) {
    this.offset[0] = Math.floor((this.screen[0]/2) - px);
    this.offset[1] = Math.floor((this.screen[1]/2) - py);

    let tile = [Math.floor(px / tileW), Math.floor(py / tileH)];

    this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0] / 2) / tileW);
    this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1] / 2) / tileH);

    if (this.startTile[0] < 0) {
      this.startTile[0] = 0;
    }
    if (this.startTile[1] < 0) {
      this.startTile[1] = 0;
    }

    this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0] / 2) / tileW);
    this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1] / 2) / tileH);

    if (this.endTile[0] >= mapW) {
      this.endTile[0] = mapW - 1;
    }
    if (this.endTile[1] >= mapH) {
      this.endTile[1] = mapH = 1;
    }
  }
};

window.onload = (e) => {
  ctx = document.getElementById('game').getContext('2d');
  requestAnimationFrame(drawGame);
  ctx.font = 'bold 10pt sans-serif';

  window.addEventListener('keydown', (e) => {
    // keyCode has been deprecated using key instead.
    if(e.key.startsWith('Arrow')) {
      keysDown[e.key] = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    // keyCode has been deprecated using key instead.
    if(e.key.startsWith('Arrow')) {
      keysDown[e.key] = false;
    }
  });

  viewport.screen = [document.getElementById('game').width,
    document.getElementById('game').height
  ];

};

function toIndex(x, y) {
  return ((y * mapW) + x);
}

function drawGame() {
  if(ctx == null) { return; }

  let currentFrameTime = Date.now();
  let timeElapsed = currentFrameTime - lastFrameTime;

  let sec = Math.floor(Date.now()/1000);
  if(sec != currentSecond) {
    currentSecond = sec;
    framesLastSecond = frameCount;
    frameCount = 1;
  } else {
    frameCount++;
  }

  if(!player.processMovement(currentFrameTime)) {
    if(keysDown[UP_ARROW] && player.tileFrom[1] > 0 && 
      gameMap[toIndex(player.tileFrom[0],
        player.tileFrom[1] - 1)] == 1) {
          player.tileTo[1] -= 1;
        }
    else if(keysDown[DOWN_ARROW] && player.tileFrom[1] < (mapH - 1) &&
      gameMap[toIndex(player.tileFrom[0],
        player.tileFrom[1] + 1)] == 1) {
          player.tileTo[1] += 1;
        }
    else if(keysDown[LEFT_ARROW] && player.tileFrom[0] > 0 &&
      gameMap[toIndex(player.tileFrom[0] - 1,
        player.tileTo[1])] == 1) {
          player.tileTo[0] -= 1;
        }
    else if(keysDown[RIGHT_ARROW] && player.tileFrom[0] <= (mapW - 1) &&
      gameMap[toIndex(player.tileFrom[0] + 1,
        player.tileTo[1])] == 1) {
          player.tileTo[0] += 1;
        }

    if((player.tileFrom[0] != player.tileTo[0]) ||
        (player.tileFrom[1] != player.tileTo[1])) {
          player.timeMoved = currentFrameTime;
        }
  }

  viewport.update(player.position[0] + (player.dimensions[0] / 2),
    player.position[1] + (player.dimensions[1] / 2));

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);

  for(let row = viewport.startTile[1]; row < viewport.endTile[1]; row++) {
    for(let col = viewport.startTile[0]; col < viewport.endTile[0]; col++) {
      switch(gameMap[((row * mapW) + col)]) {
        case 0:
          ctx.fillStyle = '#999';
          break;
        default:
          ctx.fillStyle = '#eee';
          break;
      }

      ctx.fillRect(viewport.offset[0] + (col * tileW), viewport.offset[1] + (row * tileH), tileW, tileH);
    }
  }

  // Draw the player
  ctx.fillStyle = '#00f';
  ctx.fillRect(viewport.offset[0] + player.position[0], viewport.offset[1] + player.position[1],
    player.dimensions[0], player.dimensions[1]);

  // Draw the text with the frame/second
  ctx.fillStyle = '#f00';
  ctx.fillText(`FPS: ${framesLastSecond}`, 10, 20);

  lastFrameTime = currentFrameTime;
  requestAnimationFrame(drawGame);
}