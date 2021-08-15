class object {
    constructor(name) {
        this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", name);
        currentLayer.group.appendChild(this.svgElement);
        this.type = name;
        this.isCompleted = false;
        this.isSelected = false;
        this.isMoving = false;
        this.x0 = curX;
        this.y0 = curY;
        this.pointsArray = [];
        this.frameArray = [];
        this.svgElement.setAttribute('fill', getCurrentFillColor());
        this.strokeWidth = 1;
        updateStroke(this);
        this.addActions();
    }
    createClone() {
        let clone = this.clone;
        clone.type = this.type;
        clone.isCompleted = false;
        clone.isSelected = true;
        clone.isMoving = false;
        clone.x0 = this.x0;
        clone.y0 = this.y0;
        clone.removeFrameAndPoints();
        for (let i = 0; i < this.pointsArray.length; i++) {
            clone.pointsArray[i] = this.pointsArray[i].createClone(clone);
        }
        clone.frameArray = [];
        for (let i = 0; i < this.frameArray.length; i++) {
            clone.frameArray[i] = this.frameArray[i].createClone();
        }
        clone.svgElement.setAttribute('fill', this.svgElement.getAttribute('fill'));
        clone.svgElement.setAttribute('stroke', this.svgElement.getAttribute('stroke'));
        clone.svgElement.setAttribute('stroke-width', this.svgElement.getAttribute('stroke-width'));
        clone.svgElement.setAttribute('stroke-dasharray', this.svgElement.getAttribute('stroke-dasharray'));
        clone.svgElement.setAttribute('stroke-linejoin', this.svgElement.getAttribute('stroke-linejoin'));
        clone.svgElement.setAttribute('stroke-linecap', this.svgElement.getAttribute('stroke-linecap'));
        clone.removeHotKeys();
    }
    addActions() {
        //select
        const select = (() => {
            if (wasPressed == "cursor") {
                isSomeObjectSelected = true;
                if (currentObject != null) {
                    currentObject.hideFrameAndPoints();
                }
                if (this.isCompleted) {
                    this.showFrameAndPoints();
                    currentObject = this;
                }
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
                    currentObject = null;
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
        currentLayer.group.removeChild(this.svgElement);
        this.svgElement = null;
        this.isSelected = false;
        this.isMoving = false;
        this.removeFrameAndPoints();
    }
    removeFrameAndPoints() {
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].remove();
        }
        for (let i = 0; i < this.frameArray.length; i++) {
            this.frameArray[i].remove();
        }
        this.pointsArray = [];
        this.frameArray = [];
    }
    hide() {
        this.hideFrameAndPoints()
        currentLayer.group.removeChild(this.svgElement);
    }
    show() {
        currentLayer.group.appendChild(this.svgElement);
        this.showFrameAndPoints()
    }
    hideFrameAndPoints() {
        for (let i = 0; i < this.frameArray.length; i++) {
            this.frameArray[i].hide();
        }
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].hide();
        }
        this.isSelected = false;
    }
    showFrameAndPoints() {
        for (let i = 0; i < this.frameArray.length; i++) {
            this.frameArray[i].show();
        }
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].show();
        }
        this.isSelected = true;
    }
    updateFrameAndPoints() {}
    addHotKeys() {}
    removeHotKeys() {}
    move() {}
    stopMoving() {}
    moveTo() {}
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
        this.width = 0;
        this.height = 0;
        this.x = curX;
        this.y = curY;
    }
    createClone() {
        let clone = new rectangle();
        this.clone = clone;
        super.createClone();
        clone.width = this.width;
        clone.height = this.height;
        clone.x = this.x;
        clone.y = this.y;
        clone.svgElement.setAttribute('width', this.width);
        clone.svgElement.setAttribute('height', this.height);
        clone.svgElement.setAttribute('x', this.x);
        clone.svgElement.setAttribute('y', this.y);
        return clone;
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
        this.updateFrameAndPoints();
    }
    updateFrameAndPoints(width = this.width, height = this.height, x = this.x, y = this.y) {
        this.removeFrameAndPoints();
        let w = Number(this.strokeWidth) / 2 + 1;
        x -= w;
        y -= w;
        width += w * 2;
        height += w * 2;
        this.frameArray = [new frame(x, y + height, x + width, y + height, this),
            new frame(x + width, y + height, x + width, y, this),
            new frame(x + width, y, x, y, this),
            new frame(x, y, x, y + height, this)
        ];
        this.pointsArray = [new point(x, y, this),
            new point(x + width, y, this),
            new point(x + width, y + height, this),
            new point(x, y + height, this),
        ];
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.svgElement.setAttribute('x', this.x + dx);
        this.svgElement.setAttribute('y', this.y + dy);
        this.updateFrameAndPoints(this.width, this.height, this.x + dx, this.y + dy);
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.x += dx;
        this.y += dy;
    }
    moveTo(x, y) {
        let dx = x + pointRadius - this.x,
            dy = y + pointRadius - this.y;
        this.move(dx, dy);
        this.stopMoving(dx, dy);
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
    createClone() {
        let clone = new ellipse();
        this.clone = clone;
        super.createClone();
        clone.rx = this.rx;
        clone.ry = this.ry;
        clone.cx = this.cx;
        clone.cy = this.cy;
        clone.svgElement.setAttribute('rx', this.rx);
        clone.svgElement.setAttribute('ry', this.ry);
        clone.svgElement.setAttribute('cx', this.cx);
        clone.svgElement.setAttribute('cy', this.cy);
        return clone;
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
        this.updateFrameAndPoints();
    }
    updateFrameAndPoints(rx = this.rx, ry = this.ry, cx = this.cx, cy = this.cy) {
        this.removeFrameAndPoints();
        let w = Number(this.strokeWidth) / 2 + 1;
        rx += w;
        ry += w;
        this.frameArray = [new frame(cx - rx, cy + ry, cx + rx, cy + ry, this),
            new frame(cx + rx, cy + ry, cx + rx, cy - ry, this),
            new frame(cx + rx, cy - ry, cx - rx, cy - ry, this),
            new frame(cx - rx, cy - ry, cx - rx, cy + ry, this)
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
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.svgElement.setAttribute('cx', this.cx + dx);
        this.svgElement.setAttribute('cy', this.cy + dy);
        this.updateFrameAndPoints(this.rx, this.ry, this.cx + dx, this.cy + dy);
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.cx += dx;
        this.cy += dy;
    }
    moveTo(x, y) {
        let dx = x + pointRadius - (this.cx - this.rx),
            dy = y + pointRadius - (this.cy - this.ry);
        this.move(dx, dy);
        this.stopMoving(dx, dy);
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
        this.pointsArray = [];
        this.rotationIsFixed = false;
        this.fixRotation = this.fixRotation.bind(this);
        this.freeRotation = this.freeRotation.bind(this);
        this.updateVertNum = this.updateVertNum.bind(this);
        this.addHotKeys();
    }
    createClone() {
        let clone = new polygon();
        this.clone = clone;
        super.createClone();
        clone.r = this.r;
        clone.phi = this.phi;
        clone.vertNum = this.vertNum;
        clone.points = this.points;
        clone.rotationIsFixed = this.rotationIsFixed;
        clone.svgElement.setAttribute('points', clone.points);
        return clone;
    }
    updateAttributes() {
        let dx = curX - this.x0,
            dy = curY - this.y0;
        this.r = Math.sqrt(dx ** 2 + dy ** 2);
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
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.x0 += dx;
        this.y0 += dy;
    }
    moveTo(x, y) {
        let dx = x + pointRadius - (this.x0 - this.r),
            dy = y + pointRadius - (this.y0 - this.r);
        this.move(dx, dy);
        this.stopMoving(dx, dy);
    }
}

//PENCIL
class pencil extends object {
    constructor() {
        super('polyline');
        this.type = 'pencil';
        this.path = this.x0 + " " + this.y0;
        this.pathPoints = [];
        this.svgElement.setAttribute('fill', "none");
        this.svgElement.setAttribute('points', this.path);
        this.minX = this.x0;
        this.minY = this.y0;
        this.maxX = this.x0;
        this.maxY = this.y0;
        this.svgElement.setAttribute('stroke-linejoin', "round");
        this.svgElement.setAttribute('stroke-linecap', "round");
        caps[2].checked = true;
        join[1].checked = true;
        updateStroke(this);
    }
    createClone() {
        let clone = new pencil();
        this.clone = clone;
        super.createClone();
        clone.minX = this.minX;
        clone.minY = this.minY;
        clone.maxX = this.maxX;
        clone.maxY = this.maxY;
        clone.svgElement.setAttribute('fill', "none");
        clone.path = "";
        clone.pathPoints = [];
        for (let i = 0; i < this.pathPoints.length; i++) {
            clone.pathPoints[i] = {
                x: 0,
                y: 0
            }
            clone.pathPoints[i].x = this.pathPoints[i].x;
            clone.pathPoints[i].y = this.pathPoints[i].y;
            if (i == 0) this.path = this.pathPoints[i].x + " " + this.pathPoints[i].y;
            else this.path += ", " + this.pathPoints[i].x + " " + this.pathPoints[i].y;
        }
        this.svgElement.setAttribute('points', this.path);
        this.path = "";
        return clone;
    }
    updateAttributes() {
        this.path += ", " + curX + " " + curY;
        this.pathPoints.push({
            x: curX,
            y: curY
        });
        this.svgElement.setAttribute('points', this.path);
        this.minX = Math.min(this.minX, curX);
        this.minY = Math.min(this.minY, curY);
        this.maxX = Math.max(this.maxX, curX);
        this.maxY = Math.max(this.maxY, curY);
    }
    updateFrameAndPoints(minX = this.minX, minY = this.minY, maxX = this.maxX, maxY = this.maxY) {
        this.removeFrameAndPoints();
        this.frameArray = [new frame(minX, maxY, maxX, maxY, this),
            new frame(maxX, maxY, maxX, minY, this),
            new frame(maxX, minY, minX, minY, this),
            new frame(minX, minY, minX, maxY, this)
        ];
        this.pointsArray = [new point(minX + (maxX - minX) / 2, minY + (maxY - minY) / 2, this)];
    }
    updatePosition(dx, dy) {
        let newX0 = this.x0 + dx,
            newY0 = this.y0 + dy;
        this.path = newX0 + " " + newY0;
        for (let i = 0; i < this.pathPoints.length; i++) {
            let newX = this.pathPoints[i].x + dx,
                newY = this.pathPoints[i].y + dy;
            this.path += ", " + newX + " " + newY;
        }
        this.svgElement.setAttribute('points', this.path);
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.updatePosition(dx, dy);
        this.updateFrameAndPoints(this.minX + dx,
            this.minY + dy,
            this.maxX + dx,
            this.maxY + dy
        );
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.x0 += dx;
        this.y0 += dy;
        this.minX += dx;
        this.minY += dy;
        this.maxX += dx;
        this.maxY += dy;
        for (let i = 0; i < this.pathPoints.length; i++) {
            this.pathPoints[i].x += dx;
            this.pathPoints[i].y += dy;
        }
        this.path = "";
    }
    moveTo(x, y) {
        let dx = x + pointRadius - this.minX,
            dy = y + pointRadius - this.minY;
        this.move(dx, dy);
        this.stopMoving(dx, dy);
    }
    completeFirstObject() {
        this.isCompleted = true;
        this.updateFrameAndPoints();
        this.hideFrameAndPoints();
        this.removeHotKeys();
    }
    complete() {
        super.complete();
        this.path = "";
        caps[2].checked = false;
        join[1].checked = false;
    }
}

//LINE
class line extends object {
    constructor(x1 = curX, y1 = curY, x2 = curX, y2 = curY, isFree = true) {
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
        this.isFree = isFree;
        if (!isFree) {
            this.svgElement.setAttribute('stroke', "black");
            this.svgElement.setAttribute('stroke-opacity', "0.5");
            this.svgElement.setAttribute('stroke-width', "2");
            this.svgElement.setAttribute('stroke-dasharray', "8");
        }
    }
    createClone() {
        let clone = new line();
        this.clone = clone;
        super.createClone();
        clone.x0 = this.x0;
        clone.y0 = this.y0;
        clone.x2 = this.x2;
        clone.y2 = this.y2;
        clone.isFree = this.isFree;
        clone.svgElement.setAttribute('width', this.x0);
        clone.svgElement.setAttribute('height', this.y0);
        clone.svgElement.setAttribute('x', this.x2);
        clone.svgElement.setAttribute('y', this.y2);
        clone.svgElement.setAttribute('fill', "none");
        return clone;
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
        if (this.isFree) {
            this.updatePoints(this.x0, this.y0, this.x2, this.y2);
        }
    }
    updatePoints(x0, y0, x2, y2) {
        this.removeFrameAndPoints();
        this.pointsArray = [new point(x0, y0, this),
            new point(x0 + (x2 - x0) / 2, y0 + (y2 - y0) / 2, this),
            new point(x2, y2, this)
        ];
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.svgElement.setAttribute('x1', this.x0 + dx);
        this.svgElement.setAttribute('y1', this.y0 + dy);
        this.svgElement.setAttribute('x2', this.x2 + dx);
        this.svgElement.setAttribute('y2', this.y2 + dy);
        this.updatePoints(this.x0 + dx,
            this.y0 + dy,
            this.x2 + dx,
            this.y2 + dy
        );
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.x0 += dx;
        this.y0 += dy;
        this.x2 += dx;
        this.y2 += dy;
    }
    moveTo(x, y) {
        let dx = x + pointRadius - Math.min(this.x0, this.x2),
            dy = y + pointRadius - Math.min(this.y0, this.y2);
        this.move(dx, dy);
        this.stopMoving(dx, dy);
    }
}

//POLYLINE
class polyline extends object {
    constructor() {
        super('polyline');
        this.path = this.x0 + " " + this.y0;
        this.pathPoints = [];
        this.svgElement.setAttribute('points', this.path);
        this.pointsArray.push(new point(this.x0, this.y0, this));
        this.pointsArray[0].setPointAttribute('fill', "blue");
        this.line = new line(curX, curY, curX, curY, false);
        this.minX = this.x0;
        this.minY = this.y0;
        this.maxX = this.x0;
        this.maxY = this.y0;
    }
    createClone() {
        let clone = new polyline();
        this.clone = clone;
        super.createClone();
        clone.line.remove();
        clone.minX = this.minX;
        clone.minY = this.minY;
        clone.maxX = this.maxX;
        clone.maxY = this.maxY;
        clone.path = this.x0 + " " + this.y0;
        clone.pathPoints = [];
        for (let i = 0; i < this.pathPoints.length; i++) {
            clone.pathPoints[i] = {
                x: 0,
                y: 0
            }
            clone.pathPoints[i].x = this.pathPoints[i].x;
            clone.pathPoints[i].y = this.pathPoints[i].y;
            clone.path += ", " + this.pathPoints[i].x + " " + this.pathPoints[i].y;
        }
        clone.path += ", " + clone.pathPoints[0].x + " " + clone.pathPoints[0].y;
        clone.svgElement.setAttribute('points', this.path);
        clone.path = "";
        return clone;
    }
    updateLine(current) {
        this.line.updateAttributes(current);
        if ((curX - this.x0) ** 2 + (curY - this.y0) ** 2 <= pointRadius ** 2 && this.pointsArray.length > 1) {
            this.pointsArray[0].setPointAttribute('fill', "red");
        } else {
            this.pointsArray[0].setPointAttribute('fill', "blue");
        }
    }
    updateAttributes() {
        const x = Number(this.line.getElementAttribute('x2')),
            y = Number(this.line.getElementAttribute('y2'));
        if ((curX - this.x0) ** 2 + (curY - this.y0) ** 2 <= pointRadius ** 2 && this.pointsArray.length > 1) {
            this.complete();
            return;
        }
        this.minX = Math.min(this.minX, x);
        this.minY = Math.min(this.minY, y);
        this.maxX = Math.max(this.maxX, x);
        this.maxY = Math.max(this.maxY, y);
        if (x != this.x0) {
            this.path += ", " + x + " " + y;
            this.pathPoints.push({
                x: x,
                y: y
            });
            this.svgElement.setAttribute('points', this.path);
            this.pointsArray.push(new point(x, y, this));
            this.line.remove();
            this.line = new line(x, y, curX, curY, false);
        }
    }
    updatePositionAndPoints(dx, dy) {
        this.removeFrameAndPoints();
        let newX0 = this.x0 + dx,
            newY0 = this.y0 + dy;
        this.path = newX0 + " " + newY0;
        this.pointsArray = [new point(newX0, newY0, this)];
        for (let i = 0; i < this.pathPoints.length; i++) {
            let newX = this.pathPoints[i].x + dx,
                newY = this.pathPoints[i].y + dy;
            this.path += ", " + newX + " " + newY;
            this.pointsArray.push(new point(newX, newY, this))
        }
        this.path += ", " + newX0 + " " + newY0;
        this.svgElement.setAttribute('points', this.path);
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.updatePositionAndPoints(dx, dy);
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.x0 += dx;
        this.y0 += dy;
        this.minX += dx;
        this.minY += dy;
        this.maxX += dx;
        this.maxY += dy;
        for (let i = 0; i < this.pathPoints.length; i++) {
            this.pathPoints[i].x += dx;
            this.pathPoints[i].y += dy;
        }
        this.path = "";
    }
    moveTo(x, y) {
        let dx = x + pointRadius - this.minX,
            dy = y + pointRadius - this.minY;
        this.move(dx, dy);
        this.stopMoving(dx, dy);
    }
    complete() {
        if (!polylineIsCompleted) {
            super.complete();
            if (this.pointsArray.length < 2) {
                this.remove();
            }
            this.line.remove();
            this.path += ", " + this.x0 + " " + this.y0;
            this.svgElement.setAttribute('points', this.path);
            this.path = "";
            this.pointsArray[0].setPointAttribute('fill', "white");
            polylineIsCompleted = true;
        }
    }
}