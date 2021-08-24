svgPanel = document.getElementById("svg_panel");
drawPanel = document.getElementById("draw_panel");
scrollPanel = document.getElementById("scroll_panel");
layersPanel = document.getElementById("layers_panel");
rightPanel = document.getElementById("right_panel");

let isSomeObjectSelected = false, //для курсора
	isSomePointSelected = false;
let wasPressed, currentObject = null,
	currentLayer,
	objects = [];
let buffer = null; //для копирования
let svgPanelCoords = getCoords(svgPanel),
	scrollcoords = getCoords(scrollPanel),
	curX, curY; //cursor coordinates
let scaleСoef = 1;
let pointRadius = 4;
let currentPointTypeAttr = null;

//RULER
rulerX = document.getElementById("ruler_x");
rulerY = document.getElementById("ruler_y");
ruler_x_pattern = document.getElementById("ruler_x_pattern");
ruler_y_pattern = document.getElementById("ruler_y_pattern");
ruler_x_text = document.getElementById("ruler_x_text");
ruler_y_text = document.getElementById("ruler_y_text");
ruler_x_line = document.getElementById("ruler_x_line");
ruler_y_line = document.getElementById("ruler_y_line");

//GRID 
svgGrid = document.getElementById("svg_grid");
svgBackground = document.getElementById("svg_background");
let isGridEnabled = false;

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
let isEraserActive = false;

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
	rulerX.style.top = scrollPanel.scrollTop + "px";
	rulerX.style.left = scrollPanel.scrollLeft + 15 + "px";
	rulerY.style.top = scrollPanel.scrollTop + 15 + "px";
	rulerY.style.left = scrollPanel.scrollLeft + "px";
}

scrollPanel.onscroll = function () {
	svgPanelCoords = getCoords(svgPanel);
	updateRulersPos();
	updateRulers();
};

function resetCurrentObject() {
	if (currentObject != null) {
		currentObject.hideFrameAndPoints();
		currentObject = null;
	}
}

//преобразование декартовых координат при повороте системы координат
function getRotateCoords(x, y, angle) {
	return {
		x: x * Math.cos(angle) + y * Math.sin(angle),
		y: -x * Math.sin(angle) + y * Math.cos(angle)
	}
}