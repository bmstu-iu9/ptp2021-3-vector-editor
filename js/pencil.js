pencil = document.getElementById("pencil");

pencil.onclick = function () {
    wasPressed = "pencil";
    svgPanel.style.cursor = "default";

    svgPanel.onmousedown = function (current) {
        let coords = getCoords(svgPanel);
        let x0 = current.pageX - coords.left;
        let y0 = current.pageY - coords.top;

        let newObject = new pencil('polyline', x0, y0);

        if (wasPressed == "pencil") {
            svgPanel.onmousemove = function (current) {
                curX = current.pageX - coords.left;
                curY = current.pageY - coords.top;

                newObject.updateAttributes(curX, curY);
            };

            document.onmouseup = function () {
                svgPanel.onmousemove = null;
            };

            svgPanel.onmouseleave = function () {
                svgPanel.onmousemove = null;
            };
        }
    };
}