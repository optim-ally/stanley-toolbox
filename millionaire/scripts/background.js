var ctx = document.getElementById("bg").getContext("2d"),
    img = document.getElementById("studio");

var fadeToBlack = ctx.createLinearGradient(0,350,0,650);
fadeToBlack.addColorStop(0,"transparent");
fadeToBlack.addColorStop(.16,"#026");
fadeToBlack.addColorStop(1,"#012");

function drawBackground() {
  ctx.drawImage(img,0,0);
  ctx.fillStyle = fadeToBlack;
  ctx.fillRect(0,300,760,650);
}