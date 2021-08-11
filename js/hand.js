hand = document.getElementById("hand");

hand.onclick = function () {
  wasPressed = "hand";
  svgPanel.style.cursor = "grab";
  svgPanel.onmousedown = function (current) {
    if (wasPressed == "hand") {
      svgPanel.style.cursor = "grabbing";
      let shiftX = current.pageX - svgPanelCoords.left + scrollcoords.left - scrollPanel.scrollLeft;
      let shiftY = current.pageY - svgPanelCoords.top + scrollcoords.top - scrollPanel.scrollTop;

      svgPanel.onmousemove = function (current) {
        svgPanel.style.transform = "translate(0, 0)";
        svgPanel.style.top = current.pageY - shiftY + "px";
        svgPanel.style.left = current.pageX - shiftX + "px";
        svgPanelCoords = getCoords(svgPanel);
        updateRulers();
      };

      document.onmouseup = function () {
        svgPanel.onmousemove = null;
        document.onmouseup = null;
        svgPanel.style.cursor = "grab";
      };
    }
  };
};
