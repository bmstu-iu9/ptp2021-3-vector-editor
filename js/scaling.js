scale = document.getElementById("scale");

scale.onclick = function () {
  wasPressed = "scale";
  svgPanel.style.cursor = "zoom-in";
  svgPanel.onmouseup = function (event) {
    if (wasPressed == "scale") {
      if (event.ctrlKey) {
        svgPanel.style.width = svgPanel.clientWidth / 1.5 + "px";
        svgPanel.style.height = svgPanel.clientHeight / 1.5 + "px";
        scaleСoef /= 1.5;
      } else {
        svgPanel.style.width = svgPanel.clientWidth * 1.5 + "px";
        svgPanel.style.height = svgPanel.clientHeight * 1.5 + "px";
        scaleСoef *= 1.5;
      }
      svgPanelCoords = getCoords(svgPanel);
    }
  };
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey) {
      svgPanel.style.cursor = "zoom-out";
    }
  });
  document.addEventListener("keyup", function (event) {
    if (event.key == "Control") {
      svgPanel.style.cursor = "zoom-in";
    }
  });
};