function Quine() {a = "function Quine() {a = ; return a.substr(0,23)+'&~'+a+'&~'+a.substr(23,38).replace(/~/g,'#34;')+a.substr(61);}"; return a.substr(0,23)+'"'+a+'"'+a.substr(23,38).replace(/~/g,'#34;')+a.substr(61);}

document.getElementById('quine-1').innerHTML = Quine();



function Q(){a="function Q(){a=;return a.slice(0,15)+'&~'+a+'&~'+a.slice(15,48).replace(/~/g,'#34')+a.slice(48)}";return a.slice(0,15)+'"'+a+'"'+a.slice(15,48).replace(/~/g,'#34')+a.slice(48)}

document.getElementById('quine-2').innerHTML = Q();



function q(){a="function q(){a=;return a.slice(0,15)+JSON.stringify(a)+a.slice(15)}";return a.slice(0,15)+JSON.stringify(a)+a.slice(15)}
                                                                                                                                    
document.getElementById('quine-3').innerHTML = q();