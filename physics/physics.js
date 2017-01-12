var fps = 1, gravity = 4, dampenBelow = .1, shapes, timeouts, drag = -1, addingCircle = 0, addingSquare = 0, addingTriangle = 0, drawing = 0, del = -1, deleting = 0, mouse, mouseX1, mouseY1, mouseX2, mouseY2, mouseDX, mouseDY, dist, legal, offsetX, offsetY, newDY, newY,
    canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"), message = document.getElementById("message");

function reset() {
  for (var i=0; i<timeouts.length; i++) clearTimeout(timeouts[i]);
  timeouts = [];
  shapes = [];
  animate();
}

function addCircle() {
  addingCircle = 1; stopDelete(); addingSquare = 0; addingTriangle = 0;
  if (shapes.length < 2) message.style.visibility = "visible";
}
function addSquare() { alert("Squares aren't ready yet. Stick with circles."); }
function addTriangle() { alert("Triangles aren't ready yet, just circles."); }
function deleteShape() {
  deleting = 1; addingCircle = 0; addingSquare = 0; addingTriangle = 0; }
function stopDelete() {
  deleting = 0; if (del > -1) shapes[del].beingDeleted = 0; }

function animate() {
  timeouts.push(setTimeout(function(){
    requestAnimationFrame(animate);

    ctx.clearRect(0,0,800,800);

    for (var i in shapes) shapes[i].move();
    for (var i in shapes) shapes[i].draw();
  },1000/60));
};

function drawCircle( x, y, radius ) {
  ctx.beginPath();
  ctx.arc(x,y,radius,0,2*Math.PI);
  ctx.stroke();
  ctx.fill();
}

function distance( x1, y1, x2, y2 ) {
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function getMousePos(e) {
  var rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width/rect.width, scaleY = canvas.height/rect.height;
  return { 'x':(e.clientX-rect.left)*scaleX, 'y':(e.clientY-rect.top)*scaleY }
}

function overShape(e) {
  for (var i in shapes) {
    offsetX = mouse.x-shapes[i].x;  offsetY = mouse.y-shapes[i].y;
    if (Math.sqrt(offsetX*offsetX+offsetY*offsetY) < shapes[i].radius) return i;
  } return -1;
}



canvas.addEventListener("mousedown", function(e) {
  if (deleting && del>-1) { shapes.splice(del,1); del =-1; deleting = 0; return; }
  drag = overShape(e);
  if (drag > -1) shapes[drag].beingDragged = true;
  if (drawing) { if (drag > -1) { shapes.splice(-1); drawing = false; } return; }
  mouse = getMousePos(e);
  mouseX1 = mouse.x; mouseY1 = mouse.y;
  if (drag < 0) {
    if (addingCircle) shapes.push(new ghostCircle(mouseX1,mouseY1,0));
    if (addingSquare) shapes.push(new ghostSquare(mouseX1,mouseY1,0));
    if (addingTriangle) shapes.push(new ghostTriangle(mouseX1,mouseY1,0));
    if (addingCircle || addingSquare || addingTriangle) drawing = true;
  } dist = 0;
});
canvas.addEventListener("mousemove", function(e) {
  mouse = getMousePos(e);
  mouseX2 = mouse.x; mouseY2 = mouse.y;
  if (deleting) {
    if (del > -1) shapes[del].beingDeleted = 0;
    del = overShape(e);
    if (del > -1) shapes[del].beingDeleted = 1;
    return; }
  if (drawing) {
    message.style.visibility = "hidden";
    shapes.splice(-1);
    mouseDX = mouseX2-mouseX1; mouseDY = mouseY2-mouseY1;
    dist = Math.sqrt(mouseDX*mouseDX + mouseDY*mouseDY);
    legal = !(mouseX1-dist<0||mouseY1-dist<0||mouseX1+dist>800||mouseY1+dist>800);

    if (addingCircle) { shapes.push(new ghostCircle(mouseX1,mouseY1,dist)); }
    if (addingSquare) { shapes.push(new ghostSquare(mouseX1,mouseY1,dist)); }
    if (addingTriangle) { shapes.push(new ghostTriangle(mouseX1,mouseY1,dist)); }
}});
canvas.addEventListener("mouseup", function() {
  if (drag > -1) shapes[drag].beingDragged = false;
  drag = -1;
  if (dist > 0 && drawing) {
    shapes.splice(-1);
    if (addingCircle && legal) shapes.push(new circle(mouseX1,mouseY1,dist,1,.7));
  }
  if (drawing) { addingCircle = 0; addingSquare = 0; addingTriangle = 0; }
  drawing = false;
});

function circle( x, y, radius, mass, restitution ) {
  this.x = x;
  this.y = y;
  this.prevX = x;
  this.prevY = y;
  this.dx = 0;
  this.dy = 0;
  this.radius = radius;
  this.base = 800-this.radius;
  this.mass = mass;
  this.restitution = restitution;

  this.beingDragged = false;
  this.beingDeleted = false;

  this.move = function(){
    if (this.beingDragged) {
      this.x = mouseX2-offsetX; this.x = Math.min(this.x,this.base);
                                this.x = Math.max(this.x,this.radius);
      this.y = mouseY2-offsetY; this.y = Math.min(this.y,this.base);
      this.dx = this.x-this.prevX; this.prevX = this.x;
      this.dy = this.y-this.prevY; this.prevY = this.y;
      return;
    }
    if (this.dy == 0 && this.dx == 0 && this.y == this.base) return;

    newX = this.x + this.dx;
    newDY = this.dy + gravity/fps;
    newY = this.y + newDY/fps+gravity/2/fps/fps;

    if (newY > this.base) { newY = this.base; newDY = -this.restitution*(this.dy+Math.sqrt((this.base-this.y)*2*gravity)); }
    if (newY == this.base) this.dx *= 1-(1-this.restitution)/15;
    if (newX > this.base) { newX = this.base; this.dx *= -this.restitution; }
    if (newX < this.radius) { newX = this.radius; this.dx *= -this.restitution; }

    this.x = newX; this.prevX = this.x;
    this.dx *= (Math.abs(this.dx) < dampenBelow)? 0 : 1;
    this.y = newY; this.prevY = this.y;
    this.dy = (Math.abs(newDY) < dampenBelow)? 0 : newDY;
  };

  this.draw = function(){
    ctx.strokeStyle = "#080"; ctx.fillStyle = "#0f0"; ctx.lineWidth = 10;
    if (this.beingDeleted) { ctx.strokeStyle = "#800"; ctx.fillStyle = "#500"; }
    drawCircle(this.x,this.y,this.radius);
  };
}

function ghostCircle( x, y, radius ) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.move = function() {};
  this.draw = function() {
    ctx.fillStyle = "rgba(0,0,0,0)"; ctx.lineWidth = 4;
    ctx.strokeStyle = (legal)? "#888" : "#800";
    drawCircle(this.x,this.y,this.radius);
  }
}
