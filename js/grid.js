function updateGrid() {
  svgGrid.setAttribute("width", svgPanel.getAttribute("width"));
  svgGrid.setAttribute("height", svgPanel.getAttribute("height"));
  svgGrid.setAttribute("viewBox", svgPanel.getAttribute("viewBox"));
}

//SHOW GRID 
showGrid = document.getElementById("showGrid");
showGrid.onclick = function () {
    if (!isGridEnabled) {
        isGridEnabled = true;
        svgBackground.setAttribute("fill", "url(#grid_pattern)");
    } else {
        isGridEnabled = false;
        svgBackground.setAttribute("fill", "rgb(255, 255, 255)");
    }
}