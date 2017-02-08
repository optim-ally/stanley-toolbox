var questionNum, timeToAnswer, selected = '', winnings, timeSaved,
    version, money, ladderHTML, currentMessage, checking;

function reset( whichVersion ) {
  questionNum = 1;
  version = whichVersion;
  winnings = 0;
  timeSaved = 0;
  $('#timer').html('');
  $('.answer').html('');

  $('#5050').attr('src','images/lifeline-5050.png');
  $('#paf').attr('src','images/lifeline-paf.png');
  $('#ata').attr('src','images/lifeline-ata.png');

  $('#lifelines > img, #switch').unbind();
  $('#lifelines > img, #switch').mouseover(function(){
    $(this).attr('src','images/lifeline-'+$(this).attr('id')+'-hover.png');
  }).mouseout(function(){
    $(this).attr('src','images/lifeline-'+$(this).attr('id')+'.png');
  }).click(function(){ confirmLifeline($(this).attr('id')); });

  if (version == 'traditional') money = ['0','100','200','300','500','1,000','2,000','4,000','8,000','16,000','32,000','64,000','125,000','250,000','500,000','1 MILLION'];

  if (version == "modern") money = ['0','500','1,000','2,000','5,000','10,000','20,000','50,000','75,000','150,000','250,000','500,000','1 MILLION'];

  ladderHTML = ''
  for (var i=money.length-1; i; i--)
    ladderHTML += "<li id='q"+i+"'><span>&diams;</span> &nbsp; &pound;"+money[i]+"<div></div></li>";
  $('#ladder').html('<ol reversed>'+ladderHTML+'</ol>');

  if (version == 'traditional') $('#q5,#q10,#q15').css('color','#FED');
  if (version == 'modern') $('#q2,#q7,#q12').css('color','#FED');

  areYouReady(1);
}


function areYouReady( stage ) {
  readyQuestion(stage);
  currentMessage = 'ready?';

  if (stage == 1) $('#message-text').html("Ready to begin a new game?<br/><br/>Hit 'Next Question' to start the timer for Question 1");
  else $('#message-text').html("Correct!<br/><br/>When you're ready, click 'Next Question' to go to question "+stage);
  $('#quit').html('Quit Game').css('visibility','inherit');
  $('#next-question').html('Next Question').css('visibility','inherit');
  $('#confirm').css('visibility','hidden');
  $('input').css('visibility','hidden');

  checking = setInterval(function(){
    if (getQuestionSuccess == true) {
      clearInterval(checking);
      $('#message-board').css('visibility','visible');
    }
  },100);
}


function areYouSure() {
  $('#message-text').html((money[questionNum-1].length > 1 || currentMessage == 'walk?')? 'Walk away with £'+(money[questionNum-1])+'?':'Are you sure?');
  $('#quit').html('Yes').css('visibility','inherit');
  $('#next-question').html('No').css('visibility','inherit');
  $('#confirm').css('visibility','hidden');
  $('input').css('visibility','hidden');

  $('#message-board').css('visibility','visible');
}


function readyQuestion( k ) {
  selected = '';
  remove = [];
  $('#final').attr('class','inactive');
  $('.answer-text').parent().attr('class','');
  if (k>1) {
    $('#q'+(k-1)).attr('class','');
    $('#q'+(k-1)+'>span').css('visibility','visible');
  }
  if (version == 'modern') {
    timeToAnswer = (k<3)? 15 : (k<8)? 30 : 60;
    (k<5)? getQuestion('easy') : (k<9)? getQuestion('medium') : getQuestion('hard');
  } else {
    timeToAnswer = 60;
    (k<6)? getQuestion('easy') : (k<11)? getQuestion('medium') : getQuestion('hard');
  }
}


function confirmLifeline( name ) {
  currentMessage = name;
  $('#confirm').html('Ok').css('visibility','hidden');
  $('#quit').html('Ok').css('visibility','inherit');
  $('#next-question').html('Not now').css('visibility','inherit');
  switch(name) {
    case '5050': $('#message-text').html('Use the 50-50 lifeline?<br/>This will remove two incorrect answers'); break;
    case 'paf': $('#message-text').html('Phone a friend?<br/>They may be able to help with the question'); break;
    case 'ata': $('#message-text').html('Ask the audience?<br/>You will be shown how many would choose each answer'); break;
    case 'switch': $('#message-text').html('Use the Switch lifeline?<br/>The question will be replaced by a new one'); break;
    case 'help': $('#message-text').html('You can use each lifeline only once per game<br/><br/>Click on the icons to find out what they do');
      $('#confirm').css('visibility','inherit');
      $('#quit').css('visibility','hidden');
      $('#next-question').css('visibility','hidden');
      break;
  }
  $('#message-board').css('visibility','visible');
}


function finalAnswer() {
  stopTimer();
  $('.hover').attr('class','');
  $('#'+correctAnswer).attr('class','correct');
  if (selected == correctAnswer) setTimeout(questionSuccess,500);
  else setTimeout(questionFailure,500);
}


function questionSuccess() {
  if (version == 'traditional') {
    if (questionNum == 5) winnings = 1000;
    if (questionNum == 10) winnings = 32000;
    if (questionNum == 15) { millionaire(); return; }
  } else {
    if (questionNum == 2) winnings = 1000;
    if (questionNum == 7) winnings = 50000;
    if (questionNum == 12) { millionaire(); return; }
  }
  questionNum++
  timeSaved += currentTime;
  areYouReady(questionNum);
}

function questionFailure() {
  if (highScore()) { newHighScore(); return; }
  $('#message-text').html('Game over!<br/><br/>You go home with £'+winnings);
  $('#quit').css('visibility','hidden');
  $('#next-question').css('visibility','hidden');
  $('#confirm').html('Back to Menu').css('visibility','inherit');
  $('#message-board').css('visibility','visible');
}


function millionaire() {
  questionNum = 13;
  celebrate();
  currentMessage = 'winner';
  setTimeout(newHighScore,3000);
}


$('#quit').click(function(){
  if (currentMessage == '5050') fiftyFifty();
  else if (currentMessage == 'paf') phoneAFriend();
  else if (currentMessage == 'ata') askAudience();
  else if (currentMessage == 'switch') switchQuestion();
  else if (currentMessage != 'ready?' && highScore())
    newHighScore();
  else if (currentMessage != 'ready?' || questionNum == 1) {
    stopTimer();
    $('#home').css({animation:'inLeft 1s','animation-fill-mode':'forwards'});
  } else { currentMessage = 'sure?'; areYouSure(); }
});
$('#next-question').click(function(){
  if (currentMessage == 'ready?') {
    if (version == 'modern' && questionNum == 8) {
      $('#message-text').html("New lifeline unlocked!<br/><br/>You can now use the 'Switch' lifeline to change a question");
      $('#quit').css('visibility','hidden');
      $('#next-question').css('visibility','hidden');
      $('#confirm').html('Ok').css('visibility','inherit');
      $('#switch').css('visibility','visible');
      currentMessage = 'new life';
    }
    else { $('#message-board').css('visibility','hidden');
      startQuestion(); }
  } else if (currentMessage == 'sure?') areYouReady(questionNum);
  else $('#message-board').css('visibility','hidden');
});
$('#confirm').click(function(){
  if (currentMessage == 'new life') startQuestion();
  if (currentMessage == 'info') startTimer();
  if (currentMessage == 'help' || currentMessage == 'info' || currentMessage == 'new life') { $('#message-board').css('visibility','hidden'); return; }
  if ($(this).attr('class') == 'inactive') return;
  if (currentMessage == 'newHighScore') updateHighScores();
  $('#home').css({animation:'inLeft 1s','animation-fill-mode':'forwards'});
  stopCelebrating();
});


$('.answer-text').mouseover(function(){
  if ($(this).parent().attr('class') == 'chosen' || !timerRunning || $(this).parent().attr('class') == 'removed') return;
  $(this).parent().attr('class','hover');
}).mouseout(function(){
  if ($(this).parent().attr('class') == 'chosen' || !timerRunning || $(this).parent().attr('class') == 'removed') return;
  $(this).parent().attr('class','');
}).click(function(){
  if (!timerRunning || $(this).parent().attr('class') == 'removed') return;
  $('.chosen').attr('class','');
  $(this).parent().attr('class','chosen');
  selected = $(this).parent().attr('id');
  $('#final').attr('class','active');
});


$('#final').click(function(){
  if ($(this).attr('class') == 'active') finalAnswer();
});


$('#walk-away').mouseover(function(){
  $(this).attr('src','images/'+$(this).attr('id')+'-hover.png');
}).mouseout(function(){
  $(this).attr('src','images/'+$(this).attr('id')+'.png');
}).click(function(){ currentMessage = 'walk?'; areYouSure(); });