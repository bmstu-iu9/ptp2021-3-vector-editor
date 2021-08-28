cursor = document.getElementById("cursor");
cursor.onclick = function () {
    wasPressed = "cursor";
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = null;
}