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
                this.setColor("red");
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
            this.circle.addEventListener("mouseover", function () {
                if (this.object.isMoving) {
                    currentPointTypeAttr = this.type.attr;
                }
            }.bind(this));
            this.circle.addEventListener("mouseup", this.setColor.bind(this, "white"));
        }
        //rotateObject
        if (this.type.action == "rotate") {
            //чтобы менялся только, когда выбран курсор
            this.setRotateCursor = (() => {
                if (wasPressed == "cursor") {
                    this.circle.style.cursor = "url(img/rotate.svg) 10 10, pointer";
                } else {
                    this.circle.style.cursor = svgPanel.style.cursor;
                }
            }).bind(this);
            document.addEventListener('click', this.setRotateCursor);

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
                    doFunc("rotate", this.object, this.object.angle)
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
                    document.dispatchEvent(new Event("mouseup"));
                    this.object.stopRotating();
                    this.object.updateParameters();
                }
            }).bind(this);
            document.addEventListener("mouseup", stopRotating);
        }
        //movePoint
        if (this.type.action == "resize" || this.type.action == "polygon" || this.type.action == "pathTool") {
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
                    };
                    doFunc("resize", this.object, this.object.getResizeAttrs());
                    this.object.startResize();
                    document.addEventListener("mousemove", move);
                }
            }).bind(this);
            this.circle.addEventListener("mousedown", startMoving);
            const stopMoving = (() => {
                if (this.isMoving) {
                    this.isMoving = false;
                    currentPointTypeAttr = null;
                    this.isSelected = false;
                    isSomePointSelected = false;
                    this.setColor("white");
                    document.removeEventListener("mousemove", move);
                    this.object.stopResize();
                    this.object.updateParameters();
                    this.object.removeHotKeys();
                }
            }).bind(this);
            document.addEventListener("mouseup", stopMoving);
        }
        //удаление точки пера
        const deletePoint = ((event) => {
            if (wasPressed == "cursor") {
                event.preventDefault();
                this.object.deletePoint(this.type.attr);
                isSomePointSelected = false;
            }
        })
        if (this.type.action == "pathTool") {
            this.circle.addEventListener("contextmenu", deletePoint);
        }
    }
    createClone(newObject) {
        let clone = new point(this.x, this.y, newObject, this.type);
        clone.type = {
            action: this.type.action,
            attr: this.type.attr
        }
        clone.transform = this.transform;
        clone.setPointAttribute('transform', this.transform);
        return clone;
    }
    setColor(color) {
        if (this.circle != null && !isSomePointSelected && this.object.isCompleted) {
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
        if (this.type.action == "rotate") {
            document.removeEventListener('click', this.setRotateCursor);
        }
        svgPanel.removeChild(this.circle);
        this.circle = null;
        this.isSelected = false;
    }
    setPointAttribute(attributeName, value) {
        this.circle.setAttribute(attributeName, value);
    }
    update(x, y, transform, attr = this.type.attr) {
        if (this.object.type != "polygon") {
            if (isSomePointSelected && currentPointTypeAttr != null && currentPointTypeAttr == attr) this.circle.setAttribute('fill', "red");
            else this.circle.setAttribute('fill', "white");
        }
        this.x = x;
        this.y = y;
        if (transform) {
            this.transform = transform;
            this.circle.setAttribute('transform', this.transform);
        }
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
        this.red = red;
        this.setFrameAttribute('opacity', "0.5");
        if (red) this.setFrameAttribute('stroke', "red");
        else this.setFrameAttribute('stroke', object.getElementAttribute('stroke'));
        if (red || object.strokeWidth > 2) this.setFrameAttribute('stroke-width', 2);
        else this.setFrameAttribute('stroke-width', object.strokeWidth);
        if (red || !red && object.getElementAttribute('stroke-dasharray') == null) this.setFrameAttribute('stroke-dasharray', this.getFrameAttribute('stroke-width') * 4);
        else this.setFrameAttribute('stroke-dasharray', object.getElementAttribute('stroke-dasharray'));
        if (red) this.setFrameAttribute('stroke-linejoin', "none");
        else this.setFrameAttribute('stroke-linejoin', object.getElementAttribute('stroke-linejoin'));
        if (red) this.setFrameAttribute('stroke-linecap', "none");
        else this.setFrameAttribute('stroke-linecap', object.getElementAttribute('stroke-linecap'));
        this.setFrameAttribute('fill', "none");
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
    getFrameAttribute(attributeName) {
        return this.svgElement.getAttribute(attributeName);
    }
    update() {
        if (this.red) this.setFrameAttribute('stroke', "red");
        else this.setFrameAttribute('stroke', this.object.getElementAttribute('stroke'));
        if (this.red || this.object.strokeWidth > 2) this.setFrameAttribute('stroke-width', 2);
        else this.setFrameAttribute('stroke-width', this.object.strokeWidth);
        if (this.red || !this.red && (this.object.getElementAttribute('stroke-dasharray') == null || this.object.getElementAttribute('stroke-dasharray') == "null"))
            this.setFrameAttribute('stroke-dasharray', this.getFrameAttribute('stroke-width') * 4);
        else this.setFrameAttribute('stroke-dasharray', this.object.getElementAttribute('stroke-dasharray'));
        if (this.red) this.setFrameAttribute('stroke-linejoin', "none");
        else this.setFrameAttribute('stroke-linejoin', this.object.getElementAttribute('stroke-linejoin'));
        if (this.red) this.setFrameAttribute('stroke-linecap', "none");
        else this.setFrameAttribute('stroke-linecap', this.object.getElementAttribute('stroke-linecap'));
    }
}
class lineFrame extends frame {
    constructor(x1, y1, x2, y2, object, red = false) {
        super('line', object, red);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.setFrameAttribute('x1', x1);
        this.setFrameAttribute('y1', y1);
        this.setFrameAttribute('x2', x2);
        this.setFrameAttribute('y2', y2);
        this.red = red;
    }
    createClone(newObject) {
        let clone = new lineFrame(this.x1, this.y1, this.x2, this.y2, newObject, this.red);
        if (this.transform) {
            clone.transform = this.transform;
            clone.setFrameAttribute('transform', this.transform);
        }
        return clone;
    }
    update(x1, y1, x2, y2, transform) {
        super.update();
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.setFrameAttribute('x1', x1);
        this.setFrameAttribute('y1', y1);
        this.setFrameAttribute('x2', x2);
        this.setFrameAttribute('y2', y2);
        if (transform) {
            this.transform = transform;
            this.setFrameAttribute('transform', transform);
        }
        if (this.object.type == 'vector') this.setFrameAttribute('stroke-dasharray', "none");
    }
}
class rectangleFrame extends frame {
    constructor(x, y, width, height, object, red = false) {
        super('rect', object, red);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.setFrameAttribute('x', x);
        this.setFrameAttribute('y', y);
        this.setFrameAttribute('width', width);
        this.setFrameAttribute('height', height);
        this.red = red;
    }
    createClone(newObject) {
        let clone = new rectangleFrame(this.x, this.y, this.width, this.height, newObject, this.red);
        clone.transform = this.transform;
        clone.setFrameAttribute('transform', this.transform);
        return clone;
    }
    update(x, y, width, height, transform) {
        super.update();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.transform = transform;
        this.setFrameAttribute('x', x);
        this.setFrameAttribute('y', y);
        this.setFrameAttribute('width', width);
        this.setFrameAttribute('height', height);
        this.setFrameAttribute('transform', transform);
    }
}
class ellipseFrame extends frame {
    constructor(cx, cy, rx, ry, object) {
        super('ellipse', object);
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
        this.setFrameAttribute('cx', cx);
        this.setFrameAttribute('cy', cy);
        this.setFrameAttribute('rx', rx);
        this.setFrameAttribute('ry', ry);
    }
    createClone(newObject) {
        let clone = new ellipseFrame(this.cx, this.cy, this.rx, this.ry, newObject);
        if (this.transform) {
            clone.transform = this.transform;
            clone.setFrameAttribute('transform', this.transform);
        }
        return clone;
    }
    update(cx, cy, rx, ry, transform) {
        super.update();
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
        this.setFrameAttribute('cx', cx);
        this.setFrameAttribute('cy', cy);
        this.setFrameAttribute('rx', rx);
        this.setFrameAttribute('ry', ry);
        if (transform) {
            this.transform = transform;
            this.setFrameAttribute('transform', transform);
        }
    }
}
class polygonFrame extends frame {
    constructor(vertices, object) {
        super('polygon', object);
        this.vertices = vertices;
        this.setFrameAttribute('points', vertices);
    }
    createClone(newObject) {
        let clone = new polygonFrame(this.vertices, newObject);
        return clone;
    }
    update(vertices) {
        super.update();
        this.vertices = vertices;
        this.setFrameAttribute('points', vertices);
    }
}
class polylineFrame extends frame {
    constructor(path, object) {
        super('polyline', object);
        this.path = path;
        this.setFrameAttribute('points', path);
    }
    createClone(newObject) {
        let clone = new polylineFrame(this.path, newObject);
        clone.transform = this.transform;
        clone.svgElement.setAttribute("transform", this.transform);
        return clone;
    }
    update(path, transform) {
        super.update();
        this.path = path;
        this.setFrameAttribute('points', path);
        this.setFrameAttribute('transform', transform);
        this.transform = transform;
    }
}
class pathFrame extends frame {
    constructor(path, object) {
        super('path', object);
        this.path = path;
        this.setFrameAttribute('d', path);
    }
    createClone(newObject) {
        let clone = new pathFrame(this.path, newObject);
        if (this.transform) {
            clone.transform = this.transform;
            clone.setFrameAttribute('transform', this.transform);
        }
        return clone;
    }
    update(path, transform) {
        super.update();
        this.path = path;
        this.setFrameAttribute('d', path);
        if (transform) {
            this.transform = transform;
            this.setFrameAttribute('transform', transform);
        }
    }
}