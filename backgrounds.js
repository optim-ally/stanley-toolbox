var bgTimeouts = [];


function drawBackground( k ) {
  var ctx = document.getElementById("bg-"+k).getContext("2d"), newEnds = [];



  if (k == 1) {

    for (var θ=0; θ<6; θ+=Math.PI*.2) newEnds.push({'x':640,'y':400,'θ':θ});

    expand1(0,newEnds);
    function expand1( depth, ends ) { if (depth < 10) {
        var newEnds = [], d = depth+1, end, length;

        for (var i in ends) {
          end = ends[i];
          length = (depth > 7)? 7:.5*Math.min(end.x,1280-end.x,end.y,800-end.y);
          for (var b=0; b<2; b++) {
            var newθ = end.θ + Math.pow(-1,b)*(Math.random()*.2+.4),
                newX = end.x + length*Math.cos(newθ),
                newY = end.y + length*Math.sin(newθ);
            newEnds.push({'x':newX,'y':newY,'θ':newθ});
        }}

        animate1(.01);
        function animate1( k ) {
          for (var i in ends) {
            var x1 = ends[i].x, y1 = ends[i].y;
            var c = 1+1/d, rgb = 10*c+","+90*c+","+50*c+",.7";
            ctx.strokeStyle = (d<9)? "rgba("+rgb+")":(i%2)?"#5544CC":"#BB3388";
            for (var j=i*2; j<i*2+2; j++) {
              var x2 = newEnds[j].x, y2 = newEnds[j].y;
              ctx.beginPath();
              ctx.moveTo(x1,y1);
              ctx.lineTo(x1+k*(x2-x1),y1+k*(y2-y1));
              ctx.stroke();
              ctx.closePath();
          }}
          if(k<.995)
            bgTimeouts.push(setTimeout(function(){ animate1(k+.01); },depth+k));
          else
            bgTimeouts.push(setTimeout(function(){ expand1(depth+1,newEnds); },depth));
  }}}}




  else if (k == 2) {

    for (var i=0; i<3; i++) newEnds.push({'x':640,'y':400});

    expand2(0,newEnds);
    function expand2( depth, ends ) { if (depth < 7) {
        var newEnds = [], end, xlength, ylength;

        for (var i in ends) {
          end = ends[i];
          xlength = (depth > 4)? 50:.7*(Math.min(end.x,1280-end.x));
          ylength = (depth > 4)? 50:.7*(Math.min(end.y,800-end.y));
          var noGo = Math.floor(Math.random()*4);
          for (var b=0; b<4; b++) {
            if (b != noGo)
              switch(b) {
                case noGo: break;
                case 0: newEnds.push({'x':end.x+xlength,'y':end.y}); break;
                case 1: newEnds.push({'x':end.x-xlength,'y':end.y}); break;
                case 2: newEnds.push({'x':end.x,'y':end.y+ylength}); break;
                case 3: newEnds.push({'x':end.x,'y':end.y-ylength}); break;
        }}}

        animate2(.01);
        function animate2( k ) {
          for (var i in ends) {
            var x1 = ends[i].x, y1 = ends[i].y;
            for (var j=i*3; j<i*3+3; j++) {
              var x2 = newEnds[j].x, y2 = newEnds[j].y;
              ctx.strokeStyle = !(j%3)?"#5544CC":(j%3-1)?"#BB3388":"#338855";
              ctx.beginPath();
              ctx.moveTo(x1,y1);
              ctx.lineTo(x1+k*(x2-x1),y1+k*(y2-y1));
              ctx.stroke();
              ctx.closePath();
          }}
          if(k<.995)
            bgTimeouts.push(setTimeout(function(){ animate2(k+.01); },depth+k));
          else
            bgTimeouts.push(setTimeout(function(){ expand2(depth+1,newEnds); },depth));
  }}}}




  else if (k == 3) {

    for (var θ=0; θ<6; θ+=2/3*Math.PI)
        newEnds.push({'x':640,'y':400,'θ':θ,'d':400});

    expand3(0,newEnds);
    function expand3( depth, ends ) { if (depth < 6) {
        var newEnds = [], end, centre, diamtr;

        for (var i in ends) {
          end = ends[i];
          diamtr = (depth > 4)? 20:.7*Math.min(end.x,1280-end.x,end.y,800-end.y);
          for (var b=0; b<2; b++) {
            var newθ = end.θ + Math.pow(-1,b)*(Math.random()*.2+5.7),
                newX = end.x + diamtr*Math.cos(newθ),
                newY = end.y + diamtr*Math.sin(newθ);
            newEnds.push({'x':newX,'y':newY,'θ':newθ,'d':diamtr});
        }}

        animate3(.01);
        function animate3( k ) {
          for (var i in ends) {
            var x1 = ends[i].x, y1 = ends[i].y, θ1 = ends[i].θ+Math.PI;
            for (var j=i*2; j<i*2+2; j++) {
              var x2 = newEnds[j].x, y2 = newEnds[j].y, r = newEnds[j].d/2;
              ctx.strokeStyle = !(j%3)?"#5544CC":(j%3-1)?"#BB3388":"#338855";
              ctx.beginPath();
              ctx.lineTo(x1+k*(x2-x1),y1+k*(y2-y1));
              ctx.arc((x1+x2)/2,(y1+y2)/2,r,θ1-k*Math.PI,θ1+k*Math.PI);
              ctx.stroke();
              ctx.closePath();
          }}
          if(k<.995)
            bgTimeouts.push(setTimeout(function(){ animate3(k+.01); },5+depth+k));
          else
            bgTimeouts.push(setTimeout(function(){ expand3(depth+1,newEnds); },5+depth));
  }}}}




  else if (k == 4) {

    for (var θ=0; θ<2*Math.PI-.01; θ+=Math.PI/3)
        newEnds.push({'x':640,'y':400,'θ':θ});

    expand4(0,newEnds);
    function expand4( depth, ends ) {
        var newEnds = [], end, length, c = Math.pow(2,depth+1);

        if (depth < 6)
          for (var newθ=0; newθ<2*Math.PI-.01; newθ+=Math.PI/3/c) {
            length = .42*Math.log(depth+5)*Math.min(400/Math.abs(Math.sin(newθ)),
                                                    640/Math.abs(Math.cos(newθ)));
            var newX = 640+length*Math.cos(newθ)+(Math.random()-.5)*100/(depth+1),
                newY = 400+length*Math.sin(newθ)+(Math.random()-.5)*100/(depth+1);
            newEnds.push({'x':newX,'y':newY,'θ':newθ});
          }

        var colourShuffle = Math.floor(Math.random()*3);
        animate4(.03);
        function animate4( k ) {
          for (var i in ends) {
            var x1 = ends[i].x, y1 = ends[i].y, next = (Number(i)+1)%ends.length,
                x2 = ends[next].x, y2 = ends[next].y, s = i+colourShuffle;
            ctx.strokeStyle = !(s%3)?"#5544CC":(s%3-1)?"#BB3388":"#338855";
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2+k*(x1-x2),y2+k*(y1-y2));
            if (depth < 6)
              for (var j=i*2; j<i*2+2; j++) {
                var x3 = newEnds[j].x, y3 = newEnds[j].y;
                ctx.lineTo(x2+k*(x3-x2),y2+k*(y3-y2));
              } ctx.stroke(); ctx.closePath(); }
          if(k<.99)
            bgTimeouts.push(setTimeout(function(){ animate4(k+.03); },10+3*depth+k));
          else bgTimeouts.push(setTimeout(function(){
              expand4(depth+1,newEnds); },10+3*depth));
        }
        if (depth > 5) return;
}}}




function redraw( k ) {
    for (var i = 0; i < bgTimeouts.length; i++) { clearTimeout(bgTimeouts[i]); }
    bgTimeouts = [];
    newEnds = [];
    document.getElementById("bg-"+k).getContext("2d").clearRect(0,0,1280,800);
    drawBackground(k);
}