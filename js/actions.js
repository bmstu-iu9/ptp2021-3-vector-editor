//DELETE

deleteChild = document.getElementById("delete");

deleteChild.onclick = function () {
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

/*save = document.getElementById("save");

save.onclick = function () {
    let svgData = svgPanel.innerHTML.toString();

    let fileName = prompt('Введите, пожалуйста, имя файла без расширения:');

    if (fileName == null)
    return;

    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    let blob = new Blob([svgData], {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = fileName + ".svg";
    a.click();

    window.URL.revokeObjectURL(url);
}*/


