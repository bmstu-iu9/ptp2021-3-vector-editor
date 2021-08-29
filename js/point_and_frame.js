class point {
    constructor(x, y, object, type) {
        this.circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        svgPanel.appendChild(this.circle);
        this.x = x;
        this.y = y;
        this.object = object;
        this.transform = 'rotate(' + 0 + ' ' + 0 + ' ' + 0 + ')';
        this.type = type;
        this.circle.setAttribute('fill', "white");
        this.circle.setAttribute('stroke', "black");
        this.circle.setAttribute('cx', x);
        this.circle.setAttribute('cy', y);
        this.circle.setAttribute('r', pointRadius);
        this.circle.setAttribute('transform', this.transform);
        this.addActions();
    }
    addActions() {
        //select
        this.circle.addEventListener("mousedown", function () {
            if (wasPressed == "cursor") {
                isSomePointSelected = true;
                this.isSelected = true;
            }
        }.bind(this));
        this.circle.addEventListener("mouseup", function () {
            this.isSelected = false;
            isSomePointSelected = false;
        }.bind(this));
        this.circle.addEventListener("mouseover", this.setColor.bind(this, "red"));
        this.circle.addEventListener("mouseout", this.setColor.bind(this, "white"));
        //moveObject
        if (this.type.action == "move") {
            const startMoving = ((current) => {
                if (this.isSelected && this.object.isCompleted) {
                    this.object.isMoving = true;
                    updateCursorCoords(current);
                    currentPointTypeAttr = this.type.attr;
                    this.object.start = {
                        x: curX,
                        y: curY
                    }
                }
            }).bind(this);
            this.circle.addEventListener("mousedown", startMoving);
        }
        //rotateObject
        if (this.type.action == "rotate") {
            this.circle.addEventListener("mouseover", function () {
                if (wasPressed == "cursor") {
                    svgPanel.style.cursor = "url(img/rotate.svg) 10 10, pointer";
                }
            });
            this.circle.addEventListener("mouseout", function () {
                if (!this.object.isRotating) {
                    svgPanel.style.cursor = "default";
                }
            }.bind(this));

            const rotate = ((current) => {
                if (this.object.isRotating) {
                    updateCursorCoords(current);
                    this.object.rotate();
                }
            }).bind(this);
            document.addEventListener("mousemove", rotate);
            const startRotating = ((current) => {
                if (this.isSelected && this.object.isCompleted) {
                    this.object.isRotating = true;
                    this.object.isMoving = false;
                    updateCursorCoords(current);
                    currentPointTypeAttr = "rotate";
                    svgPanel.style.cursor = "url(img/rotate.svg) 10 10, pointer";
                    this.object.startRotating();
                }
            }).bind(this);
            this.circle.addEventListener("mousedown", startRotating);
            const stopRotating = ((current) => {
                if (this.object.isRotating) {
                    this.object.isRotating = false;
                    updateCursorCoords(current);
                    svgPanel.style.cursor = "default";
                    currentPointTypeAttr = null;
                    this.isSelected = false;
                    isSomePointSelected = false;
                    this.object.stopRotating();
                }
            }).bind(this);
            svgPanel.addEventListener("mouseup", stopRotating);
        }
        //movePoint
        if (this.type.action == "resize" || this.type.action == "polygon" || this.type.action == "polyline") {
            const move = ((current) => {
                if (this.isMoving && currentObject == this.object) {
                    updateCursorCoords(current);
                    this.object.resize(curX - pointStart.x, curY - pointStart.y);
                }
            }).bind(this);
            const startMoving = ((current) => {
                if (this.isSelected && this.object.isCompleted) {
                    this.isMoving = true;
                    currentPointTypeAttr = this.type.attr;
                    this.object.addHotKeys();
                    updateCursorCoords(current);
                    pointStart = {
                        x: curX,
                        y: curY
                    }
                    document.addEventListener("mousemove", move);
                }
            }).bind(this);
            this.circle.addEventListener("mousedown", startMoving);
            const stopMoving = (() => {
                if (this.isMoving) {
                    this.isMoving = false;
                    this.object.stopResize();
                    this.object.removeHotKeys();
                    if (this.circle != null) this.circle.setAttribute('fill', "white");
                    currentPointTypeAttr = null;
                    this.isSelected = false;
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
        if (this.type.action == "polyline") {
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
        if (!isSomePointSelected && this.object.isCompleted) {
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
        if (this.object == currentObject || !this.object.isCompleted)
            svgPanel.removeChild(this.circle);
        this.circle = null;
        this.isSelected = false;
    }
    setPointAttribute(attributeName, value) {
        this.circle.setAttribute(attributeName, value);
    }
    update(x, y, transform, attr = this.type.attr) {
        if (this.type.action != "polygon") {
            if (currentPointTypeAttr != null && currentPointTypeAttr == attr) this.circle.setAttribute('fill', "red");
            else this.circle.setAttribute('fill', "white");
        }
        this.x = x;
        this.y = y;
        this.transform = transform;
        this.circle.setAttribute('cx', x);
        this.circle.setAttribute('cy', y);
        this.circle.setAttribute('transform', this.transform);
        this.type.attr = attr;
    }
}

class frame {
    constructor(name, object, red = false) {
        this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", name);
        svgPanel.appendChild(this.svgElement);
        this.object = object;
        this.red = red;
        if (red || Number(object.getElementAttribute('opacity')) > 0.5) this.svgElement.setAttribute('opacity', "0.5");
        else this.svgElement.setAttribute('opacity', object.getElementAttribute('opacity'));
        if (red) this.svgElement.setAttribute('stroke', "red");
        else this.svgElement.setAttribute('stroke', object.getElementAttribute('stroke'));
        if (red) this.svgElement.setAttribute('stroke-width', pointRadius);
        else this.svgElement.setAttribute('stroke-width', object.strokeWidth);
        if (red || object.getElementAttribute('stroke-dasharray') == null) this.svgElement.setAttribute('stroke-dasharray', this.svgElement.getAttribute('stroke-width') * 4);
        else this.svgElement.setAttribute('stroke-dasharray', object.getElementAttribute('stroke-dasharray'));
        if (red) this.svgElement.setAttribute('stroke-linejoin', "none");
        else this.svgElement.setAttribute('stroke-linejoin', object.getElementAttribute('stroke-linejoin'));
        if (red) this.svgElement.setAttribute('stroke-linecap', "none");
        else this.svgElement.setAttribute('stroke-linecap', object.getElementAttribute('stroke-linecap'));
        this.svgElement.setAttribute('fill', "none");
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
    update() {
        if (this.red) this.svgElement.setAttribute('stroke', "red");
        else this.svgElement.setAttribute('stroke', this.object.getElementAttribute('stroke'));
        if (this.red) this.svgElement.setAttribute('stroke-width', pointRadius);
        else this.svgElement.setAttribute('stroke-width', this.object.getElementAttribute('stroke-width'));
        if (this.red || this.object.getElementAttribute('stroke-dasharray') == null ||
            this.object.getElementAttribute('stroke-dasharray') == "null") this.svgElement.setAttribute('stroke-dasharray', this.object.strokeWidth * 4);
        else this.svgElement.setAttribute('stroke-dasharray', this.object.getElementAttribute('stroke-dasharray'));
        if (this.red) this.svgElement.setAttribute('stroke-linejoin', "none");
        else this.svgElement.setAttribute('stroke-linejoin', this.object.getElementAttribute('stroke-linejoin'));
        if (this.red) this.svgElement.setAttribute('stroke-linecap', "none");
        else this.svgElement.setAttribute('stroke-linecap', this.object.getElementAttribute('stroke-linecap'));
    }
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
    update(x1, y1, x2, y2, transform) {
        super.update();
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.transform = transform;
        this.svgElement.setAttribute('x1', x1);
        this.svgElement.setAttribute('y1', y1);
        this.svgElement.setAttribute('x2', x2);
        this.svgElement.setAttribute('y2', y2);
        if (transform != null) this.svgElement.setAttribute('transform', transform);
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
    update(x, y, width, height, transform) {
        super.update();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.transform = transform;
        this.svgElement.setAttribute('x', x);
        this.svgElement.setAttribute('y', y);
        this.svgElement.setAttribute('width', width);
        this.svgElement.setAttribute('height', height);
        if (transform != null) this.svgElement.setAttribute('transform', transform);
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
    update(cx, cy, rx, ry, transform) {
        super.update();
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
        this.transform = transform;
        this.svgElement.setAttribute('cx', cx);
        this.svgElement.setAttribute('cy', cy);
        this.svgElement.setAttribute('rx', rx);
        this.svgElement.setAttribute('ry', ry);
        if (transform != null) this.svgElement.setAttribute('transform', transform);
    }
    update() {}
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
    update(vertices, transform) {
        super.update();
        this.vertices = vertices;
        this.svgElement.setAttribute('points', vertices);
        if (transform != null) this.svgElement.setAttribute('transform', transform);
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
    update(path, transform) {
        super.update();
        this.path = path;
        this.svgElement.setAttribute('points', path);
        if (transform != null) this.svgElement.setAttribute('transform', transform);
    }
}
class pathFrame extends frame {
    constructor(path, object) {
        super('path', object);
        this.path = path;
        this.svgElement.setAttribute('d', path);
    }
    createClone(newObject) {
        let clone = new pathFrame(this.path, newObject);
        return clone;
    }
    update(path, transform) {
        super.update();
        this.path = path;
        this.svgElement.setAttribute('d', path);
        if (transform != null) this.svgElement.setAttribute('transform', transform);
    }
}