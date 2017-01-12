var polys, states, inState, newPoly, drag, zooming, lastNode, next, new1, new2,
    ind1, ind2, mouse, mouseX1, mouseY1, mouseX2, mouseY2, mouseDX, mouseDY, dist, scale, x1, y1, x2, y2, dx, dy, newX, newY, foldX1, foldY1, foldX2, foldY2, det, foldDet, currentNode, zoomedTo, zoomBox, side, scale,
    canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"),
    message = document.getElementById("message");
ctx.lineWidth=1; ctx.strokeStyle="#555"; ctx.fillStyle="rgba(220,130,130,.5)";

function reset() {
  states = []; inState = 0; zoomBox = [-10,0,0,0]; zoomedTo=[0,0,800];
  polys = [new poly([new node(150,150),new node(650,150),
                     new node(650,650),new node(150,650)])];
  states.push(polys.slice(0));
  drag = false; zooming = false;
  updateCanvas();
}
function undo() {
  inState = Math.max(inState-1,0); 
  getCurrentState();  updateCanvas();  drag = false; zooming = false;
}
function redo() {
  inState = Math.min(inState+1,states.length-1);
  getCurrentState();  updateCanvas();  drag = false; zooming = false;
}
function zoomIn() { zooming = true; message.style.visibility = "visible"; }
function zoomOut() { drag=false; zooming=false;
                     zoomedTo=[0,0,800]; updateCanvas(); }
function drawZoomBox() {
  ctx.beginPath();
  ctx.moveTo(zoomX(zoomBox[0]),zoomY(zoomBox[1]));
  ctx.lineTo(zoomX(zoomBox[0]+zoomBox[2]),zoomY(zoomBox[1]));
  ctx.lineTo(zoomX(zoomBox[0]+zoomBox[2]),zoomY(zoomBox[1]+zoomBox[3]));
  ctx.lineTo(zoomX(zoomBox[0]),zoomY(zoomBox[1]+zoomBox[3]));
  ctx.lineTo(zoomX(zoomBox[0]),zoomY(zoomBox[1]));
  ctx.stroke(); ctx.fillStyle = "rgba(200,200,200,.7)";
  ctx.fill(); ctx.fillStyle = "rgba(220,130,130,.5)";
  ctx.closePath();
}
function getCurrentState() { polys = [];
  for (var i in states[inState]) { polys.push(new poly([]));
    for (var j in states[inState][i].nodes) {
      currentNode = states[inState][i].nodes[j];
      polys[i].nodes.push(new node(currentNode.x,currentNode.y));
}}}
function updateCanvas() { ctx.clearRect(0,0,800,800);
  for (var i in polys) polys[i].draw();  drawZoomBox();
}
function getMousePos(e) {
  var rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width/rect.width, scaleY = canvas.height/rect.height;
  return { 'x':(e.clientX-rect.left)*scaleX, 'y':(e.clientY-rect.top)*scaleY }
}
function overPoly(e) { mouse = getMousePos(e);
  return(Boolean(ctx.getImageData(mouse.x,mouse.y,1,1).data[0]));
}
function sameSide( Px, Py, Qx, Qy ) {
  return !((dy*(Px-foldX1)+dx*(Py-foldY1)) * (dy*(Qx-foldX1)+dx*(Qy-foldY1)) <0);
}
function zoomX( x ) { return (x-zoomedTo[0])*800/zoomedTo[2]; }
function zoomY( y ) { return (y-zoomedTo[1])*800/zoomedTo[2]; }
function zoomX_( x ) { return x*zoomedTo[2]/800+zoomedTo[0]; }
function zoomY_( y ) { return y*zoomedTo[2]/800+zoomedTo[1]; }




canvas.addEventListener("mousedown", function(e) {
  if (!overPoly(e) && !zooming) return;
  drag = true;
  mouse = getMousePos(e);  mouseX1 = zoomX_(mouse.x);  mouseY1 = zoomY_(mouse.y);
  if (!zooming) states.splice(inState+1);
});
canvas.addEventListener("mousemove", function(e) {
  if (drag) {
    mouse = getMousePos(e); 
    mouseX2 = zoomX_(mouse.x);  mouseDX = mouseX2-mouseX1;
    mouseY2 = zoomY_(mouse.y);  mouseDY = mouseY2-mouseY1;
    if (zooming) { side = Math.max(Math.abs(mouseDX),Math.abs(mouseDY));
     zoomBox=[mouseX1,mouseY1,Math.sign(mouseDX)*side,Math.sign(mouseDY)*side]; }
    else {
      getCurrentState();
      foldX1 = (mouseX1+mouseX2)/2;
      foldY1 = (mouseY1+mouseY2)/2;
      foldX2 = foldX1+foldY1-mouseY1;  dx = foldX2-foldX1;
      foldY2 = foldY1-foldX1+mouseX1;  dy = foldY1-foldY2;
      dist = mouseDX*mouseDX + mouseDY*mouseDY;
      for (var i in polys) polys[i].fold(e);
    }
    updateCanvas();
    message.style.visibility = "hidden";
  }
});
canvas.addEventListener("mouseup", function() {
  if (drag) {
    if (zooming) { zoomBox = [-10,0,0,0];
      if (side > 0) { scale = zoomedTo[2]/800;
        zoomedTo=[Math.min(mouseX1,mouseX1+Math.sign(mouseDX)*side),
                  Math.min(mouseY1,mouseY1+Math.sign(mouseDY)*side),side];
      } updateCanvas();
    } else if (dist > 0) {
      inState++;
      states.push(new Array);
      for (var i in polys) {
        states[inState].push(new poly([]));
        for (var j in polys[i].nodes) {
          currentNode = polys[i].nodes[j];
          currentNode.x0 = currentNode.x;
          currentNode.y0 = currentNode.y;
          states[inState][i].nodes.push(new node(currentNode.x,currentNode.y));
          polys[i].nodes0.push(new node(currentNode.x,currentNode.y));
        }
      }
    }
  }
  drag = false; zooming = false;
});




function poly( nodes ) {
  this.nodes = nodes;  this.nodes0 = nodes;

  this.draw = function() {
    lastNode = this.nodes[this.nodes.length-1];
    ctx.beginPath();
    ctx.moveTo(zoomX(lastNode.x),zoomY(lastNode.y));
    for (var i in this.nodes)
      ctx.lineTo(zoomX(this.nodes[i].x),zoomY(this.nodes[i].y));
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  this.fold = function() {
    this.nodes = [];
      for (var i in this.nodes0)
        this.nodes.push(new node(this.nodes0[i].x,this.nodes0[i].y));
    ind1 = -1;

    for (var i=0; i<this.nodes.length; i++) {
      next = this.nodes0[(i+1)%this.nodes.length];
      x1 = this.nodes0[i].x0;  x2 = next.x0;
      y1 = this.nodes0[i].y0;  y2 = next.y0;
      if (!sameSide(x1,y1,x2,y2)) {
        scale = (x1-x2)*(foldY1-foldY2) - (y1-y2)*(foldX1-foldX2);
        det = x1*y2 - y1*x2;
        foldDet = foldX1*foldY2 - foldY1*foldX2;
        newX = (det*(foldX1-foldX2) - (x1-x2)*foldDet) / scale;
        newY = (det*(foldY1-foldY2) - (y1-y2)*foldDet) / scale;
        (ind1<0)? new1 = new node(newX,newY) : new2 = new node(newX,newY); (ind1<0)? ind1 = Number(i) : ind2 = Number(i);
      } this.nodes[i].move();
    }
    if (ind1 >= 0) {
      newPoly = this.nodes.slice(ind1+1,ind2+1);
      newPoly.push(new2,new1);
      polys.push(new poly(newPoly));
      this.nodes = this.nodes.slice(ind2+1).concat(this.nodes.slice(0,ind1+1));
      this.nodes.push(new1,new2);
    }
  }
}

function node( x, y ) {
  this.x = x;  this.x0 = x;
  this.y = y;  this.y0 = y;

  this.move = function(e) {
    if (sameSide(this.x0,this.y0,mouseX1,mouseY1)) {
      scale = ((foldX1-this.x0)*mouseDX+(foldY1-this.y0)*mouseDY)*2/dist;
      this.x = this.x0 + scale*mouseDX;  this.y = this.y0 + scale*mouseDY;
    } else { this.x = this.x0; this.y = this.y0; }
  }
}