var polys, states, inState, newPoly, drag, zooming, lastNode, next, new1, new2,
    ind1, ind2, mouse, mouseX1, mouseY1, mouseX2, mouseY2, mouseDX, mouseDY, dist, scale, x1, y1, x2, y2, dx, dy, newX, newY, foldX1, foldY1, foldX2, foldY2, det, foldDet, currentNode, zoomedTo, zoomBox, side, scale,
    canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"),
    message = document.getElementById("message");

ctx.lineWidth=1; ctx.strokeStyle="#555"; ctx.fillStyle="rgba(220,130,130,.5)";


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to reset all variables and folds to initial state
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function reset() {
  states = []; inState = 0; zoomBox = [-10,0,0,0]; zoomedTo=[0,0,800];
  polys = [new poly([new node(150,150),new node(650,150),
                     new node(650,650),new node(150,650)])];
  states.push(polys.slice(0));
  drag = false; zooming = false;
  updateCanvas();
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to revert to previous state in memory: undo a fold
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function undo() {
  inState = Math.max(inState-1,0); 
  getCurrentState();  updateCanvas();  drag = false; zooming = false;
}
// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to return to next state in memory if it exists: redo a fold
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function redo() {
  inState = Math.min(inState+1,states.length-1);
  getCurrentState();  updateCanvas();  drag = false; zooming = false;
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// functions to zoom in an out of the fold space
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function zoomIn() {
  zooming = true;
  message.style.visibility = "visible";
}
function zoomOut() {
  drag=false;
  zooming=false;
  zoomedTo=[0,0,800];
  updateCanvas();
}
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



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to save the current state of the fold space to the array 'polys'
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function getCurrentState() {
  polys = [];
  for (var i in states[inState]) {
    polys.push(new poly([]));
    for (var j in states[inState][i].nodes) {
      currentNode = states[inState][i].nodes[j];
      polys[i].nodes.push(new node(currentNode.x,currentNode.y));
    }
  }
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to redraw the fold space (e.g. previewing fold, making fold, zooming in)
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function updateCanvas() { ctx.clearRect(0,0,800,800);
  for (var i in polys) polys[i].draw();  drawZoomBox();
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to get the current mouse position in terms of canvas coordinates
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function getMousePos(e) {
  var rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width/rect.width, scaleY = canvas.height/rect.height;
  // 'scaleX/Y' factor maps the mouse position in the actual canvas to its 'true' position in the fully zoomed-out fold space
  return { 'x':(e.clientX-rect.left)*scaleX, 'y':(e.clientY-rect.top)*scaleY }
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to check if the mouse is over the paper or not
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function overPoly(e) {
  mouse = getMousePos(e);
  return(Boolean(ctx.getImageData(mouse.x,mouse.y,1,1).data[0]));
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to check whether or not two points are on the same side of the fold line
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function sameSide( Px, Py, Qx, Qy ) {
  return !((dy*(Px-foldX1)+dx*(Py-foldY1)) * (dy*(Qx-foldX1)+dx*(Qy-foldY1)) <0);
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// functions to map points to and from a zoomed-in window
//
// all calculations are performed as if there were no zoom (except for mouse position, which is mapped one way, and drawing polygons, which are mapped in the other direction)
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function zoomX( x ) { return (x-zoomedTo[0])*800/zoomedTo[2]; }
function zoomY( y ) { return (y-zoomedTo[1])*800/zoomedTo[2]; }
function zoomX_( x ) { return x*zoomedTo[2]/800+zoomedTo[0]; }
function zoomY_( y ) { return y*zoomedTo[2]/800+zoomedTo[1]; }






// ––––––––––––––––––––––––––––––––––––––––––––––––––
// start a new fold on mouse click
// ––––––––––––––––––––––––––––––––––––––––––––––––––
canvas.addEventListener("mousedown", function(e) {
  if (!overPoly(e) && !zooming) return;
  drag = true;
  // record initial mouse position in the canvas
  mouse = getMousePos(e);
  mouseX1 = zoomX_(mouse.x);
  mouseY1 = zoomY_(mouse.y);
  if (!zooming) states.splice(inState+1);
});

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// preview the new fold on mouse drag
// ––––––––––––––––––––––––––––––––––––––––––––––––––
canvas.addEventListener("mousemove", function(e) {
  if (drag) {
    // every time the mouse is moved while held down, compare the initial and current positions
    mouse = getMousePos(e); 
    mouseX2 = zoomX_(mouse.x);  mouseDX = mouseX2-mouseX1;
    mouseY2 = zoomY_(mouse.y);  mouseDY = mouseY2-mouseY1;

    // if drawing a zoom box:
    if (zooming) {
      side = Math.max(Math.abs(mouseDX),Math.abs(mouseDY));
      zoomBox=[mouseX1,mouseY1,Math.sign(mouseDX)*side,Math.sign(mouseDY)*side];

    // if making a fold:
    } else {
      dist = mouseDX*mouseDX + mouseDY*mouseDY;
      getCurrentState();
      // find a point on the fold line (the 'crease')
      foldX1 = (mouseX1+mouseX2)/2;
      foldY1 = (mouseY1+mouseY2)/2;
      // find a second point on the fold line
      foldX2 = foldX1+foldY1-mouseY1;  dx = foldX2-foldX1;
      foldY2 = foldY1-foldX1+mouseX1;  dy = foldY1-foldY2;

      // deal with each polygon in the fold space separately
      // they will be folded simultaneously, giving the impression of layered folds
      for (var i in polys) polys[i].fold(e);
    }
    updateCanvas();

    // started dragging, so hide the zoom instruction message if shown
    message.style.visibility = "hidden";
  }
});

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// complete the fold on mouse up
// ––––––––––––––––––––––––––––––––––––––––––––––––––
canvas.addEventListener("mouseup", function() {
  if (drag) {

    // if drawing a zoom box, perform the relevant zoom
    if (zooming) {
      // hide the zoom box
      zoomBox = [-10,0,0,0];
      // then check that the box was actually drawn, as we can't zoom in on a single point (e.g. from a click)
      if (side > 0) {
        scale = zoomedTo[2]/800;
        // store the top-left corner and the side length of the zoom box
        // previous zooms are already effective through mapping the mouse position, so this compounds on existing zoom factors
        zoomedTo = [Math.min(mouseX1,mouseX1+Math.sign(mouseDX)*side),
                    Math.min(mouseY1,mouseY1+Math.sign(mouseDY)*side), side];
      }
      updateCanvas();

    // if making a fold, store the new fold state
    } else if (dist > 0) {
      inState++;
      // the following code makes a deep copy of the current state into memory
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
  drag = false;
  zooming = false;
});






// ––––––––––––––––––––––––––––––––––––––––––––––––––
// polygon object creation
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function poly( nodes ) {
  this.nodes = nodes;

  // keep a copy of nodes at last completed fold (needed for the geometry calculations)
  this.nodes0 = nodes;

  // function to draw the polygon in the canvas
  // all calculations are performed as if there were no zoom
  // only at the drawing stage do we map the positions back to their equivalents in the zoomed window
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

  // function to fold a polygon according to the global variables defining the fold line (the 'crease')
  // folding involves splitting a polygon into two along the line and reflecting one of the new polygons across
  this.fold = function() {
    this.nodes = [];
      for (var i in this.nodes0)
        this.nodes.push(new node(this.nodes0[i].x,this.nodes0[i].y));

    // ind1 is the index of the first new node (i.e. intersection of the polygon edge with the fold line)
    // setting it to -1 here gives us an indicator of whether it has been found
    // once it is no longer -1, we can start to look for ind2, the second new node
    ind1 = -1;

    // iterate through the nodes of the polygon
    for (var i=0; i<this.nodes.length; i++) {

      // check if the current and next nodes are on the same side of the fold line
      next = this.nodes0[(i+1)%this.nodes.length];
      x1 = this.nodes0[i].x0;  x2 = next.x0;
      y1 = this.nodes0[i].y0;  y2 = next.y0;
      if (!sameSide(x1,y1,x2,y2)) {
        // if not on the same side, create a new node where the line between them intersects the fold line
        scale = (x1-x2)*(foldY1-foldY2) - (y1-y2)*(foldX1-foldX2);
        det = x1*y2 - y1*x2;
        foldDet = foldX1*foldY2 - foldY1*foldX2;
        newX = (det*(foldX1-foldX2) - (x1-x2)*foldDet) / scale;
        newY = (det*(foldY1-foldY2) - (y1-y2)*foldDet) / scale;
        // the following ternary operators decide if this is the first or second new node to be found
        (ind1 < 0)? new1 = new node(newX,newY) : new2 = new node(newX,newY);
        (ind1 < 0)? ind1 = Number(i) : ind2 = Number(i);
      }
      // for each node, calculate its new position
      this.nodes[i].move();
    }
    // check if intersections were detected (if not, the polygon can remain in one piece)
    if (ind1 >= 0) {
      // if so, create a new polygon and edit the existing polygon to reflect this
      newPoly = this.nodes.slice(ind1+1,ind2+1);
      newPoly.push(new2,new1);
      polys.push(new poly(newPoly));
      this.nodes = this.nodes.slice(ind2+1).concat(this.nodes.slice(0,ind1+1));
      this.nodes.push(new1,new2);
    }
  }
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// node object creation
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function node( x, y ) {
  this.x = x;  this.x0 = x;
  this.y = y;  this.y0 = y;

  // function to calculate the position of a node after a fold
  this.move = function(e) {

    // only move the nodes on the same side of the fold line as the initial mouse click
    if (sameSide(this.x0,this.y0,mouseX1,mouseY1)) {
      scale = ((foldX1-this.x0)*mouseDX+(foldY1-this.y0)*mouseDY)*2/dist;
      this.x = this.x0 + scale*mouseDX;  this.y = this.y0 + scale*mouseDY;
    } else {
      this.x = this.x0; this.y = this.y0;
    }
  }
}