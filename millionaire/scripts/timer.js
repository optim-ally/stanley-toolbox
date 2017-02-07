var tic, currentTime = 60, timerRunning, timerHTML = "";

for (var i=0; i<36; i++) timerHTML += "<div class='light'/>";
$('#timer-display').append("<div id='light-container'>" + timerHTML + '</div>');

var lights = $('.light');

for (var i=0; i<lights.length; i++) {
  lights[i].style.marginTop = 50-53*Math.cos(i/18*Math.PI) + '%';
  lights[i].style.marginLeft = 50+53*Math.sin(i/18*Math.PI) + '%';
  lights[i].className = 'light';
}


function startTimer( t ) {
  timerRunning = true;
  currentTime = t || currentTime;
  for (var i=0; i<lights.length; i++) {
    lights[i].style.animationDelay = i/36-1 + 's';
    lights[i].className = 'light lit';
  }
  function countDown() {
    $('#timer').html(currentTime);
    currentTime--;
    if (currentTime >= 0) tic = setTimeout(countDown,1000);
    else {
      for (var i=0; i<lights.length; i++) { lights[i].style.backgroundColor = 'red'; }
      stopTimer();
      finalAnswer();
    }
  }
  countDown();
}

function stopTimer() {
  clearTimeout(tic);
  timerRunning = false;
  for (var i=0; i<lights.length; i++) { lights[i].className = 'light'; }
}