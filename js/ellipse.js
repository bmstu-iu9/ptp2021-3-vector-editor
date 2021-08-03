ellipse = document.getElementById("ellipse");

ellipse.onclick = function () {
    wasPressed = "ellipse";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "ellipse") {
            updateCursorCoords(current);
            let newObject = new ellipse();

            document.onmousemove = function (current) {
                updateCursorCoords(current);
                newObject.updateAttributes();
            };
            document.onmouseup = function () {
                document.onmousemove = null;
            };
        }
    };
}