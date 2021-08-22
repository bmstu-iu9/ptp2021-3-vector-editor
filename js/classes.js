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
            clone.frameArray[i] = this.frameArray[i].createClone(clone);
        }
        clone.strokeWidth = this.strokeWidth;
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
            if (!isSomeObjectSelected && !isSomePointSelected) {
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
                };
            }
        }).bind(this);
        this.svgElement.addEventListener("mousedown", startMoving);
        const stopMoving = ((current) => {
            if (this.isSelected && this.isMoving) {
                this.isMoving = false;
                updateCursorCoords(current);
                currentPointTypeAttr = null;
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
    startRotating() {}
    rotate() {}
    stopRotating() {}
    getNewCoords() {} //преобразование координат ключевых точек при повороте фигуры
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

        /*isSomeObjectSelected = true;
        if (currentObject != null) {
            currentObject.hideFrameAndPoints();   показывать рамку после создания объекта
            currentObject = null;
        }
        currentObject = this;
        this.isSelected = true;*/
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
        this.cPoint = {
            x: curX,
            y: curY
        }
        this.transform = 'rotate(' + 0 + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        this.frameArray = [new rectangleFrame(this.x, this.y, this.width, this.height, this.transform, this)];
        this.pointsArray = [new point(this.x, this.y, this, {
                action: "resize",
                attr: "ltc"
            }),
            new point(this.x + this.width / 2, this.y, this, {
                action: "resize",
                attr: "t"
            }),
            new point(this.x + this.width, this.y, this, {
                action: "resize",
                attr: "rtc"
            }),
            new point(this.x + this.width, this.y + this.height / 2, this, {
                action: "resize",
                attr: "r"
            }),
            new point(this.x + this.width, this.y + this.height, this, {
                action: "resize",
                attr: "rbc"
            }),
            new point(this.x + this.width / 2, this.y + this.height, this, {
                action: "resize",
                attr: "b"
            }),
            new point(this.x, this.y + this.height, this, {
                action: "resize",
                attr: "lbc"
            }),
            new point(this.x, this.y + this.height / 2, this, {
                action: "resize",
                attr: "l"
            }),
            new point(this.x + this.width / 2, this.y - 20, this, {
                action: "rotate",
                attr: "rotate"
            }),
        ];
        //rotate
        this.angle = 0;
        this.angleX = this.x;
        this.angleY = this.y;
    }
    createClone() {
        let clone = new rectangle();
        this.clone = clone;
        super.createClone();
        clone.width = this.width;
        clone.height = this.height;
        clone.x = this.x;
        clone.y = this.y;
        clone.cPoint = this.cPoint;
        clone.angle = this.angle;
        clone.angleX = this.angleX;
        clone.angleY = this.angleY;
        clone.svgElement.setAttribute('width', this.width);
        clone.svgElement.setAttribute('height', this.height);
        clone.svgElement.setAttribute('x', this.x);
        clone.svgElement.setAttribute('y', this.y);
        clone.svgElement.setAttribute('transform', this.transform);
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
        this.cPoint = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
        this.angleX = this.x;
        this.angleY = this.y;
        this.svgElement.setAttribute('width', this.width);
        this.svgElement.setAttribute('height', this.height);
        this.svgElement.setAttribute('x', this.x);
        this.svgElement.setAttribute('y', this.y);
        this.updateFrameAndPoints()
    }
    updateFrameAndPoints(width = this.width, height = this.height, x = this.x, y = this.y, angle = this.angle, angleX = this.angleX, angleY = this.angleY) {
        this.frameArray[0].update(angleX, angleY, width, height, this.transform);

        this.pointsArray[0].update(this.getNewCoords(x, y, angle).x, this.getNewCoords(x, y, angle).y);
        this.pointsArray[1].update(this.getNewCoords(x + width / 2, y, angle).x, this.getNewCoords(x + width / 2, y, angle).y);
        this.pointsArray[2].update(this.getNewCoords(x + width, y, angle).x, this.getNewCoords(x + width, y, angle).y);
        this.pointsArray[3].update(this.getNewCoords(x + width, y + height / 2, angle).x, this.getNewCoords(x + width, y + height / 2, angle).y);
        this.pointsArray[4].update(this.getNewCoords(x + width, y + height, angle).x, this.getNewCoords(x + width, y + height, angle).y);
        this.pointsArray[5].update(this.getNewCoords(x + width / 2, y + height, angle).x, this.getNewCoords(x + width / 2, y + height, angle).y);
        this.pointsArray[6].update(this.getNewCoords(x, y + height, angle).x, this.getNewCoords(x, y + height, angle).y);
        this.pointsArray[7].update(this.getNewCoords(x, y + height / 2, angle).x, this.getNewCoords(x, y + height / 2, angle).y);
        this.pointsArray[8].update(this.getNewCoords(x + width / 2, y - 20, angle).x, this.getNewCoords(x + width / 2, y - 20, angle).y);
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        let new_dx = getRotateCoords(dx, dy, this.angle).x,
            new_dy = getRotateCoords(dx, dy, this.angle).y;
        this.svgElement.setAttribute('x', this.angleX + new_dx);
        this.svgElement.setAttribute('y', this.angleY + new_dy);
        this.updateFrameAndPoints(this.width, this.height, this.x + new_dx, this.y + new_dy, this.angle, this.angleX + new_dx, this.angleY + new_dy);
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        let new_dx = getRotateCoords(dx, dy, this.angle).x,
            new_dy = getRotateCoords(dx, dy, this.angle).y;
        this.x += dx;
        this.y += dy;
        this.angleX += new_dx;
        this.angleY += new_dy;
        this.cPoint = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
    }
    moveTo(x, y) {
        let dx = x + pointRadius - this.x,
            dy = y + pointRadius - this.y;
        this.move(dx, dy);
        this.stopMoving(dx, dy);
    }
    resize() {
        /*let n = {
                x: this.x,
                y: this.y,
                height: this.height,
                width: this.width
            };
            switch (currentPointTypeAttr) {
                case "ltc":
                    n.width += this.x - curX;
                    n.height += this.y - curY;
                    n.x = curX;
                    n.y = curY;
                    break;
                case "t":
                    n.height += this.y - curY;
                    n.y = curY;
                    break;
                case "rtc":
                    n.width = curX - this.x;
                    n.height += this.y - curY;
                    n.y += curY - this.y;
                    break;
                case "r":
                    n.width = curX - this.x;
                    break;
                case "rbc":
                    n.width = curX - this.x;
                    n.height = curY - this.y;
                    break;
                case "b":
                    n.height = curY - this.y;
                    break;
                case "lbc":
                    n.width += this.x - curX;
                    n.height = curY - this.y;
                    n.x = curX;
                    break;
                case "l":
                    n.width += this.x - curX;
                    n.x = curX;
                    break;
            }
            if (n.width < 0) {
                n.width = 0;
                if (this.x + this.width < curX) n.x = this.x + this.width;
                switch (currentPointTypeAttr) {
                    case "ltc":
                        currentPointTypeAttr = "rtc";
                        break;
                    case "lbc":
                        currentPointTypeAttr = "rbc";
                        break;
                    case "rtc":
                        currentPointTypeAttr = "ltc";
                        break;
                    case "rbc":
                        currentPointTypeAttr = "lbc";
                        break;
                    case "l":
                        currentPointTypeAttr = "r";
                        break;
                    case "r":
                        currentPointTypeAttr = "l";
                        break;
                }
            }
            if (n.height < 0) {
                n.height = 0;
                if (this.y + this.height < curY) n.y = this.y + this.height;
                switch (currentPointTypeAttr) {
                    case "ltc":
                        currentPointTypeAttr = "lbc";
                        break;
                    case "lbc":
                        currentPointTypeAttr = "ltc";
                        break;
                    case "rtc":
                        currentPointTypeAttr = "rbc";
                        break;
                    case "rbc":
                        currentPointTypeAttr = "rtc";
                        break;
                    case "t":
                        currentPointTypeAttr = "b";
                        break;
                    case "b":
                        currentPointTypeAttr = "t";
                        break;
                }
            }
            this.x = n.x;
            this.y = n.y;
            this.width = n.width;
            this.height = n.height;
            this.svgElement.setAttribute('x', n.x);
            this.svgElement.setAttribute('y', n.y);
            this.svgElement.setAttribute('width', n.width);
            this.svgElement.setAttribute('height', n.height);
            this.updateFrameAndPoints();*/
    }
    startRotating() {
        this.rPoint = {
            x: this.getNewCoords(this.x + this.width / 2, this.y - 20, this.angle).x,
            y: this.getNewCoords(this.x + this.width / 2, this.y - 20, this.angle).y
        }
    }
    rotate(angle = this.angle) {
        let firstSide = Math.sqrt(Math.pow(Math.abs(this.rPoint.x - this.cPoint.x), 2) + Math.pow(Math.abs(this.rPoint.y - this.cPoint.y), 2)),
            secondSide = Math.sqrt(Math.pow(Math.abs(curX - this.cPoint.x), 2) + Math.pow(Math.abs(curY - this.cPoint.y), 2)),
            thirdSide = (Math.sqrt(Math.pow(Math.abs(curX - this.rPoint.x), 2) + Math.pow(Math.abs(curY - this.rPoint.y), 2))),
            angleCos = (Math.pow(firstSide, 2) + Math.pow(secondSide, 2) - Math.pow(thirdSide, 2)) / (2 * firstSide * secondSide),
            newAngle = getRotateCoords(curX, curY, angle).x >= getRotateCoords(this.cPoint.x, this.cPoint.y, angle).x ?
            Math.acos(angleCos) + angle : 2 * Math.PI - Math.acos(angleCos) + angle;
        if (this.svgElement.hasAttribute('transform')) {
            this.svgElement.removeAttribute('transform');
            this.svgElement.setAttribute('x', this.x);
            this.svgElement.setAttribute('y', this.y);
            this.angleX = this.x;
            this.angleY = this.y;
        }
        this.transform = 'rotate(' + newAngle * 180.0 / Math.PI + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        this.svgElement.setAttribute('transform', this.transform);
        this.updateFrameAndPoints(this.width, this.height, this.x, this.y, newAngle);
    }
    stopRotating() {
        let argss = this.transform.split('(')[1],
            args = argss.split(')')[0],
            newAngle = args.split(' ')[0] * Math.PI / 180.0;
        this.angle = newAngle;
        this.angle = this.angle > 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;
        this.updateFrameAndPoints();
    }
    getNewCoords(x = this.x, y = this.y, angle = this.angle) {
        return {
            x: (x - this.cPoint.x) * Math.cos(angle) - (y - this.cPoint.y) * Math.sin(angle) + this.cPoint.x,
            y: (x - this.cPoint.x) * Math.sin(angle) + (y - this.cPoint.y) * Math.cos(angle) + this.cPoint.y
        }
    }
}

//ELLIPSE
class ellipse extends object {
    constructor() {
        super('ellipse');
        this.rx = 0;
        this.ry = 0;
        this.cx = curX;
        this.cy = curY;
        this.transform = 'rotate(' + 0 + ' ' + this.cx + ' ' + this.cy + ')';
        this.frameArray = [new lineFrame(this.cx - this.rx, this.cy + this.ry, this.cx + this.rx, this.cy + this.ry, this, true),
            new lineFrame(this.cx + this.rx, this.cy + this.ry, this.cx + this.rx, this.cy - this.ry, this, true),
            new lineFrame(this.cx + this.rx, this.cy - this.ry, this.cx - this.rx, this.cy - this.ry, this, true),
            new lineFrame(this.cx - this.rx, this.cy - this.ry, this.cx - this.rx, this.cy + this.ry, this, true),
            new ellipseFrame(this.cx, this.cy, this.rx, this.ry, this.transform, this)
        ];
        this.pointsArray = [new point(this.cx - this.rx, this.cy - this.ry, this, {
                action: "resize",
                attr: "ltc"
            }),
            new point(this.cx, this.cy - this.ry, this, {
                action: "resize",
                attr: "t"
            }),
            new point(this.cx + this.rx, this.cy - this.ry, this, {
                action: "resize",
                attr: "rtc"
            }),
            new point(this.cx + this.rx, this.cy, this, {
                action: "resize",
                attr: "r"
            }),
            new point(this.cx + this.rx, this.cy + this.ry, this, {
                action: "resize",
                attr: "rbc"
            }),
            new point(this.cx, this.cy + this.ry, this, {
                action: "resize",
                attr: "b"
            }),
            new point(this.cx - this.rx, this.cy + this.ry, this, {
                action: "resize",
                attr: "lbc"
            }),
            new point(this.cx - this.rx, this.cy, this, {
                action: "resize",
                attr: "l"
            }),
            new point(this.cx, this.cy - this.ry - 20, this, {
                action: "rotate",
                attr: "rotate"
            })
        ];
        //rotate
        this.angleCx = 0;
        this.angleCy = 0;
        this.angle = 0;
    }
    createClone() {
        let clone = new ellipse();
        this.clone = clone;
        super.createClone();
        clone.rx = this.rx;
        clone.ry = this.ry;
        clone.cx = this.cx;
        clone.cy = this.cy;
        clone.angleCx = this.angleCx;
        clone.angleCy = this.angleCy;
        clone.angle = this.angle;
        clone.svgElement.setAttribute('rx', this.rx);
        clone.svgElement.setAttribute('ry', this.ry);
        clone.svgElement.setAttribute('cx', this.cx);
        clone.svgElement.setAttribute('cy', this.cy);
        clone.svgElement.setAttribute('transform', this.transform);
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
        this.angleCx = this.cx;
        this.angleCy = this.cy;
        this.svgElement.setAttribute('rx', this.rx);
        this.svgElement.setAttribute('ry', this.ry);
        this.svgElement.setAttribute('cx', this.cx);
        this.svgElement.setAttribute('cy', this.cy);
        this.updateFrameAndPoints();
    }
    updateFrameAndPoints(rx = this.rx, ry = this.ry, cx = this.cx, cy = this.cy, angle = this.angle, angleCx = this.angleCx, angleCy = this.angleCy) {
        this.frameArray[0].update(this.getNewCoords(cx - rx, cy + ry, angle).x, this.getNewCoords(cx - rx, cy + ry, angle).y,
            this.getNewCoords(cx + rx, cy + ry, angle).x, this.getNewCoords(cx + rx, cy + ry, angle).y);
        this.frameArray[1].update(this.getNewCoords(cx + rx, cy + ry, angle).x, this.getNewCoords(cx + rx, cy + ry, angle).y,
            this.getNewCoords(cx + rx, cy - ry, angle).x, this.getNewCoords(cx + rx, cy - ry, angle).y);
        this.frameArray[2].update(this.getNewCoords(cx + rx, cy - ry, angle).x, this.getNewCoords(cx + rx, cy - ry, angle).y,
            this.getNewCoords(cx - rx, cy - ry, angle).x, this.getNewCoords(cx - rx, cy - ry, angle).y);
        this.frameArray[3].update(this.getNewCoords(cx - rx, cy - ry, angle).x, this.getNewCoords(cx - rx, cy - ry, angle).y,
            this.getNewCoords(cx - rx, cy + ry, angle).x, this.getNewCoords(cx - rx, cy + ry, angle).y);
        this.frameArray[4].update(angleCx, angleCy, rx, ry, this.transform);

        this.pointsArray[0].update(this.getNewCoords(cx - rx, cy - ry, angle).x, this.getNewCoords(cx - rx, cy - ry, angle).y);
        this.pointsArray[1].update(this.getNewCoords(cx, cy - ry, angle).x, this.getNewCoords(cx, cy - ry, angle).y);
        this.pointsArray[2].update(this.getNewCoords(cx + rx, cy - ry, angle).x, this.getNewCoords(cx + rx, cy - ry, angle).y);
        this.pointsArray[3].update(this.getNewCoords(cx + rx, cy, angle).x, this.getNewCoords(cx + rx, cy, angle).y);
        this.pointsArray[4].update(this.getNewCoords(cx + rx, cy + ry, angle).x, this.getNewCoords(cx + rx, cy + ry, angle).y);
        this.pointsArray[5].update(this.getNewCoords(cx, cy + ry, angle).x, this.getNewCoords(cx, cy + ry, angle).y);
        this.pointsArray[6].update(this.getNewCoords(cx - rx, cy + ry, angle).x, this.getNewCoords(cx - rx, cy + ry, angle).y);
        this.pointsArray[7].update(this.getNewCoords(cx - rx, cy, angle).x, this.getNewCoords(cx - rx, cy, angle).y);
        this.pointsArray[8].update(this.getNewCoords(cx, cy - ry - 20, angle).x, this.getNewCoords(cx, cy - ry - 20, angle).y);
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        let new_dx = getRotateCoords(dx, dy, this.angle).x,
            new_dy = getRotateCoords(dx, dy, this.angle).y;
        this.svgElement.setAttribute('cx', this.angleCx + new_dx);
        this.svgElement.setAttribute('cy', this.angleCy + new_dy);
        this.updateFrameAndPoints(this.rx, this.ry, this.cx + new_dx, this.cy + new_dy, this.angle, this.angleCx + new_dx, this.angleCy + new_dy);
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        let new_dx = getRotateCoords(dx, dy, this.angle).x,
            new_dy = getRotateCoords(dx, dy, this.angle).y;
        this.cx += dx;
        this.cy += dy;
        this.angleCx += new_dx;
        this.angleCy += new_dy;
    }
    moveTo(x, y) {
        let dx = x + pointRadius - (this.cx - this.rx),
            dy = y + pointRadius - (this.cy - this.ry);
        this.move(dx, dy);
        this.stopMoving(dx, dy);
    }
    resize() {
        /*let n = {
            cx: this.cx,
            cy: this.cy,
            rx: this.rx,
            ry: this.ry
        };
        switch (currentPointTypeAttr) {
            case "ltc":
                n.rx = (this.cx + this.rx - curX) / 2;
                n.ry = (this.cy + this.ry - curY) / 2;
                n.cx = curX + n.rx;
                n.cy = curY + n.ry;
                break;
            case "t":
                n.ry = (this.cy + this.ry - curY) / 2;
                n.cy = curY + n.ry;
                break;
            case "rtc":
                n.rx += (curX - (this.cx + this.rx)) / 2;
                n.ry += (this.cy - this.ry - curY) / 2;
                n.cx = curX - n.rx;
                n.cy = curY + n.ry;
                break;
            case "r":
                n.rx += (curX - (this.cx + this.rx)) / 2;
                n.cx = curX - n.rx;
                break;
            case "rbc":
                n.rx += (curX - (this.cx + this.rx)) / 2;
                n.ry += (curY - (this.cy + this.ry)) / 2;
                n.cx = curX - n.rx;
                n.cy = curY - n.ry;
                break;
            case "b":
                n.ry += (curY - (this.cy + this.ry)) / 2;
                n.cy = curY - n.ry;
                break;
            case "lbc":
                n.rx = (this.cx + this.rx - curX) / 2;
                n.ry += (curY - (this.cy + this.ry)) / 2;
                n.cx = curX + n.rx;
                n.cy = curY - n.ry;
                break;
            case "l":
                n.rx = (this.cx + this.rx - curX) / 2;
                n.cx = curX + n.rx;
                break;
        }
        if (n.rx < 0) {
            n.rx = 0;
            if (this.cx + this.rx < curX) {
                n.cx = this.cx + 2 * this.rx;
                n.rx = this.rx;
            }
            if (this.cx + this.rx > curX) {
                n.cx = this.cx - 2 * this.rx;
                n.rx = this.rx;
            }
            switch (currentPointTypeAttr) {
                case "ltc":
                    currentPointTypeAttr = "rtc";
                    break;
                case "lbc":
                    currentPointTypeAttr = "rbc";
                    break;
                case "rtc":
                    currentPointTypeAttr = "ltc";
                    break;
                case "rbc":
                    currentPointTypeAttr = "lbc";
                    break;
                case "l":
                    currentPointTypeAttr = "r";
                    break;
                case "r":
                    currentPointTypeAttr = "l";
                    break;
            }
        }
        if (n.ry < 0) {
            n.ry = 0;
            if (this.cy + this.ry < curY) {
                n.cy = this.cy + 2 * this.ry;
                n.ry = this.ry;
            }
            if (this.cy + this.ry > curY) {
                n.cy = this.cy - 2 * this.ry;
                n.ry = this.ry;
            }
            switch (currentPointTypeAttr) {
                case "ltc":
                    currentPointTypeAttr = "lbc";
                    break;
                case "lbc":
                    currentPointTypeAttr = "ltc";
                    break;
                case "rtc":
                    currentPointTypeAttr = "rbc";
                    break;
                case "rbc":
                    currentPointTypeAttr = "rtc";
                    break;
                case "t":
                    currentPointTypeAttr = "b";
                    break;
                case "b":
                    currentPointTypeAttr = "t";
                    break;
            }
        }
        this.cx = n.cx;
        this.cy = n.cy;
        this.rx = n.rx;
        this.ry = n.ry;
        this.svgElement.setAttribute('cx', n.cx);
        this.svgElement.setAttribute('cy', n.cy);
        this.svgElement.setAttribute('rx', n.rx);
        this.svgElement.setAttribute('ry', n.ry);
        this.updateFrameAndPoints();*/
    }
    startRotating() {
        this.rPoint = {
            x: this.getNewCoords(this.cx, this.cy - this.ry - 20, this.angle).x,
            y: this.getNewCoords(this.cx, this.cy - this.ry - 20, this.angle).y
        }
    }
    rotate(angle = this.angle) {
        let firstSide = Math.sqrt(Math.pow(Math.abs(this.rPoint.x - this.cx), 2) + Math.pow(Math.abs(this.rPoint.y - this.cy), 2)),
            secondSide = Math.sqrt(Math.pow(Math.abs(curX - this.cx), 2) + Math.pow(Math.abs(curY - this.cy), 2)),
            thirdSide = (Math.sqrt(Math.pow(Math.abs(curX - this.rPoint.x), 2) + Math.pow(Math.abs(curY - this.rPoint.y), 2))),
            angleCos = (Math.pow(firstSide, 2) + Math.pow(secondSide, 2) - Math.pow(thirdSide, 2)) / (2 * firstSide * secondSide),
            newAngle = getRotateCoords(curX, curY, angle).x >= getRotateCoords(this.cx, this.cy, angle).x ?
            Math.acos(angleCos) + angle : 2 * Math.PI - Math.acos(angleCos) + angle;
        if (this.svgElement.hasAttribute('transform')) {
            this.svgElement.removeAttribute('transform');
            this.svgElement.setAttribute('cx', this.cx);
            this.svgElement.setAttribute('cy', this.cy);
            this.angleCx = this.cx;
            this.angleCy = this.cy;
        }
        this.transform = 'rotate(' + newAngle * 180.0 / Math.PI + ' ' + this.cx + ' ' + this.cy + ')';
        this.svgElement.setAttribute('transform', this.transform);
        this.updateFrameAndPoints(this.rx, this.ry, this.cx, this.dy, newAngle);
    }
    stopRotating() {
        let argss = this.transform.split('(')[1],
            args = argss.split(')')[0],
            newAngle = args.split(' ')[0] * Math.PI / 180.0;
        this.angle = newAngle;
        this.angle = this.angle > 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;
        this.updateFrameAndPoints();
    }
    getNewCoords(x = this.x0, y = this.y0, angle = this.angle) {
        return {
            x: (x - this.cx) * Math.cos(angle) - (y - this.cy) * Math.sin(angle) + this.cx,
            y: (x - this.cx) * Math.sin(angle) + (y - this.cy) * Math.cos(angle) + this.cy
        }
    }
}

//POLYGON
class polygon extends object {
    constructor() {
        super('polygon');
        this.r = 0;
        this.phi = 0;
        this.vertNum = curVertNum;
        this.vertices = "";
        this.rotationIsFixed = false;
        this.angleIsFixed = false;
        this.radiusIsFixed = false;
        this.fix = this.fix.bind(this);
        this.free = this.free.bind(this);
        this.updateVertNum = this.updateVertNum.bind(this);
        this.addHotKeys();
        this.frameArray = [new polygonFrame(this.vertices, this)]
    }
    createClone() {
        let clone = new polygon();
        this.clone = clone;
        super.createClone();
        clone.r = this.r;
        clone.phi = this.phi;
        clone.vertNum = this.vertNum;
        clone.vertices = this.vertices;
        clone.svgElement.setAttribute('points', this.vertices);
        return clone;
    }
    updateAttributes() {
        let dx = curX - this.x0,
            dy = curY - this.y0;
        if (!this.radiusIsFixed) this.r = Math.sqrt(dx ** 2 + dy ** 2);
        else if (dx != 0 && dy != 0) {
            dx *= this.r / Math.sqrt(dx ** 2 + dy ** 2);
            dy *= this.r / Math.sqrt(dx ** 2 + dy ** 2);
        }
        if (!this.angleIsFixed) {
            if (this.rotationIsFixed) this.phi = (this.vertNum - 2) * Math.PI / (this.vertNum * 2);
            else if (this.r > 0) this.phi = dy > 0 ? Math.acos(dx / this.r) : -Math.acos(dx / this.r);
        }
        this.updateFrameAndPoints();
    }
    updateFrameAndPoints(x0 = this.x0, y0 = this.y0) {
        //включает обновление атрибута
        let firstX, firstY;
        for (let i = 0; i < this.vertNum; i++) {
            let x = x0 + this.r * Math.cos(this.phi + 2 * Math.PI * i / this.vertNum);
            let y = y0 + this.r * Math.sin(this.phi + 2 * Math.PI * i / this.vertNum);
            if (i == 0) {
                this.vertices = x + " " + y;
                firstX = x;
                firstY = y;
            } else {
                this.vertices += ", " + x + " " + y;
            }
        }
        this.vertices += ", " + firstX + " " + firstY;
        this.frameArray[0].update(this.vertices);

        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].remove();
        }
        this.pointsArray = [];
        for (let i = 0; i < this.vertNum; i++) {
            let x = x0 + this.r * Math.cos(this.phi + 2 * Math.PI * i / this.vertNum);
            let y = y0 + this.r * Math.sin(this.phi + 2 * Math.PI * i / this.vertNum);
            this.pointsArray.push(new point(x, y, this, {
                action: "polygon"
            }));
        }
        this.svgElement.setAttribute('points', this.vertices);
    }
    addHotKeys() {
        document.addEventListener('keydown', this.updateVertNum);
        document.addEventListener('keydown', this.fix);
        document.addEventListener('keyup', this.free);
    }
    removeHotKeys() {
        document.removeEventListener('keydown', this.updateVertNum);
        this.rotationIsFixed = false;
        this.angleIsFixed = false;
        this.radiusIsFixed = false;
        document.removeEventListener('keydown', this.fix);
        document.removeEventListener('keyup', this.free);
    }
    updateVertNum(current) {
        if (current.code == 'ArrowUp') {
            curVertNum++;
            this.vertNum++;
        }
        if (current.code == 'ArrowDown' && curVertNum > 3) {
            curVertNum--;
            this.vertNum--;
        }
        this.updateAttributes();
    }
    fix(event) {
        event.preventDefault();
        if (event.shiftKey) {
            this.rotationIsFixed = true;
            this.updateAttributes();
        }
        if (event.altKey) {
            this.angleIsFixed = true;
            this.updateAttributes();
        }
        if (event.ctrlKey) {
            this.radiusIsFixed = true;
            this.updateAttributes();
        }
    }
    free(event) {
        if (event.key == 'Shift') {
            this.rotationIsFixed = false;
            this.updateAttributes();
        }
        if (event.key == "Alt") {
            this.angleIsFixed = false;
            this.updateAttributes();
        }
        if (event.key == 'Control') {
            this.radiusIsFixed = false;
            this.updateAttributes();
        }
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.updateFrameAndPoints(this.x0 + dx, this.y0 + dy);
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
    resize() {
        this.updateAttributes();
    }
}

//PENCIL
class pencil extends object {
    constructor() {
        super('polyline');
        this.type = 'pencil';
        this.path = this.x0 + " " + this.y0;
        this.pathCoords = [];
        this.svgElement.setAttribute('fill', "none");
        this.svgElement.setAttribute('points', this.path);
        this.minX = this.x0;
        this.minY = this.y0;
        this.maxX = this.x0;
        this.maxY = this.y0;
        this.cPoint = {
            x: this.minX + (this.maxX - this.minX) / 2,
            y: this.minY + (this.maxY - this.minY) / 2
        }
        this.angle = 0;
        this.newAngle = 0; //для посчёта нового угла вращения
        this.svgElement.setAttribute('stroke-linejoin', "round");
        this.svgElement.setAttribute('stroke-linecap', "round");
    }
    createClone() {
        let clone = new pencil();
        this.clone = clone;
        super.createClone();
        clone.minX = this.minX;
        clone.minY = this.minY;
        clone.maxX = this.maxX;
        clone.maxY = this.maxY;
        clone.cPoint = this.cPoint;
        clone.angle = this.angle;
        clone.newAngle = this.newAngle;
        clone.svgElement.setAttribute('fill', "none");
        clone.path = "";
        clone.pathCoords = [];
        for (let i = 0; i < this.pathCoords.length; i++) {
            clone.pathCoords[i] = {
                x: 0,
                y: 0
            }
            clone.pathCoords[i].x = this.pathCoords[i].x;
            clone.pathCoords[i].y = this.pathCoords[i].y;
        }
        clone.svgElement.setAttribute('points', this.path);
        return clone;
    }
    updateAttributes() {
        this.path += ", " + curX + " " + curY;
        this.pathCoords.push({
            x: curX,
            y: curY
        });
        this.svgElement.setAttribute('points', this.path);
        this.minX = Math.min(this.minX, curX);
        this.minY = Math.min(this.minY, curY);
        this.maxX = Math.max(this.maxX, curX);
        this.maxY = Math.max(this.maxY, curY);
        this.minAngleX = this.minX;
        this.maxAngleX = this.maxX;
        this.minAngleY = this.minY;
        this.maxAngleY = this.maxY;
        this.cPoint = {
            x: this.minX + (this.maxX - this.minX) / 2,
            y: this.minY + (this.maxY - this.minY) / 2
        }
    }
    updateFrameAndPoints(dx = 0, dy = 0, minX = this.minX, minY = this.minY, maxX = this.maxX, maxY = this.maxY, angle = this.angle) {
        //включает обновление атрибута
        let newX0 = this.getNewCoords(this.x0 + dx, this.y0 + dy, angle).x,
            newY0 = this.getNewCoords(this.x0 + dx, this.y0 + dy, angle).y;
        this.path = newX0 + " " + newY0;
        for (let i = 0; i < this.pathCoords.length; i++) {
            let newX = this.getNewCoords(this.pathCoords[i].x + dx, this.pathCoords[i].y + dy, angle).x,
                newY = this.getNewCoords(this.pathCoords[i].x + dx, this.pathCoords[i].y + dy, angle).y
            this.path += ", " + newX + " " + newY;
        }
        this.svgElement.setAttribute('points', this.path);

        this.frameArray[0].update(this.getNewCoords(minX, maxY, angle).x, this.getNewCoords(minX, maxY, angle).y,
            this.getNewCoords(maxX, maxY, angle).x, this.getNewCoords(maxX, maxY, angle).y);
        this.frameArray[1].update(this.getNewCoords(maxX, maxY, angle).x, this.getNewCoords(maxX, maxY, angle).y,
            this.getNewCoords(maxX, minY, angle).x, this.getNewCoords(maxX, minY, angle).y);
        this.frameArray[2].update(this.getNewCoords(maxX, minY, angle).x, this.getNewCoords(maxX, minY, angle).y,
            this.getNewCoords(minX, minY, angle).x, this.getNewCoords(minX, minY, angle).y);
        this.frameArray[3].update(this.getNewCoords(minX, minY, angle).x, this.getNewCoords(minX, minY, angle).y,
            this.getNewCoords(minX, maxY, angle).x, this.getNewCoords(minX, maxY, angle).y);
        this.frameArray[4].update(this.path);
        this.pointsArray[0].update(this.getNewCoords(minX + (maxX - minX) / 2, minY + (maxY - minY) / 2, angle).x,
            this.getNewCoords(minX + (maxX - minX) / 2, minY + (maxY - minY) / 2, angle).y);
        this.pointsArray[1].update(this.getNewCoords(minX + (maxX - minX) / 2, minY - 20, angle).x,
            this.getNewCoords(minX + (maxX - minX) / 2, minY - 20, angle).y);
        this.path = "";
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.updateFrameAndPoints(getRotateCoords(dx, dy, this.angle).x, getRotateCoords(dx, dy, this.angle).y,
            this.minX + getRotateCoords(dx, dy, this.angle).x,
            this.minY + getRotateCoords(dx, dy, this.angle).y,
            this.maxX + getRotateCoords(dx, dy, this.angle).x,
            this.maxY + getRotateCoords(dx, dy, this.angle).y,
            this.angle
        );
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.x0 += dx;
        this.y0 += dy;
        this.minX += dx;
        this.minY += dy;
        this.maxX += dx;
        this.maxY += dy;
        this.cPoint = {
            x: this.minX + (this.maxX - this.minX) / 2,
            y: this.minY + (this.maxY - this.minY) / 2
        }
        for (let i = 0; i < this.pathCoords.length; i++) {
            this.pathCoords[i].x += dx;
            this.pathCoords[i].y += dy;
        }
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
    startRotating() {
        this.rPoint = {
            x: this.getNewCoords(this.minX + (this.maxX - this.minX) / 2, this.minY - 20, this.angle).x,
            y: this.getNewCoords(this.minX + (this.maxX - this.minX) / 2, this.minY - 20, this.angle).y,
        }
    }
    rotate(angle = this.angle) {
        let firstSide = Math.sqrt(Math.pow(Math.abs(this.rPoint.x - this.cPoint.x), 2) + Math.pow(Math.abs(this.rPoint.y - this.cPoint.y), 2)),
            secondSide = Math.sqrt(Math.pow(Math.abs(curX - this.cPoint.x), 2) + Math.pow(Math.abs(curY - this.cPoint.y), 2)),
            thirdSide = (Math.sqrt(Math.pow(Math.abs(curX - this.rPoint.x), 2) + Math.pow(Math.abs(curY - this.rPoint.y), 2))),
            angleCos = (Math.pow(firstSide, 2) + Math.pow(secondSide, 2) - Math.pow(thirdSide, 2)) / (2 * firstSide * secondSide);
        this.newAngle = getRotateCoords(curX, curY, angle).x >= getRotateCoords(this.cPoint.x, this.cPoint.y, angle).x ?
            Math.acos(angleCos) + angle : 2 * Math.PI - Math.acos(angleCos) + angle;
        this.updateFrameAndPoints(0, 0, this.minX, this.minY, this.maxX, this.maxY, this.newAngle);
    }
    stopRotating() {
        this.angle = this.newAngle;
        this.angle = this.angle > 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;
        this.updateFrameAndPoints();
    }
    getNewCoords(x = this.x0, y = this.y0, angle = this.angle) {
        return {
            x: (x - this.cPoint.x) * Math.cos(angle) - (y - this.cPoint.y) * Math.sin(angle) + this.cPoint.x,
            y: (x - this.cPoint.x) * Math.sin(angle) + (y - this.cPoint.y) * Math.cos(angle) + this.cPoint.y
        }
    }
    complete() {
        this.frameArray = [new lineFrame(this.minX, this.maxY, this.maxX, this.maxY, this, true),
            new lineFrame(this.maxX, this.maxY, this.maxX, this.minY, this, true),
            new lineFrame(this.maxX, this.minY, this.minX, this.minY, this, true),
            new lineFrame(this.minX, this.minY, this.minX, this.maxY, this, true),
            new polylineFrame(this.path, this)
        ];
        this.pointsArray = [new point(this.minX + (this.maxX - this.minX) / 2, this.minY + (this.maxY - this.minY) / 2, this, {
                action: "move",
                attr: "move"
            }),
            new point(this.minX + (this.maxX - this.minX) / 2, this.minY - 20, this, {
                action: "rotate",
                attr: "rotate"
            })
        ];
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
        this.cPoint = {
            x: curX,
            y: curY
        };
        this.transform = 'rotate(' + 0 + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        if (!isFree) {
            this.svgElement.setAttribute('stroke', "black");
            this.svgElement.setAttribute('stroke-opacity', "0.5");
            this.svgElement.setAttribute('stroke-width', "2");
            this.svgElement.setAttribute('stroke-dasharray', "8");
        } else {
            this.frameArray = [new lineFrame(this.x0, this.y0, this.x2, this.y0, this, true),
                new lineFrame(this.x2, this.y0, this.x2, this.y2, this, true),
                new lineFrame(this.x2, this.y2, this.x0, this.y2, this, true),
                new lineFrame(this.x0, this.y2, this.x0, this.y0, this, true),
                new lineFrame(this.x0, this.y0, this.x2, this.y2, this),
                new lineFrame((this.x0 + this.x2) / 2, (this.y0 + this.y2) / 2,
                    (this.x0 + this.x2) / 2, (this.y0 + this.y2) / 2 - 25, this, true)
            ]
            this.pointsArray = [new point(this.x0, this.y0, this, {
                    action: "resize",
                    attr: "ltc"
                }),
                new point(this.x0 + (this.x2 - this.x0) / 2, this.y0, this, {
                    action: "resize",
                    attr: "t"
                }),
                new point(this.x2, this.y0, this, {
                    action: "resize",
                    attr: "rtc"
                }),
                new point(this.x2, this.y0 + (this.y2 - this.y0) / 2, this, {
                    action: "resize",
                    attr: "r"
                }),
                new point(this.x2, this.y2, this, {
                    action: "resize",
                    attr: "rbc"
                }),
                new point(this.x0 + (this.x2 - this.x0) / 2, this.y2, this, {
                    action: "resize",
                    attr: "b"
                }),
                new point(this.x0, this.y2, this, {
                    action: "resize",
                    attr: "lbc"
                }),
                new point(this.x0, this.y0 + (this.y2 - this.y0) / 2, this, {
                    action: "resize",
                    attr: "l"
                }),
                new point(this.x0 + (this.x2 - this.x0) / 2, this.y0 + (this.y2 - this.y0) / 2, this, {
                    action: "move",
                    attr: "move"
                }),
                new point(this.x0 + (this.x2 - this.x0) / 2, this.y0 + (this.y2 - this.y0) / 2 - 20, this, {
                    action: "rotate",
                    attr: "rotate"
                }),
            ];
        }
        //rotate 
        this.angle = 0;
        this.angleX0 = this.x0;
        this.angleX2 = this.x2;
        this.angleY0 = this.y0;
        this.angleY2 = this.y2;
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
        clone.cPoint = this.cPoint;
        clone.angle = this.angle;
        clone.angleX0 = this.angleX0;
        clone.angleX2 = this.angleX2;
        clone.angleY0 = this.angleY0;
        clone.angleY2 = this.angleY2;
        clone.svgElement.setAttribute('width', this.x0);
        clone.svgElement.setAttribute('height', this.y0);
        clone.svgElement.setAttribute('x', this.x2);
        clone.svgElement.setAttribute('y', this.y2);
        clone.svgElement.setAttribute('fill', "none");
        clone.svgElement.setAttribute('transform', this.transform);
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
        this.cPoint = {
            x: (this.x0 + this.x2) / 2,
            y: (this.y0 + this.y2) / 2
        };
        this.svgElement.setAttribute('x2', this.x2);
        this.svgElement.setAttribute('y2', this.y2);
        if (this.isFree) {
            this.updateFrameAndPoints(this.x0, this.y0, this.x2, this.y2, 0);
        }
        this.angleX2 = this.x2;
        this.angleY2 = this.y2;
    }
    updateFrameAndPoints(x0 = this.x0, y0 = this.y0, x2 = this.x2, y2 = this.y2, angle = this.angle) {
        this.frameArray[0].update(this.getNewCoords(x0, y0, angle).x, this.getNewCoords(x0, y0, angle).y,
            this.getNewCoords(x2, y0, angle).x, this.getNewCoords(x2, y0, angle).y);
        this.frameArray[1].update(this.getNewCoords(x2, y0, angle).x, this.getNewCoords(x2, y0, angle).y,
            this.getNewCoords(x2, y2, angle).x, this.getNewCoords(x2, y2, angle).y);
        this.frameArray[2].update(this.getNewCoords(x2, y2, angle).x, this.getNewCoords(x2, y2, angle).y,
            this.getNewCoords(x0, y2, angle).x, this.getNewCoords(x0, y2, angle).y);
        this.frameArray[3].update(this.getNewCoords(x0, y2, angle).x, this.getNewCoords(x0, y2, angle).y,
            this.getNewCoords(x0, y0, angle).x, this.getNewCoords(x0, y0, angle).y);
        this.frameArray[4].update(this.getNewCoords(x0, y0, angle).x, this.getNewCoords(x0, y0, angle).y,
            this.getNewCoords(x2, y2, angle).x, this.getNewCoords(x2, y2, angle).y);
        this.frameArray[5].update(this.getNewCoords((x0 + x2) / 2, (y0 + y2) / 2, angle).x,
            this.getNewCoords((x0 + x2) / 2, (y0 + y2) / 2, angle).y,
            this.getNewCoords((x0 + x2) / 2, (y0 + y2) / 2 - 25, angle).x,
            this.getNewCoords((x0 + x2) / 2, (y0 + y2) / 2 - 25, angle).y);

        this.pointsArray[0].update(this.getNewCoords(x0, y0, angle).x, this.getNewCoords(x0, y0, angle).y);
        this.pointsArray[1].update(this.getNewCoords(x0 + (x2 - x0) / 2, y0, angle).x,
            this.getNewCoords(x0 + (x2 - x0) / 2, y0, angle).y);
        this.pointsArray[2].update(this.getNewCoords(x2, y0, angle).x, this.getNewCoords(x2, y0, angle).y);
        this.pointsArray[3].update(this.getNewCoords(x2, y0 + (y2 - y0) / 2, angle).x,
            this.getNewCoords(x2, y0 + (y2 - y0) / 2, angle).y);
        this.pointsArray[4].update(this.getNewCoords(x2, y2, angle).x, this.getNewCoords(x2, y2, angle).y);
        this.pointsArray[5].update(this.getNewCoords(x0 + (x2 - x0) / 2, y2, angle).x,
            this.getNewCoords(x0 + (x2 - x0) / 2, y2, angle).y);
        this.pointsArray[6].update(this.getNewCoords(x0, y2, angle).x, this.getNewCoords(x0, y2, angle).y);
        this.pointsArray[7].update(this.getNewCoords(x0, y0 + (y2 - y0) / 2, angle).x,
            this.getNewCoords(x0, y0 + (y2 - y0) / 2, angle).y);
        this.pointsArray[8].update(this.getNewCoords(x0 + (x2 - x0) / 2, y0 + (y2 - y0) / 2, angle).x,
            this.getNewCoords(x0 + (x2 - x0) / 2, y0 + (y2 - y0) / 2, angle).y);
        this.pointsArray[9].update(this.getNewCoords(x0 + (x2 - x0) / 2, y0 + (y2 - y0) / 2 - 20, angle).x,
            this.getNewCoords(x0 + (x2 - x0) / 2, y0 + (y2 - y0) / 2 - 20, angle).y);
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        let new_dx = getRotateCoords(dx, dy, this.angle).x,
            new_dy = getRotateCoords(dx, dy, this.angle).y;
        this.svgElement.setAttribute('x1', this.angleX0 + new_dx);
        this.svgElement.setAttribute('y1', this.angleY0 + new_dy);
        this.svgElement.setAttribute('x2', this.angleX2 + new_dx);
        this.svgElement.setAttribute('y2', this.angleY2 + new_dy);
        this.updateFrameAndPoints(this.x0 + new_dx,
            this.y0 + new_dy,
            this.x2 + new_dx,
            this.y2 + new_dy,
            this.angle
        );
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        let new_dx = getRotateCoords(dx, dy, this.angle).x,
            new_dy = getRotateCoords(dx, dy, this.angle).y;
        this.x0 += dx;
        this.y0 += dy;
        this.x2 += dx;
        this.y2 += dy;
        this.angleX0 += new_dx;
        this.angleY0 += new_dy;
        this.angleX2 += new_dx;
        this.angleY2 += new_dy;
        this.cPoint = {
            x: (this.x0 + this.x2) / 2,
            y: (this.y0 + this.y2) / 2
        };
    }
    moveTo(x, y) {
        let dx = x + pointRadius - Math.min(this.x0, this.x2),
            dy = y + pointRadius - Math.min(this.y0, this.y2);
        this.move(dx, dy);
        this.stopMoving(dx, dy);
    }
    resize() {
        /*switch (currentPointTypeAttr) {
            case "1":
                this.x0 = curX;
                this.y0 = curY;
                break;
            case "2":
                this.x2 = curX;
                this.y2 = curY;
                break;
        }
        this.svgElement.setAttribute('x1', this.x0);
        this.svgElement.setAttribute('y1', this.y0);
        this.svgElement.setAttribute('x2', this.x2);
        this.svgElement.setAttribute('y2', this.y2);
        this.updateFrameAndPoints();*/
    }
    startRotating() {
        this.rPoint = {
            x: this.getNewCoords(this.x0 + (this.x2 - this.x0) / 2, this.y0 + (this.y2 - this.y0) / 2 - 20, this.angle).x,
            y: this.getNewCoords(this.x0 + (this.x2 - this.x0) / 2, this.y0 + (this.y2 - this.y0) / 2 - 20, this.angle).y
        }
    }
    rotate(angle = this.angle) {
        let firstSide = Math.sqrt(Math.pow(Math.abs(this.rPoint.x - this.cPoint.x), 2) + Math.pow(Math.abs(this.rPoint.y - this.cPoint.y), 2)),
            secondSide = Math.sqrt(Math.pow(Math.abs(curX - this.cPoint.x), 2) + Math.pow(Math.abs(curY - this.cPoint.y), 2)),
            thirdSide = (Math.sqrt(Math.pow(Math.abs(curX - this.rPoint.x), 2) + Math.pow(Math.abs(curY - this.rPoint.y), 2))),
            angleCos = (Math.pow(firstSide, 2) + Math.pow(secondSide, 2) - Math.pow(thirdSide, 2)) / (2 * firstSide * secondSide),
            newAngle = getRotateCoords(curX, curY, angle).x >= getRotateCoords(this.cPoint.x, this.cPoint.y, angle).x ?
            Math.acos(angleCos) + angle : 2 * Math.PI - Math.acos(angleCos) + angle;
        if (this.svgElement.hasAttribute('transform')) {
            this.svgElement.removeAttribute('transform');
            this.svgElement.setAttribute('x1', this.x0);
            this.svgElement.setAttribute('y1', this.y0);
            this.svgElement.setAttribute('x2', this.x2);
            this.svgElement.setAttribute('y2', this.y2);
            this.angleX0 = this.x0;
            this.angleY0 = this.y0;
            this.angleX2 = this.x2;
            this.angleY2 = this.y2;
        }
        this.transform = 'rotate(' + newAngle * 180.0 / Math.PI + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        this.svgElement.setAttribute('transform', this.transform);
        this.updateFrameAndPoints(this.x0, this.y0, this.x2, this.y2, newAngle);
    }
    stopRotating() {
        let argss = this.transform.split('(')[1],
            args = argss.split(')')[0],
            newAngle = args.split(' ')[0] * Math.PI / 180.0;
        this.angle = newAngle;
        this.angle = this.angle > 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;
        this.updateFrameAndPoints();
    }
    getNewCoords(x = this.x0, y = this.y0, angle = this.angle) {
        return {
            x: (x - this.cPoint.x) * Math.cos(angle) - (y - this.cPoint.y) * Math.sin(angle) + this.cPoint.x,
            y: (x - this.cPoint.x) * Math.sin(angle) + (y - this.cPoint.y) * Math.cos(angle) + this.cPoint.y
        }
    }
}

//POLYLINE
class polyline extends object {
    constructor() {
        super('polyline');
        this.path = this.x0 + " " + this.y0;
        this.pathCoords = [{
            x: this.x0,
            y: this.y0
        }];
        this.svgElement.setAttribute('points', this.path);
        this.pointsArray.push(new point(this.x0, this.y0, this, {
            action: "polyline",
            attr: 0
        }));
        this.pointsArray[0].setPointAttribute('fill', "blue");
        this.line = new line(curX, curY, curX, curY, false);
        this.minX = this.x0;
        this.minY = this.y0;
        this.maxX = this.x0;
        this.maxY = this.y0;
        this.cPoint = {
            x: this.minX + (this.maxX - this.minX) / 2,
            y: this.minY + (this.maxY - this.minY) / 2
        };
        this.angle = 0;
        this.newAngle = 0;
        this.frameArray = [new polylineFrame(this.path, this)];
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
        clone.cPoint = this.cPoint;
        clone.angle = this.angle;
        clone.newAngle = this.newAngle;
        clone.path = "";
        clone.pathCoords = [];
        for (let i = 0; i < this.pathCoords.length; i++) {
            clone.pathCoords[i] = {
                x: 0,
                y: 0
            }
            clone.pathCoords[i].x = this.pathCoords[i].x;
            clone.pathCoords[i].y = this.pathCoords[i].y;
        }
        clone.svgElement.setAttribute('points', this.path);
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
            this.pathCoords.push({
                x: x,
                y: y
            });
            this.path += ", " + x + " " + y;
            this.svgElement.setAttribute('points', this.path);
            this.line.remove();
            this.line = new line(x, y, curX, curY, false);
            this.pointsArray.push(new point(x, y, this, {
                action: "polyline",
                attr: this.pathCoords.length - 1
            }));
        }
    }
    updateFrameAndPoints(dx = 0, dy = 0) {
        //включает обновление атрибута
        for (let i = 0; i < this.pathCoords.length; i++) {
            let x = this.pathCoords[i].x + dx,
                y = this.pathCoords[i].y + dy;
            if (i == 0) this.path = x + " " + y;
            else this.path += ", " + x + " " + y;
            this.pointsArray[i].update(x, y, i);
        }
        this.path += ", " + (this.pathCoords[0].x + dx) + " " + (this.pathCoords[0].y + dy);
        this.frameArray[0].update(this.path);
        this.svgElement.setAttribute('points', this.path);
        this.path = "";
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.updateFrameAndPoints(dx, dy);
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.x0 += dx;
        this.y0 += dy;
        this.minX += dx;
        this.minY += dy;
        this.maxX += dx;
        this.maxY += dy;
        for (let i = 0; i < this.pathCoords.length; i++) {
            this.pathCoords[i].x += dx;
            this.pathCoords[i].y += dy;
        }
    }
    moveTo(x, y) {
        let dx = x + pointRadius - this.minX,
            dy = y + pointRadius - this.minY;
        this.move(dx, dy);
        this.stopMoving(dx, dy);
    }
    deletePoint(ind) {
        if (this.pathCoords.length == 2) deleteFunc(); //actions.js
        else {
            this.pointsArray[ind].remove();
            this.pointsArray.splice(ind, 1);
            this.pathCoords.splice(ind, 1);
            this.updateFrameAndPoints();
        }
    }
    resize() {
        this.pathCoords[currentPointTypeAttr].x = curX;
        this.pathCoords[currentPointTypeAttr].y = curY;
        this.updateFrameAndPoints();
    }
    startRotating() {
        this.rPoint = {
            x: this.getNewCoords(this.minX + (this.maxX - this.minX) / 2, this.minY - 20, this.angle).x,
            y: this.getNewCoords(this.minX + (this.maxX - this.minX) / 2, this.minY - 20, this.angle).y,
        }
    }
    rotate(angle = this.angle) {
        let firstSide = Math.sqrt(Math.pow(Math.abs(this.rPoint.x - this.cPoint.x), 2) + Math.pow(Math.abs(this.rPoint.y - this.cPoint.y), 2)),
            secondSide = Math.sqrt(Math.pow(Math.abs(curX - this.cPoint.x), 2) + Math.pow(Math.abs(curY - this.cPoint.y), 2)),
            thirdSide = (Math.sqrt(Math.pow(Math.abs(curX - this.rPoint.x), 2) + Math.pow(Math.abs(curY - this.rPoint.y), 2))),
            angleCos = (Math.pow(firstSide, 2) + Math.pow(secondSide, 2) - Math.pow(thirdSide, 2)) / (2 * firstSide * secondSide);
        this.newAngle = getRotateCoords(curX, curY, angle).x >= getRotateCoords(this.cPoint.x, this.cPoint.y, angle).x ?
            Math.acos(angleCos) + angle : 2 * Math.PI - Math.acos(angleCos) + angle;
        this.updateFrameAndPoints(0, 0, this.minX, this.minY, this.maxX, this.maxY, this.newAngle);
    }
    stopRotating() {
        this.angle = this.newAngle;
        this.angle = this.angle > 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;
        this.updateFrameAndPoints();
    }
    getNewCoords(x = this.x0, y = this.y0, angle = this.angle) {
        return {
            x: (x - this.cPoint.x) * Math.cos(angle) - (y - this.cPoint.y) * Math.sin(angle) + this.cPoint.x,
            y: (x - this.cPoint.x) * Math.sin(angle) + (y - this.cPoint.y) * Math.cos(angle) + this.cPoint.y
        }
    }
    complete() {
        if (!polylineIsCompleted) {
            super.complete();
            this.line.remove();
            this.pointsArray[0].setPointAttribute('fill', "white");
            polylineIsCompleted = true;
        }
        this.frameArray = [new lineFrame(this.minX, this.maxY, this.maxX, this.maxY, this, true),
            new lineFrame(this.maxX, this.maxY, this.maxX, this.minY, this, true),
            new lineFrame(this.maxX, this.minY, this.minX, this.minY, this, true),
            new lineFrame(this.minX, this.minY, this.minX, this.maxY, this, true),
            new polylineFrame(this.path, this)
        ];
        this.pointsArray = [new point(this.minX + (this.maxX - this.minX) / 2, this.minY + (this.maxY - this.minY) / 2, this, {
                action: "move",
                attr: "move"
            }),
            new point(this.minX + (this.maxX - this.minX) / 2, this.minY - 20, this, {
                action: "rotate",
                attr: "rotate"
            })
        ];
        super.complete();
        this.path = "";
    }
}
