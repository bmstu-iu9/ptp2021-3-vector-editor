class text extends object {
    constructor(svgElement = null) {
        super('foreignObject', svgElement, 'text');
        if (svgElement != null) {
            [this.x, this.y, this.width, this.height] = [
                Number(this.getElementAttribute('x')),
                Number(this.getElementAttribute('y')),
                Number(this.getElementAttribute('width')),
                Number(this.getElementAttribute('height'))
            ]
            this.cPoint = {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
            this.textDiv = svgElement.childNodes[0];
        } else {
            this.width = 300;
            this.height = 200;
            this.x = curX - 15;
            this.y = curY - 10;
            this.setElementAttribute('x', this.x);
            this.setElementAttribute('y', this.y);
            this.setElementAttribute('width', this.width);
            this.setElementAttribute('height', this.height);
            this.textDiv = document.createElement('div');
            this.textDiv.setAttribute('contenteditable', true);
            this.textDiv.style.overflow = 'hidden';
            this.textDiv.style.overflowWrap = 'break-word';
            this.textDiv.textContent = 'Text';
            this.textDiv.style.width = this.width + "px";
            this.textDiv.style.height = this.height + "px";
            this.textDiv.style.outline = "none";
            if (fillColor.value != "#ffffff") this.textDiv.style.color = fillColor.value;
            this.svgElement.appendChild(this.textDiv);
            //rotate
            this.cPoint = {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            };
            this.transform = 'rotate(' + 0 + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
            this.setElementAttribute('transform', this.transform);
            this.angle = 0;
        }

        this.frameArray = [new rectangleFrame(this.x, this.y, this.width, this.height, this, true)];

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
            new point(this.x + this.width / 2, this.y + this.height / 2, this, {
                action: "move",
                attr: "move"
            }),
            new point(this.x + this.width / 2, this.y - 20, this, {
                action: "rotate",
                attr: "rotate"
            })
        ];
    }
    createClone() {
        this.textDiv.setAttribute('contenteditable', 'false');
        this.textDiv.style.webkitTouchCallout = 'none';
        this.textDiv.style.webkitUserSelect = 'none';
        this.textDiv.style.userSelect = 'none';
        let clone = new text();
        this.clone = clone;
        clone.transform = this.transform;
        super.createClone();
        clone.width = this.width;
        clone.height = this.height;
        clone.x = this.x;
        clone.y = this.y;
        clone.cPoint = this.cPoint;
        clone.angle = this.angle;
        clone.textDiv.innerHTML = this.textDiv.innerHTML;
        this.setElementAttribute('width', this.width);
        this.setElementAttribute('height', this.height);
        this.setElementAttribute('x', this.x);
        this.setElementAttribute('y', this.y);
        clone.svgElement.setAttribute('transform', this.transform);
        return clone;
    }
    addActions() {
        super.addActions();
        document.addEventListener('mousedown', () => {
            if (wasPressed == "cursor" && !isSomePointSelected) {
                this.textDiv.setAttribute('contenteditable', 'true');
                this.svgElement.style.cursor = "text";
            } else {
                this.svgElement.style.cursor = svgPanel.style.cursor;
                this.textDiv.setAttribute('contenteditable', 'false');
                this.textDiv.style.webkitTouchCallout = 'none';
                this.textDiv.style.webkitUserSelect = 'none';
                this.textDiv.style.userSelect = 'none';
            }
        });
        //чтобы после вращения курсор над текстом менялся на default(если мышка после вращения осталась на текстом)
        document.addEventListener("mouseup", function () {
            if (wasPressed == "cursor" && !isSomePointSelected) {
                this.svgElement.style.cursor = "text";
            } else {
                this.svgElement.style.cursor = svgPanel.style.cursor;
            }
        }.bind(this));
    }
    updateFrameAndPoints(width = this.width, height = this.height, x = this.x, y = this.y, transform = this.transform) {
        this.frameArray[0].update(x, y, width, height, transform);

        this.pointsArray[0].update(x, y, transform);
        this.pointsArray[1].update(x + width / 2, y, transform);
        this.pointsArray[2].update(x + width, y, transform);
        this.pointsArray[3].update(x + width, y + height / 2, transform);
        this.pointsArray[4].update(x + width, y + height, transform);
        this.pointsArray[5].update(x + width / 2, y + height, transform);
        this.pointsArray[6].update(x, y + height, transform);
        this.pointsArray[7].update(x, y + height / 2, transform);
        this.pointsArray[8].update(x + width / 2, y + height / 2, transform);
        this.pointsArray[9].update(x + width / 2, y - 20, transform);
    }
    //FILL AND STROKE
    getFillAttrs() {
        if (this.isCompleted) return [this.textDiv.style.color]
    }
    setFillAttrs(attrs) {
        this.textDiv.style.color = attrs[0];
    }
    //MOVE
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        let new_dx = getRotateCoords(dx, dy, this.angle).x,
            new_dy = getRotateCoords(dx, dy, this.angle).y;
        this.svgElement.setAttribute('x', this.x + new_dx);
        this.svgElement.setAttribute('y', this.y + new_dy);
        this.updateFrameAndPoints(this.width, this.height, this.x + new_dx, this.y + new_dy, this.transform);
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.x += dx;
        this.y += dy;
        this.cPoint = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
        this.transform = 'rotate(' + this.angle * 180.0 / Math.PI + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        this.svgElement.setAttribute('x', this.x);
        this.svgElement.setAttribute('y', this.y);
        this.svgElement.setAttribute('transform', this.transform);
    }
    moveTo(x, y) {
        let dx = x + pointRadius - this.x,
            dy = y + pointRadius - this.y;
        this.move(dx, dy);
        this.stopMoving(dx, dy);
        this.updateParameters();
    }
    getCornerCoords() {
        return {
            x: this.x - pointRadius,
            y: this.y - pointRadius
        }
    }
    //RESIZE
    startResize() {
        this.resizeTemp = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    resize(dx, dy) {
        let new_dx = getRotateCoords(dx, dy, this.angle).x,
            new_dy = getRotateCoords(dx, dy, this.angle).y;
        let n = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        switch (currentPointTypeAttr) {
            case "ltc":
                n.x += new_dx;
                n.y += new_dy;
                n.width -= new_dx;
                n.height -= new_dy;
                break;
            case "t":
                n.y += new_dy;
                n.height -= new_dy;
                break;
            case "rtc":
                n.y += new_dy;
                n.width += new_dx;
                n.height -= new_dy;
                break;
            case "r":
                n.width += new_dx;
                break;
            case "rbc":
                n.width += new_dx;
                n.height += new_dy;
                break;
            case "b":
                n.height += new_dy;
                break;
            case "lbc":
                n.x += new_dx;
                n.width -= new_dx;
                n.height += new_dy;
                break;
            case "l":
                n.x += new_dx;
                n.width -= new_dx;
                break;
        }
        if (n.width < 0) {
            if (this.x + this.width < n.x) n.x = this.x + this.width;
            let q = 1;
            switch (currentPointTypeAttr) {
                case "ltc":
                    currentPointTypeAttr = "rtc";
                    break;
                case "lbc":
                    currentPointTypeAttr = "rbc";
                    break;
                case "rtc":
                    q *= -1;
                    currentPointTypeAttr = "ltc";
                    break;
                case "rbc":
                    q *= -1;
                    currentPointTypeAttr = "lbc";
                    break;
                case "l":
                    currentPointTypeAttr = "r";
                    break;
                case "r":
                    q *= -1;
                    currentPointTypeAttr = "l";
                    break;
            }
            pointStart.x += this.width * Math.cos(this.angle) * q;
            pointStart.y += this.width * Math.sin(this.angle) * q;
            n.width = 0;
            this.width = 0;
            this.x = n.x;
        }
        if (n.height < 0) {
            if (this.y + this.height < n.y) n.y = this.y + this.height;
            let q = 1;
            switch (currentPointTypeAttr) {
                case "ltc":
                    currentPointTypeAttr = "lbc";
                    break;
                case "lbc":
                    q *= -1;
                    currentPointTypeAttr = "ltc";
                    break;
                case "rtc":
                    currentPointTypeAttr = "rbc";
                    break;
                case "rbc":
                    q *= -1;
                    currentPointTypeAttr = "rtc";
                    break;
                case "t":
                    currentPointTypeAttr = "b";
                    break;
                case "b":
                    q *= -1;
                    currentPointTypeAttr = "t";
                    break;
            }
            pointStart.x -= this.height * Math.sin(this.angle) * q;
            pointStart.y += this.height * Math.cos(this.angle) * q;
            n.height = 0;
            this.height = 0;
            this.y = n.y;
        }
        this.resizeTemp = n;
        this.svgElement.setAttribute('x', n.x);
        this.svgElement.setAttribute('y', n.y);
        this.svgElement.setAttribute('width', n.width);
        this.svgElement.setAttribute('height', n.height);
        this.setElementAttribute('rx', Math.max(n.height, n.width) * this.r / 100);
        this.updateFrameAndPoints(n.width, n.height, n.x, n.y, this.transform);
    }
    stopResize() {
        this.width = this.resizeTemp.width;
        this.height = this.resizeTemp.height;
        let new_x = this.getNewCoords(this.resizeTemp.x + this.width / 2, this.resizeTemp.y + this.height / 2, this.angle).x,
            new_y = this.getNewCoords(this.resizeTemp.x + this.width / 2, this.resizeTemp.y + this.height / 2, this.angle).y;
        this.cPoint = {
            x: new_x,
            y: new_y
        };
        this.x = this.cPoint.x - this.width / 2;
        this.y = this.cPoint.y - this.height / 2;
        this.transform = 'rotate(' + this.angle * 180.0 / Math.PI + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        this.svgElement.setAttribute('x', this.x);
        this.svgElement.setAttribute('y', this.y);
        this.svgElement.setAttribute('width', this.width);
        this.svgElement.setAttribute('height', this.height);
        this.textDiv.style.width = this.width + "px";
        this.textDiv.style.height = this.height + "px";
        this.svgElement.setAttribute('transform', this.transform);
        this.updateFrameAndPoints();
    }
    getResizeAttrs() {
        return [
            Number(this.getElementAttribute('x')),
            Number(this.getElementAttribute('y')),
            Number(this.getElementAttribute('width')),
            Number(this.getElementAttribute('height'))
        ]
    }
    setResizeAttrs(attrs) {
        [this.x, this.y, this.width, this.height] = attrs;
        this.cPoint = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
        this.transform = 'rotate(' + this.angle * 180.0 / Math.PI + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        this.svgElement.setAttribute('x', this.x);
        this.svgElement.setAttribute('y', this.y);
        this.svgElement.setAttribute('width', this.width);
        this.svgElement.setAttribute('height', this.height);
        this.textDiv.style.width = this.width + "px";
        this.textDiv.style.height = this.height + "px";
        this.svgElement.setAttribute('transform', this.transform);
        this.setElementAttribute('rx', Math.max(this.height, this.width) * this.r / 100);
        this.updateFrameAndPoints();
        this.updateParameters();
    }
    //ROTATE
    startRotating() {
        this.rPoint = {
            x: this.getNewCoords(this.x + this.width / 2, this.y - 20, this.angle).x,
            y: this.getNewCoords(this.x + this.width / 2, this.y - 20, this.angle).y
        };
    }
    rotate(angle = this.angle) {
        let firstSide = Math.sqrt(Math.pow(Math.abs(this.rPoint.x - this.cPoint.x), 2) + Math.pow(Math.abs(this.rPoint.y - this.cPoint.y), 2)),
            secondSide = Math.sqrt(Math.pow(Math.abs(curX - this.cPoint.x), 2) + Math.pow(Math.abs(curY - this.cPoint.y), 2)),
            thirdSide = (Math.sqrt(Math.pow(Math.abs(curX - this.rPoint.x), 2) + Math.pow(Math.abs(curY - this.rPoint.y), 2))),
            angleCos = (Math.pow(firstSide, 2) + Math.pow(secondSide, 2) - Math.pow(thirdSide, 2)) / (2 * firstSide * secondSide),
            newAngle;
        if (secondSide == 0) newAngle = this.angle;
        else newAngle = getRotateCoords(curX, curY, angle).x >= getRotateCoords(this.cPoint.x, this.cPoint.y, angle).x ?
            Math.acos(angleCos) + angle : 2 * Math.PI - Math.acos(angleCos) + angle;
        this.svgElement.setAttribute('x', this.x);
        this.svgElement.setAttribute('y', this.y);
        this.transform = 'rotate(' + newAngle * 180.0 / Math.PI + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        this.svgElement.setAttribute('transform', this.transform);
        this.updateFrameAndPoints();
    }
    stopRotating() {
        let argss = this.transform.split('(')[1],
            args = argss.split(')')[0],
            newAngle = args.split(' ')[0] * Math.PI / 180.0;
        this.angle = newAngle;
        this.angle = this.angle > 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;
        this.updateFrameAndPoints();
    }
    rotateTo(newAngle) {
        this.svgElement.setAttribute('x', this.x);
        this.svgElement.setAttribute('y', this.y);
        this.transform = 'rotate(' + newAngle * 180.0 / Math.PI + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        this.svgElement.setAttribute('transform', this.transform);
        this.angle = newAngle;
        this.angle = this.angle > 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;
        this.updateFrameAndPoints();
        this.updateParameters();
    }
    getNewCoords(x = this.x, y = this.y, angle = this.angle) {
        return {
            x: (x - this.cPoint.x) * Math.cos(angle) - (y - this.cPoint.y) * Math.sin(angle) + this.cPoint.x,
            y: (x - this.cPoint.x) * Math.sin(angle) + (y - this.cPoint.y) * Math.cos(angle) + this.cPoint.y
        };
    }
}