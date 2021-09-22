cursor = document.getElementById("cursor");
cursor.onclick = function () {
    scrollPanel.style.cursor = "default";
    scrollPanel.onmousedown = null;
}