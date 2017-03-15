var fps = 1;
var gravity = 4;
var dampenBelow = .1;

var shapes, timeouts = [], drag = -1, addingCircle = 0, addingSquare = 0, addingTriang = 0, drawing = 0, del = -1, deleting = 0, mouse, mouseX1, mouseY1, mouseX2, mouseY2, mouseDX, mouseDY, dist, legal, offsetX, offsetY, distX, distY, distXSq, distYSq, centreDist, edgeDist, paraX, paraY;

var canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"),
    message = document.getElementById("message");


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// reset world to initial, empty state
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function reset() {
  for (var i=0; i<timeouts.length; i++) clearTimeout(timeouts[i]);
  timeouts = [];
  shapes = [];
  animate();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// functions to begin shape-drawing process
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function addCircle() {
  addingCircle = 1;
  addingSquare = 0;
  addingTriang = 0;
  stopDelete();
  if (shapes.length < 2) message.style.visibility = "visible";
}
function addSquare() { alert("Squares aren't ready yet. Stick with circles."); }
function addTriang() { alert("Triangles aren't ready yet, just circles."); }

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// begin/stop shape-deletion process
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function deleteShape() {
  message.style.visibility = "hidden";
  deleting = 1;
  addingCircle = 0;
  addingSquare = 0;
  addingTriang = 0;
}
function stopDelete() {
  deleting = 0;
  if (del > -1) shapes[del].beingDeleted = 0;
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// looped function to execute a frame of simulation
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function animate() {
  timeouts.push(setTimeout(function(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,800,800);
    for (var i in shapes) shapes[i].move();
    for (var i in shapes) shapes[i].collisions(i);
    for (var i in shapes) shapes[i].draw();
  },1000/60));
};



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// draw a circle with centre (x, y) and a given radius
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function drawCircle( x, y, radius ) {
  ctx.beginPath();
  ctx.arc(x,y,radius,0,2*Math.PI);
  ctx.stroke();
  ctx.fill();
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// calculate the distance between (x1, y1) and (x2, y2)
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function distance( x1, y1, x2, y2 ) {
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// get the mouse position in terms of canvas coordinates
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function getMousePos(e) {
  var rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width/rect.width,
      scaleY = canvas.height/rect.height;
  return { 'x': (e.clientX-rect.left)*scaleX, 'y': (e.clientY-rect.top)*scaleY }
}

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// detect mouse intersection with a shape & return shape index
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function overShape(e) {
  for (var i in shapes) {
    offsetX = mouse.x-shapes[i].x;
    offsetY = mouse.y-shapes[i].y;
    if (Math.sqrt(offsetX*offsetX+offsetY*offsetY) < shapes[i].radius) return i;
  }
  return -1;
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// when mouse button is pressed
// ––––––––––––––––––––––––––––––––––––––––––––––––––
canvas.addEventListener("mousedown", function(e) {

  // if in shape-deletion process, remove shape under mouse
  if (deleting && del > -1) {
    shapes.splice(del,1);
    del = -1;
    deleting = 0;
    return;
  }

  // otherwise start dragging shape under mouse
  drag = overShape(e);
  if (drag > -1) shapes[drag].beingDragged = true;

  // if in shape-drawing process (i.e. click after mouse exits canvas),
  // continue drawing with mouse button pressed
  if (drawing) {
    // UNLESS there is a shape under the mouse
    // then abort drawing
    if (drag > -1) {
      shapes.splice(-1);
      drawing = false;
    }
    return;
  }

  // otherwise get mouse position...
  mouse = getMousePos(e);
  mouseX1 = mouse.x; mouseY1 = mouse.y;
  // ... and if starting shape-drawing process,
  // create grey shape guide at the correct position
  if (drag < 0) {
    if (addingCircle) shapes.push(new ghostCircle(mouseX1,mouseY1,0));
    if (addingSquare) shapes.push(new ghostSquare(mouseX1,mouseY1,0));
    if (addingTriang) shapes.push(new ghostTriang(mouseX1,mouseY1,0));
    if (addingCircle || addingSquare || addingTriang) drawing = true;
  }
  dist = 0;
});

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// when mouse is moved
// ––––––––––––––––––––––––––––––––––––––––––––––––––
canvas.addEventListener("mousemove", function(e) {

  // update mouse position
  mouse = getMousePos(e);
  mouseX2 = mouse.x;
  mouseY2 = mouse.y;

  // if in shape-deletion process, turn shapes below the mouse red
  if (deleting) {
    // first clear index of red shape
    if (del > -1) shapes[del].beingDeleted = 0;
    // then check for current index (may be the same)
    del = overShape(e);
    if (del > -1) shapes[del].beingDeleted = 1;
    return;
  }

  // if in shape-drawing process...
  if (drawing) {
    // clear instruction message ("Click and Drag")
    message.style.visibility = "hidden";

    // remove previous grey shape guide (since changing radius)
    shapes.splice(-1);
    // and calculate new radius for shape guide
    mouseDX = mouseX2-mouseX1;
    mouseDY = mouseY2-mouseY1;
    dist = Math.sqrt(mouseDX*mouseDX + mouseDY*mouseDY);

    // check if shape guide intersects canvas edges (then guide will appear red)
    legal = !(mouseX1-dist < 0 || mouseY1-dist < 0 ||
              mouseX1+dist > 800 || mouseY1+dist > 800);

    // finally, draw updated shape guide
    if (addingCircle) { shapes.push(new ghostCircle(mouseX1,mouseY1,dist)); }
    if (addingSquare) { shapes.push(new ghostSquare(mouseX1,mouseY1,dist)); }
    if (addingTriang) { shapes.push(new ghostTriang(mouseX1,mouseY1,dist)); }
}});

// ––––––––––––––––––––––––––––––––––––––––––––––––––
// when mouse button is lifted
// ––––––––––––––––––––––––––––––––––––––––––––––––––
canvas.addEventListener("mouseup", function() {

  // clear index of any shape being dragged
  if (drag > -1) shapes[drag].beingDragged = false;
  drag = -1;

  // if currently drawing (& non-zero radius) create a new shape
  if (dist > 0 && drawing) {
    shapes.splice(-1);
    // (unless the shape would intersect the canvas edges)
    if (addingCircle && legal) shapes.push(new circle(mouseX1,mouseY1,dist,1,.7));
  }

  // reset all Boolean drawing variables
  if (drawing) {
    addingCircle = 0;
    addingSquare = 0;
    addingTriang = 0;
  }
  drawing = false;
});



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// create new circle object
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function circle( x, y, radius, mass, restitution ) {
  this.x = x;
  this.y = y;
  this.newX;
  this.newY;
  this.dx = 0;
  this.dy = 0;
  this.newDX;
  this.newDY;
  this.radius = radius;
  this.base = 800-this.radius;
  this.mass = mass;
  this.restitution = restitution;

  this.beingDragged = false;
  this.beingDeleted = false;

  // ––––––––––––––––––––––––––––––––––––––––––––––––––
  // function to move the shape according to momentum, gravity, etc.
  // ––––––––––––––––––––––––––––––––––––––––––––––––––
  this.move = function(){
    if (this.beingDragged) {
      this.newX = mouseX2-offsetX; this.newX = Math.min(this.newX,this.base);
                                   this.newX = Math.max(this.newX,this.radius);
      this.newY = mouseY2-offsetY; this.newY = Math.min(this.newY,this.base);
      this.dx = this.newX-this.x;
      this.dy = this.newY-this.y;
      return;
    }
    if (this.dy == 0 && this.dx == 0 && this.y == this.base) return;

    this.newX = this.x+this.dx;
    this.dy += gravity/fps;  this.newY = this.y+this.dy/fps+gravity/2/fps/fps;
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––
  // function to model collisions with other shapes
  // ––––––––––––––––––––––––––––––––––––––––––––––––––
  this.collisions = function(i){
    this.newDX = this.dx;
    this.newDY = this.dy;

    for (var j=Number(i)+1; j<shapes.length; j++) {
      distX = shapes[j].x-this.x;  distXSq = distX*distX;
      distY = shapes[j].y-this.y;  distYSq = distY*distY;
      centreDist = Math.sqrt(distXSq+distYSq);
      edgeDist = centreDist-this.radius-shapes[j].radius;

      if (edgeDist < 0) {
        if (!this.beingDragged) {
          this.newX = this.x+edgeDist*distX/centreDist;
          this.newY = this.y+edgeDist*distY/centreDist; }
        if (!shapes[j].beingDragged) {
          shapes[j].newX = shapes[j].x-edgeDist*distX/centreDist;
          shapes[j].newY = shapes[j].y-edgeDist*distY/centreDist; }

        centreDistSq = centreDist*centreDist;
        // consider vectors parallel to the collision
        // this. vectors are called 'a'; shapes[i]. are called 'b'
        // PARA vectors as in 1-D collision; PERP vectors unaffected
        paraX = (shapes[i].dx-this.dx)*distXSq/centreDistSq;
        paraY = (shapes[i].dy-this.dy)*distYSq/centreDistSq;

        if (!this.beingDragged) {
          this.newDX += paraX*restitution;
          this.newDY += paraY*restitution;
        }
        if (!shapes[j].beingDragged) {
          shapes[i].newDX -= paraX*restitution;
          shapes[i].newDY -= paraY*restitution;
        }
      }
    }

    if (this.newX > this.base) {
      this.newX = this.base;   this.newDX *= -this.restitution; }
    if (this.newX < this.radius) {
      this.newX = this.radius; this.newDX *= -this.restitution; }
    if (this.newY == this.base)
      this.newDX = this.newDX*(1-(1-this.restitution)/15);
    if (this.newY > this.base) {
      this.newY = this.base;   this.newDY = -this.restitution*(this.newDY+Math.sqrt((this.base-this.y)*2*gravity)); }
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––
  // function to calculate the new position of the shape
  // based on this.move and this.collide and draw it there
  // ––––––––––––––––––––––––––––––––––––––––––––––––––
  this.draw = function(){
    this.x = this.newX;
    this.dx = (Math.abs(this.newDX) < dampenBelow)? 0 : this.newDX;
    this.y = this.newY;
    this.dy = (Math.abs(this.newDY) < dampenBelow)? 0 : this.newDY;

    ctx.strokeStyle = "#080"; ctx.fillStyle = "#0f0"; ctx.lineWidth = 10;
    if (this.beingDeleted) { ctx.strokeStyle = "#800"; ctx.fillStyle = "#500"; }
    drawCircle(this.x,this.y,this.radius);
  };
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// create circle-drawing guide object
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function ghostCircle( x, y, radius ) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.move = function() {};
  this.collisions = function() {};
  this.draw = function() {
    ctx.fillStyle = "rgba(0,0,0,0)"; ctx.lineWidth = 4;
    ctx.strokeStyle = (legal)? "#888" : "#800";
    drawCircle(this.x,this.y,this.radius);
  }
}
