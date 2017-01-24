var stepSize = 1000, scrolled = 0, step, offset, height, width, heightScale, widthScale, out = Math.max(screen.height,screen.width), panel1 = document.getElementById("panel-1"), panel2 = document.getElementById("panel-2"), panel3 = document.getElementById("panel-3"), panel4 = document.getElementById("panel-4"), panel5a = document.getElementById("panel-5a"), panel5b = document.getElementById("panel-5b"), panel6a = document.getElementById("panel-6a"), panel6b = document.getElementById("panel-6b"), panel7a = document.getElementById("panel-7a"),panel7b = document.getElementById("panel-7b"), panel7c = document.getElementById("panel-7c"), panel7d = document.getElementById("panel-7d"),panel8a = document.getElementById("panel-8a"), panel8b = document.getElementById("panel-8b"), panel8c = document.getElementById("panel-8c"), panel8d = document.getElementById("panel-8d"), panel8e = document.getElementById("panel-8e"), panel8f = document.getElementById("panel-8f"), panel8g = document.getElementById("panel-8g"), panel8h = document.getElementById("panel-8h"), panel9 = document.getElementById("panel-9");

document.body.addEventListener("mousewheel", function(e) { myScroll(e); });
document.body.addEventListener("DOMMouseScroll", function(e) { myScroll(e); });
window.addEventListener("resize", function() { myScroll(0); });

function myScroll(e) {
  scrolled = Math.max(Math.min(scrolled+e.wheelDelta,0),-9000) || scrolled;
  step = Math.floor(-scrolled/stepSize);
  height = window.innerHeight;
  width = window.innerWidth;
  offsetY = -(scrolled/stepSize+step)*height;
  offsetX = -(scrolled/stepSize+step)*width;


  switch (step) {

    case 0: panel1.style.top = -offsetY;
            panel2.style.left = 0;
            break;

    case 1: panel1.style.top = out;
            panel2.style.left = -offsetX;
            panel3.style.left = 0;
            break;

    case 2: panel2.style.left = out;
            panel3.style.left = offsetX;
            panel4.style.top = 0;
            break;

    case 3: panel3.style.left = out;
            panel4.style.top = Math.max(0,-height+2*offsetY);
            panel5a.style.left = 0;
            panel5b.style.left = width/2;
            break;

    case 4: panel4.style.top = out;
            panel5a.style.left = -offsetX/2;
            panel5b.style.left = offsetX/2+width/2;
            panel6a.style.top = 0;
            panel6b.style.top = height/2;
            break;

    case 5: panel5a.style.left = out;
            panel5b.style.left = out;
            panel6a.style.top = -offsetY/2;
            panel6b.style.top = offsetY/2+height/2;
            panel7a.style.cssText = "top: 0;  left: 0;";
            panel7b.style.cssText = "top: 0;  left:"+width/2;
            panel7c.style.cssText = "top:"+height/2+"; left: 0";
            panel7d.style.cssText = "top:"+height/2+"; left:"+width/2;
            break;

    case 6: panel6a.style.top = out;
            panel6b.style.top = out;
            panel7a.style.cssText = "top:"+-offsetY/2+";left:"+-offsetX/2;
            panel7b.style.cssText = "top:"+-offsetY/2+";left:"+(offsetX+width)/2;
            panel7c.style.cssText = "top:"+(offsetY+height)/2+";left:"+-offsetX/2;
            panel7d.style.cssText = "top:"+(offsetY+height)/2+";left:"+(offsetX+width)/2;
            panel8a.style.top = 0;
            panel8b.style.top = .6*height;
            panel8c.style.top = .8*height;
            panel8d.style.top = out;
            panel8e.style.top = out;
            panel8f.style.top = out;
            panel8g.style.top = out;
            panel8h.style.top = out;
            break;

    case 7: panel7a.style.top = out;
            panel7b.style.top = out;
            panel7c.style.top = out;
            panel7d.style.top = out;
            panel8a.style.top = -.12*offsetY;
            panel8b.style.top = .6*height-.3*offsetY;
            panel8c.style.top = .8*height-.4*offsetY;
            panel8d.style.top = out;
            panel8e.style.top = out;
            panel8f.style.top = -height+offsetY;
            panel8g.style.top = -height+offsetY;
            panel8h.style.top = height-offsetY/2;
            panel9.style.top = out;
            break;

    case 8: panel8a.style.top = -.12*height-.12*offsetY;
            panel8b.style.top = .3*height-.3*offsetY;
            panel8c.style.top = .4*height-.4*offsetY;
            panel8d.style.top = -height+offsetY/2;
            panel8e.style.top = -height+offsetY/2;
            panel8f.style.top = offsetY;
            panel8g.style.top = offsetY;
            panel8h.style.top = height/2-offsetY/2;
            panel9.style.top = height-offsetY;
            break;

    case 9: panel9.style.top = 0;
  }
}