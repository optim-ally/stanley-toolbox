var learningRate = .05;
var words = [english,french,german,spanish];
var useLang = [true,true,true,true];
var iteration;
var training = false;
var nWeights1 = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[1]];
var nWeights2 = [[],[],[],[]];

var charVector = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

// 20 characters allowed (a-z,\s,<other>) + bias weight (20x28+1 inputs total)
var inputs = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[1]];
// 20 nodes in hidden layer + bias weight
var weights1 = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[1]];
var nodes1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
var delta1 = [];
// 4 nodes in output layer (en,fr,de,es)
var weights2 = [[],[],[],[]];
var nodes2 = [0,0,0,0];
var delta2 = [];



// function to randomly initialise weights
function initialise() {
  for (var i=0; i<20; i++) for (var j=0; j<561; j++)
      weights1[i][j] = (Math.random()-.5)/10;

  for (var i=0; i<4; i++) for (var j=0; j<21; j++)
    weights2[i][j] = (Math.random()-.5)/2;

  iteration = 0;
  updateInfo();
  // updateGraph();
}



// function to perform a pass through the neural network
function pass( str ) {

  // first convert the input characters to vector format
  for (var i=0; i<20; i++) {
    inputs[i] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    if (i < str.length)
      if (["'","-","–"," ","."].includes(str[i])) inputs[i][26] = 1;
      else inputs[i][(alphabet.indexOf(str[i].toLowerCase())+28)%28] = 1;
  }

  // calculate excitations and sigmoids of hidden nodes
  for (var i=0; i<20; i++) {
    nodes1[i] = 0;
    for (var j=0; j<561; j++)
      nodes1[i] += weights1[i][j] * inputs[Math.floor(j/28)][j%28];
    nodes1[i] = 1/(1+Math.exp(-nodes1[i]));
  }

  // and the same for the output nodes
  for (var i=0; i<4; i++) {
    nodes2[i] = 0;
    for (var j=0; j<20; j++)
      nodes2[i] += weights2[i][j] * nodes1[j];
    nodes2[i] = 1/(1+Math.exp(-nodes2[i]));
  }
}



// function to perform backpropagation
function backpropagation() {
  delta1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  // second layer (to outputs)
  for (var i in nodes2) {
    delta2[i] = (nodes2[i]-(actual==i))*nodes2[i]*(1-nodes2[i]);
    for (var j in weights2[i]) {
      nWeights2[i][j] = weights2[i][j] - learningRate*delta2[i]*nodes1[j];
      if (j < 20) delta1[j] += delta2[i]*weights2[i][j];
    }
  }
  // first layer
  for (var j=0; j<20; j++) {
    delta1[j] *= nodes1[j]*(1-nodes1[j]);
    for (var k=0; k<561; k++)
      nWeights1[j][k] = weights1[j][k] - learningRate*delta1[j]*inputs[Math.floor(j/28)][j%28];
  }

  // update weights
  weights1 = nWeights1;
  weights2 = nWeights2;
}



// user input trial
function userTrial() {
  pass(document.getElementById("input-text").value);
  guess = nodes2.indexOf(Math.max(nodes2[0],nodes2[1],nodes2[2],nodes2[3]));
  updateTrialResults();
}



// training data trial
function dataTrial() {
  useLang[0] = document.getElementById("en").checked;
  useLang[1] = document.getElementById("fr").checked;
  useLang[2] = document.getElementById("de").checked;
  useLang[3] = document.getElementById("es").checked;

  actual = ++actual%4; while (!useLang[actual]) actual = ++actual%4;
  text = words[actual][Math.floor(Math.random()*5000)];
  document.getElementById("input-text").value = text;
  pass(text);
  guess = nodes2.indexOf(Math.max(nodes2[0],nodes2[1],nodes2[2],nodes2[3]));
  backpropagation();
  iteration++;
  updateTrialResults();
  updateTrainingResults();
  updateInfo();
  // updateGraph();
  storeInfo();
}



// function to do continuous training
function doTraining() {
  dataTrial();
  if (training) requestAnimationFrame(doTraining);
}

// start/stop continuous training
function startTraining() { if (!training) { training = true; doTraining(); }}
function stopTraining() { training = false; }
