var searchLength = 5, sensitivity = 3;

var from = document.getElementById("from"), to = document.getElementById("to"),
    fromDivs = document.getElementsByClassName("from"),
    toDivs = document.getElementsByClassName("to"),
    divs, overNum = -1, searchActive = 0 , searchFrom = trimWords(names),
    suggestions = [], field, input, results, suggestion, lowerNames = [];

for (var i in names) lowerNames.push(names[i].toLowerCase());

document.addEventListener("keydown", function( e ) {
    field = document.activeElement;

    if (e.which == 9 && searchActive) {
        clearSuggestions();
        overNum = -1; searchActive = false;
    } else if (e.which == 13) {
        e.preventDefault();
        if (overNum>-1 && overNum<suggestions.length)
            field.innerHTML = suggestions[overNum];
        else
            findDistance();
        clearSuggestions();
        overNum = -1;
        searchActive = false;
    } else if (e.which == 38 && searchActive) {
        e.preventDefault();
        overNum = Math.max(overNum-1,-1);
    } else if (e.which == 40) {
        e.preventDefault();
        (searchActive)? overNum = Math.min(overNum+1,suggestions.length) : suggest((field.id == "from")? "from" : "to");
    }
    showSuggestion();
}, false);

function clearSuggestions() {
    overNum = -1; searchActive = false;
    for (var i=0; i<5; i++) {
        fromDivs[i].style.visibility = "hidden"; toDivs[i].style.visibility = "hidden";
    }
}

function showSuggestion() {
    divs = (field.id == "from")? fromDivs : toDivs;
    for (var i=0; i<5; i++)
        divs[i].style.backgroundColor = "white";
    if (overNum > -1)
        divs[overNum].style.backgroundColor = "#CCCCCC";
}

function over( i ) {
    if (searchActive) { overNum = i; showSuggestion(); }
}

function select( i ) {
    if (searchActive) {
        field.innerHTML = suggestions[i];
        clearSuggestions();
        overNum = -1;
        searchActive = false;
        field.focus();
    }
}

function suggest( fromOrTo ) {
    input = (fromOrTo == "from")? from : to;
    input.style.cssText = "background-color: white; border:.5px solid black";
    input = input.innerHTML;
    if (input[0] == "-" || !isNaN(input[0])) return;
    searchActive = true;
    overNum = -1;

    suggestions = (!input.length || lowerNames.includes(input.toLowerCase()))?
        [] : didYouMean(input.toLowerCase().slice(0,searchLength)).slice(0,5);

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

function didYouMean(strA) {
    var near = []; strA = strA.trim().split(/[\s-]+/);
    for (var i in strA)
        strA[i] = strA[i].slice(0,searchLength);
    for (var i in strA)
        for (var name in searchFrom) {
            var strB = searchFrom[name].split(/[\s-]+/);
            for (var j in strB)
                if (strA[i] == strB[j])
                    near.push(names[name]);
        }
    for (var i in strA)
        for (var name in searchFrom) {
            var strB = searchFrom[name].split(/[\s]+/);
            for (var j in strB)
                if (strA[i].includes(strB[j]) || strB[j].includes(strA[i]))
                    near.push(names[name]);
        }
    for (var i in strA)
        for (var name in searchFrom) {
            var strB = searchFrom[name].split(/[\s-]+/);
            for (var j in strB)
                if (Lev(strA[i],strB[j]) < sensitivity && strB.length > 2)
                    near.push(names[name]);
        }
    var newArray = [];
    for (var i in near)
        if (near.indexOf(near[i]) == i)
            newArray.push(near[i]); return newArray;
}

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