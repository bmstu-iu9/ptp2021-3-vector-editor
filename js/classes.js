class object {
    constructor(name) {
        this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", name);
        svgPanel.appendChild(this.svgElement);
        this.type = name;
        this.isCompleted = false;
        this.isSelected = false;
        this.isMoving = false;
        this.x0 = curX;
        this.y0 = curY;
        this.pointsArray = [];
        this.frame = [];
        this.svgElement.setAttribute('fill', getCurrentFillColor());
        this.svgElement.setAttribute('stroke', getCurrentStrokeColor());
        this.addActions();
    }
    createClone() {
        let clone = this.clone;
        clone.type = this.type;
        clone.isCompleted = true;
        clone.isSelected = true;
        clone.isMoving = false;
        clone.x0 = this.x0;
        clone.y0 = this.y0;
        clone.removeFrameAndPoints();
        for (let i = 0; i < this.pointsArray.length; i++) {
            clone.pointsArray[i] = this.pointsArray[i].createClone(clone);
        }
        clone.frame = [];
        for (let i = 0; i < this.frame.length; i++) {
            clone.frame[i] = this.frame[i].createClone();
        }
        clone.svgElement.setAttribute('fill', this.svgElement.getAttribute('fill'));
        clone.svgElement.setAttribute('stroke', this.svgElement.getAttribute('stroke'));
        this.removeHotKeys();
    }
    addActions() {
        //select
        const select = (() => {
            if (wasPressed == "cursor") {
                isSomeObjectSelected = true;
                if (currentObject != null) {
                    currentObject.hideFrameAndPoints();
                }
                this.showFrameAndPoints();
                currentObject = this;
            }
            if (wasPressed == "fill" && this.type != 'pencil') {
                this.svgElement.setAttribute('fill', getCurrentFillColor());
            }
        }).bind(this);
        this.svgElement.addEventListener("mousedown", select);
        this.svgElement.addEventListener("mouseout", function () {
            isSomeObjectSelected = false;
        });
        //hide
        svgPanel.addEventListener("mousedown", function () {
            if (!isSomeObjectSelected) {
                if (currentObject != null) {
                    currentObject.hideFrameAndPoints();
                    currentObject = null
                }
            }
        });
        //move
        const move = ((current) => {
            if (this.isCompleted && this.isSelected && this.isMoving) {
                updateCursorCoords(current);
                this.move();
            }
        }).bind(this);
        document.addEventListener("mousemove", move);
        const startMoving = ((current) => {
            if (this.isCompleted && this.isSelected) {
                this.isMoving = true;
                updateCursorCoords(current);
                this.start = {
                    x: curX,
                    y: curY
                }
            }
        }).bind(this);
        svgPanel.addEventListener("mousedown", startMoving);
        const stopMoving = ((current) => {
            if (this.isSelected && this.isMoving) {
                this.isMoving = false;
                updateCursorCoords(current);
                this.stopMoving();
            }
        }).bind(this);
        svgPanel.addEventListener("mouseup", stopMoving);
    }
    setElementAttribute(attributeName, value) {
        this.svgElement.setAttribute(attributeName, value);
    }
    getElementAttribute(attributeName) {
        return this.svgElement.getAttribute(attributeName);
    }
    remove() {
        svgPanel.removeChild(this.svgElement);
        this.svgElement = null;
        this.isSelected = false;
        this.isMoving = false;
        this.removeFrameAndPoints();
    }
    removeFrameAndPoints() {
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].remove();
        }
        for (let i = 0; i < this.frame.length; i++) {
            this.frame[i].remove();
        }
        this.pointsArray = [];
        this.frame = [];
    }
    hide() {
        this.svgElement.setAttribute('fill-opacity', 0);
        this.svgElement.setAttribute('stroke-opacity', 0);
        for (let i = 0; i < this.frame.length; i++) {
            this.frame[i].hide();
        }
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].hide();
        }
        this.isSelected = false;
    }
    show() {
        this.svgElement.setAttribute('fill-opacity', 1);
        this.svgElement.setAttribute('stroke-opacity', 1);
        for (let i = 0; i < this.frame.length; i++) {
            this.frame[i].show();
        }
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].show();
        }
        this.isSelected = true;
    }
    hideFrameAndPoints() {
        for (let i = 0; i < this.frame.length; i++) {
            this.frame[i].hide();
        }
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].hide();
        }
        this.isSelected = false;
    }
    showFrameAndPoints() {
        for (let i = 0; i < this.frame.length; i++) {
            this.frame[i].show();
        }
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].show();
        }
        this.isSelected = true;
    }
    updateFrameAndPoints() {
        for (let i = 0; i < this.frame.length; i++) {
            this.frame[i].setElementAttribute('stroke-opacity', "0.3");
            this.frame[i].setElementAttribute('stroke', "red");
        }
    }
    addHotKeys() {}
    removeHotKeys() {}
    move() {
        svgPanel.append(this.svgElement);
        for (let i = 0; i < this.pointsArray.length; i++) {
            svgPanel.append(this.pointsArray[i].circle);
        }
        for (let i = 0; i < this.frame.length; i++) {
            svgPanel.append(this.frame[i].svgElement);
        }
    }
    stopMoving() {}
    complete() {
        this.isCompleted = true;
        this.updateFrameAndPoints();
        this.hideFrameAndPoints();
        this.removeHotKeys();
        svgPanel.onmousemove = null;
        svgPanel.onmouseup = null;
        svgPanel.onmouseenter = null;
        document.onmousemove = null;
        document.onmouseup = null;
        document.onclick = null;
        document.onmouseenter = null;
    }
}

//RECTANGLE
class rectangle extends object {
    constructor() {
        super('rect');
    }
    updateAttributes(current) {
        let w = curX - this.x0;
        let h = curY - this.y0;
        let signW = w > 0 ? 1 : -1;
        let signH = h > 0 ? 1 : -1;
        let absW = Math.abs(w);
        let absH = Math.abs(h);
        if (current.shiftKey) {
            absW = Math.min(absW, absH);
            absH = absW;
        }
        this.width = absW;
        this.height = absH;
        this.x = Math.min(this.x0, this.x0 + signW * absW);
        this.y = Math.min(this.y0, this.y0 + signH * absH);
        this.svgElement.setAttribute('width', this.width);
        this.svgElement.setAttribute('height', this.height);
        this.svgElement.setAttribute('x', this.x);
        this.svgElement.setAttribute('y', this.y);
        this.updatePoints(this.width, this.height, this.x, this.y)
    }
    updatePoints(width, height, x, y) {
        this.removeFrameAndPoints();
        this.pointsArray = [new point(x, y, this),
            new point(x + width, y, this),
            new point(x + width, y + height, this),
            new point(x, y + height, this),
        ];
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.svgElement.setAttribute('x', this.x + dx);
        this.svgElement.setAttribute('y', this.y + dy);
        this.updatePoints(this.width, this.height, this.x + dx, this.y + dy);
        super.move();
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.x += dx;
        this.y += dy;
    }
}

//ELLIPSE
class ellipse extends object {
    constructor() {
        super('ellipse');
        this.rx = curX;
        this.ry = curY;
        this.cx = 0;
        this.cy = 0;
    }
    updateAttributes(current) {
        let w = (curX - this.x0) / 2;
        let h = (curY - this.y0) / 2;
        let signW = w > 0 ? 1 : -1;
        let signH = h > 0 ? 1 : -1;
        let absW = Math.abs(w);
        let absH = Math.abs(h);
        if (current.shiftKey) {
            absW = Math.min(absW, absH);
            absH = absW;
        }
        this.rx = absW;
        this.ry = absH;
        this.cx = Math.min(this.x0, this.x0 + 2 * signW * absW) + absW;
        this.cy = Math.min(this.y0, this.y0 + 2 * signH * absH) + absH;
        this.svgElement.setAttribute('rx', this.rx);
        this.svgElement.setAttribute('ry', this.ry);
        this.svgElement.setAttribute('cx', this.cx);
        this.svgElement.setAttribute('cy', this.cy);
        this.updateFrameAndPoints(this.rx, this.ry, this.cx, this.cy);
    }
    updateFrameAndPoints(rx = this.rx, ry = this.ry, cx = this.cx, cy = this.cy) {
        this.removeFrameAndPoints();
        this.frame = [new line(cx - rx, cy + ry, cx + rx, cy + ry, false),
            new line(cx + rx, cy + ry, cx + rx, cy - ry, false),
            new line(cx + rx, cy - ry, cx - rx, cy - ry, false),
            new line(cx - rx, cy - ry, cx - rx, cy + ry, false)
        ];
        this.pointsArray = [new point(cx, cy - ry, this),
            new point(cx + rx, cy, this),
            new point(cx, cy + ry, this),
            new point(cx - rx, cy, this),
            new point(cx - rx, cy + ry, this),
            new point(cx + rx, cy + ry, this),
            new point(cx + rx, cy - ry, this),
            new point(cx - rx, cy - ry, this)
        ];
        super.updateFrameAndPoints();
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.svgElement.setAttribute('cx', this.cx + dx);
        this.svgElement.setAttribute('cy', this.cy + dy);
        this.updateFrameAndPoints(this.rx, this.ry, this.cx + dx, this.cy + dy);
        super.move();
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.cx += dx;
        this.cy += dy;
    }
}

//POLYGON
class polygon extends object {
    constructor() {
        super('polygon');
        this.r = 0;
        this.phi = 0;
        this.vertNum = curVertNum;
        this.points = "";
        this.rotationIsFixed = false;
        this.fixRotation = this.fixRotation.bind(this);
        this.freeRotation = this.freeRotation.bind(this);
        this.updateVertNum = this.updateVertNum.bind(this);
        this.addHotKeys();
    }
    updateAttributes() {
        let dx = curX - this.x0,
            dy = curY - this.y0;
        this.r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (this.rotationIsFixed) this.phi = (this.vertNum - 2) * Math.PI / (this.vertNum * 2);
        else if (this.r > 0) this.phi = dy > 0 ? Math.acos(dx / this.r) : -Math.acos(dx / this.r);
        this.removeFrameAndPoints();
        this.pointsArray = [];
        for (let i = 0; i < this.vertNum; i++) {
            let x = this.x0 + this.r * Math.cos(this.phi + 2 * Math.PI * i / this.vertNum);
            let y = this.y0 + this.r * Math.sin(this.phi + 2 * Math.PI * i / this.vertNum);
            if (i == 0) this.points = x + " " + y;
            else this.points += ", " + x + " " + y;
            this.pointsArray.push(new point(x, y, this));
        }
        this.svgElement.setAttribute('points', this.points);
    }
    addHotKeys() {
        document.addEventListener('keydown', this.updateVertNum);
        document.addEventListener('keydown', this.fixRotation);
        document.addEventListener('keyup', this.freeRotation);
    }
    removeHotKeys() {
        document.removeEventListener('keydown', this.updateVertNum);
        document.removeEventListener('keydown', this.fixRotation);
        document.removeEventListener('keyup', this.freeRotation);
    }
    updateVertNum(current) {
        if (current.code == 'ArrowUp') {
            curVertNum++;
            this.vertNum++;
            this.updateAttributes(current);
        }
        if (current.code == 'ArrowDown' && curVertNum > 3) {
            curVertNum--;
            this.vertNum--;
            this.updateAttributes(current);
        }
    }
    fixRotation(event) {
        if (event.key == 'Shift') {
            this.rotationIsFixed = true;
            this.updateAttributes();
        }
    }
    freeRotation(event) {
        if (event.key == 'Shift') {
            this.rotationIsFixed = false;
            this.updateAttributes();
        }
    }
    updatePosition(x0, y0) {
        this.removeFrameAndPoints();
        this.pointsArray = [];
        for (let i = 0; i < this.vertNum; i++) {
            let x = x0 + this.r * Math.cos(this.phi + 2 * Math.PI * i / this.vertNum);
            let y = y0 + this.r * Math.sin(this.phi + 2 * Math.PI * i / this.vertNum);
            if (i == 0) this.points = x + " " + y;
            else this.points += ", " + x + " " + y;
            this.pointsArray.push(new point(x, y, this));
        }
        this.svgElement.setAttribute('points', this.points);
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.updatePosition(this.x0 + dx, this.y0 + dy);
        super.move();
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.x0 += dx;
        this.y0 += dy;
    }
}

//PENCIL
class pencil extends object {
    constructor() {
        super('polyline');
        this.type = 'pencil';
        this.path = this.x0 + " " + this.y0;
        this.svgElement.setAttribute('fill', "none");
        this.svgElement.setAttribute('points', this.path);
        this.minX = this.x0;
        this.minY = this.y0;
        this.maxX = this.x0;
        this.maxY = this.y0;
    }
    updateAttributes() {
        this.path += ", " + curX + " " + curY;
        this.svgElement.setAttribute('points', this.path);
        this.minX = Math.min(this.minX, curX);
        this.minY = Math.min(this.minY, curY);
        this.maxX = Math.max(this.maxX, curX);
        this.maxY = Math.max(this.maxY, curY);
    }
    setFrameAndPoints() {
        this.pointsArray = [new point(this.minX + (this.maxX - this.minX) / 2, this.minY + (this.maxY - this.minY) / 2, this)];
        this.frame = [new line(this.minX, this.maxY, this.maxX, this.maxY),
            new line(this.maxX, this.maxY, this.maxX, this.minY),
            new line(this.maxX, this.minY, this.minX, this.minY),
            new line(this.minX, this.minY, this.minX, this.maxY)
        ];
        super.setFrameAndPoints();
    }
}

//LINE
class line extends object {
    constructor(x1 = curX, y1 = curY, x2 = curX, y2 = curY, inPolyline = false) {
        super('line');
        this.x0 = x1;
        this.y0 = y1;
        this.svgElement.setAttribute('x1', x1);
        this.svgElement.setAttribute('y1', y1);
        this.svgElement.setAttribute('x2', x2);
        this.svgElement.setAttribute('y2', y2);
        this.x2 = x2;
        this.y2 = y2;
        this.svgElement.setAttribute('fill', "none");
        this.inPolyline = inPolyline;
    }
    updateAttributes(current) {
        let w = curX - this.x0;
        let h = curY - this.y0;
        let signW = w > 0 ? 1 : -1;
        let signH = h > 0 ? 1 : -1;
        let absW = Math.abs(w);
        let absH = Math.abs(h);
        if (current.shiftKey) {
            if (absH < absW) {
                if (absH / absW < Math.tan(Math.PI / 8)) absH = 0;
                else absW = absH;
            } else {
                if (absW / absH < Math.tan(Math.PI / 8)) absW = 0;
                else absH = absW;
            }
        }
        this.x2 = this.x0 + signW * absW;
        this.y2 = this.y0 + signH * absH;
        this.svgElement.setAttribute('x2', this.x2);
        this.svgElement.setAttribute('y2', this.y2);
        if (!this.inPolyline) {
            this.removeFrameAndPoints();
            this.pointsArray = [new point(this.x0, this.y0, this),
                new point(this.x0 + (this.x2 - this.x0) / 2, this.y0 + (this.y2 - this.y0) / 2, this),
                new point(this.x2, this.y2, this)
            ];
        }
    }
    hide() {
        this.svgElement.setAttribute('stroke-opacity', 0);
    }
    show() {
        this.svgElement.setAttribute('stroke-opacity', 0.3);
    }
}

//POLYLINE
class polyline extends object {
    constructor() {
        super('polyline');
        this.points = this.x0 + " " + this.y0;
        this.svgElement.setAttribute('points', this.points);
        this.pointsArray.push(new point(this.x0, this.y0, this));
        this.pointsArray[0].setPointAttribute('fill', "blue");
        this.line = new line(curX, curY, curX, curY, true);
    }
    updateLine(current) {
        this.line.updateAttributes(current);
        if (Math.pow(curX - this.x0, 2) + Math.pow(curY - this.y0, 2) <= Math.pow(pointRadius, 2) && this.pointsArray.length > 1) {
            this.pointsArray[0].setPointAttribute('fill', "red");
        } else {
            this.pointsArray[0].setPointAttribute('fill', "blue");
        }
    }
    removeLine() {
        this.line.remove();
    }
    updateAttributes() {
        const x = Number(this.line.getElementAttribute('x2')),
            y = Number(this.line.getElementAttribute('y2'));
        if (Math.pow(x - this.x0, 2) + Math.pow(y - this.y0, 2) <= Math.pow(pointRadius, 2) && this.pointsArray.length > 1) {
            this.complete();
            return;
        }
        if (x != this.x0) {
            this.points += ", " + x + " " + y;
            this.svgElement.setAttribute('points', this.points);
            this.pointsArray.push(new point(x, y, this));
            this.line.remove();
            this.line = new line(x, y, curX, curY, true);
            this.line.setElementAttribute('stroke-opacity', "0.3");
            this.line.setElementAttribute('stroke', this.svgElement.getAttribute('stroke'));
        }
    }
    complete() {
        if (!polylineIsСompleted) {
            super.complete();
            if (this.pointsArray.length < 2) {
                this.remove();
            }
            this.line.remove();
            this.points += ", " + this.x0 + " " + this.y0;
            this.svgElement.setAttribute('points', this.points);
            this.pointsArray[0].setPointAttribute('fill', "white");
            polylineIsСompleted = true;
        }
    }
}