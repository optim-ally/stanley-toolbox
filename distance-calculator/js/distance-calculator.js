var start, end, startOk, endOk, lat, lon, α, x, y, currentPoint, nextPoint,
    ctx = document.getElementById("map-plot").getContext("2d"), dist;
ctx.lineWidth = 1; ctx.strokeStyle = "#0000FF";
window.onload(document.getElementById("from").focus());

function findDistance() {
    ctx.clearRect(0, 0, 720, 360);
    start = scrapeLatLon(document.getElementById("from").textContent);
    end = scrapeLatLon(document.getElementById("to").textContent);

    startOk = (start == undefined)? 0 : (abs(start[0])<=90)*(abs(start[1])<=180);
    endOk = (end == undefined)? 0 : (abs(end[0])<=90)*(abs(end[1])<=180);
    if (!startOk || !endOk) {
        if (!startOk) document.getElementById("from").style.cssText =
            "background-color:#FFBBBB; border:2px solid red";
        if (!endOk) document.getElementById("to").style.cssText =
            "background-color:#FFBBBB; border:2px solid red"; }

    else { getDistance(start,end); getInfo(start,end);
        start = [toRadians(start[0]),toRadians(start[1])];
        end = [toRadians(end[0]),toRadians(end[1])];
        circle(start); line(start,end); circle(end); }
}

function winkel3xy( latlon ) {
    lat = latlon[0]; lon = latlon[1];
    α = Math.acos(cos(lat)*cos(lon/2));
    x = 360 + 140.03443*( lon/Math.PI + cos(lat)*sin(lon/2)/sinc(α) );
    y = 180 - 57.29578*( lat + sin(lat)/sinc(α) );
    return [x,y];
}

function circle( latlon ) {
    xy = winkel3xy( latlon );
    ctx.beginPath();
    ctx.arc(xy[0],xy[1],2,0,2*Math.PI,false);
    ctx.stroke();
    ctx.closePath();
}

function line( start, end ) {
    var startX = cos(start[0])*cos(start[1]), endX = cos(end[0])*cos(end[1]),
        startY = cos(start[0])*sin(start[1]), endY = cos(end[0])*sin(end[1]),
        startZ = sin(start[0]),               endZ = sin(end[0]);
    currentPoint = startToEndStep(0);
    ctx.beginPath();
    ctx.moveTo(currentPoint[0],currentPoint[1]);
    for (var r=1; r<1000; r+=1) {
        nextPoint = startToEndStep(r);
        if (abs(currentPoint[0]-nextPoint[0]) > 360
            || abs(nextPoint[1]-180) > 170 || abs(currentPoint[1]-180) > 170)
            ctx.moveTo(nextPoint[0],nextPoint[1]);
        else ctx.lineTo(nextPoint[0],nextPoint[1]);
        currentPoint = nextPoint;
    }
    ctx.stroke();
    ctx.closePath();

    function startToEndStep( r ) {
        var newX = (1000-r)*startX + r*endX,
            newY = (1000-r)*startY + r*endY,
            newZ = (1000-r)*startZ + r*endZ;
        var newLat = Math.atan2(newZ,Math.sqrt(newX*newX + newY*newY)),
            newLon = Math.atan2(newY,newX);
        return winkel3xy([newLat,newLon]);
    }
}

function cos( θ ) { return Math.cos(θ); }
function sin( θ ) { return Math.sin(θ); }
function sinc( x ) { return (x == 0)? 1 : sin(x)/x; }
function abs( x ) { return Math.abs(x); }
function toRadians( deg ) { return deg/180 * Math.PI; }

function getDistance( start, end ) {
    dist = distance(start[0],start[1],end[0],end[1]);
    document.getElementById("distance").innerHTML =
        dist+" km , &nbsp;"+Math.round(Number(dist*621.37))/1000+" miles";
}

function distance( lat1, lon1, lat2, lon2 ) {
    var R = 6371000, φ1 = toRadians(lat1), φ2 = toRadians(lat2),
        δλ = toRadians(lon1) - toRadians(lon2);
    return Math.round(R*Math.acos(cos(φ1)*cos(φ2)*cos(δλ)+sin(φ1)*sin(φ2)))/1000;
}




function getInfo( start, end ) {
    var info1 = "", info2 = "", fromCity, toCity,
        lat1 = Math.round(start[0]*1000)/1000,
        lon1 = Math.round(start[1]*1000)/1000,
        lat2 = Math.round(end[0]*1000)/1000,
        lon2 = Math.round(end[1]*1000)/1000;
    var from = { "exact":false, "near":false, "latlon":"" },
        to = { "exact":false, "near":false, "latlon":"" };

    from.latlon = ((lat1 > 0)? lat1 + "\xB0N, " : -lat1 + "\xB0S, ")
                 +((lon1 > 0)? lon1 + "\xB0E" : -lon1 + "\xB0W");
    to.latlon = ((lat2 > 0)? lat2 + "\xB0N, " : -lat2 + "\xB0S, ")
               +((lon2 > 0)? lon2 + "\xB0E" : -lon2 + "\xB0W");

    var fromCity = nearestTo(lat1,lon1), toCity = nearestTo(lat2,lon2);
    if (fromCity.distance < 1) from.exact = true;
    else if (fromCity.distance < Math.max(50,dist/10)) from.near = true;
    if (toCity.distance < 1) to.exact = true;
    else if (toCity.distance < Math.max(50,dist/10)) to.near = true;

    fromCity = country_capitals[fromCity.index];
    toCity = country_capitals[toCity.index];

    if (fromCity.CapitalName === "Jerusalem") fromCity = fromCity.CapitalName;
    else if (fromCity.CapitalName === "N/A") fromCity = fromCity.CountryName;
    else fromCity = fromCity.CapitalName+", "+fromCity.CountryName;

    if (toCity.CapitalName === "Jerusalem") toCity = toCity.CapitalName;
    else if (toCity.CapitalName === "N/A") toCity = toCity.CountryName;
    else toCity = toCity.CapitalName+", "+toCity.CountryName;

    var br = "</p><p>";

    if (from.exact) info1 = "<p>"+fromCity+br+from.latlon+"</p>";
    else if (from.near) info1 = "<p>"+from.latlon+br+"Near "+fromCity+"</p>";
    else info1 = "<p>"+from.latlon+br+"Closest capital: "+fromCity+"</p>";

    if (to.exact) info2 = "<p>"+toCity+br+to.latlon+"</p>";
    else if (to.near) info2 = "<p>"+to.latlon+br+"Near "+toCity+"</p>";
    else info2 = "<p>"+to.latlon+br+"Closest capital: "+toCity+"</p>";

    document.getElementById("from-info").innerHTML = info1;
    document.getElementById("to-info").innerHTML = info2;
}

function getIndex(name) {
    name = name.toLowerCase();
    for (var i in country_capitals) {
        if (country_capitals[i].CountryName.toLowerCase() === name || country_capitals[i].CapitalName.toLowerCase() === name || country_capitals[i].CountryCode.toLowerCase() === name || name.includes(country_capitals[i].CountryName.toLowerCase()) || name.includes(country_capitals[i].CapitalName.toLowerCase()))
            return i;
    } return -1;
}

function nearestTo(lat, lon) {
    var minSoFar = {"index":-1,"distance":10000};
    for (var i in country_capitals) {
        currentDist = distance(lat, lon, country_capitals[i].CapitalLatitude, country_capitals[i].CapitalLongitude)
        if ( currentDist < minSoFar.distance )
            minSoFar.index = i, minSoFar.distance = currentDist;
    } return minSoFar;
}




function scrapeLatLon( str ) {
    if (!isNaN(str[0]) || str[0] === "-") {
    if (!str.includes(",")) return;
    var latitude = str.split(",")[0].trim().toLowerCase(),
        longitude = str.split(",")[1].trim().toLowerCase();

    if (!latitude.includes("n") && !latitude.includes("s")) {
        if (isNaN(latitude)) return;
        latitude = Number(latitude);
    } else {
        if (latitude[0] === "-") return;
        else if (!latitude.includes("'")) {
            latitude = latitude.replace("\xB0","");
            if (latitude.slice(-1)==="s" && !isNaN(latitude.slice(0,-1)))
                latitude = -Number(latitude.slice(0,-1));
            else if (latitude.slice(-1)==="n"  &&  !isNaN(latitude.slice(0,-1)))
                latitude = Number(latitude.slice(0,-1));
            else return;
        } else if (!latitude.includes("\"")) {
            var deg = latitude.slice(0,latitude.indexOf("\xB0"));
            latitude = latitude.slice(latitude.indexOf("\xB0")+1);
            var mins = latitude.slice(0,latitude.indexOf("'"));
            direction = latitude.slice(latitude.indexOf("'")+1);
            if ( mins === "" ) return;
            if ( !isNaN(deg) && !isNaN(mins) ) {
                if (mins < 0 || mins > 59) return;
                if (direction==="s") latitude = -Number(deg)-Number(mins)/60;
                else if (direction==="n")
                    latitude = Number(deg)+Number(mins)/60;
            } else return;
        } else {
            var deg = latitude.slice(0,latitude.indexOf("\xB0"));
            latitude = latitude.slice(latitude.indexOf("\xB0")+1);
            var mins = latitude.slice(0,latitude.indexOf("'"));
            latitude = latitude.slice(latitude.indexOf("'")+1);
            var secs = latitude.slice(0,latitude.indexOf("\""));
            direction = latitude.slice(latitude.indexOf("\"")+1);
            if (mins === "" || secs === "") return;
            if (!isNaN(deg) && !isNaN(mins) && !isNaN(secs)) {
                if (mins < 0 || secs < 0) return;
                if (mins > 59 || secs > 59) return;
                if (direction==="s")
                    latitude = -Number(deg)-Number(mins)/60 -Number(secs)/3600;
                else if (direction==="n")
                    latitude = Number(deg)+Number(mins)/60+Number(secs)/3600;
            } else return;
        }
    }

    if (!longitude.includes("e") && !longitude.includes("w")) {
        if (isNaN(longitude)) return;
        longitude = Number(longitude); }
    else {
        if (longitude[0] === "-") return;
        else if (!longitude.includes("'")) {
            longitude = longitude.replace("\xB0","");
            if (longitude.slice(-1)==="w" && !isNaN(longitude.slice(0,-1)))
                longitude = -Number(longitude.slice(0,-1));
            else if (longitude.slice(-1)==="e" && !isNaN(longitude.slice(0,-1)))
                longitude = Number(longitude.slice(0,-1));
            else return;
        } else if (!longitude.includes("\"")) {
            var deg = longitude.slice(0,longitude.indexOf("\xB0"));
            longitude = longitude.slice(longitude.indexOf("\xB0")+1);
            var mins = longitude.slice(0,longitude.indexOf("'"));
            direction = longitude.slice(longitude.indexOf("'")+1);
            if (mins === "") return; if (!isNaN(deg) && !isNaN(mins)) {
                if (mins < 0 || mins > 59) return;
                if (direction==="w") longitude = -Number(deg)-Number(mins)/60;
                else if (direction==="e")
                    longitude = Number(deg)+Number(mins)/60; }
                else return 2;
        } else {
            var deg = longitude.slice(0,longitude.indexOf("\xB0"));
            longitude = longitude.slice(longitude.indexOf("\xB0")+1);
            var mins = longitude.slice(0,longitude.indexOf("'"));
            longitude = longitude.slice(longitude.indexOf("'")+1);
            var secs = longitude.slice(0,longitude.indexOf("\""));
            direction = longitude.slice(longitude.indexOf("\"")+1);
            if (mins === "" || secs === "") return;
            if (!isNaN(deg) && !isNaN(mins) && !isNaN(secs)) {
                if (mins < 0 || secs < 0) return;
                if (mins > 59 || secs > 59) return;
                if (direction==="w")
                    longitude = -Number(deg)-Number(mins)/60-Number(secs)/3600;
                else if (direction==="e")
                    longitude = Number(deg)+Number(mins)/60+Number(secs)/3600;
            } else return;
        }
    }
    return [latitude,longitude];
    }
    var placeIndex = getIndex(str);
    if (placeIndex == -1 ) return;
    return [Number(country_capitals[placeIndex].CapitalLatitude), Number(country_capitals[placeIndex].CapitalLongitude)];
}