$('#home .button').mouseover(function(){
  $(this).css('border-image',"url('images/question-frame-highlight.png') 30% stretch");
  $(this).children().css('background-color','#404040');
}).mouseout(function(){
  $(this).css('border-image',"url('images/question-frame.png') 30% stretch");
  $(this).children().css('background-color','black');
});

$('#to-high-scores,#to-how-to-play').click(function(){
  $('#message-board').css('visibility','hidden');
  $('input').val('').css('visibility','hidden');
  $('#high-scores,#how-to-play').css('z-index',0);
  $('#'+$(this).attr('id').slice(3)).css('z-index',1);
  $('#home').css({animation:'outRight 1s','animation-fill-mode':'forwards'});
  $('#high-scores,#how-to-play').css({animation:'inLeft 1s','animation-fill-mode':'forwards'});
});

$('#play-traditional,#play-modern').click(function(){
  reset($(this).attr('id').slice(5));
  $('#high-scores,#how-to-play').css('z-index',-1);
  $('#home').css({animation:'outLeft 1s','animation-fill-mode':'forwards'});
});

$('.back-to-menu').click(function(){
  $('#home').css({animation:'inRight 1s','animation-fill-mode':'forwards'});$('#high-scores,#how-to-play').css({animation:'outLeft 1s','animation-fill-mode':'forwards'});
});