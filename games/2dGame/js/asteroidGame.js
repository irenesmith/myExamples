var canvas = document.getElementById("asteroids");
var context = canvas.getContext("2d");

context.strokeStyle = 'dimgrey';
context.lineWidth = 5;
context.rect(75, 75, 250, 250);
context.stroke();

context.font = '34px Arial';
context.strokeStyle = '#FF2222';
context.fillStyle = '#FFAAAA';
context.lineWidth = 0.75;
context.textAlign = "center";
let msg = "2D Drawing";
context.fillText(msg, canvas.width / 2, 100);
context.strokeText(msg, canvas.width / 2, 100);