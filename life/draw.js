var gridSize = 200, pix = 1000/gridSize, mouse, pixScale = 20, gridOn = 1;
    canvas = document.getElementById("board"), ctx = canvas.getContext("2d"),
    grid = document.getElementById("grid"), ctxG = grid.getContext("2d"),
    overlay = document.getElementById("overlay"), ctxO = overlay.getContext("2d"),
    rect = canvas.getBoundingClientRect();

ctx.fillStyle = "#0DF";
ctxG.strokeStyle = "#DDD";
ctxG.lineWidth = 5;
document.getElementById("toggleGrid").style.backgroundColor = "#BBB";
ctxO.fillStyle = "#AAA";
ctxO.strokeStyle = "#AAA";

function zX( x ) { return (x-500)*pixW/pix+500; }
function zY( y ) { return (y-500)*pixH/pix+500; }
function z_X( x ) { return (x-500)*pix/pixW+500; }
function z_Y( y ) { return (y-500)*pix/pixH+500; }

overlay.addEventListener("mousedown",function(e){e.preventDefault(); adding(e);});
overlay.addEventListener("mousemove",function(e){adding(e);});

function adding(e) {
  getCell(e);
  if ((e.which == 1) && !alive.includes(cellX+gridSize*cellY)) {
    stop();
    alive.push(cellX+gridSize*cellY);
    updateShapes();
  } else if ((e.which == 3) && !living && alive.includes(cellX+gridSize*cellY)) {
    alive.splice(alive.indexOf(cellX+gridSize*cellY),1);
    updateShapes();
  }
}

overlay.addEventListener("mousewheel",function(e){updateZoom(e);});
overlay.addEventListener("DOMMouseScroll",function(e){updateZoom(e);});
window.addEventListener("resize",function(){updateZoom(0);});

function updateShapes() {
  ctx.clearRect(0,0,1000,1000);
  for (var i=0; i<gridSize*gridSize; i++) {
    cornerPoints = [];
    if (alive.includes(i)) cornerPoints.push(0);
    if (alive.includes(i+1) && (i+1)%gridSize) cornerPoints.push(1);
    if (alive.includes(i+gridSize+1) && (i+1)%gridSize) cornerPoints.push(2);
    if (alive.includes(i+gridSize)) cornerPoints.push(3);
    drawShape(cornerPoints,i%gridSize*pix,Math.floor(i/gridSize)*pix);
  }
}

function drawShape( points, x, y ) {
  ctx.beginPath();
  ctx.moveTo(zX(x+(1-Math.abs(points[0]-2)/2)*pix),zY(y+Math.abs(points[0]-1)/2*pix));
  for (var i in points) {
    i = points[i];
    ctx.lineTo(zX(x+(1-Math.abs(i-2)/2)*pix),zY(y+Math.abs(i-1)/2*pix));
    ctx.lineTo(zX(x+(i>0&i<3)*pix),zY(y+(i>1)*pix));
    ctx.lineTo(zX(x+(1-Math.abs(i-1)/2)*pix),zY(y+(1-Math.abs(i-2)/2)*pix));
  }
  ctx.closePath();
  ctx.fill();
}

function getCell(e) {
  rect = canvas.getBoundingClientRect();
  mouse = {'x':(e.clientX-rect.left)*canvas.width/rect.width,
           'y':(e.clientY-rect.top)*canvas.height/rect.height};
  cellX = Math.floor(z_X(mouse.x)/pix+.5);
  cellY = Math.floor(z_Y(mouse.y)/pix+.5);

  ctxO.clearRect(0,0,1000,1000);
  ctxO.beginPath();
  ctxO.rect(zX((cellX-.5)*pix),zY((cellY-.5)*pix),pixW,pixH);
  ctxO.fill();
}

function updateGrid() {
  ctxG.clearRect(0,0,1000,1000);
  if (!gridOn) return;
  ctxG.lineWidth = pixW/5;
  for (var i=500-gridSize*pixW/2; i<500+gridSize*pixW/2; i+=pixW) {
    ctxG.beginPath();
    ctxG.moveTo(i,0);
    ctxG.lineTo(i,1000);
    ctxG.stroke();
  }
  ctxG.lineWidth = pixH/5;
  for (var j=500-gridSize*pixH/2; j<500+gridSize*pixH/2; j+=pixH) {
    ctxG.beginPath();
    ctxG.moveTo(0,j);
    ctxG.lineTo(1000,j);
    ctxG.stroke();
  }
}

function updateZoom(e) {
  rect = canvas.getBoundingClientRect();
  pixScale = Math.min(Math.max(pixScale+e.wheelDelta/10 || pixScale, rect.width/gridSize,rect.height/gridSize), 100);
  pixW = pixScale*1000/rect.width;
  pixH = pixScale*1000/rect.height;
  getCell(e);
  updateShapes();
  updateGrid();
}

function toggleGrid() {
  gridOn = (gridOn)? false : true;
  document.getElementById("toggleGrid").style.backgroundColor = (gridOn)? "#BBB":"white";
  updateGrid();
}