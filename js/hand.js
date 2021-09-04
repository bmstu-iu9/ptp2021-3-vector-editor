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
      let left = current.pageX - shiftX,
        top = current.pageY - shiftY;
      if (left > 15)
        svgPanel.style.left = left + "px";
      else
        svgPanel.style.left = "15px";
      if (top > 15)
        svgPanel.style.top = top + "px";
      else
        svgPanel.style.top = "15px";

      updateRulers();
      svgPanelCoords = getCoords(svgPanel);
    };

    document.onmouseup = function () {
      svgPanel.onmousemove = null;
      document.onmouseup = null;
      svgPanel.style.cursor = "grab";
    };
  };
};