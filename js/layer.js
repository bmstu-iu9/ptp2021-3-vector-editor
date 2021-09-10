class layer {
    constructor(name) {
        this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        svgcontent.append(this.group);
        this.group.style.pointerEvents = "all";
        this.name = name;
        this.group.id = name;
        this.group.setAttribute('opacity', 1);
        currentLayer = this;
        this.addPanel();
        this.addActions();
        this.cloneNum = 0;
    }
    addPanel() {
        this.panel = document.createElement('div');
        this.panel.className = "layer";
        layersPanel.prepend(this.panel);

        this.navigation = document.createElement('div');
        this.navigation.className = "navigation";
        this.panel.appendChild(this.navigation);
        this.up = document.createElement('img');
        this.up.src = 'img/layers/up.svg';
        this.up.title = "Поднять слой";
        this.down = document.createElement('img');
        this.down.src = 'img/layers/down.svg';
        this.down.title = "Опустить слой";
        this.navigation.append(this.up, this.down);

        this.nameAndButtons = document.createElement('div');
        this.nameAndButtons.className = "nameAndButtons";
        this.panel.append(this.nameAndButtons);
        this.text = document.createElement('div');
        this.text.className = "layerName";
        this.text.textContent = this.name;
        this.nameAndButtons.appendChild(this.text);

        this.buttons = document.createElement('div');
        this.buttons.className = "layer_buttons";
        this.nameAndButtons.appendChild(this.buttons);
        this.opacity = document.createElement('input');
        this.opacity.type = "range";
        this.opacity.min = 0;
        this.opacity.max = 1;
        this.opacity.step = 0.01;
        this.opacity.value = 1;
        this.opacity.title = "Прозрачность";
        this.opValue = 1;
        this.vis = document.createElement('img');
        this.vis.src = 'img/layers/visible.svg';
        this.vis.title = "Скрыть";


        let menu = document.createElement('div');
        menu.className = "layers_menu";
        this.buttons.append(this.opacity, this.vis, menu);
        let ul = document.createElement('ul');
        ul.className = "styleList";
        menu.appendChild(ul);
        this.rename = document.createElement('li');
        this.rename.textContent = "Переименовать";
        this.del = document.createElement('li');
        this.del.textContent = "Удалить";
        this.dub = document.createElement('li');
        this.dub.textContent = "Дублировать";
        this.merge = document.createElement('li');
        this.merge.textContent = "Слить с нижним";
        this.new = document.createElement('li');
        this.new.textContent = "Новый слой сверху";
        ul.append(this.rename, this.del, this.dub, this.merge, this.new);
    }
    addActions() {
        this.panel.onclick = (e) => {
            if (this != currentLayer && (e.target == this.navigation || e.target == this.nameAndButtons || e.target == this.text || e.target == this.buttons)) {
                this.activeLayer();
                currentLayer = this;
            }
        }
        this.text.onclick = (e) => {
            if (e.ctrlKey) {
                this.renameLayer();
            }
        }
        this.rename.onclick = () => {
            this.renameLayer();
        }
        this.del.onclick = () => {
            this.delete();
        }
        this.up.onclick = () => {
            this.higher();
        }
        this.down.onclick = () => {
            this.lower();
        }
        this.new.onclick = () => {
            newLayer.click();
            this.group.after(currentLayer.group);
            this.panel.before(currentLayer.panel);
        }
        this.vis.onclick = () => {
            this.changeVisibility();
        }
        this.opacity.onmousedown = () => {
            if (currentLayer == this) resetCurrentObject();
            rightPanel.onmousemove = () => {
                this.opValue = this.opacity.value;
                this.group.setAttribute('opacity', this.opValue);
                this.vis.src = this.opValue == 0 ? 'img/layers/invisible.svg' : 'img/layers/visible.svg';
            }
            document.onmouseup = () => {
                rightPanel.onmousemove();
                this.opValue = this.opValue == 0 ? 1 : this.opValue;
                rightPanel.onmousemove = null;
                document.onmouseup = null;
            }
        }
        this.merge.onclick = () => {
            this.mergeLayer();
        }
        this.dub.onclick = () => {
            this.dublicate();
        }
    }

    renameLayer() {
        this.cloneNum = 0;
        this.text.textContent = "";
        let enter = document.createElement('input');
        enter.type = "text";
        enter.value = this.name;
        enter.setAttribute('maxlength', 13);
        this.text.appendChild(enter);
        enter.focus();
        enter.onblur = () => {
            this.updateName(enter);
        }
        enter.onkeyup = (e) => {
            if (e.key == 'Enter') {
                enter.blur();
            }
        }
    }
    updateName(enter) {
        let newName = enter.value;
        enter.remove();
        if (layers[newName] && newName != this.name) {
            alert("Слой с таким названием уже существует!");
            this.text.textContent = this.name;
            return;
        }
        layers[this.name] = null;
        this.name = newName;
        this.text.textContent = this.name;
        this.group.id = this.name;
        layers[this.name] = this;
    }
    delete(afterMerge = false) {
        if (this == currentLayer) {
            let next = this.group.nextSibling;
            if (afterMerge) next = null;
            if (next == null) next = this.group.previousSibling;
            if (next == null) return;
            layers[next.id].activeLayer();
            currentLayer = layers[next.id];
        }
        layers[this.name] = null;
        svgcontent.removeChild(this.group);
        layersPanel.removeChild(this.panel);
    }
    activeLayer() {
        resetCurrentLayer();
        this.group.style.pointerEvents = "all";
        this.panel.style.background = "#555";
    }
    higher() {
        let next = this.group.nextSibling;
        if (next != null) {
            next.after(this.group);
            this.panel.previousSibling.before(this.panel);
        }
    }
    lower() {
        let prev = this.group.previousSibling;
        if (prev != null) {
            prev.before(this.group);
            this.panel.nextSibling.after(this.panel);
        }
    }
    changeVisibility() {
        if (currentLayer == this) resetCurrentObject();
        let value = this.group.getAttribute('opacity');
        let newValue = value == 0 ? this.opValue : 0;
        this.group.setAttribute('opacity', newValue);
        this.vis.src = value == 0 ? 'img/layers/visible.svg' : 'img/layers/invisible.svg';
        this.opacity.value = newValue;
    }
    mergeLayer() {
        layers[this.name] = null;
        let prev = this.group.previousSibling;
        if (prev == null) return;
        let content = this.group.childNodes;
        let n = content.length;
        for (i = 0; i < n; i++) {
            prev.append(content[0]);
        }
        this.delete(true);
    }
    dublicate() {
        resetCurrentLayer();
        this.cloneNum++;
        let name = this.name + "(" + this.cloneNum + ")";
        layers[name] = new layer(name);
        let clone = layers[name];
        this.group.after(clone.group);
        this.panel.before(clone.panel);

        let content = this.group.childNodes;
        for (let i = 0; i < content.length; i++) {
            let figure = content[i].obj.createClone();
            clone.group.append(figure.svgElement);
        }
        clone.opValue = this.opValue;
        clone.group.setAttribute('opacity', this.group.getAttribute('opacity'));
        clone.vis.src = this.vis.src;
        clone.opacity.value = this.opacity.value;
    }
}

createFirstLayer();

function createFirstLayer() {
    svgcontent = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    svgPanel.append(svgcontent);
    layersNum = 1;
    layers = new Map();
    layers["Cлой " + layersNum] = new layer("Cлой " + layersNum);
}

newLayer = document.getElementById("new_layer");
newLayer.onclick = () => {
    resetCurrentLayer();
    layersNum++;
    layers["Cлой " + layersNum] = new layer("Cлой " + layersNum);
}

function resetCurrentLayer() {
    resetCurrentObject();
    currentLayer.group.style.pointerEvents = "none";
    currentLayer.panel.style.background = "#444";
    currentLayer = null;
}

mergeLayers = document.getElementById("merge_layers");
mergeLayers.onclick = () => {
    let allLayers = svgcontent.childNodes;
    while (allLayers.length != 1) {
        layers[svgcontent.lastChild.id].mergeLayer();
    }
}