class layer {
    constructor() {
        this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        svgPanel.append(this.group);
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
            this.panel.onclick = null;
        }
    }
    delete() {
        if (this == currentLayer) {
            let next = this.group.nextSibling;
            if (next == null) next = this.group.previousSibling;
            if (next == svgGrid) return;
            currentLayer = layers[next.id];
            currentLayer.activeLayer();
        }
        svgPanel.removeChild(this.group);
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
layersNum = 1;
const layers = new Map();
layers["Cлой " + layersNum] = new layer();
newLayer = document.getElementById("new_layer");
newLayer.onclick = () => {
    currentLayer.group.style.pointerEvents = "none";
    currentLayer.panel.style.background = "#444";
    layersNum++;
    layers["Cлой " + layersNum] = new layer();
}