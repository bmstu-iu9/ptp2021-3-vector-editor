class point {
    constructor(x, y, object, type) {
        this.circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        svgPanel.appendChild(this.circle);
        this.x = x;
        this.y = y;
        this.object = object;
        this.type = type;
        this.circle.setAttribute('fill', "white");
        this.circle.setAttribute('stroke', "black");
        this.circle.setAttribute('cx', x);
        this.circle.setAttribute('cy', y);
        this.circle.setAttribute('r', pointRadius);

        //this.circle.addEventListener("mousedown", this.dispatchToObject.bind(this, "mousedown"));
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
        svgPanel.removeChild(this.circle);
    }
    show() {
        svgPanel.appendChild(this.circle);
    }
    remove() {
        svgPanel.removeChild(this.circle);
        this.circle = null;
    }
    setPointAttribute(attributeName, value) {
        this.circle.setAttribute(attributeName, value);
    }
}

class frame {
    constructor(x1, y1, x2, y2, object) {
        this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        svgPanel.appendChild(this.svgElement);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.object = object;
        this.svgElement.setAttribute('x1', x1);
        this.svgElement.setAttribute('y1', y1);
        this.svgElement.setAttribute('x2', x2);
        this.svgElement.setAttribute('y2', y2);
        this.svgElement.setAttribute('stroke-opacity', "0.5");
        this.svgElement.setAttribute('stroke', "red");
        this.svgElement.setAttribute('stroke-width', "2");
        this.svgElement.setAttribute('stroke-dasharray', "8");
    }
    createClone(newObject) {
        let clone = new point(this.x1, this.y1, this.x2, this.y2, newObject);
        return clone;
    }
    hide() {
        svgPanel.removeChild(this.svgElement);
    }
    show() {
        svgPanel.appendChild(this.svgElement);
    }
    remove() {
        svgPanel.removeChild(this.svgElement);
        this.svgElement = null;
    }
    setPointAttribute(attributeName, value) {
        this.svgElement.setAttribute(attributeName, value);
    }
}