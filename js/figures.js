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
                newObject.complete();
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
                newObject.complete();
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

            document.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updateAttributes(current);
            };
            document.onmouseup = function () {
                newObject.complete();
            };
        }
    };
}

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
                newObject.complete();
            };
            svgPanel.onmouseenter = function (current) {
                updateCursorCoords(current);
                newObject.completeFirstObject();
                newObject = new pencil();
            };
        }
    };
};

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
                newObject.complete();
            };
        }
    };
}

//POLYLINE
pathTool = document.getElementById("pathTool");
let polylineIsCompleted = true;

pathTool.onclick = function () {
    wasPressed = "pathTool";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "pathTool" && polylineIsCompleted) {
            updateCursorCoords(current);
            let newObject = new polyline();
            polylineIsCompleted = false;

            document.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updateLine(current);
            };
            svgPanel.onmouseup = function (current) {
                newObject.updateAttributes();
                if (current.ctrlKey) {
                    newObject.complete();
                }
            };
            document.onclick = function () {
                if (wasPressed != "pathTool") {
                    newObject.complete();
                }
            }
        }
    };
};