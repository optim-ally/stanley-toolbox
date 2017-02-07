var highScores = {'traditional':[['TL27',1000000,0,42],['BOB',125000,3,212],['MARIE',64000,0,468],['AMY',64000,2,227],['JAKE',32000,3,84]],
            'modern':[['ALICE',250000,2,130],['JAMES',150000,3,46],['SALLY',75000,2,141],['OLAF',75000,4,83],['TOM',50000,2,11]]},
    lifelinesUsed, worstEntry, currentEntry, highScoresHTML, minutes, char, name;
highScores = JSON.parse(localStorage.getItem('high-scores')) || highScores;
displayHighScores();

function highScore() {
  worstEntry = highScores[version][4];
  console.log(worstEntry);
  if (money[questionNum-1] > worstEntry[1]) return true;
  if (money[questionNum-1] < worstEntry[1]) return false;
  lifelinesUsed = usedFiftyFifty + usedPhoneAFriend + usedAskAudience;
  if (lifelinesUsed < worstEntry[2]) return true;
  if (lifelinesUsed > worstEntry[2]) return false;
  if (timeSaved >= worstEntry[3]) return true;
  return false;
}

function displayHighScores() {
  highScoresHTML = '<tr><th>Position</th><th>Name</th><th>Winnings</th><th>Lifelines</th><th>Spare Time</th></tr>';
  for (var i=0; i<5; i++) {
    currentEntry = highScores.traditional[i];
    highScoresHTML += '<tr><td>'+(i+1)+'</td><td>'+currentEntry[0]+'</td><td>£'+currentEntry[1]+'</td><td>'+currentEntry[2]+'</td><td>'+time(currentEntry[3])+'</td></tr>';
  }
  $('#trad-high-scores').html(highScoresHTML);
  highScoresHTML = '<tr><th>Position</th><th>Name</th><th>Winnings</th><th>Lifelines</th><th>Spare Time</th></tr>';
  for (var i=0; i<5; i++) {
    currentEntry = highScores.modern[i];
    highScoresHTML += '<tr><td>'+(i+1)+'</td><td>'+currentEntry[0]+'</td><td>£'+currentEntry[1]+'</td><td>'+currentEntry[2]+'</td><td>'+time(currentEntry[3])+'</td></tr>';
  }
  $('#modn-high-scores').html(highScoresHTML);
}

function time( seconds ) {
  minutes = 0;
  while (seconds > 60) {
    minutes++;
    seconds -= 60;
  }
  if (seconds < 10) seconds = '0' + seconds;
  return minutes + ' : ' + seconds;
}

function newHighScore() {
  stopTimer();
  currentMessage = 'newHighScore';
  $('#message-text').html('New high score!<br/><br/>Enter your name:');
  $('input').val('').css('visibility','visible');
  $('#confirm').html('Done').attr('class','inactive').css('visibility','inherit');
  $('#quit').css('visibility','hidden');
  $('#next-question').css('visibility','hidden');
  $('#message-board').css('visibility','visible');
}

function updateHighScores() {
  currentEntry = [$('input').val(),Number(money[questionNum-1].replace(',','')),lifelinesUsed,timeSaved];
  highScores[version][4] = currentEntry;
  highScores[version].sort(function(a,b){
    if (a[1] > b[1]) return -1;  if (a[1] < b[1]) return 1;
    if (a[2] < b[2]) return -1;  if (a[2] > b[2]) return 1;
    if (a[3] > b[3]) return -1;  if (a[3] < b[3]) return 1;
    return 0;
  });
  displayHighScores();
  localStorage.setItem('high-scores',JSON.stringify(highScores));
}

$('input').keydown(function(e) {
  char = e.which;
  if (char != 8) e.preventDefault();
  else if ($('input').val().length == 1) $('#confirm').attr('class','inactive');
  if (char > 64 && char < 91 && $('input').val().length < 4) {
    $('input').val($('input').val()+String.fromCharCode(char));
    $('#confirm').attr('class','active');
  }
});