rectangle = document.getElementById("rectangle");

rectangle.onclick = function () {
    wasPressed = "rectangle";
    panel.style.cursor = "default";

    panel.onmousedown = function (current) {
        let coords = getCoords(panel);
        let x0 = current.pageX - coords.left;
        let y0 = current.pageY - coords.top;
        let newSvgChild = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        panel.appendChild(newSvgChild);

        if (wasPressed == "rectangle") {
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
            newSvgChild.setAttribute('width', Math.abs(curX - x0));
            newSvgChild.setAttribute('height', Math.abs(curY - y0));
            newSvgChild.setAttribute('x', Math.min(x0, curX));
            newSvgChild.setAttribute('y', Math.min(y0, curY));
        }
    };
}