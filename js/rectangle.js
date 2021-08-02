rectangle = document.getElementById("rectangle");

rectangle.onclick = function () {
    wasPressed = "rectangle";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "rectangle") {
            coords = getMouseCoords(current);
            let x0 = coords.x;
            let y0 = coords.y;
            let newObject = new rectangle();

            document.onmousemove = function (current) {
                coords = getMouseCoords(current);
                newObject.updateAttributes(x0, y0, coords.x, coords.y);
            };
            document.onmouseup = function () {
                document.onmousemove = null;
            };
        }
    };
}