class layer {
    constructor() {
        this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        svgcontent.append(this.group);
        this.group.style.pointerEvents = "all";
        this.name = "Cлой " + layersNum;
        this.group.id = this.name;
        currentLayer = this;
        this.addPanel();
        this.addActions();
    }
    addPanel() {
        this.panel = document.createElement('div');
        this.panel.className = "layer";
        layersPanel.prepend(this.panel);

        let navigation = document.createElement('div');
        navigation.className = "navigation";
        this.panel.appendChild(navigation);
        this.up = document.createElement('img');
        this.up.src = 'img/layers/up.svg';
        navigation.appendChild(this.up);
        this.down = document.createElement('img');
        this.down.src = 'img/layers/down.svg';
        navigation.appendChild(this.down);

        let nameAndButtons = document.createElement('div');
        nameAndButtons.className = "nameAndButtons";
        this.panel.append(nameAndButtons);
        this.text = document.createElement('input');
        this.text.type = "text";
        this.text.value = this.name;
        nameAndButtons.appendChild(this.text);

        buttons = document.createElement('div');
        buttons.className = "layer_buttons";
        nameAndButtons.appendChild(buttons);
        this.opacity = document.createElement('input');
        this.opacity.type = "range";
        this.opacity.value = "100";
        this.opacity.title = "Прозрачность";
        buttons.appendChild(this.opacity);
        this.vis = document.createElement('img');
        this.vis.src = 'img/layers/visible.svg';
        this.vis.title = "Скрыть";
        buttons.appendChild(this.vis);

        let menu = document.createElement('div');
        menu.className = "layers_menu";
        buttons.appendChild(menu);
        let ul = document.createElement('ul');
        ul.className = "styleList";
        menu.appendChild(ul);
        this.del = document.createElement('li');
        this.del.textContent = "Удалить";
        ul.appendChild(this.del);
        this.dub = document.createElement('li');
        this.dub.textContent = "Дублировать";
        ul.appendChild(this.dub);
    }
    addActions() {
        this.panel.onclick = () => {
            currentLayer.group.style.pointerEvents = "none";
            currentLayer.panel.style.background = "#444";
            if (currentObject != null) {
                currentObject.hideFrameAndPoints();
                currentObject = null;
            }
            currentLayer = this;
            this.activeLayer();
        }

        this.del.onclick = () => {
            this.delete();
        }
    }
    delete() {
        if (this == currentLayer) {
            let next = this.group.nextSibling;
            if (next == null) next = this.group.previousSibling;
            if (next == null) return;
            currentLayer = layers[next.id];
            currentLayer.activeLayer();
        }
        this.panel.onclick = null;
        svgcontent.removeChild(this.group);
        layersPanel.removeChild(this.panel);
        if (currentObject != null) {
            currentObject.hideFrameAndPoints();
            currentObject = null;
        }
    }
    activeLayer() {
        this.group.style.pointerEvents = "all";
        this.panel.style.background = "#555";
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
    currentLayer.group.style.pointerEvents = "none";
    currentLayer.panel.style.background = "#444";
    layersNum++;
    layers["Cлой " + layersNum] = new layer();
}