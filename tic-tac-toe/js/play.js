var currentPlayer = "X";
var computerPlayer = 0;

var cells = document.getElementsByTagName("td");

$(Document).on("click","td", function() {
    if (document.getElementById("winner").innerHTML === "") {
        if (this.innerHTML !== "")
            return;
        this.innerHTML = currentPlayer;
        updateBoardState();
        var winner = checkWin();
        if (winner == 0)
            window.setTimeout(computerMove,200);
        else if (winner == 11)
            document.getElementById("winner").innerHTML = "It's a tie";
        else
        document.getElementById("winner").innerHTML = (winner == 1)? "X wins":"O wins";
    }
}).on("click","#retry", function() {
    for (var i in cells)
        cells[i].innerHTML = "";
    document.getElementById("winner").innerHTML = "";
    boardState = [0,0,0,0,0,0,0,0,0];
    if (currentPlayer === "O")
        computerMove();

}).on("click","#toggle-player", function() {
    if (currentPlayer === "X") {
        this.innerHTML = "Play as X"; currentPlayer = "O";
    } else {
        this.innerHTML = "Play as O"; currentPlayer = "X";
    }
    for (var i in cells)
        cells[i].innerHTML = "";
    document.getElementById("winner").innerHTML = "";
    boardState = [0,0,0,0,0,0,0,0,0];
    if (currentPlayer === "O")
        computerMove();
});



function computerMove() {
    if (currentPlayer == "O")
        for (var i in boardState)
            boardState[i] = -boardState[i];

    cells[ findBestMove(weights[0]) ].innerHTML = (currentPlayer === "X")? "O":"X";
    updateBoardState();

    var winner = checkWin();
    if (winner == 11)
        document.getElementById("winner").innerHTML = "It's a tie";
    else if (winner != 0)
        document.getElementById("winner").innerHTML = (winner == 1)? "X wins":"O wins";
}



function checkWin() {
    if ( Math.max(boardState[0]+boardState[1]+boardState[2],
                  boardState[3]+boardState[4]+boardState[5],
                  boardState[6]+boardState[7]+boardState[8],

                  boardState[0]+boardState[3]+boardState[6],
                  boardState[1]+boardState[4]+boardState[7],
                  boardState[2]+boardState[5]+boardState[8],

                  boardState[0]+boardState[4]+boardState[8],
                  boardState[2]+boardState[4]+boardState[6]) == 3 )
        return 1;
    else if ( Math.min(boardState[0]+boardState[1]+boardState[2],
                       boardState[3]+boardState[4]+boardState[5],
                       boardState[6]+boardState[7]+boardState[8],

                       boardState[0]+boardState[3]+boardState[6],
                       boardState[1]+boardState[4]+boardState[7],
                       boardState[2]+boardState[5]+boardState[8],

                       boardState[0]+boardState[4]+boardState[8],
                       boardState[2]+boardState[4]+boardState[6]) == -3 )
        return -1;
    else if (boardState[0]*boardState[1]*boardState[2]*
             boardState[3]*boardState[4]*boardState[5]*
             boardState[6]*boardState[7]*boardState[8] != 0)
        return 11;
    else
        return 0;
}