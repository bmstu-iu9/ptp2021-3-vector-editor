hand = document.getElementById("hand");

hand.onclick = function () {
  wasPressed = "hand";
  svgPanel.style.cursor = "grab";
  svgPanel.onmousedown = function (current) {
    svgPanel.style.cursor = "grabbing";
    let shiftX = current.pageX - svgPanelCoords.left + scrollcoords.left - scrollPanel.scrollLeft;
    let shiftY = current.pageY - svgPanelCoords.top + scrollcoords.top - scrollPanel.scrollTop;

    svgPanel.onmousemove = function (current) {
      svgPanel.style.transform = "translate(0, 0)";
      if (current.pageX - shiftX > 15) {
        svgPanel.style.left = current.pageX - shiftX + "px";
        updateRulers();
      } else {
        svgPanel.style.left = 15;
      }
      if (current.pageY - shiftY > 15) {
        svgPanel.style.top = current.pageY - shiftY + "px";
        updateRulers();
      } else {
        svgPanel.style.top = 15;
      }
      svgPanelCoords = getCoords(svgPanel);
    };

    document.onmouseup = function () {
      svgPanel.onmousemove = null;
      document.onmouseup = null;
      svgPanel.style.cursor = "grab";
    };
  };
};