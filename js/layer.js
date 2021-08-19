class layer {
    constructor() {
        this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        svgcontent.append(this.group);
        this.group.style.pointerEvents = "all";
        this.name = "Cлой " + layersNum;
        this.group.id = this.name;
        this.group.setAttribute('opacity', 1);
        currentLayer = this;
        this.addPanel();
        this.addActions();
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
        this.text.textContent = this.name; //14
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
        this.up2 = document.createElement('li');
        this.up2.textContent = "На передний план";
        this.down2 = document.createElement('li');
        this.down2.textContent = "На задний план";
        ul.append(this.rename, this.del, this.dub, this.merge, this.up2, this.down2);
    }
    addActions() {
        this.panel.onclick = (e) => {
            if (e.target == this.navigation || e.target == this.nameAndButtons || e.target == this.text || e.target == this.buttons) {
                currentLayer.group.style.pointerEvents = "none";
                currentLayer.panel.style.background = "#444";
                currentLayer = this;
                this.activeLayer();
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
        this.up2.onclick = () => {
            svgcontent.append(this.group);
            layersPanel.prepend(this.panel);
        }
        this.down2.onclick = () => {
            svgcontent.prepend(this.group);
            layersPanel.append(this.panel);
        }
        this.vis.onclick = () => {
            let value = this.group.getAttribute('opacity');
            let newValue = value == 1 ? 0 : 1;
            this.group.setAttribute('opacity', newValue);
            this.vis.src = value == 1 ? 'img/layers/invisible.svg' : 'img/layers/visible.svg'
        }
        this.opacity.onchange = () => {
            this.group.setAttribute('opacity', this.opacity.value);
        }
        this.merge.onclick = () => {
            this.mergeLayer();
        }
    }
    
    renameLayer() {
        this.text.textContent = "";
        let enter = document.createElement('input');
        enter.type = "text";
        enter.value = this.name;
        enter.setAttribute('maxlength', 14);
        this.text.appendChild(enter);
        enter.focus();
        enter.onblur = () => {
            this.updateName(enter);
        }
        enter.onkeyup = (e) => {
            if (e.key == 'Enter') {
                this.updateName(enter);
            }
        }
    }
    updateName(enter) {
        console.log(layers.delete(this.name));
        layers[this.name] = null;
        this.name = enter.value;
        this.text.textContent = this.name;
        this.group.id = this.name;
        layers[this.name] = this;
        enter.remove();
    }
    delete(afterMerge = false) {
        if (this == currentLayer) {
            let next = this.group.nextSibling;
            if (afterMerge) next = null;
            if (next == null) next = this.group.previousSibling;
            if (next == null) return;
            currentLayer = layers[next.id];
            currentLayer.activeLayer();
        }
        layers[this.name] = null;
        svgcontent.removeChild(this.group);
        layersPanel.removeChild(this.panel);
    }
    activeLayer() {
        this.group.style.pointerEvents = "all";
        this.panel.style.background = "#555";
        resetCurrentObject();
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
    mergeLayer() {
        let prev = this.group.previousSibling;
        if (prev == null) return;
        let content = this.group.childNodes;
        let n = content.length
        for (i = 0; i < n; i++) {
            prev.append(content[0]);
        }
        this.delete(true);
    }
}

createFirstLayer();

function createFirstLayer() {
    svgcontent = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    svgPanel.append(svgcontent);
    layersNum = 1;
    layers = new Map();
    layers["Cлой " + layersNum] = new layer();
}

newLayer = document.getElementById("new_layer");
newLayer.onclick = () => {
    resetCurrentObject();
    currentLayer.group.style.pointerEvents = "none";
    currentLayer.panel.style.background = "#444";
    layersNum++;
    layers["Cлой " + layersNum] = new layer();
}
mergeLayers = document.getElementById("merge_layers");
mergeLayers.onclick = () => {
    layersNum = 1;
    let allLayers = svgcontent.childNodes;
    while (allLayers.length != 1) {
        layers[svgcontent.lastChild.id].mergeLayer();
    }

}