var baseURL = 'https%3A%2F%2Fopentdb.com%2Fapi.php%3Famount%3D1', url,
    answerText = $('.answer'), getQuestionSuccess,
    responseCode, question, answers, correctAnswer, token;
getNewToken();

function getQuestion( difficulty ) {
  getQuestionSuccess = false;
  url = baseURL;
  url += '%26category%3D0';
  url += '%26difficulty%3D'+difficulty;
  url += '%26type%3Dmultiple';
  url += '%26token%3D'+token
  url += '%22&format=json&diagnostics=true&callback=';

  $.getJSON('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22'+url, callback);

  function callback(data) {
    data = data.query.results.json;
    if (data.response_code != 0) { getQuestion(difficulty); return; }
    question = data.results.question;
    answers = data.results.incorrect_answers;
    correctAnswer = Math.floor(Math.random()*4);
    answers.splice(correctAnswer,0,data.results.correct_answer);
    correctAnswer = ['A','B','C','D'][correctAnswer];
    getQuestionSuccess = true;
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