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

        if (type == "move") this.circle.addEventListener("mousedown", this.dispatchToObject.bind(this, "mousedown"));
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
        this.line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        svgPanel.appendChild(this.line);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.object = object;
        this.line.setAttribute('x1', x1);
        this.line.setAttribute('y1', y1);
        this.line.setAttribute('x2', x2);
        this.line.setAttribute('y2', y2);
        this.line.setAttribute('stroke-opacity', "0.5");
        this.line.setAttribute('stroke', "red");
        this.line.setAttribute('stroke-width', "4");
        this.line.setAttribute('stroke-dasharray', "8");
    }
    createClone(newObject) {
        let clone = new frame(this.x1, this.y1, this.x2, this.y2, newObject);
        return clone;
    }
    hide() {
        svgPanel.removeChild(this.line);
    }
    show() {
        svgPanel.appendChild(this.line);
    }
    remove() {
        svgPanel.removeChild(this.line);
        this.line = null;
    }
    setFrameAttribute(attributeName, value) {
        this.line.setAttribute(attributeName, value);
    }
}
class pencilShadow {
    constructor(path, color, width, object) {
        this.polyline = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
        svgPanel.appendChild(this.polyline);
        this.path = path;
        this.color = color;
        this.width = width;
        this.object = object;
        this.polyline.setAttribute('points', path);
        this.polyline.setAttribute('stroke-opacity', "0.5");
        this.polyline.setAttribute('stroke', color);
        this.polyline.setAttribute('stroke-width', width);
        this.polyline.setAttribute('stroke-dasharray', "8");
        this.polyline.setAttribute('fill', "none");
    }
    createClone(newObject) {
        let clone = new pencilShadow(this.path, this.color, this.width, newObject);
        return clone;
    }
    hide() {
        svgPanel.removeChild(this.polyline);
    }
    show() {
        svgPanel.appendChild(this.polyline);
    }
    remove() {
        svgPanel.removeChild(this.polyline);
        this.polyline = null;
    }
    setFrameAttribute(attributeName, value) {
        this.polyline.setAttribute(attributeName, value);
    }
}