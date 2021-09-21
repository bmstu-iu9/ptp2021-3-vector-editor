//DELETE
deleteObject = document.getElementById("deleteObject");

deleteObject.onclick = function () {
    if (currentObject != null) {
        doFunc("delete", currentObject);
        deleteFunc();
    }
}
document.addEventListener('keydown', function (event) {
    if (event.code == 'Delete' && currentObject != null) {
        doFunc("delete", currentObject);
        deleteFunc();
    }
});

function deleteFunc() {
    currentObject.hide();
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
    doFunc("create", currentObject);
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
        doFunc("delete", currentObject);
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
    svgPanel.style.left = "50%";
    svgPanel.style.top = "50%";
    svgPanel.style.transform = "translate(-50%, -50%)";
    if (scrollPanel.clientWidth - 15 < width) {
        svgPanel.style.left = "15px";
        svgPanel.style.transform = "translate(0, -50%)";
    }
    if (scrollPanel.clientHeight - 15 < height) {
        svgPanel.style.top = "15px";
        svgPanel.style.transform = "translate(-50%, 0)";
    }
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
    resetCurrentObject();
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
    updateSizeOfCanvas();
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
        undoActions = [];
        redoActions = [];
        createFirstLayer();
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
    };
    reader.readAsText(file);
    updateSizeOfCanvas();
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
    scaleСoef *= 1.25;
    updateScale();
    scale_panel.style.display = "flex";
    scaleP.value = scaleСoef * 100;
}

zoomOut = document.getElementById("zoomOut");
zoomOut.onclick = function () {
    scaleСoef /= 1.25;
    updateScale();
    scale_panel.style.display = "flex";
    scaleP.value = scaleСoef * 100;
}

//LAYERS
frontObject = document.getElementById("frontObject");

frontObject.onclick = function () {
    if (currentObject != null) {
        doFunc("append", currentObject)
        currentObject.appendSvgElement();
    }
}

backObject = document.getElementById("backObject");

backObject.onclick = function () {
    if (currentObject != null) {
        doFunc("prepend", currentObject)
        currentObject.prependSvgElement();
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

//UNDO REDO
undoButton = document.getElementById("undo");
undoButton.onclick = function () {
    undoFunc();
}
document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
        undoFunc();
    }
});

function search(childs) {
    for (let i = 0; i < childs.length; i++) {
        if (childs[i].nodeName == "g" && childs[i].id != "pentagram") {
            search(childs[i].childNodes)
        } else {
            let t;
            if (childs[i].id != null && childs[i].id != "") t = childs[i].id;
            else t = childs[i].nodeName;
            switch (t) {
                case "rect":
                    rectangle.create(childs[i]);
                    break;
                case "ellipse":
                    ellipse.create(childs[i]);
                    break;
                case "polygon":
                    polygon.create(childs[i]);
                    break;
                case "star":
                    starPolygon.create(childs[i]);
                    break;
                case "pentagram":
                    pentagram.create(childs[i]);
                    break;
                case "pencil":
                    pencil.create(childs[i]);
                    break;
                case "line":
                    line.create(childs[i]);
                    break;
                case "pathTool":
                case "polyline":
                    pathTool.create(childs[i]);
                    break;
                case "vector":
                case "path":
                    vector.create(childs[i]);
                    break;
                case "text":
                    text.create(childs[i]);
                    break;
                default:
                    break;
            }
        }
    }
}


redoButton = document.getElementById("redo");
redoButton.onclick = function () {
    redoFunc();
}
document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyY' && (event.ctrlKey || event.metaKey)) {
        redoFunc();
    }
});

let undoActions = [],
    redoActions = [];
let maxActionsNum = 20;

class action {
    constructor(type, object, attr) {
        this.type = type;
        this.object = object;
        this.attr = attr;
    }
    undo() {
        switch (this.type) {
            case "delete":
                this.object.showSvgElement();
                break;
            case "create":
                if (currentObject == this.object) currentObject = null;
                this.object.hide();
                break;
            case "move":
                let coords = this.attr;
                this.attr = this.object.getCornerCoords();
                this.object.moveTo(coords.x, coords.y);
                break;
            case "rotate":
                let ang = this.attr;
                this.attr = this.object.angle;
                this.object.rotateTo(ang);
                break;
            case "resize":
                let resizeAttrs = this.attr;
                this.attr = this.object.getResizeAttrs(this.attr[2]); //аргумент для пера(индекс)
                this.object.setResizeAttrs(resizeAttrs);
                break;
            case "property":
                let prev = currentObject;
                currentObject = this.object;
                currentObject.addPanel();
                let prevValue = this.attr[0].value;
                this.attr[0].value = this.attr[1];
                this.attr[1] = prevValue;
                var event = new Event('change');
                this.attr[0].dispatchEvent(event);
                currentObject.removePanel();
                currentObject = prev;
                if (prev != null) currentObject.addPanel();
                break;
            case "fill":
                let fillAttrs = this.attr;
                this.attr = this.object.getFillAttrs();
                this.object.setFillAttrs(fillAttrs);
                break;
            case "backgroundFill":
                let backgroundColor = this.attr;
                this.attr = svgPanel.style.background;
                svgPanel.style.background = backgroundColor;
                break;
            case "stroke":
                let strokeAttrs = this.attr;
                this.attr = this.object.getStrokeAttrs();
                this.object.setStrokeAttrs(strokeAttrs);
                break;
            case "append":
                this.object.prependSvgElement();
                break;
            case "prepend":
                this.object.appendSvgElement();
                break;
        }
        redoActions.push(this);
        if (redoActions.length > maxActionsNum) redoActions.shift();
    }
    redo() {
        switch (this.type) {
            case "delete":
                if (currentObject == this.object) currentObject = null;
                this.object.hide();
                break;
            case "create":
                this.object.showSvgElement();
                break;
            case "move":
                let coords = this.attr;
                this.attr = this.object.getCornerCoords();
                this.object.moveTo(coords.x, coords.y);
                break;
            case "rotate":
                let ang = this.attr;
                this.attr = this.object.angle;
                this.object.rotateTo(ang);
                break;
            case "resize":
                let resizeAttrs = this.attr;
                this.attr = this.object.getResizeAttrs(this.attr[2]); //аргумент для пера(индекс)
                this.object.setResizeAttrs(resizeAttrs);
                break;
            case "property":
                let prev = currentObject;
                currentObject = this.object;
                let prevValue = this.attr[0].value;
                this.attr[0].value = this.attr[1];
                this.attr[1] = prevValue;
                var event = new Event('change');
                this.attr[0].dispatchEvent(event);
                currentObject.removePanel();
                currentObject = prev;
                if (prev != null) currentObject.addPanel();
                break;
            case "fill":
                let fillAttrs = this.attr;
                this.attr = this.object.getFillAttrs();
                this.object.setFillAttrs(fillAttrs);
                break;
            case "backgroundFill":
                let backgroundColor = this.attr;
                this.attr = svgPanel.style.background;
                svgPanel.style.background = backgroundColor;
                break;
            case "stroke":
                let strokeAttrs = this.attr;
                this.attr = this.object.getStrokeAttrs();
                this.object.setStrokeAttrs(strokeAttrs);
                break;
            case "append":
                this.object.appendSvgElement();
                break;
            case "prepend":
                this.object.prependSvgElement();
                break;
        }
        undoActions.push(this);
        if (undoActions.length > maxActionsNum) undoActions.shift();
    }
}

function doFunc(type, object, attr = null) {
    redoActions = [];
    undoActions.push(new action(type, object, attr));
    if (undoActions.length > maxActionsNum) undoActions.shift();
}

function undoFunc() {
    if (undoActions.length > 0) {
        undoActions.pop().undo();
    }
}

function redoFunc() {
    if (redoActions.length > 0) {
        redoActions.pop().redo();
    }
}