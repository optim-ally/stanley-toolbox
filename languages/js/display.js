// var graphData = [];
var last100Results = [];
var last100Correct = 0;
var per1000 = [];
// var chartContainer = document.getElementById("chart").getContext('2d');
var text, actual = 0, guess = 1, results, message, language;

/* function updateGraph() {
  lineData = { datasets: [{ data: graphData, label: "% Correct of Last 100",
                            borderColor: "rgba(50,150,250,1)", fill: true,
                            backgroundColor: "rgba(50,150,250,0.3)" }]};
  new Chart.Line(chartContainer, {
    data: lineData,
    options: { animation: false,
               scales: { yAxes: [{ ticks: { min: 0, max: 100 }}],
                         xAxes: [{ type: "linear", position: "bottom" }]}}});
} */


function updateInfo() {
  last100Results.push(Number(actual == guess));
  last100Correct = last100Correct + (actual == guess);

  if (iteration > 100) {
    last100Correct -= last100Results[0];
    last100Results.splice(0,1);
  }
  /* if (iteration > 0)
    graphData.push({x:iteration, y:last100Correct/Math.min(iteration,100)*100});*/

  document.getElementById("iteration").innerHTML = "Iteration " + iteration;
  document.getElementById("win-ratio").innerHTML = last100Correct + " correct of the last 100 trials."
}


function storeInfo() {
  if (iteration%1000 == 100) per1000.push(last100Correct);
  else if (iteration%100 == 0) per1000[per1000.length-1] += last100Correct;
  if (iteration%10000 == 0) console.log("// [" + per1000 + "]\n\nweights2 = " + JSON.stringify(weights2) + ";\n\nweights1 = " + JSON.stringify(weights1) + ";");
}




function updateTrialResults() {
  results = [Math.round(nodes2[0]*10000)/100 + "% English",
             Math.round(nodes2[1]*10000)/100 + "% French",
             Math.round(nodes2[2]*10000)/100 + "% German",
             Math.round(nodes2[3]*10000)/100 + "% Spanish"];

  results[guess] = "<span class=\"guess\">" + results[guess] + "</span>";

  document.getElementById("user-trial").innerHTML = results[0] + "<br/>" + results[1] + "<br/>" + results[2] + "<br/>" + results[3] + "<br/>";
}


function updateTrainingResults() {
  results[guess] = (actual === guess)?
    "<span class=\"correct\">" + results[guess] + "</span>" :
    "<span class=\"wrong\">" + results[guess] + "</span>";
  switch (actual) { case 0: language = " (English) "; break;
                    case 1: language = " (French) "; break;
                    case 2: language = " (German) "; break;
                    case 3: language = " (Spanish) "; break; }

  document.getElementById("training-trials").innerHTML = "<p>" + text + language + results[guess] + document.getElementById("training-trials").innerHTML;
}
