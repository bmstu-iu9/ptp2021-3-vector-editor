let newObject;

function setCursorActive() {
    if (newObject.isCompleted) {
        cursor.dispatchEvent(new Event("mousedown"));
        cursor.click();
    }
}

//RECTANGLE
rectangleButton = document.getElementById("rectangle");

rectangleButton.onclick = function () {
    scrollPanel.style.cursor = "default";
    scrollPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        newObject = new rectangle();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete();
            setCursorActive();
        };
    };
};

//ELLIPSE
ellipseButton = document.getElementById("ellipse");

ellipseButton.onclick = function () {
    scrollPanel.style.cursor = "default";
    scrollPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        newObject = new ellipse();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete();
            setCursorActive();
        };
    };
};

//POLYGON
polygonButton = document.getElementById("polygon");
let curVertNum = 3;

polygonButton.onclick = function () {
    scrollPanel.style.cursor = "default";
    scrollPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        newObject = new polygon();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete();
            setCursorActive();
        };
    };
};

//STAR POLYGON
starPolygonButton = document.getElementById("starPolygon");
let curStarPolygonVertNum = 5;

starPolygonButton.onclick = function () {
    scrollPanel.style.cursor = "default";
    scrollPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        newObject = new starPolygon();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete();
            setCursorActive();
        };
    };
};

//PENTAGRAM
pentagramButton = document.getElementById("pentagram");
let curPentagramVertNum = 5;

pentagramButton.onclick = function () {
    scrollPanel.style.cursor = "default";
    scrollPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        newObject = new pentagram();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete();
            setCursorActive();
        };
    };
};

//PENCIL
pencilButton = document.getElementById("pencil");

pencilButton.onclick = function () {
    scrollPanel.style.cursor = "url(img/pencil_cursor.svg) 0 20, default";
    scrollPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        newObject = new pencil();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes();
        };
        document.onmouseup = function () {
            newObject.complete();
            setCursorActive();
        };
    };
};

//LINE
lineButton = document.getElementById("line");

lineButton.onclick = function () {
    scrollPanel.style.cursor = "default";
    scrollPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        newObject = new line();

        document.onmousemove = function (current) {
            updateCursorCoords(current);
            newObject.updateAttributes(current);
        };
        document.onmouseup = function () {
            newObject.complete(newObject.x0 != newObject.x2 || newObject.y0 != newObject.y2);
            setCursorActive();
        };
    };
};

//POLYLINE
pathTool = document.getElementById("pathTool");
let polylineIsCompleted = true;

pathTool.onclick = function () {
    scrollPanel.style.cursor = "default";
    scrollPanel.onmousedown = function (current) {
        if (polylineIsCompleted && current.which == 1) {
            updateCursorCoords(current);
            newObject = new pathTool();
            polylineIsCompleted = false;

            document.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updateLine(current);
            };
            document.onmouseup = function (current) {
                newObject.updateAttributes();
                if (current.ctrlKey) {
                    newObject.complete();
                    setCursorActive();
                }
            };
            container.onmousedown = function () {
                newObject.complete();
                setCursorActive();
            };
            rightPanel.onmousedown = function () {
                newObject.complete();
                setCursorActive();
            };
            document.onmousedown = function () {
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
    scrollPanel.style.cursor = "default";
    scrollPanel.onmousedown = startVector;
};

function startVector(current) {
    if (vectorIsCompleted && current.which == 1) {
        updateCursorCoords(current);
        newObject = new vector();
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
                if (wasPressed != "vector") {
                    newObject.complete();
                    return;
                }
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
                setCursorActive();
            }
        };
        container.onmousedown = function () {
            newObject.complete();
            setCursorActive();
        };
        rightPanel.onmousedown = function () {
            newObject.complete();
            setCursorActive();
        };
        document.onmousedown = function () {
            if (wasPressed != "vector") {
                newObject.complete();
            }
        };
    }
};

//TEXT
textButton = document.getElementById("text");

textButton.onclick = function () {
    scrollPanel.style.cursor = "default";
    scrollPanel.onmousedown = function (current) {
        updateCursorCoords(current);
        newObject = new text();
        newObject.complete();
        setCursorActive();
    };
};