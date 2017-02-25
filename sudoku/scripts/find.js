var numInput, fullRowSequence, blockRowSequence, rowStrings, tempInput, tempTempInput, bestRow, bestRowMatches, bestBlock, bestBlockMatches, matches, blockMatches, temp = new Array(9), highlight;

function findInput() {
  numInput = '';
  fullRowSequence = {};
  rowStrings = [];
  for (var i=0; i<9; i++) rowStrings.push(states[i].join(''));
  for (var i in input) numInput += decode[input[i].toUpperCase()] || '';
  tempInput = numInput;

  while (tempInput.length > 0) {

    tempTempInput = tempInput;
    bestBlock = [];
    bestBlockMatches = 0;
    for (var block=0; block<9; block+=3) {

      blockMatches = 0;
      blockRowSequence = [];
      bestRow = -1;
      bestRowMatches = 0;
      for (var row=0; row<3; row++) {

        str = rowStrings[3*block+row];
        if (str == '') continue;

        matches = 0;
        while (str.indexOf(tempTempInput[matches]) >= 0)
          str = str.slice(str.indexOf(tempInput[matches++])+1);
        if (matches > bestRowMatches) {
          bestRowMatches = matches;
          bestRow = i;
        }
      }
      if (bestRow < 0) return false;
      rowSequence.push(bestRow);
      rowStrings[bestRow] = '';
      tempTempInput = tempTempInput.slice(bestRowMatches);
    }




    bestRow = -1;
    bestRowMatches = 0;

    for (var i in rowStrings) {
      str = rowStrings[i];
      if (str == '') continue;
      matches = 0;
      while (str.indexOf(tempInput[matches]) >= 0)
        str = str.slice(str.indexOf(tempInput[matches++])+1);
      if (matches > bestRowMatches) {
        bestRowMatches = matches;
        bestRow = i;
      }
    }
    if (bestRow < 0) return false;
    rowSequence.push(bestRow);
    rowStrings[bestRow] = '';
    tempInput = tempInput.slice(bestRowMatches);
  }







  matches = 0;
  highlight = [];
  for (var i in rowSequence) {
    for (var j=0; j<9; j++) {
      temp[j] = states[i][j];
      states[i][j] = states[rowSequence[i]][j];
      states[rowSequence[i]][j] = temp[j];

      if (states[i][j] == numInput[matches]) {
        highlight.push(9*i+j);
        matches++;
      }
    }
    index = rowSequence.indexOf(i);
    if (index >= 0) {
      rowSequence[index] = rowSequence[i];
      rowSequence[i] = i;
    }
  }







  for (var row=0; row<9; row++)
  for (var col=0; col<9; col++)
    $(grid[9*row+col]).text(encode[states[row][col]]);

  for (var i in highlight)
    $(grid[highlight[i]]).css('background','yellow');
  return true;
}