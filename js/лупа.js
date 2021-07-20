scale = document.getElementById("scale");
scale.onclick = function () {
  wasPressed = "scale";
  panel.style.cursor = "zoom-in";
  panel.onmousedown = function (event) {
    if (wasPressed == "scale") {
      if (event.ctrlKey) panel.style.cursor = "zoom-out";
      else panel.style.cursor = "zoom-in";
    }
  };
  panel.onmouseup = function (event) {
    if (wasPressed == "scale") {
      if (event.ctrlKey) {
        panel.style.width = panel.clientWidth / 1.5 + "px";
        panel.style.height = panel.clientHeight / 1.5 + "px";
      } else {
        panel.style.width = panel.clientWidth * 1.5 + "px";
        panel.style.height = panel.clientHeight * 1.5 + "px";
      }
    }
  };
};
