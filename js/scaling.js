scale = document.getElementById("scale");

scale.onclick = function () {
  wasPressed = "scale";
  svgPanel.style.cursor = "zoom-in";
  svgPanel.onclick = function (event) {
    if (wasPressed == "scale") {
      if (event.ctrlKey) {
        sizeCoef = 2 / 3;
        shiftCoef = 1 / 3;
      } else {
        sizeCoef = 3 / 2;
        shiftCoef = -1 / 2;
      }
      svgPanel.style.width = svgPanel.clientWidth * sizeCoef + "px";
      svgPanel.style.height = svgPanel.clientHeight * sizeCoef + "px";
      scaleСoef *= sizeCoef;

      let shiftX = event.pageX - svgPanelCoords.left; //расстояние м/у курсором
      let shiftY = event.pageY - svgPanelCoords.top; //и границей холста

      svgPanelX = svgPanelCoords.left - scrollcoords.left;
      svgPanelY = svgPanelCoords.top - scrollcoords.top;

      svgPanel.style.transform = "translate(0, 0)";
      let left = svgPanelX + shiftX * shiftCoef + scrollPanel.scrollLeft;
      let top = svgPanelY + shiftY * shiftCoef + scrollPanel.scrollTop;
      if (left > 15) {
        svgPanel.style.left = left;
      } else {
        svgPanel.style.left = 15;
      }
      if (top > 15) {
        svgPanel.style.top = top;
      } else {
        svgPanel.style.top = 15;
      }
      //svgPanel.style.top == svgPanelY
      svgPanelCoords = getCoords(svgPanel);
      updateRulers();
    }
  };
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && wasPressed == "scale") {
      svgPanel.style.cursor = "zoom-out";
    }
  });
  document.addEventListener("keyup", function (event) {
    if (event.key == "Control" && wasPressed == "scale") {
      svgPanel.style.cursor = "zoom-in";
    }
  });
};