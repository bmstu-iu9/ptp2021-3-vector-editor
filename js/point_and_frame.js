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
        this.deletePoint = ((event) => {
            if (event.code == 'Delete') {
                cursorOverPolylinePoint = false;
                this.object.deletePoint(this.x, this.y);
                document.removeEventListener("keydown", this.deletePoint);
            }
        })
        this.addActions();
        this.addHotKeys();
    }
    addActions() {
        this.circle.addEventListener("mousedown", function () {
            isSomePointSelected = true;
        });
        this.circle.addEventListener("mouseover", function () {
            this.setColor("red");
            //cursorOverPoint = true;
        }.bind(this));
        this.circle.addEventListener("mouseout", function () {
            this.setColor("white");
            isSomePointSelected = false;
            //cursorOverPoint = false;
        }.bind(this));
        //move
        if (this.type == "move") {
            const startMoving = ((current) => {
                this.object.isMoving = true;
                updateCursorCoords(current);
                this.object.start = {
                    x: curX,
                    y: curY
                }
            }).bind(this);
            this.circle.addEventListener("mousedown", startMoving);
        }
    }
    addHotKeys() {
        //удаление точки пера
        if (this.type == "polyline") {
            this.circle.addEventListener("mouseover", function () {
                if (this.object.isCompleted) {
                    cursorOverPolylinePoint = true;
                    document.addEventListener("keydown", this.deletePoint);
                }
            }.bind(this));
            this.circle.addEventListener("mouseout", function () {
                if (this.object.isCompleted) {
                    cursorOverPolylinePoint = false;
                    document.removeEventListener("keydown", this.deletePoint);
                }
            }.bind(this));
        }
    }
    removeHotKeys() {
        //удаление точки пера
        cursorOverPolylinePoint = false;
        document.removeEventListener("keydown", this.deletePoint);
    }
    createClone(newObject) {
        let clone = new point(this.x, this.y, newObject, this.type);
        return clone;
    }
    setColor(color) {
        if (this.object.isCompleted) {
            this.circle.setAttribute('fill', color);
        }
    }
    hide() {
        svgPanel.removeChild(this.circle);
        this.setColor("white");
        this.removeHotKeys();
    }
    show() {
        svgPanel.appendChild(this.circle);
        this.addHotKeys();
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
        this.line.setAttribute('stroke-width', pointRadius);
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
    constructor(path, object) {
        this.polyline = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
        svgPanel.appendChild(this.polyline);
        this.path = path;
        this.object = object;
        this.polyline.setAttribute('points', path);
        this.polyline.setAttribute('stroke-opacity', "0.5");
        this.polyline.setAttribute('stroke', object.getElementAttribute('stroke'));
        this.polyline.setAttribute('stroke-width', object.getElementAttribute('stroke-width'));
        if (object.getElementAttribute('stroke-dasharray') == null) this.polyline.setAttribute('stroke-dasharray', "8");
        else this.polyline.setAttribute('stroke-dasharray', object.getElementAttribute('stroke-dasharray'));
        this.polyline.setAttribute('stroke-linejoin', object.getElementAttribute('stroke-linejoin'));
        this.polyline.setAttribute('stroke-linecap', object.getElementAttribute('stroke-linecap'));
        this.polyline.setAttribute('fill', "none");
    }
    createClone(newObject) {
        let clone = new pencilShadow(this.path, newObject);
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