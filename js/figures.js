//RECTANGLE
rectangleButton = document.getElementById("rectangle");

rectangleButton.onclick = function () {
    wasPressed = "rectangle";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        let newObject = new rectangle();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete();
            if (newObject.width == 0 || newObject.height == 0) {
                newObject.remove();
                resetCurrentObject();
            }
        };
    };
}

//ELLIPSE
ellipseButton = document.getElementById("ellipse");

ellipseButton.onclick = function () {
    wasPressed = "ellipse";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        let newObject = new ellipse();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete();
            if (newObject.rx == 0 || newObject.ry == 0) {
                newObject.remove();
                resetCurrentObject();
            }
        };
    };
}

//POLYGON
polygonButton = document.getElementById("polygon");
let curVertNum = 3;

polygonButton.onclick = function () {
    wasPressed = "polygon";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        let newObject = new polygon();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete();
            if (newObject.r == 0) {
                newObject.remove();
                resetCurrentObject();
            }
        };
    };
}

//PENTAGRAM
pentagramButton = document.getElementById("pentagram");
let curPentagramVertNum = 5;

pentagramButton.onclick = function () {
    wasPressed = "pentagram";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        let newObject = new pentagram();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete();
            if (newObject.r == 0) {
                newObject.remove();
                resetCurrentObject();
            }
        };
    };
}

//PENCIL
pencilButton = document.getElementById("pencil");

pencilButton.onclick = function () {
    wasPressed = "pencil";
    svgPanel.style.cursor = "url(img/pencil_cursor.svg) 0 20, default";
    svgPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        let newObject = new pencil();

        svgPanel.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes();
        };
        document.onmouseup = function () {
            if (newObject.path == newObject.x0 + "," + newObject.y0) {
                newObject.complete();
                newObject.remove();
                resetCurrentObject();
            } else newObject.complete();
        };
        svgPanel.onmouseenter = function (current) {
            document.onmouseup();
            resetCurrentObject();
            svgPanel.onmousedown(current);
        };
    };
};

//LINE
line = document.getElementById("line");

line.onclick = function () {
    wasPressed = "line";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        let newObject = new line();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete();
            if (newObject.x0 == newObject.x2 && newObject.y0 == newObject.y2) {
                newObject.remove();
                resetCurrentObject();
            }
        };
    };
}

//POLYLINE
pathTool = document.getElementById("pathTool");
let polylineIsCompleted = true;

pathTool.onclick = function () {
    wasPressed = "pathTool";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (polylineIsCompleted && current.which == 1) {
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
