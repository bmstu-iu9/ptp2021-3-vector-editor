class layer {
    constructor() {
        this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        svgPanel.appendChild(this.group);
    }
}
firstLayer = new layer();
currentLayer = firstLayer.group;