svgPanel = document.getElementById("svg_panel");
drawPanel = document.getElementById("draw_panel");
scrollPanel = document.getElementById("scroll_panel");
let isSomeObjectSelected = false //для курсора
let wasPressed, currentObject = null,
  strokeColor = "black",
  objects = [];
let svgPanelCoords = getCoords(svgPanel),
  scrollcoords = getCoords(scrollPanel),
  curX, curY; //cursor coordinates
let scaleСoef = 1;
let pointRadius = 4;
rulerX = document.getElementById("ruler_x");
rulerY = document.getElementById("ruler_y");
ruler_x_pattern = document.getElementById("ruler_x_pattern");
ruler_y_pattern = document.getElementById("ruler_y_pattern");
ruler_x_text = document.getElementById("ruler_x_text");
ruler_y_text = document.getElementById("ruler_y_text");
ruler_x_line = document.getElementById("ruler_x_line");
ruler_y_line = document.getElementById("ruler_y_line");

//ACTIVE TOOL
var left_panel = document.getElementById("left_panel");
var buttons = left_panel.getElementsByClassName("tool_button");
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

window.onresize = function () {
  svgPanelCoords = getCoords(svgPanel);
  scrollcoords = getCoords(scrollPanel);
  updateRulers();
}

window.onload = function () {
  updateRulers();
}

//updateRulersPos
function updateRulersPos() {
  rulerX.style.top = scrollPanel.scrollTop;
  rulerY.style.left = scrollPanel.scrollLeft;
}

scrollPanel.onscroll = function () {
  svgPanelCoords = getCoords(svgPanel);
  updateRulersPos();
};