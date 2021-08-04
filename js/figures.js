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
            document.addEventListener('keydown', newObject.updateVertNum);

            document.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updateAttributes();
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.removeEventListener('keydown', newObject.updateVertNum);
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
            };
        }
    };
}