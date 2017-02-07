var baseURL = 'https%3A%2F%2Fopentdb.com%2Fapi.php%3Famount%3D1',
    answerText = $('.answer'),
    responseCode, question, answers, correctAnswer, token;
getNewToken();

function getQuestion( difficulty, category, type ) {
  var category = category || 'Any', type = type || 'multiple', url = baseURL;
  
  switch(category) {
    case 'Any': category = 0; break;
    case 'General Knowledge': category = 9; break;
    case 'Entertainment: Books': category = 10; break;
    case 'Entertainment: Film': category = 11; break;
    case 'Entertainment: Music': category = 12; break;
    case 'Entertainment: Musicals & Theatres': category = 13; break;
    case 'Entertainment: Television': category = 14; break;
    case 'Entertainment: Video Games': category = 15; break;
    case 'Entertainment: Board Games': category = 16; break;
    case 'Science & Nature': category = 17; break;
    case 'Science: Computers': category = 18; break;
    case 'Science: Mathematics': category = 19; break;
    case 'Mythology': category = 20; break;
    case 'Sports': category = 21; break;
    case 'Geography': category = 22; break;
    case 'History': category = 23; break;
    case 'Politics': category = 24; break;
    case 'Art': category = 25; break;
    case 'Celebrities': category = 26; break;
    case 'Animals': category = 27; break;
    case 'Vehicles': category = 28; break;
    case 'Entertainment: Comics': category = 29; break;
    case 'Science: Gadgets': category = 30; break;
    case 'Entertainment: Japanese Anime & Manga': category = 31; break;
    case 'Entertainment: Cartoon & Animations': category = 32; break;
  }

  var url = baseURL;
  url += '%26category%3D'+category;
  url += '%26difficulty%3D'+difficulty;
  url += '%26type%3D'+type;
  url += '%26token%3D'+token
  url += '%22&format=json&diagnostics=true&callback=';

  $.getJSON('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22'+url, callback);

  function callback(data) {
    data = data.query.results.json;
    responseCode = data.response_code;
    question = data.results.question;
    answers = data.results.incorrect_answers;
    correctAnswer = Math.floor(Math.random()*4);
    answers.splice(correctAnswer,0,data.results.correct_answer);
    correctAnswer = ['A','B','C','D'][correctAnswer];
  }
}

function startQuestion() {
  $('#question').html(question);
  for (var i=0; i<4; i++)
    answerText[i].innerHTML = answers[i];
  startTimer(timeToAnswer);
  $('#q'+questionNum).attr('class','selected');
}

function getNewToken() {
  $.getJSON('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22https%3A%2F%2Fopentdb.com%2Fapi_token.php%3Fcommand%3Drequest%22&format=json&diagnostics=true&callback=', tokenCallback);

  function tokenCallback(data) { token = data.query.results.json.token; }
}