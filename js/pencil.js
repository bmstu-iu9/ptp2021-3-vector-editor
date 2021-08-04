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
                svgPanel.onmousemove = null;
            };
            svgPanel.onmouseenter = function (current) {
                updateCursorCoords(current);
                newObject = new pencil();
            };
        }
    };
};