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
        this.text = document.createElement('input');
        this.text.type = "text";
        this.text.value = this.name;
        this.nameAndButtons.appendChild(this.text);

        this.buttons = document.createElement('div');
        this.buttons.className = "layer_buttons";
        this.nameAndButtons.appendChild(this.buttons);
        this.opacity = document.createElement('input');
        this.opacity.type = "range";
        this.opacity.value = "100";
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
        this.del = document.createElement('li');
        this.del.textContent = "Удалить";
        this.dub = document.createElement('li');
        this.dub.textContent = "Дублировать";
        this.up2 = document.createElement('li');
        this.up2.textContent = "На передний план";
        this.down2 = document.createElement('li');
        this.down2.textContent = "На задний план";
        ul.append(this.del, this.dub, this.up2, this.down2);
    }
    addActions() {
        this.panel.onclick = (e) => {
            if (e.target == this.navigation || e.target == this.nameAndButtons || e.target == this.buttons) {
                currentLayer.group.style.pointerEvents = "none";
                currentLayer.panel.style.background = "#444";
                currentLayer = this;
                this.activeLayer();
            }
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
    }
    delete() {
        if (this == currentLayer) {
            let next = this.group.nextSibling;
            if (next == null) next = this.group.previousSibling;
            if (next == null) return;
            currentLayer = layers[next.id];
            currentLayer.activeLayer();
        }
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