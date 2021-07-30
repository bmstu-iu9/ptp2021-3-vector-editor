rectangle = document.getElementById("rectangle");

rectangle.onclick = function () {
    wasPressed = "rectangle";
    svgPanel.style.cursor = "default";

    svgPanel.onmousedown = function (current) {
        let coords = getCoords(svgPanel);
        let x0 = current.pageX - coords.left;
        let y0 = current.pageY - coords.top;

        let newObject = new rectangle('rect');

        if (wasPressed == "rectangle") {
            scrollPanel.onmousemove = function (current) {
                curX = current.pageX - coords.left;
                curY = current.pageY - coords.top;

                newObject.updateAttributes(x0, y0, curX, curY);
            };

            document.onmouseup = function () {
                scrollPanel.onmousemove = null;
            };            
        }
    };
}
