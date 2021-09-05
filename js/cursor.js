cursor = document.getElementById("cursor");
cursor.onclick = function () {
    svgPanel.style.cursor = "default";
    svgPanel.onmousedown = null;
}