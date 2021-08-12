class point {
    constructor(x, y, object, type) {
        this.circle = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
        svgPanel.appendChild(this.circle);
        this.x = x;
        this.y = y;
        this.object = object;
        this.type = type;
        this.circle.setAttribute('fill', "white");
        this.circle.setAttribute('stroke', "black");
        this.circle.setAttribute('cx', x);
        this.circle.setAttribute('cy', y);
        this.circle.setAttribute('rx', pointRadius);
        this.circle.setAttribute('ry', pointRadius);

        this.circle.addEventListener("mousedown", this.dispatchToObject.bind(this, "mousedown"));
        this.circle.addEventListener("mouseout", this.dispatchToObject.bind(this, "mouseout"));
        this.circle.addEventListener("mouseover", this.setColor.bind(this, "red"));
        this.circle.addEventListener("mouseout", this.setColor.bind(this, "white"));
    }
    createClone(newObject) {
        let clone = new point(this.x, this.y, newObject, this.type);
        return clone;
    }
    dispatchToObject(event) {
        if (this.object.isCompleted) {
            this.object.svgElement.dispatchEvent(new Event(event));
        }
    }
    setColor(color) {
        if (this.object.isCompleted) {
            this.circle.setAttribute('fill', color);
        }
    }
    hide() {
        //svgPanel.removeChild(this.circle);
        this.circle.setAttribute('stroke-opacity', 0);
        this.circle.setAttribute('fill-opacity', 0);
    }
    show() {
        //svgPanel.appendChild(this.circle);
        this.circle.setAttribute('stroke-opacity', 1);
        this.circle.setAttribute('fill-opacity', 1);
    }
    remove() {
        svgPanel.removeChild(this.circle);
        this.circle = null;
    }
    setPointAttribute(attributeName, value) {
        this.circle.setAttribute(attributeName, value);
    }
}