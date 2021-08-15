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
        this.panel.style.background = "#555";
        this.panel.textContent = "Cлой " + layersNum;
        this.buttons = document.createElement('div');
        this.buttons.className = "layer_buttons";
        this.panel.appendChild(this.buttons);
        this.del = document.createElement('img');
        this.del.src = 'img/layers/delete.svg';
        this.del.title = "Удалить слой";
        this.buttons.appendChild(this.del);
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