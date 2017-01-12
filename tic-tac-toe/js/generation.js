$(Document).on("click","#toggle-ranking", function() { toggleRanking(); })
    .on("click","#mutation", function() { toggleMutation(); })
    .on("click","#gen1", function() { oneGeneration(); })
    .on("click","#gen10", function() { tenGenerations(); })
    .on("click","#gen100", function() { hundredGenerations(); })
    .on("click","#gen1000", function() { thousandGenerations(); })
    .on("click","#random", function() { generateNewWeights(); });
$(function onload() { generateNewWeights(); });
$(function onload() { document.getElementById("generation").innerHTML="Generation 0"; });

var generation = 0;
var generations = [];
var winPercentages = [];
var tiePercentages = [];

// set to true to rank by self-play; false to rank by play against random
var useSelfPlay = false;

// set to true for fine tuning; false for high mutation rate
var fineTuning = false;


function toggleRanking() {
    useSelfPlay = !useSelfPlay;
    document.getElementById("toggle-ranking").innerHTML
        = (useSelfPlay)? "Self training":"Random training";
}


function toggleMutation() {
    fineTuning = !fineTuning;
    document.getElementById("mutation").innerHTML =
        (fineTuning)? "Fine tuning":"High mutation rate";
}


function oneGeneration() {
    iterate();

    generation += 1;
    document.getElementById("generation").innerHTML = "Generation " + generation;
    printWeights();
    addDataPoint();
    updateGraph();
}


function tenGenerations() {
    for (var i = 0; i < 10; i++) {
        iterate();
        generation ++;
        addDataPoint();
    }

    updateGraph();
    document.getElementById("generation").innerHTML = "Generation " + generation;
    printWeights();
}


function hundredGenerations() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++)
            iterate();

        generation += 10;
        addDataPoint();
    }
  
    updateGraph();  
    document.getElementById("generation").innerHTML = "Generation " + generation;
    printWeights();
}


function thousandGenerations() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 100; j++)
            iterate();

        generation += 100;
        addDataPoint();
    }
  
    updateGraph();  
    document.getElementById("generation").innerHTML = "Generation " + generation;
    printWeights();
}


function generateNewWeights() {
    generation = 0;
    generations = [];
    winPercentages = [];
    tiePercentages = [];
    for (var i = 0; i < 100; i++) {
        weights[i] = randWeights();
    }
    sortWeights();
    printWeights();
    addDataPoint();
    updateGraph();
}






function vary(parent) {
    var child =[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 19; j++) {
            child[i][j] = Math.round((parent[i][j] + Math.random() * .4 - .2)*10)/10;
        }
    }
    for (var i = 15; i < 24; i++) {
        for (var j = 0; j < 16; j++) {
            child[i][j] = Math.round((parent[i][j] + Math.random() * .4 - .2)*10)/10;
        }
    }
    return child;
}



function iterate() {


    if (fineTuning) {
        var i = 25
        for (var count = 0; count < 5; count++) {
            weights[i] = vary(weights[0]);
            i++;
        }
        for (var parent = 1; parent < 3; parent++)
            for (var count = 0; count < 4; count++) {
                weights[i] = vary(weights[parent]);
                i++;
            }
        for (var parent = 3; parent < 7; parent++)
            for (var count = 0; count < 3; count++) {
                weights[i] = vary(weights[parent]);
                i++;
            }
        for (var parent = 7; parent < 14; parent++)
             for (var count = 0; count < 2; count++) {
                weights[i] = vary(weights[parent]);
                i++;
            }
        for (var parent = 14; parent < 25; parent++) {
            weights[i] = vary(weights[parent]);
            i++;
        }
        for (var count = 0; count < 25; count++) {
            weights[i] = randWeights();
            i++;
        }


    } else if (!fineTuning)
        for (var i = 1; i < 100; i++)
            weights[i] = vary(weights[0]);


    sortWeights();
}



function addDataPoint() {
    var winsAndTies = randComparison(0,1000);
    var win = winsAndTies[0], tie = winsAndTies[1];

    document.getElementById("vs-random").innerHTML = "Best player beats random in " +
        win + "% of games <br>" + "and ties " + tie + "%";

    generations.push(generation);
    winPercentages.push( {x: generation, y: win} );
    tiePercentages.push( {x: generation, y: win + tie} );
}



function randComparison(n,games) {
    var victories = 0;
    var ties = 0;
    for (var count = 0; count < games; count++) {
        
        boardState = [0,0,0,0,0,0,0,0,0];
        var winner = 0;
        while (true) {

            boardState[ findBestMove(weights[n]) ] = -1;
            winner = checkWin();
            if (winner != 0) break;

            var randMove = 0;
            while (true) {
                randMove = Math.floor( Math.random() * 9 );
                if (boardState[randMove] == 0) break;
            }
            boardState[ randMove ] = 1;
            winner = checkWin();
            if (winner != 0) break;

        }
        if (winner == 11) ties++;
        if (winner == -1) victories++;


        boardState = [0,0,0,0,0,0,0,0,0];
        var winner = 0;
        while (true) {

            var randMove = 0;
            while (true) {
                randMove = Math.floor( Math.random() * 9 );
                if (boardState[randMove] == 0) break;
            }
            boardState[ randMove ] = 1;
            winner = checkWin();
            if (winner != 0) break;

            boardState[ findBestMove(weights[n]) ] = -1;
            winner = checkWin();
            if (winner != 0) break;

        }
        if (winner == -1) victories++;
        if (winner == 11) ties++;
    }

    var winPercentOfTotal = victories/20,
        tiePercentOfTotal = ties/20,
        winPercentOfAllWins = victories/(20-ties/100);
    return [winPercentOfTotal, tiePercentOfTotal, winPercentOfAllWins];
}



function sortWeights() {
    victoryCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


    if (useSelfPlay) {
        for (var i = 1; i < 100; i++)
            for (var j = 0; j < i; j++) {
                var winner = bestOf(i,j);
                if (winner == -1) {
                    victoryCount[i] += .5;
                    victoryCount[j] += .5;
                } else
                    victoryCount[winner]++;

                winner = bestOf(j,i);
                if (winner == -1) {
                    victoryCount[i] += .5;
                    victoryCount[j] += .5;
                } else
                    victoryCount[winner]++;
            }


    } else if (!useSelfPlay)
        for (var i = 1; i < 100; i++)
            victoryCount[i] = randComparison(i,100)[2];


    var ranking = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,
                  20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,
                  40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,
                  60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,
                  80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99],
        rankedWeights = [];
    ranking.sort( function(a,b) {return victoryCount[b] - victoryCount[a]} );

    for (var j = 0; j < 100; j++)
        rankedWeights[j] = weights[[ranking[j]]];
    weights = rankedWeights;
}

function bestOf(a,b) {
    boardState = [0,0,0,0,0,0,0,0,0];
    var turn = a;
    while (true) {

        for (var i in boardState)
            boardState[i] = -boardState[i];

        boardState[ findBestMove(weights[turn]) ] = -1;

        winner = checkWin();
        if (winner == 11)
            return -1;
        else if (winner != 0)
            return turn;

        turn = (turn == a)? b:a;
    }
}



function randWeights() {
    var rand = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 18; j++) {
            rand[i][j] = Math.round((Math.random() * 6 - 3)*10)/10;
        }
        rand[i][18] = Math.round((Math.random() * 2 - 1)*100)/10;
    }
    for (var i = 15; i < 24; i++) {
        for (var j = 0; j < 15; j++) {
            rand[i][j] = Math.round((Math.random() * 6 - 3)*10)/10;
        }
        rand[i][15] = Math.round((Math.random() * 2 - 1)*100)/10;
    }
    return rand;
}



function updateGraph() {
    var lineChartData = {
        datasets: [
            { data: winPercentages, borderColor: "rgba(50,150,250,1)",
             label: "Victory %", fill: true, backgroundColor: "rgba(50,150,250,0.3)" },
            { data: tiePercentages, borderColor: "rgba(200,200,100,1)",
             label: "With ties" }
        ],
    };
    var chartContainer = document.getElementById("chart").getContext('2d');
    new Chart.Line(chartContainer, {
        data: lineChartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100
                    }
                }],
                xAxes: [{
                    type: "linear",
                    position: "bottom"
                }]
            }
        }});
}



function printWeights() {
    document.getElementById("best").innerHTML =
        "H1 (" + weights[0][0].slice(0,18) + "), bias " + weights[0][0][18] + "<br>" +
        "H2 (" + weights[0][1].slice(0,18) + "), bias " + weights[0][1][18] + "<br>" +
        "H3 (" + weights[0][2].slice(0,18) + "), bias " + weights[0][2][18] + "<br>" +
        "H4 (" + weights[0][3].slice(0,18) + "), bias " + weights[0][3][18] + "<br>" +
        "H5 (" + weights[0][4].slice(0,18) + "), bias " + weights[0][4][18] + "<br>" +
        "H6 (" + weights[0][5].slice(0,18) + "), bias " + weights[0][5][18] + "<br>" +
        "H7 (" + weights[0][6].slice(0,18) + "), bias " + weights[0][6][18] + "<br>" +
        "H8 (" + weights[0][7].slice(0,18) + "), bias " + weights[0][7][18] + "<br>" +
        "H9 (" + weights[0][8].slice(0,18) + "), bias " + weights[0][8][18] + "<br>" +
        "H10 ("+ weights[0][9].slice(0,18) + "), bias " + weights[0][9][18] + "<br>" +
        "H11 ("+ weights[0][10].slice(0,18) +"), bias " + weights[0][10][18] +"<br>" +
        "H12 ("+ weights[0][11].slice(0,18) +"), bias " + weights[0][11][18] +"<br>" +
        "H13 ("+ weights[0][12].slice(0,18) +"), bias " + weights[0][12][18] +"<br>" +
        "H14 ("+ weights[0][13].slice(0,18) +"), bias " + weights[0][13][18] +"<br>" +
        "H15 ("+ weights[0][14].slice(0,18) +"), bias " + weights[0][14][18] +"<br><br>"+
        "O1 (" + weights[0][15].slice(0,15) +"), bias " + weights[0][15][15] +"<br>" +
        "O2 (" + weights[0][16].slice(0,15) +"), bias " + weights[0][16][15] +"<br>" +
        "O3 (" + weights[0][17].slice(0,15) +"), bias " + weights[0][17][15] +"<br>" +
        "O4 (" + weights[0][18].slice(0,15) +"), bias " + weights[0][18][15] +"<br>" +
        "O5 (" + weights[0][19].slice(0,15) +"), bias " + weights[0][19][15] +"<br>" +
        "O6 (" + weights[0][20].slice(0,15) +"), bias " + weights[0][20][15] +"<br>" +
        "O7 (" + weights[0][21].slice(0,15) +"), bias " + weights[0][21][15] +"<br>" +
        "O8 (" + weights[0][22].slice(0,15) +"), bias " + weights[0][22][15] +"<br>" +
        "O9 (" + weights[0][23].slice(0,15) +"), bias " + weights[0][23][15];

    document.getElementById("rest").innerHTML = "<br>";
    for (var i = 1; i < 10; i++) {
        var playerRank = i + 1;
        document.getElementById("rest").innerHTML += playerRank + "<br><br>" +
        "H1 (" + weights[i][0].slice(0,18) + "), bias " + weights[i][0][18] + "<br>" +
        "H2 (" + weights[i][1].slice(0,18) + "), bias " + weights[i][1][18] + "<br>" +
        "H3 (" + weights[i][2].slice(0,18) + "), bias " + weights[i][2][18] + "<br>" +
        "H4 (" + weights[i][3].slice(0,18) + "), bias " + weights[i][3][18] + "<br>" +
        "H5 (" + weights[i][4].slice(0,18) + "), bias " + weights[i][4][18] + "<br>" +
        "H6 (" + weights[i][5].slice(0,18) + "), bias " + weights[i][5][18] + "<br>" +
        "H7 (" + weights[i][6].slice(0,18) + "), bias " + weights[i][6][18] + "<br>" +
        "H8 (" + weights[i][7].slice(0,18) + "), bias " + weights[i][7][18] + "<br>" +
        "H9 (" + weights[i][8].slice(0,18) + "), bias " + weights[i][8][18] + "<br>"+
        "H10 ("+ weights[i][9].slice(0,18) + "), bias " + weights[i][9][18] + "<br>" +
        "H11 ("+ weights[i][10].slice(0,18) +"), bias " + weights[i][10][18] +"<br>" +
        "H12 ("+ weights[i][11].slice(0,18) +"), bias " + weights[i][11][18] +"<br>" +
        "H13 ("+ weights[i][12].slice(0,18) +"), bias " + weights[i][12][18] +"<br>" +
        "H14 ("+ weights[i][13].slice(0,18) +"), bias " + weights[i][13][18] +"<br>" +
        "H15 ("+ weights[i][14].slice(0,18) +"), bias " + weights[i][14][18] +"<br><br>"+
        "O1 (" + weights[i][15].slice(0,15) +"), bias " + weights[i][15][15] +"<br>" +
        "O2 (" + weights[i][16].slice(0,15) +"), bias " + weights[i][16][15] +"<br>" +
        "O3 (" + weights[i][17].slice(0,15) +"), bias " + weights[i][17][15] +"<br>" +
        "O4 (" + weights[i][18].slice(0,15) +"), bias " + weights[i][18][15] +"<br>" +
        "O5 (" + weights[i][19].slice(0,15) +"), bias " + weights[i][19][15] +"<br>" +
        "O6 (" + weights[i][20].slice(0,15) +"), bias " + weights[i][20][15] +"<br>" +
        "O7 (" + weights[i][21].slice(0,15) +"), bias " + weights[i][21][15] +"<br>" +
        "O8 (" + weights[i][22].slice(0,15) +"), bias " + weights[i][22][15] +"<br>" +
        "O9 (" + weights[i][23].slice(0,15) +"), bias " + weights[i][23][15] +
        "<br><br><br><br>"; }
}