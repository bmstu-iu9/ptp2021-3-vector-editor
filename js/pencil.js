pencil = document.getElementById("pencil");

pencil.onclick = function () {
    wasPressed = "pencil";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        if (wasPressed == "pencil") {
            coords = getMouseCoords(current);
            let newObject = new pencil(coords.x, coords.y);

            svgPanel.onmousemove = function (current) {
                coords = getMouseCoords(current);
                newObject.updateAttributes(coords.x, coords.y);
            };
            document.onmouseup = function () {
                svgPanel.onmousemove = null;
            };
            svgPanel.onmouseenter = function (current) {
                coords = getMouseCoords(current);
                newObject = new pencil(coords.x, coords.y);
            };
        }
    };
};
