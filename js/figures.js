//RECTANGLE
rectangleButton = document.getElementById("rectangle");

rectangleButton.onclick = function () {
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
        };
    };
}

//ELLIPSE
ellipseButton = document.getElementById("ellipse");

ellipseButton.onclick = function () {
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
        };
    };
}

//POLYGON
polygonButton = document.getElementById("polygon");
let curVertNum = 3;

polygonButton.onclick = function () {
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
        };
    };
}

//STAR POLYGON
starPolygonButton = document.getElementById("starPolygon");
let curStarPolygonVertNum = 5;

starPolygonButton.onclick = function () {
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        let newObject = new starPolygon();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete();
        };
    };
}

//PENTAGRAM
pentagramButton = document.getElementById("pentagram");
let curPentagramVertNum = 5;

pentagramButton.onclick = function () {
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
        };
    };
}

//PENCIL
pencilButton = document.getElementById("pencil");

pencilButton.onclick = function () {
    svgPanel.style.cursor = "url(img/pencil_cursor.svg) 0 20, default";
    svgPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        let newObject = new pencil();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes();
        };
        document.onmouseup = function () {
            newObject.complete();
        };
    };
};

//LINE
lineButton = document.getElementById("line");

lineButton.onclick = function () {
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        let newObject = new line();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete(newObject.x0 != newObject.x2 || newObject.y0 != newObject.y2);
        };
    };
}

//POLYLINE
pathTool = document.getElementById("pathTool");
let polylineIsCompleted = true;

pathTool.onclick = function () {
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
            document.onmouseup = function (current) {
                newObject.updateAttributes();
                if (current.ctrlKey) {
                    newObject.complete();
                }
            };
            container.onmousedown = function () {
                newObject.complete();
            };
            rightPanel.onmousedown = function () {
                newObject.complete();
            };
            document.onclick = function () {
                if (wasPressed != "pathTool") {
                    newObject.complete();
                }
            };
        }
    };
};

//VECTOR
vectorTool = document.getElementById("vector");
let vectorIsCompleted = true;

vectorTool.onclick = function () {
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = startVector;
};

function startVector(current) {
    if (vectorIsCompleted && current.which == 1) {
        updateCursorCoords(current);
        let newObject = new vector();
        vectorIsCompleted = false;

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateLine();
        };

        document.onmouseup = function (current) {

            document.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updatePath();
            };
            document.onmousedown = function (current) {
                updateCursorCoords(current);
                newObject.updatePoint();
                document.onmousemove = function (current) {
                    updateCursorCoords(current);
                    newObject.updateSecondPath();
                };
            };

            updateCursorCoords(current);
            newObject.updateFirstPath();

            if (current.ctrlKey) {
                newObject.complete();
            }
        };
        container.onmousedown = function () {
            newObject.complete();
        };
        rightPanel.onmousedown = function () {
            newObject.complete();
        };
        document.onclick = function () {
            if (wasPressed != "vector") {
                newObject.complete();
            }
        };
    }
}