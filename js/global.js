svgPanel = document.getElementById("svg_panel");
drawPanel = document.getElementById("draw_panel");
scrollPanel = document.getElementById("scroll_panel");
layersPanel = document.getElementById("layers_panel");
rightPanel = document.getElementById("right_panel");
canvas = document.getElementById("canvas");

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
let pointRadius = 4,
	pointStart,
	currentPointTypeAttr = null;

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
	buttons[i].addEventListener("mousedown", function () {
		var current = left_panel.getElementsByClassName("tool_button active");
		let n = current.length;
		for (let i = 0; i < n; i++) {
			current[0].className = "tool_button";
		}
		this.className += " active";
		wasPressed = this.id;
		if (["rectangle", "ellipse", "polygon", "starPolygon", "pentagram"].indexOf(this.id) + 1) {
			document.getElementById("figures").className += " active";
		}
		if (["pathTool", "vector"].indexOf(this.id) + 1) {
			document.getElementById("pathAndvector").className += " active";
		}
		left_panel.dispatchEvent(new Event('change'));
	});
}

left_panel.onchange = () => {
	scale_panel.style.display = "none";
}

let isEraserActive = false;

//GET COORDS 
function getCoords(elem) {
	let box = elem.getBoundingClientRect();
	return {
		top: box.top + scrollY,
		left: box.left + scrollX,
	};
}

function updateCursorCoords(current) {
	curX = Math.round((current.pageX - svgPanelCoords.left) / scaleСoef);
	curY = Math.round((current.pageY - svgPanelCoords.top) / scaleСoef);
}

//преобразование декартовых координат при повороте системы координат
function getRotateCoords(x, y, angle) {
	return {
		x: x * Math.cos(angle) + y * Math.sin(angle),
		y: -x * Math.sin(angle) + y * Math.cos(angle)
	};
}

window.onresize = function () {
	scrollcoords = getCoords(scrollPanel);
	centralLocation();
}

scrollPanel.onscroll = function () {
	svgPanelCoords = getCoords(svgPanel);
	updateRulers();
};

let firstWidth = svgPanel.clientWidth,
	firstHeight = svgPanel.clientHeight;

function updateSizeOfCanvas() {
	firstWidth = svgPanel.clientWidth, firstHeight = svgPanel.clientHeight;
}

function resetCurrentObject() {
	if (currentObject != null) {
		currentObject.hideFrameAndPoints();
		currentObject.removePanel()
		currentObject = null;
	}
}