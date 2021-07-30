scale = document.getElementById("scale");
scale.onclick = function () {
  wasPressed = "scale";
  svgPanel.style.cursor = "zoom-in";
  svgPanel.onmousedown = function (event) {
    if (wasPressed == "scale") {
      if (event.ctrlKey) svgPanel.style.cursor = "zoom-out";
      else svgPanel.style.cursor = "zoom-in";
    }
  };
  svgPanel.onmouseup = function (event) {
    if (wasPressed == "scale") {
      if (event.ctrlKey) {
        svgPanel.style.width = svgPanel.clientWidth / 1.5 + "px";
        svgPanel.style.height = svgPanel.clientHeight / 1.5 + "px";
      } else {
        svgPanel.style.width = svgPanel.clientWidth * 1.5 + "px";
        svgPanel.style.height = svgPanel.clientHeight * 1.5 + "px";
      }
    }
  };
};
