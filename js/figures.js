//PENCIL
pencilButton = document.getElementById("pencil");

pencilButton.onclick = function () {
    wasPressed = "pencil";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "pencil") {
            updateCursorCoords(current);
            let newObject = new pencil();

            svgPanel.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updateAttributes();
            };
            document.onmouseup = function () {
                svgPanel.onmousemove = null;
                document.onmouseup = null;
            };
            svgPanel.onmouseenter = function (current) {
                updateCursorCoords(current);
                newObject = new pencil();
            };
        }
    };
};

//RECTANGLE
rectangleButton = document.getElementById("rectangle");

rectangleButton.onclick = function () {
    wasPressed = "rectangle";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "rectangle") {
            updateCursorCoords(current);
            let newObject = new rectangle();

            document.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updateAttributes(current);
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    };
}

//ELLIPSE
ellipseButton = document.getElementById("ellipse");

ellipseButton.onclick = function () {
    wasPressed = "ellipse";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "ellipse") {
            updateCursorCoords(current);
            let newObject = new ellipse();

            document.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updateAttributes(current);
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    };
}

//POLYGON
polygonButton = document.getElementById("polygon");
let curVertNum = 3;

polygonButton.onclick = function () {
    wasPressed = "polygon";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "polygon") {
            updateCursorCoords(current);
            let newObject = new polygon();
            newObject.addHotKeys();

            document.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updateAttributes(current);
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                newObject.removeHotKeys();
            };
        }
    };
}

//LINE
line = document.getElementById("line");

line.onclick = function () {
    wasPressed = "line";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "line") {
            updateCursorCoords(current);
            let newObject = new line();

            document.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updateAttributes(current);
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    };
}

//POLYLINE
pathTool = document.getElementById("pathTool");
let completed = true;

pathTool.onclick = function () {
    wasPressed = "pathTool";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "pathTool" && completed) {
            updateCursorCoords(current);
            let newObject = new polyline();
            completed = false;

            document.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updateLine(current);
            };
            svgPanel.onmouseup = function (current) {
                newObject.updateAttributes();
                if (current.ctrlKey) {
                    newObject.completePolyline();
                }
            };
            document.onclick = function () {
                if (wasPressed != "pathTool") {
                    newObject.completePolyline();
                }
            }
        }
    };
};