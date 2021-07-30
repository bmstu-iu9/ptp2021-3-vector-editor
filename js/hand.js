hand = document.getElementById("hand");

hand.onclick = function () {
  wasPressed = "hand";
  svgPanel.style.cursor = "grab";

  svgPanel.onmousedown = function (current) {
    if (wasPressed == "hand") {
      svgPanel.style.cursor = "grabbing";
      let coords = getCoords(svgPanel);
      let scrollcoords = getCoords(scrollPanel);
      let shiftX = current.pageX - coords.left + scrollcoords.left;
      let shiftY = current.pageY - coords.top + scrollcoords.top;

      svgPanel.onmousemove = function (current) {
        svgPanel.style.transform = "translate(0, 0)";
        svgPanel.style.top = current.pageY - shiftY + "px";
        svgPanel.style.left = current.pageX - shiftX + "px";
      };

      document.onmouseup = function () {
        svgPanel.onmousemove = null;
        svgPanel.style.cursor = "grab";
      };

      function getCoords(elem) {
        let box = elem.getBoundingClientRect();

        return {
          top: box.top + pageYOffset,
          left: box.left + pageXOffset,
        };
      }
    }
  };
};
