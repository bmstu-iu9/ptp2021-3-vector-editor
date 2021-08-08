cursor = document.getElementById("cursor");
cursor.onclick = function () {
    wasPressed = "cursor";
    svgPanel.style.cursor = "default";
}

fill = document.getElementById("fill");
fill.onclick = function () {
    wasPressed = "fill";
    svgPanel.style.cursor = "url(img/fill.ico), default";
}