//DELETE
deleteObject = document.getElementById("deleteObject");

deleteObject.onclick = function () {
    if (currentObject != null) {
        svgPanel.removeChild(currentObject);
        currentObject = null;
    }
}
document.addEventListener('keydown', function(event) {
    if (event.code == 'Delete' && currentObject != null) {
        svgPanel.removeChild(currentObject);
        currentObject = null;
    }
});

//CANCEL
/*cancel = document.getElementById("cancel");

cancel.onclick = function () {
    if (objects.length != 0) {
        temp = objects.pop()
        svgPanel.removeChild(temp);
        temp = null;
    }
}

document.addEventListener('keydown', function(event) {
    if (event.code == 'KeyZ' && event.ctrlKey && objects.length != 0) {
        temp = objects.pop();
        svgPanel.removeChild(temp);
        temp = null;
    }
});*/

//SAVE
save = document.getElementById("save");

save.onclick = function () {
    let svgData = main_panel.innerHTML.toString();
    let fileName = prompt('Введите имя файла без расширения:');
    if (fileName == null)
    return;
    let blob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = fileName + ".svg";
    a.click();

    window.URL.revokeObjectURL(url);
}*/


