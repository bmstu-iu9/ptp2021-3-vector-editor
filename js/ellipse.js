ellipse = document.getElementById("ellipse");

ellipse.onclick = function () {
    wasPressed = "ellipse";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = function (current) {
        let coords = getCoords(svgPanel);
        let x0 = (current.pageX - coords.left)/scaleСoef;
        let y0 = (current.pageY - coords.top)/scaleСoef;
        let newObject = new ellipse('ellipse');
        
        if (wasPressed == "ellipse") {
            scrollPanel.onmousemove = function (current) {
                curX = (current.pageX - coords.left)/scaleСoef;
                curY = (current.pageY - coords.top)/scaleСoef;
                newObject.updateAttributes(x0, y0, curX, curY);
            };
            document.onmouseup = function () {
                scrollPanel.onmousemove = null;
            };            
        }
    };
}