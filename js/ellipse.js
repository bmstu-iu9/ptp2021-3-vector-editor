ellipse = document.getElementById("ellipse");

ellipse.onclick = function () {
    wasPressed = "ellipse";
    panel.style.cursor = "default";

    panel.onmousedown = function (current) {
        let coords = getCoords(panel);
        let x0 = current.pageX - coords.left;
        let y0 = current.pageY - coords.top;
        let newSvgChild = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
        panel.appendChild(newSvgChild);

        if (wasPressed == "ellipse") {
            scrollPanel.onmousemove = function (current) {
                curX = current.pageX - coords.left;
                curY = current.pageY - coords.top;

                updateAttributes();
            };

            document.onmouseup = function () {
                scrollPanel.onmousemove = null;
                document.onmouseup = null;
            };            
        }
        function getCoords(elem) {
            let box = elem.getBoundingClientRect();
            return {
                top: box.top + pageYOffset,
                left: box.left + pageXOffset,
            };
        }
        function updateAttributes(){
            newSvgChild.setAttribute("rx", Math.abs(curX - x0)/2);
            newSvgChild.setAttribute("ry", Math.abs(curY - y0)/2);
            newSvgChild.setAttribute("cx", Math.min(x0, curX)+Math.abs(curX - x0)/2);
            newSvgChild.setAttribute("cy", Math.min(y0, curY)+Math.abs(curY - y0)/2);
        }
    };
}