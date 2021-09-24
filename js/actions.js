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

function centralLocation(width = svgPanel.clientWidth, height = svgPanel.clientHeight) {
    svgPanel.style.left = "50%";
    svgPanel.style.top = "50%";
    svgPanel.style.transform = "translate(-50%, -50%)";
    if (scrollPanel.clientWidth - startCoords < width) {
        svgPanel.style.left = startCoords + "px";
        svgPanel.style.transform = "translate(0, -50%)";
    }
    if (scrollPanel.clientHeight - startCoords < height) {
        svgPanel.style.top = startCoords + "px";
        svgPanel.style.transform = "translate(-50%, 0)";
    }
    if (scrollPanel.clientWidth - startCoords < width && scrollPanel.clientHeight - startCoords < height)
        svgPanel.style.transform = "translate(0, 0)";
    svgPanelCoords = getCoords(svgPanel);
    updateRulers();
}

centralLocation();

//CREATE 
create = document.getElementById("create");

create.onclick = function () {
    let width = prompt('Введите ширину нового холста в пикселях:', 512);
    let height = prompt('Введите высоту нового холста в пикселях:', 512);

    if (width < 1 || height < 1) {
        alert("Недопустимый размер холста!")
        return;
    }
    scaleСoef = 1;
    resetDocument(width, height);
}

function resetDocument(width, height) {
    scaleСoef = 1;
    resetCurrentObject();
    for (var i = 2; i < svgPanel.childNodes.length;) {
        svgPanel.removeChild(svgPanel.childNodes[i]);
        svgPanel.childNodes[i].remove();
    }
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
        openSvg.outerHTML = event.target.result;
        let helper = document.querySelector("#helper"),
            tempSvg = helper.lastElementChild;

        let width = tempSvg.getAttribute('width');
        let height = tempSvg.getAttribute('height')
        let backgroundcolor = tempSvg.style.background;
        if (backgroundcolor != "") svgPanel.style.background = backgroundcolor;
        else svgPanel.style.background = "";
        if (width == null || height == null) {
            svgPanel.setAttribute('width', 512);
            svgPanel.setAttribute('height', 512);
            svgPanel.setAttribute('viewBox', '0 0 512 512');
            width = 512, height = 512;
        }
        resetDocument(width, height)

        tempSvg.setAttribute("style", "display: none;");
        tempSvg.setAttribute("id", "open_svg");
        openSvg = document.getElementById(tempSvg.id);
        search(openSvg.childNodes);
        for (let i = 0; i < elementsToAppend.length; i++) {
            currentLayer.group.appendChild(elementsToAppend[i]);
        }
        elementsToAppend = [];
    };
    reader.readAsText(file);
}

document.getElementById("file-selector").addEventListener("change", readFile);

let elementsToAppend = [];

function search(childs) {
    for (let i = 0; i < childs.length; i++) {
        if (childs[i].nodeName == "g" && childs[i].id != "pentagram") {
            search(childs[i].childNodes)
        } else {
            let t;
            if (childs[i].id != null && childs[i].id != "") t = childs[i].id.split('_')[0];
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

//SAVE
save = document.getElementById("save");

save.onclick = function () {
    let style = svgPanel.getAttribute('style'),
        backgroundcolor = svgPanel.style.background;
    svgPanel.style = "";
    svgPanel.style.background = backgroundcolor;
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
    let style = svgPanel.getAttribute('style'),
        backgroundcolor = svgPanel.style.background;
    svgPanel.style = "";
    svgPanel.style.background = backgroundcolor;
    let svgGridClone = svgGrid;
    svgPanel.removeChild(svgGrid);
    resetCurrentObject()

    let svgData = draw_panel.innerHTML.toString();
    var img = new Image();
    var url = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData + " ");

    img.onload = function () {
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        let a = document.createElement("a");
        a.style = "display: none";
        a.href = canvas.toDataURL("image/png");;
        a.download = ".png";
        a.click();

    };
    img.src = url;

    svgPanel.style = style;
    svgPanel.prepend(svgGridClone);
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
            case "end":
                changeProperty(this)
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
            case "end":
                changeProperty(this)
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

function changeProperty(act) {
    let prev = currentObject;
    currentObject = act.object;
    currentObject.addPanel();
    let prevValue;
    if (act.type == "end") {
        prevValue = act.attr[0].checked;
        act.attr[0].checked = act.attr[1];
    } else {
        prevValue = act.attr[0].value;
        act.attr[0].value = act.attr[1];
    }
    act.attr[1] = prevValue;
    var event = new Event('change');
    act.attr[0].dispatchEvent(event);
    currentObject.removePanel();
    currentObject = prev;
    if (prev != null) currentObject.addPanel();
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