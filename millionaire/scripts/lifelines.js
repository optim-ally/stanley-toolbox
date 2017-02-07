var remove = [], message;

function fiftyFifty() {
  remove = ['A','B','C','D'];
  remove.splice(remove.indexOf(correctAnswer),1);
  remove.splice(Math.floor(Math.random()*3),1);
  for (var i in remove) $('#'+remove[i]).attr('class','removed');
  $('#message-board').css('visibility','hidden');
  $('#5050').attr('src','images/lifeline-5050-used.png').unbind();
}


function phoneAFriend() {
  stopTimer();
  currentMessage = 'phone';
  switch(Math.floor(Math.random()*5)) {
    case 0: case 1: message = "I know this one! It's definitely " + correctAnswer + ', you can trust me on that'; break;
    case 2: case 3: message = "Hmmm... I'm not certain, but I have a strong feeling the answer is " + ((Math.random()<.7)? correctAnswer:'C'); break;
    case 4: message = 'Oh, wow. I have no idea! If I had to guess, it might be ' + ['A','B','C','D'][Math.floor(Math.random()*4)];
  }
  $('#message-text').html(message);
  $('#confirm').html('Ok').css('visibility','inherit');
  $('#quit').css('visibility','hidden');
  $('#next-question').css('visibility','hidden');
  $('#paf').attr('src','images/lifeline-paf-used.png').unbind();
}


function askAudience() {
  
}