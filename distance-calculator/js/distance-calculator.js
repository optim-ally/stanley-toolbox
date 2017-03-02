var start, end, startOk, endOk, lat, lon, α, x, y, currentPoint, nextPoint,
    ctx = document.getElementById("map-plot").getContext("2d"), dist;

ctx.lineWidth = 1; ctx.strokeStyle = "#0000FF";
window.onload(document.getElementById("from").focus());


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// primary function: reads input fields and calls further functions to output the results
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function findDistance() {
  // clear any existing path on the map
  ctx.clearRect(0, 0, 720, 360);

  // scrapeLatLon function tries to extract a location from a string
  start = scrapeLatLon(document.getElementById("from").textContent);
  end = scrapeLatLon(document.getElementById("to").textContent);

  // if either field cannot be parsed, or if the latitude or longitude is out of range, terminate process and highlight that field
  startOk = (start == undefined)? 0 : (abs(start[0])<=90)*(abs(start[1])<=180);
  endOk = (end == undefined)? 0 : (abs(end[0])<=90)*(abs(end[1])<=180);
  if (!startOk || !endOk) {
    if (!startOk) document.getElementById("from").style.cssText =
      "background-color:#FFBBBB; border:2px solid red";
    if (!endOk) document.getElementById("to").style.cssText =
      "background-color:#FFBBBB; border:2px solid red"; }

  // successful parse:
  else {
    // ...output textual information
    getDistance(start,end);
    getInfo(start,end);
    // ...and draw new path on the map
    start = [toRadians(start[0]),toRadians(start[1])];
    end = [toRadians(end[0]),toRadians(end[1])];
    circle(start); line(start,end); circle(end); }
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to convert latitude-longitude to Winkel-Tripel cartesian coordinates
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function winkel3xy( latlon ) {
  // formulae are known
  lat = latlon[0]; lon = latlon[1];
  α = Math.acos(cos(lat)*cos(lon/2));
  // constants found by calculation / empirically derived
  x = 360 + 140.03443*( lon/Math.PI + cos(lat)*sin(lon/2)/sinc(α) );
  y = 180 - 57.29578*( lat + sin(lat)/sinc(α) );
  return [x,y];
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to draw a circle on the map at a specific latitude-longitude
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function circle( latlon ) {
    xy = winkel3xy( latlon );
    ctx.beginPath();
    ctx.arc(xy[0],xy[1],2,0,2*Math.PI,false);
    ctx.stroke();
    ctx.closePath();
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to draw a great circle line between two points on the map
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function line( start, end ) {
  // decompose into 3D cartesian coordinates
  var startX = cos(start[0])*cos(start[1]), endX = cos(end[0])*cos(end[1]),
      startY = cos(start[0])*sin(start[1]), endY = cos(end[0])*sin(end[1]),
      startZ = sin(start[0]),               endZ = sin(end[0]);

  // set up iteration, startToEndStep(0) is the start point
  currentPoint = startToEndStep(0);
  ctx.beginPath();
  ctx.moveTo(currentPoint[0],currentPoint[1]);

  // move along line parametrically, startToEndStep(1000) is the end point, but r <= 999 so as not to shade in the circle around the end point (the line stops short)
  for (var r=1; r<1000; r++) {
    nextPoint = startToEndStep(r);
    // check if edge wrapping (i.e. jump from Russia to Alaska)
    if (abs(currentPoint[0]-nextPoint[0]) > 360 || abs(nextPoint[1]-180) > 170 || abs(currentPoint[1]-180) > 170)
      ctx.moveTo(nextPoint[0],nextPoint[1]);
    // if not edge wapping: draw line to next point
    else ctx.lineTo(nextPoint[0],nextPoint[1]);
    currentPoint = nextPoint;
  }
  ctx.stroke();
  ctx.closePath();


  // internal function to calculate the rth point along the line (0 <= r <= 999)
  function startToEndStep( r ) {
    // first find the point r/1000 of the way along the straight line in 3D space (through the earth)
    var newX = (1000-r)*startX + r*endX,
        newY = (1000-r)*startY + r*endY,
        newZ = (1000-r)*startZ + r*endZ;
    // ...then project that point onto the surface of the Earth (alternatively, see this as finding the latitude-longitude of the point on a new, concentric sphere nested inside the Earth)
    var newLat = Math.atan2(newZ,Math.sqrt(newX*newX + newY*newY)),
        newLon = Math.atan2(newY,newX);
    // output the point as it appears on the Winkel-Tripel map projection
    return winkel3xy([newLat,newLon]);
  }
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// some essential mathematical functions
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function cos( θ ) { return Math.cos(θ); }
function sin( θ ) { return Math.sin(θ); }
function sinc( x ) { return (x == 0)? 1 : sin(x)/x; }
function abs( x ) { return Math.abs(x); }
function toRadians( deg ) { return deg/180 * Math.PI; }

function distance( lat1, lon1, lat2, lon2 ) {
    var R = 6371000, φ1 = toRadians(lat1), φ2 = toRadians(lat2),
        δλ = toRadians(lon1) - toRadians(lon2);
    return Math.round(R*Math.acos(cos(φ1)*cos(φ2)*cos(δλ)+sin(φ1)*sin(φ2)))/1000;
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to display distance results on the webpage
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function getDistance( start, end ) {
    dist = distance(start[0],start[1],end[0],end[1]);
    document.getElementById("distance").innerHTML =
        dist+" km , &nbsp;"+Math.round(Number(dist*621.37))/1000+" miles";
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to display the details of the two locations
//
// it decides if the user has selected a location corresponsing exactly to a certain capital city, closely to a certain city, or else it does not identify the point with a city and instead outputs the nearest city for the user's interest
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function getInfo( start, end ) {
  // initialise output strings and neaten inputs
  var info1 = "", info2 = "", fromCity, toCity,
      lat1 = Math.round(start[0]*1000)/1000,
      lon1 = Math.round(start[1]*1000)/1000,
      lat2 = Math.round(end[0]*1000)/1000,
      lon2 = Math.round(end[1]*1000)/1000;

  // store indicators (e.g. is the location in a city, or just near to one)
  var from = { "exact":false, "near":false, "latlon":"" },
      to = { "exact":false, "near":false, "latlon":"" };

  // convert +/- coordinate into N/S or E/W (positive) coordinates
  from.latlon = ((lat1 > 0)? lat1 + "\xB0N, " : -lat1 + "\xB0S, ")
               +((lon1 > 0)? lon1 + "\xB0E" : -lon1 + "\xB0W");
  to.latlon = ((lat2 > 0)? lat2 + "\xB0N, " : -lat2 + "\xB0S, ")
             +((lon2 > 0)? lon2 + "\xB0E" : -lon2 + "\xB0W");

  // find closest city (returns city index in the database and distance from location)
  var fromCity = nearestTo(lat1,lon1),
      toCity = nearestTo(lat2,lon2);
  // check if location is in the city or close to it (difficult to be precise with this)
  // if neither hold, the output message will just show the coordinates and give the closest capital city in brackets (even if it is 1000km away)
  if (fromCity.distance < 1) from.exact = true;
  else if (fromCity.distance < Math.max(50,dist/10)) from.near = true;
  if (toCity.distance < 1) to.exact = true;
  else if (toCity.distance < Math.max(50,dist/10)) to.near = true;

  // now get the city details from the database
  fromCity = country_capitals[fromCity.index];
  toCity = country_capitals[toCity.index];

  // special case: country of Jerusalem is contested 
  if (fromCity.CapitalName === "Jerusalem") fromCity = fromCity.CapitalName;
  else if (fromCity.CapitalName === "N/A") fromCity = fromCity.CountryName;
  else fromCity = fromCity.CapitalName+", "+fromCity.CountryName;

  if (toCity.CapitalName === "Jerusalem") toCity = toCity.CapitalName;
  else if (toCity.CapitalName === "N/A") toCity = toCity.CountryName;
  else toCity = toCity.CapitalName+", "+toCity.CountryName;

  // neatness: gives custom line break spacing
  var br = "</p><p>";

  // generate output message for start point
  if (from.exact) info1 = "<p>"+fromCity+br+from.latlon+"</p>";
  else if (from.near) info1 = "<p>"+from.latlon+br+"Near "+fromCity+"</p>";
  else info1 = "<p>"+from.latlon+br+"Closest capital: "+fromCity+"</p>";

  // generate output message for end point
  if (to.exact) info2 = "<p>"+toCity+br+to.latlon+"</p>";
  else if (to.near) info2 = "<p>"+to.latlon+br+"Near "+toCity+"</p>";
  else info2 = "<p>"+to.latlon+br+"Closest capital: "+toCity+"</p>";

  // finally, display the info on the webpage
  document.getElementById("from-info").innerHTML = info1;
  document.getElementById("to-info").innerHTML = info2;
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to find the index of a city, country, or country code in the database
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function getIndex(name) {
    name = name.toLowerCase();
    for (var i in country_capitals) {
        if (country_capitals[i].CountryName.toLowerCase() === name || country_capitals[i].CapitalName.toLowerCase() === name || country_capitals[i].CountryCode.toLowerCase() === name || name.includes(country_capitals[i].CountryName.toLowerCase()) || name.includes(country_capitals[i].CapitalName.toLowerCase()))
            return i;
    } return -1;
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to find the nearest city to a certain latitude-longitude location
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function nearestTo(lat, lon) {
    var minSoFar = {"index":-1,"distance":10000};
    for (var i in country_capitals) {
        currentDist = distance(lat, lon, country_capitals[i].CapitalLatitude, country_capitals[i].CapitalLongitude)
        if ( currentDist < minSoFar.distance )
            minSoFar.index = i, minSoFar.distance = currentDist;
    } return minSoFar;
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to parse an input string for its latitude-longitude location
//
// supported inputs are:
//        place name ("Jakarta" / "Indonesia")
//        signed decimal (-6.17, 106.82)
//        degrees + direction (6.17S / 6.17°S)
//        degrees,minutes (DM) + direction (106°51'E)
//        degrees,minutes,seconds (DMS) + direction (106°50'44"E)
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function scrapeLatLon( str ) {

  // check if input is in coordinate form (i.e. not a place name)
  if (!isNaN(str[0]) || str[0] === "-") {


    // insist coordinates are separated by a comma
    if (!str.includes(",")) return;

    // separate the latitude-longitude components
    var latitude = str.split(",")[0].trim().toLowerCase(),
        longitude = str.split(",")[1].trim().toLowerCase();


    // parse latitude

    // check case: signed decimal
    if (!latitude.includes("n") && !latitude.includes("s")) {
      if (isNaN(latitude)) return;
      latitude = Number(latitude);
    } else {
      // not signed decimal, so insist coordinates are positive
      if (latitude[0] === "-") return;

      // check case: degrees + direction
      else if (!latitude.includes("'")) {
        // remove ° (degrees) symbol
        latitude = latitude.replace("\xB0","");
        // convert N/S to signed decimal
        if (latitude.slice(-1)==="s" && !isNaN(latitude.slice(0,-1)))
          latitude = -Number(latitude.slice(0,-1));
        else if (latitude.slice(-1)==="n"  &&  !isNaN(latitude.slice(0,-1)))
          latitude = Number(latitude.slice(0,-1));
        else return;

      // check case: DM + direction
      } else if (!latitude.includes("\"")) {
        // split up the components
        var deg = latitude.slice(0,latitude.indexOf("\xB0"));
        latitude = latitude.slice(latitude.indexOf("\xB0")+1);
        var mins = latitude.slice(0,latitude.indexOf("'"));
        direction = latitude.slice(latitude.indexOf("'")+1);
        // quick error check
        if ( mins === "" ) return;
        if ( !isNaN(deg) && !isNaN(mins) ) {
          if (mins < 0 || mins > 59) return;
          // then calculate the equivalent signed decimal
          if (direction==="s")
            latitude = -Number(deg)-Number(mins)/60;
          else if (direction==="n")
            latitude = Number(deg)+Number(mins)/60;
        } else return;

      // final case: DMS + direction
      } else {
        // split up the components
        var deg = latitude.slice(0,latitude.indexOf("\xB0"));
        latitude = latitude.slice(latitude.indexOf("\xB0")+1);
        var mins = latitude.slice(0,latitude.indexOf("'"));
        latitude = latitude.slice(latitude.indexOf("'")+1);
        var secs = latitude.slice(0,latitude.indexOf("\""));
        direction = latitude.slice(latitude.indexOf("\"")+1);
        // quick error check
        if (mins === "" || secs === "") return;
        if (!isNaN(deg) && !isNaN(mins) && !isNaN(secs)) {
          if (mins < 0 || secs < 0) return;
          if (mins > 59 || secs > 59) return;
          // then calculate the equivalent signed decimal
          if (direction==="s")
            latitude = -Number(deg)-Number(mins)/60 -Number(secs)/3600;
          else if (direction==="n")
            latitude = Number(deg)+Number(mins)/60+Number(secs)/3600;
        } else return;
      }
    }


    // parse longitude: same process as above
    
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



  // if this point is reached, input is not in coordinate form
  // i.e. input is place name
  var placeIndex = getIndex(str);
  if (placeIndex == -1 ) return;
  return [Number(country_capitals[placeIndex].CapitalLatitude), Number(country_capitals[placeIndex].CapitalLongitude)];
}