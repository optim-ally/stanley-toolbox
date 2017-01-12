var fg=document.getElementById("text-fg"), bg=document.getElementById("text-bg"),
    make="none", txt, wrds, word, cases=[], firstVariantIndex, vars, listName;

function check( str, paste ) {
    make = str; paste = 0 || paste;
    txt = fg.innerHTML.replace(/<\/?span[^>]*>/g,"").replace(/&nbsp;/g,"º°");
    wrds = txt.replace(/(<([^>]+)>)/g," ").replace(/[^a-zA-Z-]/g," ").split(" ");

    for (var i in wrds.sort(function(a,b) { return b.length-a.length })) {
        word = wrds[i];
        if (!!word) txt = txt.replace(RegExp(word,"g"),preference(word)||word);
    }
    txt = txt.replace(/º°/g,"&nbsp;"); bg.innerHTML = txt;
    if (make !== "none" || paste) {
        txt = txt.replace(/<\/?span[^>]*>/g,""); fg.innerHTML = txt;
    }
}

function preference( str ) {
    cases = []; for (var i in str.split("")) cases[i] = (/[A-Z]/.test(str[i]));
    if (make !== "none") {
        firstVariantIndex = Math.floor(wordList.indexOf(str.toLowerCase())/9)*9;
        vars = wordList.slice(firstVariantIndex,firstVariantIndex+9);
        str = (make === "both")? both(str):(make === "uk")? uk(str):us(str);
    }
    listName = inList(str);
    for (var i=cases.length; i>=0; i--)
        if (cases[i]) str = str.slice(0,i)+(str[i].toUpperCase())+str.slice(i+1);
    return (!listName)? str:"<span class='"+listName+"'>"+str+"</span>";
}

function inList( str ) {
    for (var i in wordLists) if (wordLists[i].includes(str.toLowerCase()))
        return listNames[i];
    return "";
}

function uk( str ) { return vars[0] || vars[1] || vars[2] || vars[3] || str; }
function us( str ) { return vars[5] || vars[6] || vars[7] || vars[8] || str; }
function both( str ) {
    if (!!vars[4]) return vars[4];
    for (var i in vars) { listName = inList(vars[i]);
        if (listName === "uk-" || listName === "us-") return vars[i]; }
    return str;
}

window.onload(fg.focus());
fg.addEventListener("scroll",function() { bg.scrollTop = this.scrollTop; });
fg.addEventListener("paste",function(e) { e.preventDefault();
    if (e.clipboardData) {
        content = (e.originalEvent || e).clipboardData.getData("text/plain");
        document.execCommand("insertText",false,content); check("none",1); }
    else if (window.clipboardData) {
        content = window.clipboardData.getData("Text");
        document.selection.createRange().pasteHTML(content); }   
});