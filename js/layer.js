class layer {
    constructor() {
        this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        svgPanel.appendChild(this.group);
        currentLayer = this.group;
        this.addPanel();
        this.addActions();
        
    }
    addPanel() {
        this.panel = document.createElement('div');
        this.panel.className = "layer";
        layersPanel.appendChild(this.panel);
        this.panel.textContent = "Cлой " + (layersNum + 1);
        this.buttons = document.createElement('div');
        this.buttons.className = "layer_buttons";
        this.panel.appendChild(this.buttons);
        this.del = document.createElement('img');
        this.del.src = 'img/layers/delete.svg';
        this.del.title = "Удалить слой";
        this.buttons.appendChild(this.del);
    }
    addActions() {
        this.del.onclick = () => {this.delete();}
    }
    delete() {
        svgPanel.removeChild(this.group);
        layersPanel.removeChild(this.panel);
        if (currentObject!=null) currentObject.removeFrameAndPoints();
    }
}
layersNum = 0;
layers = [];
layers[0] = new layer();
newLayer = document.getElementById("new_layer");
newLayer.onclick = () => {
    currentLayer.style.pointerEvents = "none";
    layersNum++;
    layers.push(new layer());
}