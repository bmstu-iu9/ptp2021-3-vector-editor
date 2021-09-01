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
    currentObject.addPanel();
    unblockEditing(3);
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
    resetCurrentObject();
    buffer.show();
    currentObject = buffer;
    buffer = buffer.createClone();
    buffer.move(50, 50);
    buffer.stopMoving(50, 50);
    currentObject.addPanel();
}

//CUT
cut = document.getElementById("cut");
cut.onclick = function () {
    if (currentObject != null) {
        copyFunc();
        deleteFunc();
    }
}
document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyX' && (event.ctrlKey || event.metaKey) && currentObject != null) {
        copyFunc();
        deleteFunc();
    }
});

editFunctions = [cut, copy, deleteObject, paste];

function unblockEditing(i) {
    func = editFunctions[i];
    func.style.color = "#fff";
    func.style.cursor = "pointer";
    func.onmouseover = (e) => e.target.style.background = "#555";
    func.onmouseout = (e) => e.target.style.background = "#333";
}

function blockEditing(i) {
    func = editFunctions[i];
    func.style.color = "#999";
    func.style.cursor = "default";
    func.style.background = "#333";
    func.onmouseover = null;
    func.onmouseout = null;
}

function centralLocation(width, height) {
    svgPanel.setAttribute('style', 'top: 50%; left: 50%; transform: translate(-50%, -50%);');
    if (scrollPanel.clientWidth - 15 < width)
        svgPanel.setAttribute('style', 'transform: translate(0, -50%); left: 15px;');
    if (scrollPanel.clientHeight - 15 < height)
        svgPanel.setAttribute('style', 'transform: translate(-50%, 0); top: 15px;');
    if (scrollPanel.clientWidth - 15 < width && scrollPanel.clientHeight - 15 < height)
        svgPanel.style.transform = "translate(0, 0)";
}

//CREATE 
create = document.getElementById("create");

create.onclick = function () {
    let width = prompt('Введите ширину нового холста в пикселях:', 512);
    let height = prompt('Введите высоту нового холста в пикселях:', 512);

    if (width < 1 || height < 1) {
        alert("Недопустимый размер холста!")
        return;
    }

    for (var i = 2; i < svgPanel.childNodes.length;)
        svgPanel.removeChild(svgPanel.childNodes[i]);
    for (var i = 0; i < layersPanel.childNodes.length;)
        layersPanel.removeChild(layersPanel.childNodes[i]);

    centralLocation(width, height);
    svgPanel.setAttribute('viewBox', '0 0 ' + String(width) + ' ' + String(height));
    svgPanel.setAttribute('width', width);
    svgPanel.setAttribute('height', height);
    scrollcoords = getCoords(scrollPanel);
    svgPanelCoords = getCoords(svgPanel);
    updateRulers();
    updateGrid();
    createFirstLayer();
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
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
        let clone = svgGrid.cloneNode(true);
        svgPanel.outerHTML = event.target.result;
        clone.setAttribute("id", "svg_grid");
        let divs = document.querySelector("#draw_panel");
        let first = divs.firstElementChild;
        first.setAttribute("id", "svg_panel");
        svgPanel = document.getElementById(first.id);
        svgPanel.insertBefore(clone, svgPanel.firstElementChild);
        svgGrid = document.getElementById("svg_grid");
        svgBackground = document.getElementById("svg_background");
        let width = first.getAttribute('width');
        let height = first.getAttribute('height')
        if (width == null || height == null) {
            first.setAttribute('width', 512);
            first.setAttribute('height', 512);
            first.setAttribute('viewBox', '0 0 512 512');
            width = 512, height = 512;
        }

        svgPanel = document.getElementById(first.id);
        svgPanel.setAttribute('style', 'background-color: #fff; position: absolute;');
        centralLocation(width, height);
        scrollcoords = getCoords(scrollPanel);
        svgPanelCoords = getCoords(svgPanel);
        updateRulers();
        updateGrid();
        for (var i = 0; i < layersPanel.childNodes.length;)
            layersPanel.removeChild(layersPanel.childNodes[i]);
        createFirstLayer();
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
    };
    reader.readAsText(file);
}

document.getElementById("file-selector").addEventListener("change", readFile);

//SAVE
save = document.getElementById("save");

save.onclick = function () {
    let style = svgPanel.getAttribute('style');
    svgPanel.removeAttribute('style');
    let svgGridClone = svgGrid;
    svgPanel.removeChild(svgGrid);
    resetCurrentObject()

    let svgData = draw_panel.innerHTML.toString();
    let blob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8"
    });
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = ".svg";
    a.click();

    window.URL.revokeObjectURL(url);

    svgPanel.style = style;
    svgPanel.prepend(svgGridClone);
}

//SAVEPNG
savePng = document.getElementById("savePng");

savePng.onclick = function () {
    let style = svgPanel.getAttribute('style');
    svgPanel.removeAttribute('style');
    let svgGridClone = svgGrid;
    svgPanel.removeChild(svgGrid);
    resetCurrentObject()

    let svgData = draw_panel.innerHTML.toString();
    let blob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8"
    });
    let url = window.URL.createObjectURL(blob);

    let img = new Image();
    img.onload = function () {
        canvas.getContext("2d").drawImage(img, 0, 0);

        let a = document.createElement("a");
        a.style = "display: none";
        a.href = canvas.toDataURL("image/png");;
        a.download = ".png";
        a.click();

        window.URL.revokeObjectURL(url);
    }
    img.src = url;

    svgPanel.style = style;
    svgPanel.prepend(svgGridClone);
}

//SCALING
zoomIn = document.getElementById("zoomIn");
zoomIn.onclick = function () {
    svgPanelCoords = getCoords(svgPanel);
    svgPanel.style.transform = "translate(0, 0)";
    svgPanel.style.left = svgPanelCoords.left - scrollcoords.left;
    svgPanel.style.top = svgPanelCoords.top - scrollcoords.top;
    svgPanel.style.width = svgPanel.clientWidth * 1.5 + "px";
    svgPanel.style.height = svgPanel.clientHeight * 1.5 + "px";
    scaleСoef *= 1.5;
    updateRulers();
}

zoomOut = document.getElementById("zoomOut");
zoomOut.onclick = function () {
    svgPanelCoords = getCoords(svgPanel);
    svgPanel.style.transform = "translate(0, 0)";
    svgPanel.style.left = svgPanelCoords.left - scrollcoords.left;
    svgPanel.style.top = svgPanelCoords.top - scrollcoords.top;
    svgPanel.style.width = svgPanel.clientWidth / 1.5 + "px";
    svgPanel.style.height = svgPanel.clientHeight / 1.5 + "px";
    scaleСoef /= 1.5;
    updateRulers();
}

//LAYERS
frontObject = document.getElementById("frontObject");

frontObject.onclick = function () {
    if (currentObject != null) {
        currentLayer.group.append(currentObject.svgElement);
    }
}

backObject = document.getElementById("backObject");

backObject.onclick = function () {
    if (currentObject != null) {
        currentLayer.group.prepend(currentObject.svgElement);
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

//SHOW GRID 
showGrid = document.getElementById("showGrid");
showGrid.onclick = function () {
    if (!isGridEnabled) {
        isGridEnabled = true;
        svgBackground.setAttribute("fill", "url(#grid_pattern)");
    } else {
        isGridEnabled = false;
        svgBackground.setAttribute("fill", "rgb(255, 255, 255)");
    }
}