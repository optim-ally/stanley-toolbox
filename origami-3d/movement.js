var nbrs, nbr, inDrag = -1, pulled = [], mouse, mouseX, mouseY, mouseDX, mouseDY,
    xdist, ydist, dist, res, rad, pix, nodes,
    canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d");


function reset() {
  res = Number(document.getElementById("resSelector").value);  rad = 10*17/res;
  pix = 500/(res-1);  nodes = [];  ctx.lineWidth = 4*17/res;

  for (var i=0; i<res*res; i++) {
    nbrs = [];
    if (i%res) nbrs.push(i-1);
    if ((i+1)%res) nbrs.push(i+1);
    if (i-res>=0) nbrs.push(i-res);
    if (i+res<res*res) nbrs.push(i+res);
    nodes.push(new node(i,150+i%res*pix,150+Math.floor(i/res)*pix,nbrs));
  }
  updateCanvas();
}




canvas.addEventListener("mousedown", function(e) {
  clicked = overNode(e);
  if (clicked < 0) return;
  inDrag = clicked;
});
canvas.addEventListener("mousemove", function(e) {
  mouse = getMousePos(e);
  mouseDX = mouse.x-mouseX;  mouseX = mouse.x;
  mouseDY = mouse.y-mouseY;  mouseY = mouse.y;

  if (inDrag > -1) {
    pulled = [];
    pulledAdd(inDrag);
    for (var i in nodes) nodes[i].move(e);
    updateCanvas();
  }
});
canvas.addEventListener("mouseup", function() { inDrag = -1; });




function updateCanvas() {
  ctx.clearRect(0,0,800,800);
  for (var i=nodes.length; i; i--) nodes[i-1].draw();
}
function getMousePos(e) {
  var rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width/rect.width, scaleY = canvas.height/rect.height;
  return {'x':(e.clientX-rect.left)*scaleX,'y':(e.clientY-rect.top)*scaleY}
}
function overNode(e) {
  mouse = getMousePos(e);
  for (var i in nodes)
    if (Math.pow(nodes[i].x-mouse.x,2)+Math.pow(nodes[i].y-mouse.y,2) < rad*rad+5)
      return Number(i);
  return -1;
}
function pulledAdd( i ) {
  pulled.push(Number(i));
  for (var j in nodes[i].nbrs) {
    nbr = nodes[nodes[i].nbrs[j]];
    xdist = nodes[i].x-nbr.x; ydist = nodes[i].y-nbr.y;
    dist = Math.sqrt(xdist*xdist + ydist*ydist);
    if (!pulled.includes(nbr.index)&&dist>=pix&&(mouseDX*xdist+mouseDY*ydist>0))
      pulledAdd(nbr.index);
  }
}




function node( index, x, y, nbrs ) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.nbrs = nbrs;
    this.hue = Math.floor(this.index/res)/res/2+this.index%res/res/2;
    this.r = Math.round(250-this.hue*240);
    this.g = Math.round(Math.sin(this.hue*Math.PI)*150);
    this.b = Math.round(10+this.hue*200);

    this.draw = function() {
        console.log(this.nbrs);
        ctx.strokeStyle = "rgba("+this.r+","+this.g+","+this.b+",1)";
        ctx.beginPath();
        for (var i in this.nbrs) {
            nbr = nodes[this.nbrs[i]];
            if (nbr.index > this.index) {
                ctx.moveTo(this.x,this.y);
                ctx.lineTo(nbr.x,nbr.y);
            }
        } ctx.stroke();
        ctx.closePath();
    }
    this.move = function(e) {
        if (pulled.includes(this.index)) { this.x += mouseDX; this.y += mouseDY; }
    }
}