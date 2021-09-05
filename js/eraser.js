eraser = document.getElementById("eraser");
eraser.onclick = function () {
    svgPanel.onmousedown = () => isEraserActive = true;
    document.onmouseup = () => isEraserActive = false;
    svgPanel.style.cursor = "url(img/eraser.ico) 6 11, default";
}