hand = document.getElementById("hand");
panel = document.getElementById("svg_panel");
scrollPanel = document.getElementById("main_panel");
var wasPressed;

hand.onclick = function () {
  wasPressed = "hand";
  panel.style.cursor = "grab";

  panel.onmousedown = function (current) {
    if (wasPressed == "hand") {
      panel.style.cursor = "grabbing";
      let coords = getCoords(panel);
      let scrollcoords = getCoords(scrollPanel);
      let shiftX = current.pageX - coords.left + scrollcoords.left;
      let shiftY = current.pageY - coords.top + scrollcoords.top;

      panel.onmousemove = function (current) {
        panel.style.transform = "translate(0, 0)";
        panel.style.top = current.pageY - shiftY + "px";
        panel.style.left = current.pageX - shiftX + "px";
      };

      document.onmouseup = function () {
        panel.onmousemove = null;
        document.onmouseup = null;
        panel.style.cursor = "grab";
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
