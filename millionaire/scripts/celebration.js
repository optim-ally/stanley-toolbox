var ctx0 = $('#celebration')[0].getContext('2d'), pi2 = 2*Math.PI,
    allConfetti = [], colors = ['#0dd','#d0d','#0f0','#dd0'],
    generatingConfetti, movingConfetti, animationFrame, counter = 0;

function celebrate() {
  stopTimer();
  $('#timer').html('£M');
  for (var i=0; i<lights.length; i++) {
    lights[i].style.animationDelay = -i/4 + 's';
    lights[i].className = 'light flashing';
  }
  generatingConfetti = setInterval(newConfetti,1000);
  movingConfetti = requestAnimationFrame(moveConfetti);
}

function stopCelebrating() {
  clearTimeout(movingConfetti);
  cancelAnimationFrame(animationFrame);
  clearInterval(generatingConfetti);
  allConfetti = [];
  ctx0.clearRect(0,0,760,1000);
}

function newConfetti() {
  for (var i=0; i<60; i++) allConfetti.push(new confetti(Math.random()*760,-Math.random()*200,colors[Math.floor(Math.random()*4)]));
  counter++;
  if (counter > 7) allConfetti.splice(0,60);
}

function moveConfetti() {
  ctx0.clearRect(0,0,760,1000);
  for (var i in allConfetti) allConfetti[i].move();
  movingConfetti = setTimeout(function(){
    animationFrame = requestAnimationFrame(moveConfetti);
  },20);
}

function confetti( x, y, color ) {
  this.x = x;
  this.y = y;
  this.dx = Math.random()*6-3
  this.color = color;

  this.move = function(){
    this.x += this.dx;
    this.dx += Math.random()*1-.5;
    this.dx = Math.min(Math.max(this.dx,-3),3);
    this.y += 5;
    ctx0.beginPath();
    ctx0.arc(this.x,this.y,5,0,pi2);
    ctx0.fillStyle = this.color;
    ctx0.fill();
  }
}