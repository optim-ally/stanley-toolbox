var tableHTML, index, grid, shifted = false, alted = false;

$(function(){
  tableHTML = "<table id='grid'>";
  for (var row=0; row<3; row++) {
    tableHTML += '<tr>';
    for (var col=0; col<3; col++) {
      tableHTML += '<td><table>';
      for (var blockRow=0; blockRow<3; blockRow++) {
        tableHTML += '<tr>';
        for (var blockCol=0; blockCol<3; blockCol++) {
          index = blockCol + 3*col + 9*blockRow + 27*row;

          tableHTML += "<td><div id='box" + index + "' class='box' contenteditable></div></td>";
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table></td>';
    }
    tableHTML += '</tr>';
  }
  tableHTML += '</table>';

  $('#grid-container').html(tableHTML);

  grid = $('#grid div').sort(function(a,b){
    return a.id.replace('box','') - b.id.replace('box','');
  });

  colourCells();

/*
  $('#grid div').keydown(function(e){
    if (e.which == 8 || (e.which > 48 && e.which < 59 && !shifted && !alted))
      $(this).text('');
    else if (e.which != 9 && e.which != 37 && e.which != 39)
      e.preventDefault();
  }).focus(function(){
    setTimeout(function(){
      document.execCommand('selectAll',false,null); },1);
  });


  $(document).keydown(function(e){
    if (e.which == 16) shifted = true;
    if (e.which == 18) alted = true;
  }).keyup(function(e){
    if (e.which == 16) shifted = false;
    if (e.which == 18) alted = false;
  });
*/
});

function colourCells() {
  for (var i=0; i<81; i++)
    $(grid[i]).css('background',(_((i%9)/3+_(i/27))%2)?'#FEE':'#F8F8FF');
}

function clearGrid() {
  for (var i=0; i<81; i++) $(grid[i]).text('');
}

function _(x) { return Math.floor(x); }