rectangle = document.getElementById("rectangle");

rectangle.onclick = function () {
    wasPressed = "rectangle";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "rectangle") {
            updateCursorCoords(current);
            let newObject = new rectangle();

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