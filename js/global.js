svgPanel = document.getElementById("svg_panel");
scrollPanel = document.getElementById("main_panel");
let wasPressed, currentObject = null,
  strokeColor = "black",
  objects = [];
let coords, svgPanelCoords = getCoords(svgPanel);
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

function getMouseCoords(current) {
  return {
    x: (current.pageX - svgPanelCoords.left) / scaleСoef,
    y: (current.pageY - svgPanelCoords.top) / scaleСoef,
  };
}