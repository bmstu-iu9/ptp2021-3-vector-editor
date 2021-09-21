eraser = document.getElementById("eraser");
eraser.onmousedown = function () {
    scrollPanel.onmousedown = () => isEraserActive = true;
    document.onmouseup = () => isEraserActive = false;
    scrollPanel.style.cursor = "url(img/eraser.ico) 6 11, default";
}