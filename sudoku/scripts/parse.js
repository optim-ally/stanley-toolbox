var remaining, input, counts, encode, decode, char, numOfLetters, letterIndex;

function parseInput() {
  remaining = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  input = $('input').val();
  counts = {};
  encode = {};
  decode = {};

  for (var i in input) {
    char = input[i].toUpperCase();
    if (char == ' ') continue;
    if (counts[char] == undefined) {
      counts[char] = 1;
    } else counts[char] += 1;
    letterIndex = remaining.indexOf(char);
    if (letterIndex >= 0)
      remaining = remaining.slice(0,letterIndex) + remaining.slice(letterIndex+1);
  }

  numOfLetters = Object.keys(counts).length;
  if (numOfLetters > 9) {
    alert('Too many different letters!');
    return false;
  } else
    for (var i=0; i<9-numOfLetters; i++) {
      letterIndex = Math.floor(Math.random()*(remaining.length));
      counts[remaining[letterIndex]] = 0;
      remaining = remaining.slice(0,letterIndex) + remaining.slice(letterIndex+1);
    }

  letterIndex = 1;
  for (var letter in counts) {
    if (counts[letter] > 9) {
      alert("Too many '" + letter + "'s");
      return false;
    }
    counts[letter] = 9-counts[letter];
    encode[letterIndex] = letter;
    decode[letter] = ''+letterIndex;
    letterIndex++;
  }
  return true;
}