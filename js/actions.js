//DELETE
deleteObject = document.getElementById("deleteObject");

deleteObject.onclick = function () {
    if (currentObject != null) {
        deleteFunc();
    }
}
document.addEventListener('keydown', function (event) {
    if (event.code == 'Delete' && currentObject != null) {
        deleteFunc();
    }
});

function deleteFunc() {
    currentObject.remove();
    currentObject = null;
}

//COPY
copy = document.getElementById("copy");
copy.onclick = function () {
    if (currentObject != null) {
        copyFunc();
    }
}
document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyC' && (event.ctrlKey || event.metaKey) && currentObject != null) {
        copyFunc();
    }
});

function copyFunc() {
    buffer = currentObject.createClone();
    buffer.moveTo(0, 0);
    buffer.hide();
}

//PASTE
paste = document.getElementById("paste");
paste.onclick = function () {
    if (buffer != null) {
        pasteFunc();
    }
}
document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyV' && (event.ctrlKey || event.metaKey) && buffer != null) {
        pasteFunc();
    }
});

function pasteFunc() {
    if (currentObject != null) currentObject.hideFrameAndPoints();
    buffer.isCompleted = true;
    buffer.show();
    currentObject = buffer;
    buffer = buffer.createClone();
    buffer.move(50, 50);
    buffer.stopMoving(50, 50);
    buffer.hide();
}

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

    if (width < 1 || height < 1) {
        alert("Недопустимый размер холста!")
        return;
    }

    deleteAllChildren(svgPanel);

    svgPanel.setAttribute('viewBox', '0 0 ' + String(width) + ' ' + String(height));
    svgPanel.setAttribute('width', width);
    svgPanel.setAttribute('height', height);
    scrollcoords = getCoords(scrollPanel);
    svgPanelCoords = getCoords(svgPanel);
    updateRulers();
}

//OPEN
open = document.getElementById("open");

open.onclick = function () {
    document.getElementById("file-selector").click();
}

function readFile(object) {
    let file = object.target.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
        let result = confirm("Вы действительно хотите открыть новый файл? Все изменения в текущем файле будут удалены.");
        if (!result)
            return;
        svgPanel.outerHTML = event.target.result;
        let divs = document.querySelector("#draw_panel");
        let first = divs.firstElementChild;
        if (first.id == "") {
            first.setAttribute('id', 'svg_panel');
        }
        if (first.getAttribute('width') || first.getAttribute('height') == null) {
            first.setAttribute('width', 512);
            first.setAttribute('height', 512);
            first.setAttribute('viewBox', '0 0 512 512');
        }
        first.setAttribute('style', 'background-color: #fff; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);');
        svgPanel = document.getElementById(first.id);
        scrollcoords = getCoords(scrollPanel);
        svgPanelCoords = getCoords(svgPanel);
        updateRulers();
    };
    reader.readAsText(file);
}

document.getElementById("file-selector").addEventListener("change", readFile);

//SAVE
save = document.getElementById("save");

save.onclick = function () {
    let svgData = draw_panel.innerHTML.toString();
    let fileName = prompt('Введите имя файла без расширения:');
    if (fileName == null)
        return;
    let blob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8"
    });
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
    let svgData = draw_panel.innerHTML.toString();
    let fileName = prompt('Введите имя файла без расширения:');
    if (fileName == null)
        return;
    let blob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8"
    });
    let url = window.URL.createObjectURL(blob);

    let canvas = document.getElementById("canvas");
    let img = new Image();
    img.onload = function () {
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

//LAYERS
frontObject = document.getElementById("frontObject");

frontObject.onclick = function () {
    if (currentObject != null) {
        svgPanel.append(currentObject.svgElement);
        for (let i = 0; i < currentObject.pointsArray.length; i++) {
            svgPanel.append(currentObject.pointsArray[i].circle);
        }
        for (let i = 0; i < currentObject.frame.length; i++) {
            svgPanel.append(currentObject.frame[i].svgElement);
        }
    }
}

backObject = document.getElementById("backObject");

backObject.onclick = function () {
    if (currentObject != null) {
        for (let i = currentObject.pointsArray.length - 1; i >= 0; i--) {
            svgPanel.prepend(currentObject.pointsArray[i].circle);
        }
        for (let i = 0; i < currentObject.frame.length; i++) {
            svgPanel.prepend(currentObject.frame[i].svgElement);
        }
        svgPanel.prepend(currentObject.svgElement);
    }
}

//SHOW RULERS 
showRulers = document.getElementById("showRulers");
showRulers.onclick = function () {
    if (rulers.style.display == "none") {
        rulers.style.display = "block";
        updateRulers();
    } else {
        rulers.style.display = "none";
    }
}

//COLOR CHANGE
strokeColor = document.getElementById("strokeColor");

strokeColor.onchange = function () {
    if (currentObject != null) {
        currentObject.svgElement.setAttribute('stroke', strokeColor.value);
    }
}

fillColor = document.getElementById("fillColor");

fillColor.onchange = function () {
    if (currentObject != null && currentObject.type != 'pencil') {
        currentObject.svgElement.setAttribute('fill', fillColor.value);
    }
}