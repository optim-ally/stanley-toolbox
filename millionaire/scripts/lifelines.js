var remove = [], remaining, message, percent = {'A':0,'B':0,'C':0,'D':0}, toc, x,
    usedFiftyFifty = 0, usedPhoneAFriend = 0, usedAskAudience = 0, usedSwitch = 0;

function fiftyFifty() {
  remove = ['A','B','C','D'];
  remove.splice(remove.indexOf(correctAnswer),1);
  remove.splice(Math.floor(Math.random()*3),1);
  for (var i in remove) $('#'+remove[i]).attr('class','removed');
  $('#message-board').css('visibility','hidden');
  $('#5050').attr('src','images/lifeline-5050-used.png').unbind();
  usedFiftyFifty = 1;
}


function phoneAFriend() {
  stopTimer();
  currentMessage = 'info';
  remaining = ['A','B','C','D'].filter(function(x){ return remove.indexOf(x) < 0 });
  switch(Math.floor(Math.random()*5)) {
    case 0: case 1: message = "\"I know this one! It's definitely " + correctAnswer + ', you can trust me on that\"'; break;
    case 2: case 3: message = "\"Hmmm... I'm not certain, but I have a strong feeling the answer is " + ((Math.random()<.7)? correctAnswer:remaining[1]) + '\"'; break;
    case 4: message = '\"Oh, wow. I have no idea! If I had to guess, it might be ' + remaining[Math.floor(Math.random()*remaining.length)] + '\"';
  }
  $('#message-text').html(message);
  $('#confirm').html('Ok').css('visibility','inherit');
  $('#quit').css('visibility','hidden');
  $('#next-question').css('visibility','hidden');
  $('#paf').attr('src','images/lifeline-paf-used.png').unbind();
  usedPhoneAFriend = 1;
}


function askAudience() {
  stopTimer();
  currentMessage = 'info';
  remaining = ['A','B','C','D'].filter(function(x){ return remove.indexOf(x) < 0 });
  percent = {'A':0,'B':0,'C':0,'D':0};
  for (var i in remaining) percent[remaining[i]] = Math.floor(Math.random()*Math.random()*50); 
  percent[correctAnswer] += 100-percent['A']-percent['B']-percent['C']-percent['D'];
  $('#message-text').html("<div><div id='bar-A'></div><div id='bar-B'></div><div id='bar-C'></div><div id='bar-D'></div></div><table><tr><td>A</td><td>B</td><td>C</td><td>D</td></tr></table>");
  $('#message-text > div > div').css('height',0);
  toc = setInterval(frame,5);
  x = 0;
  function frame() {
    if (x >= 1) clearInterval(toc);
    else {
      for (var i in remaining)
      $('#bar-'+remaining[i]).css({'height':x*percent[remaining[i]]+'%', 'top':100-x*percent[remaining[i]]+'%'});
      x += .01;
    }
  }
  $('#message-text > div > div').css('animation','grow 2s ease-out');
  $('#confirm').html('Ok').css('visibility','inherit');
  $('#quit').css('visibility','hidden');
  $('#next-question').css('visibility','hidden');
  $('#ata').attr('src','images/lifeline-ata-used.png').unbind();
  usedAskAudience = 1;
}


function switchQuestion() {
  stopTimer();
  readyQuestion(questionNum);
  checking = setInterval(function(){
    if (getQuestionSuccess == true) {
      clearInterval(checking);
      startQuestion();
      $('#message-board').css('visibility','hidden');
      $('#switch').css('visibility','hidden').unbind();
    }
  },100);
  usedSwitch = 1;
}