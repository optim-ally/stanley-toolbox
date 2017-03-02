// parameters for search accuracy:

// set the number of characters from start of string to check against the database
// higher = more accurate, more error tolerance
// lower = faster
var searchLength = 5;

// set the number of errors allowed (Levenshtein distance metric)
// higher = more results
// lower = better matched results
var sensitivity = 3;


// initialise other variables / html objects
var divs, overNum = -1, searchActive = 0 , searchFrom = trimWords(names),
    suggestions = [], field, input, results, suggestion, lowerNames = [],
    from = document.getElementById("from"),
    to = document.getElementById("to"),
    fromDivs = document.getElementsByClassName("from"),
    toDivs = document.getElementsByClassName("to");

for (var i in names) lowerNames.push(names[i].toLowerCase());



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// listener to update search whenever the input is changed
// ––––––––––––––––––––––––––––––––––––––––––––––––––
document.addEventListener("keydown", function( e ) {
  field = document.activeElement;

  // detect <tab> out of field
  if (e.which == 9 && searchActive) {
    clearSuggestions();
    overNum = -1; searchActive = false;
  // detect <enter>
  // either search or, if currently navigating search results using up- and down-arrows, select current search result
  } else if (e.which == 13) {
    e.preventDefault();
    if (overNum>-1 && overNum<suggestions.length)
      field.innerHTML = suggestions[overNum];
    else
      findDistance();
    clearSuggestions();
    overNum = -1;
    searchActive = false;
  // detect <up arrow>
  } else if (e.which == 38 && searchActive) {
    e.preventDefault();
    overNum = Math.max(overNum-1,-1);
  // detect <down arrow>
  } else if (e.which == 40) {
    e.preventDefault();
    (searchActive)? overNum = Math.min(overNum+1,suggestions.length) : suggest((field.id == "from")? "from" : "to");
  }
  showSuggestion();
}, false);



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to hide all search results (e.g. when location has been selected)
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function clearSuggestions() {
  overNum = -1; searchActive = false;
  for (var i=0; i<5; i++) {
    fromDivs[i].style.visibility = "hidden"; toDivs[i].style.visibility = "hidden";
  }
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to show all search results (e.g. when typing in search field)
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function showSuggestion() {
  divs = (field.id == "from")? fromDivs : toDivs;
  for (var i=0; i<5; i++)
    divs[i].style.backgroundColor = "white";
  if (overNum > -1)
    divs[overNum].style.backgroundColor = "#CCCCCC";
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to update the selected search result (e.g. with up- or down-arrows)
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function over( i ) {
    if (searchActive) {
      overNum = i;
      showSuggestion();
    }
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to confirm the selected search result
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function select( i ) {
  if (searchActive) {
    field.innerHTML = suggestions[i];
    clearSuggestions();
    overNum = -1;
    searchActive = false;
    field.focus();
  }
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to get search results
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function suggest( fromOrTo ) {
  input = (fromOrTo == "from")? from : to;

  // reset formatting in case of previous failure to parse (background and border go red)
  input.style.cssText = "background-color: white; border:.5px solid black";
  input = input.innerHTML;

  // if coordinate input, do not give search results (only for place names)
  if (input[0] == "-" || !isNaN(input[0])) return;

  // otherwise...
  searchActive = true;
  overNum = -1;

  // show search results, but only if input is not empty and does not already match a place name exactly
  suggestions = (!input.length || lowerNames.includes(input.toLowerCase()))?
    [] : didYouMean(input.toLowerCase().slice(0,searchLength)).slice(0,5);

  // display best few search results in the webpage
  for (var i=1; i<6; i++) {
    suggestion = document.getElementById(fromOrTo+i);
    if (i > suggestions.length)
      suggestion.style.visibility = "hidden"; 
    else {
      suggestion.innerHTML = suggestions[i-1];
      suggestion.style.visibility = "visible";
    }
  }
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to find closest place names to the input string (Levenshtein distance metric)
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function didYouMean(strA) {
  // initialise array of results
  var near = [];

  // create array of all words in input name (e.g. 'El Salvador' is two words)
  strA = strA.trim().split(/[\s-]+/);

  // trim all input words to the longest relevant search length (according to initial search parameters)
  for (var i in strA)
    strA[i] = strA[i].slice(0,searchLength);

  // check for matching place names in the database
  // first check for exact matches
  for (var i in strA)
    for (var name in searchFrom) {
      var strB = searchFrom[name].split(/[\s-]+/);
      for (var j in strB)
        if (strA[i] == strB[j])
          near.push(names[name]);
    }
  // then check for superstrings
  for (var i in strA)
    for (var name in searchFrom) {
      var strB = searchFrom[name].split(/[\s]+/);
      for (var j in strB)
        if (strA[i].includes(strB[j]) || strB[j].includes(strA[i]))
          near.push(names[name]);
    }
  // finally check for similar strings
  for (var i in strA)
    for (var name in searchFrom) {
      var strB = searchFrom[name].split(/[\s-]+/);
      for (var j in strB)
        if (Lev(strA[i],strB[j]) < sensitivity && strB.length > 2)
          near.push(names[name]);
    }

  // remove repeated place names (e.g. 'Sel' matches twice with 'El Salvador')
  var newArray = [];
  for (var i in near)
    if (near.indexOf(near[i]) == i)
      newArray.push(near[i]);
  return newArray;
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// Levenshtein distance function
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function Lev(strA,strB) {
    var lenA = strA.length, lenB = strB.length;
    if (lenA == 0) return lenB;
    if (lenB == 0) return lenA;

    if (strA.slice(-1) == strB.slice(-1))
        return Lev(strA.slice(0,-1),strB.slice(0,-1));
    return Math.min( Lev(strA.slice(0,-1), strB)+1,
                    Lev(strB.slice(0,-1), strA)+1,
                    Lev(strA.slice(0,-1), strB.slice(0,-1))+1 );
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to remove unwanted letters (according to the initial search parameter 'searchlength') from the end of all place names in the database
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function trimWords(array) {
    var newArray = [];
    for (var i in array) {
        var strB = array[i].split(/[\s]+/);
        for (var j in strB)
            strB[j] = strB[j].slice(0,searchLength);
        newArray.push(strB.join(' ').toLowerCase());
    }
    return newArray;
}