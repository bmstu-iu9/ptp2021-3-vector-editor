ellipse = document.getElementById("ellipse");

ellipse.onclick = function () {
    wasPressed = "ellipse";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "ellipse") {
            coords = getMouseCoords(current);
            let x0 = coords.x;
            let y0 = coords.y;
            let newObject = new ellipse(x0, y0);

            document.onmousemove = function (current) {
                coords = getMouseCoords(current);
                newObject.updateAttributes(coords.x, coords.y);
            };
            document.onmouseup = function () {
                document.onmousemove = null;
            };
        }
    };
}