// event handlers for hovering over 'buttons' on the home menu
$('#home .button').mouseover(function(){
  $(this).css('border-image',"url('images/question-frame-highlight.png') 30% stretch");
  $(this).children().css('background-color','#404040');
}).mouseout(function(){
  $(this).css('border-image',"url('images/question-frame.png') 30% stretch");
  $(this).children().css('background-color','black');
});

// event handlers for clicking on high-score or how-to-play 'buttons'
$('#to-high-scores,#to-how-to-play').click(function(){
  // rearrange the z-indices to put the chosen panel in front of the game interface
  $('#message-board').css('visibility','hidden');
  $('input').val('').css('visibility','hidden');
  $('#high-scores,#how-to-play').css('z-index',0);
  $('#'+$(this).attr('id').slice(3)).css('z-index',1);

  // then scroll the home menu out of the way and the chosen one in
  $('#home').css({animation:'outRight 1s','animation-fill-mode':'forwards'});
  $('#high-scores,#how-to-play').css({animation:'inLeft 1s','animation-fill-mode':'forwards'});
});

// event handlers for clicking to start a new game
$('#play-traditional,#play-modern').click(function(){
  // prepare the chosen game mode
  reset($(this).attr('id').slice(5));
  // hide the other panels behind the game interface
  $('#high-scores,#how-to-play').css('z-index',-1);
  // then scroll the home menu out of the way
  $('#home').css({animation:'outLeft 1s','animation-fill-mode':'forwards'});
});

// event handler for clicking back-to-menu 'button'
$('.back-to-menu').click(function(){
  // simply scroll the home menu back into view
  $('#home').css({animation:'inRight 1s','animation-fill-mode':'forwards'});$('#high-scores,#how-to-play').css({animation:'outLeft 1s','animation-fill-mode':'forwards'});
});

// event handler for opening and closing the category settings
$('#home img').click(function(){
  $('#settings').css('visibility','visible');
});
$('#done').click(function(){
  $('#settings').css('visibility','hidden');
});

// event handlers for changing category settings
$('#settings > div > div').not('#done').click(function(){
  $('.chosen-category').attr('class','');
  $(this).children().attr('class','chosen-category');
  category = $(this).children().html();
});
