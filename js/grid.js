function updateGrid() {
  svgGrid.setAttribute("width", svgPanel.getAttribute("width"));
  svgGrid.setAttribute("height", svgPanel.getAttribute("height"));
  svgGrid.setAttribute("viewBox", svgPanel.getAttribute("viewBox"));
}