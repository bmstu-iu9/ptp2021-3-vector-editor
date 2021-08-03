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

//CREATE 
create = document.getElementById("create"); 

function deleteChild(node, parent) {
    for (var i = 0; i < node.childNodes.length;)
        deleteChild(node.childNodes[i], node);

    if (node.childNodes.length == 0) {
        parent.removeChild(node);
        return;
    }
}

function deleteAllChildren(node) {
    for (var i = 0; i < node.childNodes.length;)
        deleteChild(node.childNodes[i], node);
}

create.onclick = function () {
    let width = prompt('Введите ширину нового холста в пикселях:', 512);
    let height = prompt('Введите высоту нового холста в пикселях:', 512);

    if (width < 1 || height < 1){
        alert("Недопустимый размер холста!")
        return;
    }

    deleteAllChildren(svgPanel);

    svgPanel.setAttribute('viewBox', '0 0 ' + String(width) + ' ' + String(height)); 
    svgPanel.setAttribute('width', width);
    svgPanel.setAttribute('height', height);
    scrollcoords, svgPanelCoords = getCoords(svgPanel);
}

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
}

//SAVEPNG
savePng = document.getElementById("savePng");

savePng.onclick = function () {
    let svgData = main_panel.innerHTML.toString();
    let fileName = prompt('Введите имя файла без расширения:');
    if (fileName == null)
    return;
    let blob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    let url = window.URL.createObjectURL(blob);

    let canvas = document.getElementById("canvas");
    let img = new Image();
    img.onload = function() {
        canvas.getContext("2d").drawImage(img, 0, 0);

        let a = document.createElement("a");
        a.style = "display: none";
        a.href = canvas.toDataURL("image/png");;
        a.download = fileName + ".png";
        a.click();

        window.URL.revokeObjectURL(url);
    }
    img.src = url;
}


//SCALING
zoomIn = document.getElementById("zoomIn");
zoomIn.onclick = function () {
    svgPanel.style.width = svgPanel.clientWidth * 1.5 + "px";
    svgPanel.style.height = svgPanel.clientHeight * 1.5 + "px";
    scaleСoef *= 1.5;
    svgPanelCoords = getCoords(svgPanel);
}

zoomOut = document.getElementById("zoomOut");
zoomOut.onclick = function () {
    svgPanel.style.width = svgPanel.clientWidth / 1.5 + "px";
    svgPanel.style.height = svgPanel.clientHeight / 1.5 + "px";
    scaleСoef /= 1.5;
    svgPanelCoords = getCoords(svgPanel);
}