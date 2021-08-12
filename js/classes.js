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
        updateStroke(this.svgElement);
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
        for (let i = 0; i < this.frame.length; i++) {
            this.frame[i].hide();
        }
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].hide();
        }
        svgPanel.removeChild(this.svgElement);
        this.isSelected = false;
    }
    show() {
        svgPanel.appendChild(this.svgElement);
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
    updateFrameAndPoints() {}
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
        clone.removeHotKeys();
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
        clone.removeHotKeys();
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
        clone.removeHotKeys();
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
        super.move();
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
        this.frame = [new line(minX, maxY, maxX, maxY, false),
            new line(maxX, maxY, maxX, minY, false),
            new line(maxX, minY, minX, minY, false),
            new line(minX, minY, minX, maxY, false)
        ];
        this.pointsArray = [new point(minX + (maxX - minX) / 2, minY + (maxY - minY) / 2, this)];
        super.updateFrameAndPoints();
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
    move(startX = this.start.x, startY = this.start.y) {
        let dx = curX - startX,
            dy = curY - startY;
        this.updatePosition(dx, dy);
        this.updateFrameAndPoints(this.minX + dx,
            this.minY + dy,
            this.maxX + dx,
            this.maxY + dy
        );
    }
    stopMove(startX = this.start.x, startY = this.start.y) {
        let dx = curX - startX,
            dy = curY - startY;
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
    completeFirstObject() {
        this.isCompleted = true;
        this.updateFrameAndPoints();
        this.hideFrameAndPoints();
        this.removeHotKeys();
    }
    complete() {
        super.complete();
        this.path = "";
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
    move(startX = this.start.x, startY = this.start.y) {
        this.svgElement.setAttribute('x1', this.x0 + (curX - startX));
        this.svgElement.setAttribute('y1', this.y0 + (curY - startY));
        this.svgElement.setAttribute('x2', this.x2 + (curX - startX));
        this.svgElement.setAttribute('y2', this.y2 + (curY - startY));
        this.updatePoints(this.x0 + (curX - startX),
            this.y0 + (curY - startY),
            this.x2 + (curX - startX),
            this.y2 + (curY - startY)
        );
    }
    stopMove(startX = this.start.x, startY = this.start.y) {
        this.x0 += (curX - startX);
        this.y0 += (curY - startY);
        this.x2 += (curX - startX);
        this.y2 += (curY - startY);
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
        this.path = this.x0 + " " + this.y0;
        this.pathPoints = [];
        this.svgElement.setAttribute('points', this.path);
        this.pointsArray.push(new point(this.x0, this.y0, this));
        this.pointsArray[0].setPointAttribute('fill', "blue");
        this.line = new line(curX, curY, curX, curY, false);
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
            this.path += ", " + x + " " + y;
            this.pathPoints.push({
                x: x,
                y: y
            });
            this.svgElement.setAttribute('points', this.path);
            this.pointsArray.push(new point(x, y, this));
            this.line.remove();
            this.line = new line(x, y, curX, curY, false);
            this.line.setElementAttribute('stroke-opacity', "0.3");
            this.line.setElementAttribute('stroke', this.svgElement.getAttribute('stroke'));
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
    move(startX = this.start.x, startY = this.start.y) {
        let dx = curX - startX,
            dy = curY - startY;
        this.updatePositionAndPoints(dx, dy);
    }
    stopMove(startX = this.start.x, startY = this.start.y) {
        let dx = curX - startX,
            dy = curY - startY;
        this.x0 += dx;
        this.y0 += dy;
        for (let i = 0; i < this.pathPoints.length; i++) {
            this.pathPoints[i].x += dx;
            this.pathPoints[i].y += dy;
        }
        this.path = "";
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