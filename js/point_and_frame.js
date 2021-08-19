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
        this.addActions();
    }
    addActions() {
        //select
        this.circle.addEventListener("mousedown", function () {
            isSomePointSelected = true;
            this.isSelected = true;
        }.bind(this));
        this.circle.addEventListener("mouseup", function () {
            this.isSelected = false;
            isSomePointSelected = false;
        }.bind(this));
        this.circle.addEventListener("mouseover", this.setColor.bind(this, "red"));
        this.circle.addEventListener("mouseout", this.setColor.bind(this, "white"));
        //moveObject
        if (this.type != null && this.type.action == "move") {
            const startMoving = ((current) => {
                this.object.isMoving = true;
                updateCursorCoords(current);
                currentPointTypeAttr = this.type.attr;
                this.object.start = {
                    x: curX,
                    y: curY
                }
            }).bind(this);
            this.circle.addEventListener("mousedown", startMoving);
        }
        //movePoint
        if (this.type.action == "resize" || this.type.action == "polygon" || this.type.action == "polyline") {
            const move = ((current) => {
                if (this.isMoving && currentObject == this.object) {
                    updateCursorCoords(current);
                    this.object.resize(current);
                }
            }).bind(this);
            const startMoving = (() => {
                if (this.isSelected) {
                    this.isMoving = true;
                    currentPointTypeAttr = this.type.attr;
                    this.object.addHotKeys();
                    document.addEventListener("mousemove", move);
                }
            }).bind(this);
            this.circle.addEventListener("mousedown", startMoving);
            const stopMoving = (() => {
                if (this.isMoving) {
                    this.isMoving = false;
                    currentPointTypeAttr = null;
                    this.object.removeHotKeys();
                    if (this.circle != null) this.circle.setAttribute('fill', "white");
                    isSomePointSelected = false;
                    document.removeEventListener("mousemove", move);
                }
            }).bind(this);
            svgPanel.addEventListener("mouseup", stopMoving);
        }
        //удаление точки пера
        const deletePoint = ((event) => {
            event.preventDefault();
            this.object.deletePoint(this.type.attr);
            isSomePointSelected = false;
        })
        if (this.type != null && this.type.action == "polyline") {
            this.circle.addEventListener("contextmenu", deletePoint);
        }
    }
    createClone(newObject) {
        let clone = new point(this.x, this.y, newObject, this.type);
        clone.type = {
            action: this.type.action,
            attr: this.type.attr
        }
        return clone;
    }
    setColor(color) {
        if ((!isSomePointSelected || this.type.action == "polygon") && this.object.isCompleted) {
            this.circle.setAttribute('fill', color);
        }
    }
    hide() {
        this.setColor("white");
        svgPanel.removeChild(this.circle);
    }
    show() {
        svgPanel.appendChild(this.circle);
    }
    remove() {
        svgPanel.removeChild(this.circle);
        this.circle = null;
        this.isSelected = false;
    }
    setPointAttribute(attributeName, value) {
        this.circle.setAttribute(attributeName, value);
    }
    update(x, y, attr = this.type.attr) {
        if (currentPointTypeAttr != null && currentPointTypeAttr == attr) this.circle.setAttribute('fill', "red");
        else this.circle.setAttribute('fill', "white");
        this.x = x;
        this.y = y;
        this.circle.setAttribute('cx', x);
        this.circle.setAttribute('cy', y);
        this.type.attr = attr;
    }
}

class frame {
    constructor(name, object, red = false) {
        this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", name);
        svgPanel.appendChild(this.svgElement);
        this.object = object;
        this.svgElement.setAttribute('stroke-opacity', "0.5");
        if (red) this.svgElement.setAttribute('stroke', "red");
        else this.svgElement.setAttribute('stroke', object.getElementAttribute('stroke'));
        if (red) this.svgElement.setAttribute('stroke-width', pointRadius);
        else this.svgElement.setAttribute('stroke-width', object.getElementAttribute('stroke-width'));
        if (red || object.getElementAttribute('stroke-dasharray') == null) this.svgElement.setAttribute('stroke-dasharray', object.strokeWidth * 4);
        else this.svgElement.setAttribute('stroke-dasharray', object.getElementAttribute('stroke-dasharray'));
        if (red) this.svgElement.setAttribute('stroke-linejoin', "none");
        else this.svgElement.setAttribute('stroke-linejoin', object.getElementAttribute('stroke-linejoin'));
        if (red) this.svgElement.setAttribute('stroke-linecap', "none");
        else this.svgElement.setAttribute('stroke-linecap', object.getElementAttribute('stroke-linecap'));
        this.svgElement.setAttribute('fill', "none");
    }
    createClone(newObject) {
        let clone = new frame(this.x1, this.y1, this.x2, this.y2, newObject);
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
    setFrameAttribute(attributeName, value) {
        this.svgElement.setAttribute(attributeName, value);
    }
    update() {}
}
class lineFrame extends frame {
    constructor(x1, y1, x2, y2, object, red = false) {
        super('line', object, red);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.svgElement.setAttribute('x1', x1);
        this.svgElement.setAttribute('y1', y1);
        this.svgElement.setAttribute('x2', x2);
        this.svgElement.setAttribute('y2', y2);
        this.red = red;
    }
    createClone(newObject) {
        let clone = new lineFrame(this.x1, this.y1, this.x2, this.y2, newObject, this.red);
        return clone;
    }
    update(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.svgElement.setAttribute('x1', x1);
        this.svgElement.setAttribute('y1', y1);
        this.svgElement.setAttribute('x2', x2);
        this.svgElement.setAttribute('y2', y2);
    }
}
class rectangleFrame extends frame {
    constructor(x, y, width, height, object) {
        super('rect', object);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.svgElement.setAttribute('x', x);
        this.svgElement.setAttribute('y', y);
        this.svgElement.setAttribute('width', width);
        this.svgElement.setAttribute('height', height);
    }
    createClone(newObject) {
        let clone = new rectangleFrame(this.x, this.y, this.width, this.height, newObject);
        return clone;
    }
    update(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.svgElement.setAttribute('x', x);
        this.svgElement.setAttribute('y', y);
        this.svgElement.setAttribute('width', width);
        this.svgElement.setAttribute('height', height);
    }
}
class ellipseFrame extends frame {
    constructor(cx, cy, rx, ry, object) {
        super('ellipse', object);
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
        this.svgElement.setAttribute('cx', cx);
        this.svgElement.setAttribute('cy', cy);
        this.svgElement.setAttribute('rx', rx);
        this.svgElement.setAttribute('ry', ry);
    }
    createClone(newObject) {
        let clone = new ellipseFrame(this.cx, this.cy, this.rx, this.ry, newObject);
        return clone;
    }
    update(cx, cy, rx, ry) {
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
        this.svgElement.setAttribute('cx', cx);
        this.svgElement.setAttribute('cy', cy);
        this.svgElement.setAttribute('rx', rx);
        this.svgElement.setAttribute('ry', ry);
    }
}
class polygonFrame extends frame {
    constructor(vertices, object) {
        super('polygon', object);
        this.vertices = vertices;
        this.svgElement.setAttribute('points', vertices);
    }
    createClone(newObject) {
        let clone = new polygonFrame(this.vertices, newObject);
        return clone;
    }
    update(vertices) {
        this.vertices = vertices;
        this.svgElement.setAttribute('points', vertices);
    }
}
class polylineFrame extends frame {
    constructor(path, object) {
        super('polyline', object);
        this.path = path;
        this.svgElement.setAttribute('points', path);
    }
    createClone(newObject) {
        let clone = new polylineFrame(this.path, newObject);
        return clone;
    }
    update(path) {
        this.path = path;
        this.svgElement.setAttribute('points', path);
    }
}