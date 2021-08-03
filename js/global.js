svgPanel = document.getElementById("svg_panel");
drawPanel = document.getElementById("draw_panel");
scrollPanel = document.getElementById("main_panel");
let wasPressed, currentObject = null,
  strokeColor = "black",
  objects = [];
let svgPanelCoords = getCoords(svgPanel),
  scrollcoords = getCoords(scrollPanel),
  curX, curY; //cursor coordinates
let scaleСoef = 1;

//CURRENT COLOR
function getCurrentColor() {
  return document.getElementById("colorpicker").value;
}

//ACTIVE TOOL
var vertical_panel = document.getElementById("vertical_panel");
var buttons = vertical_panel.getElementsByClassName("tool_button");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("tool_button active");
    if (current.length > 0) {
      current[0].className = "tool_button";
    }
    this.className += " active";
  });
}

//GET COORDS 
function getCoords(elem) {
  let box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
  };
}

function updateCursorCoords(current) {
  curX = (current.pageX - svgPanelCoords.left) / scaleСoef;
  curY = (current.pageY - svgPanelCoords.top) / scaleСoef;
}