class vector extends object {
    constructor(svgElement = null) {
        super('path', svgElement, 'vector');
        this.hasEnd = false;
        this.isClosed = false;
        if (svgElement != null) {
            vectorIsCompleted = false;
            this.path = this.getElementAttribute('d');
            let split = this.path.split(' ');
            this.x0 = Number(split[1].split(',')[0]);
            this.y0 = Number(split[1].split(',')[1]);
            this.pathCoords = [];
            this.minX = this.x0;
            this.minY = this.y0;
            this.maxX = this.x0;
            this.maxY = this.y0;
            this.frameArray = [];
            this.pointsArray = [];
            this.i = 0;

            let n = split.length;
            if (split[split.length - 1] == "Z") {
                vectEnd.checked = "true";
                this.hasEnd = true;
                n--;
            }

            for (let i = 0; i < n; i++) {
                if (split[i] == "M" || split[i] == "C") {
                    continue;
                }
                let x = Number(split[i].split(',')[0]),
                    y = Number(split[i].split(',')[1]);
                this.pathCoords.push({
                    x: x,
                    y: y
                })
                this.minX = Math.min(this.minX, x);
                this.minY = Math.min(this.minY, y);
                this.maxX = Math.max(this.maxX, x);
                this.maxY = Math.max(this.maxY, y);
                if (i == n - 1 && x == this.x0 && y == this.y0) this.isClosed = true;
                if (!(i == n - 1 && x == this.x0 && y == this.y0)) {
                    if (this.i % 3 == 0) {
                        this.pointsArray.push(new point(x, y, this, {
                            action: "pathTool",
                            attr: this.i
                        }));
                    } else {
                        this.frameArray.push(new lineFrame(x, y, x, y, this, true));
                        this.pointsArray.push(new point(x, y, this, {
                            action: "resize",
                            attr: this.i
                        }));
                    }
                }
                this.i++;
            }
            this.cPoint = {
                x: this.minX + (this.maxX - this.minX) / 2,
                y: this.minY + (this.maxY - this.minY) / 2
            };
        } else {
            this.path = "M " + this.x0 + "," + this.y0;
            this.pathCoords = [{
                x: this.x0,
                y: this.y0
            }];
            this.i = 0;
            this.newPath = "";
            this.minX = this.x0;
            this.minY = this.y0;
            this.maxX = this.x0;
            this.maxY = this.y0;
            this.cPoint = {
                x: this.minX + (this.maxX - this.minX) / 2,
                y: this.minY + (this.maxY - this.minY) / 2
            };
            this.setElementAttribute('d', this.path);
            this.frameArray = [new lineFrame(this.x0, this.y0, this.x0, this.y0, this, true),
                new lineFrame(this.x0, this.y0, this.x0, this.y0, this, true)
            ];
            this.pointsArray = [new point(this.x0, this.y0, this, {
                    action: "resize",
                    attr: this.i * 3 - 1
                }), new point(curX, curY, this, {
                    action: "resize",
                    attr: this.i * 3 + 1
                }),
                new point(curX, curY, this, {
                    action: "pathTool",
                    attr: this.i * 3
                })
            ];
            let t = this.pointsArray[1];
            this.pointsArray[1] = this.pointsArray[2];
            this.pointsArray[2] = t;
            this.pointsArray[1].setPointAttribute('fill', "blue");
            //rotate
            this.transform = 'rotate(' + 0 + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
            this.angle = 0;
        }
    }
    static create(svgElement) {
        let newObj = new vector(svgElement);
        super.create(newObj);
    }
    createClone() {
        let clone = new vector();
        super.createClone(clone);
        clone.hasEnd = this.hasEnd;
        clone.isClosed = this.isClosed;
        clone.minX = this.minX;
        clone.minY = this.minY;
        clone.maxX = this.maxX;
        clone.maxY = this.maxY;
        clone.cPoint = this.cPoint;
        clone.transform = this.transform;
        clone.svgElement.setAttribute('transform', this.transform);
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
        clone.updateFrameAndPoints();
        return clone;
    }
    addParameters() {
        vect_panel.style.display = "flex";
    }
    updateParameters() {
        vectX.value = this.minX;
        vectY.value = this.minY;
        vectEnd.checked = this.hasEnd ? true : false;
        angleInput.value = this.angle * 180.0 / Math.PI;
    }
    removeParameters() {
        vect_panel.style.display = "none";
    }
    updateFrameAndPoints(dx = 0, dy = 0) {
        for (let i = 0; i < this.pathCoords.length; i++) {
            let x = this.pathCoords[i].x + dx,
                y = this.pathCoords[i].y + dy;
            if (!this.isClosed || i != this.pathCoords.length - 1) this.pointsArray[i].update(x, y, this.transform, i);
            if (i == 0) {
                this.path = "M " + x + "," + y;
                continue;
            }
            if (i % 3 == 1) {
                this.frameArray[(i / 3 | 0) * 2].update(this.pathCoords[i - 1].x + dx, this.pathCoords[i - 1].y + dy, x, y, this.transform);
                this.path += " C " + x + "," + y;
            }
            if (i % 3 == 2) {
                this.frameArray[(i / 3 | 0) * 2 + 1].update(this.pathCoords[i + 1].x + dx, this.pathCoords[i + 1].y + dy, x, y, this.transform);
                this.path += " " + x + "," + y;
            }
            if (i % 3 == 0) {
                this.path += " " + x + "," + y;
            }
        }
        if (this.hasEnd) this.path += ' Z';
        this.setElementAttribute('d', this.path);
    }
    move(dx = curX - this.start.x, dy = curY - this.start.y) {
        let new_dx = getRotateCoords(dx, dy, this.angle).x,
            new_dy = getRotateCoords(dx, dy, this.angle).y;
        this.updateFrameAndPoints(new_dx, new_dy);
    }
    stopMoving(dx = curX - this.start.x, dy = curY - this.start.y) {
        this.minX += dx;
        this.minY += dy;
        this.maxX += dx;
        this.maxY += dy;
        this.cPoint = {
            x: this.minX + (this.maxX - this.minX) / 2,
            y: this.minY + (this.maxY - this.minY) / 2
        };
        for (let i = 0; i < this.pathCoords.length; i++) {
            this.pathCoords[i].x += dx;
            this.pathCoords[i].y += dy;
        }

        this.transform = 'rotate(' + this.angle * 180.0 / Math.PI + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        this.svgElement.setAttribute('transform', this.transform);
        this.updateFrameAndPoints();
    }
    moveTo(x, y) {
        let dx = x + pointRadius - this.minX,
            dy = y + pointRadius - this.minY;
        this.move(dx, dy);
        this.stopMoving(dx, dy);
    }
    getCornerCoords() {
        return {
            x: this.minX - pointRadius,
            y: this.minY - pointRadius
        };
    }
    deletePoint(ind) {
        if (this.pathCoords.length == 4) deleteFunc(); //actions.js
        else {
            if (ind == 0) {
                ind++;
                this.frameArray[0].remove();
                this.frameArray[1].remove();
                this.frameArray.splice(0, 2);
                if (this.isClosed) {
                    this.pathCoords[this.pathCoords.length - 1].x = this.pathCoords[3].x;
                    this.pathCoords[this.pathCoords.length - 1].y = this.pathCoords[3].y;
                }
            } else
            if (ind == this.pathCoords.length - 1) {
                ind--;
                this.frameArray[this.frameArray.length - 1].remove();
                this.frameArray[this.frameArray.length - 2].remove();
                this.frameArray.splice(this.frameArray.length - 2, 2);
            } else {
                this.frameArray[(ind / 3) * 2 - 1].remove();
                this.frameArray[(ind / 3) * 2].remove();
                this.frameArray.splice((ind / 3 | 0) * 2 - 1, 2);
            }
            this.pointsArray[ind].remove();
            this.pointsArray[ind - 1].remove();
            this.pointsArray[ind + 1].remove();
            this.pointsArray.splice(ind - 1, 3);
            this.pathCoords.splice(ind - 1, 3);
            this.updateFrameAndPoints();
        }
    }
    resize() {
        let new_curX = this.getNewCoords(curX, curY, 2 * Math.PI - this.angle).x,
            new_curY = this.getNewCoords(curX, curY, 2 * Math.PI - this.angle).y;
        let i = currentPointTypeAttr;
        if (i % 3 == 0) {
            let dx = new_curX - this.pathCoords[i].x,
                dy = new_curY - this.pathCoords[i].y;
            if (i < this.pathCoords.length - 1) {
                this.pathCoords[i + 1].x += dx;
                this.pathCoords[i + 1].y += dy;
            }
            if (i > 0) {
                this.pathCoords[i - 1].x += dx;
                this.pathCoords[i - 1].y += dy;
            }
        }
        this.pathCoords[i].x = new_curX;
        this.pathCoords[i].y = new_curY;
        this.updateFrameAndPoints();
        if (i == 0 && this.isClosed) {
            currentPointTypeAttr = this.pathCoords.length - 1;
            this.resize();
            currentPointTypeAttr = 0;
        }
    }
    stopResize() {
        this.minX = 10000;
        this.minY = 10000;
        this.maxX = -10000;
        this.maxY = -10000;
        for (let i = 0; i < this.pathCoords.length; i++) {
            let x = this.pathCoords[i].x,
                y = this.pathCoords[i].y;
            this.minX = Math.min(this.minX, x);
            this.minY = Math.min(this.minY, y);
            this.maxX = Math.max(this.maxX, x);
            this.maxY = Math.max(this.maxY, y);
        }
        this.cPoint = {
            x: this.minX + (this.maxX - this.minX) / 2,
            y: this.minY + (this.maxY - this.minY) / 2
        };
        this.transform = 'rotate(' + this.angle * 180.0 / Math.PI + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        this.svgElement.setAttribute('transform', this.transform);
        this.updateFrameAndPoints();
    }
    getResizeAttrs(ind = currentPointTypeAttr) {
        let attrs = [
            this.pathCoords[this.pathCoords.length - 2].x,
            this.pathCoords[this.pathCoords.length - 2].y,
            ind,
            this.pathCoords[ind].x, this.pathCoords[ind].y,
        ];

        if (ind < this.pathCoords.length - 1) attrs.push(this.pathCoords[ind + 1].x, this.pathCoords[ind + 1].y);
        if (ind > 0) attrs.push(this.pathCoords[ind - 1].x, this.pathCoords[ind - 1].y);
        return attrs;
    }
    setResizeAttrs(attrs) {
        let i = attrs[2];
        if (i % 3 == 0) {
            if (i < this.pathCoords.length - 1) {
                this.pathCoords[i + 1].x = attrs[5];
                this.pathCoords[i + 1].y = attrs[6];
                if (i > 0) {
                    this.pathCoords[i - 1].x = attrs[7];
                    this.pathCoords[i - 1].y = attrs[8];
                }
            } else
            if (i > 0) {
                this.pathCoords[i - 1].x = attrs[5];
                this.pathCoords[i - 1].y = attrs[6];
            }
            if (i == 0 && this.isClosed) {
                this.pathCoords[this.pathCoords.length - 1].x = attrs[3];
                this.pathCoords[this.pathCoords.length - 1].y = attrs[4];
                this.pathCoords[this.pathCoords.length - 2].x = attrs[0];
                this.pathCoords[this.pathCoords.length - 2].y = attrs[1];
            }
        }
        this.pathCoords[i].x = attrs[3];
        this.pathCoords[i].y = attrs[4];
        this.stopResize();
    }
    rotateTo(newAngle) {
        this.transform = 'rotate(' + newAngle * 180.0 / Math.PI + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
        this.svgElement.setAttribute('transform', this.transform);
        this.angle = newAngle;
        this.angle = this.angle > 2 * Math.PI ? this.angle - 2 * Math.PI : this.angle;
        this.updateFrameAndPoints();
    }
    getNewCoords(x = this.x0, y = this.y0, angle = this.angle) {
        return {
            x: (x - this.cPoint.x) * Math.cos(angle) - (y - this.cPoint.y) * Math.sin(angle) + this.cPoint.x,
            y: (x - this.cPoint.x) * Math.sin(angle) + (y - this.cPoint.y) * Math.cos(angle) + this.cPoint.y
        };
    }
    updatePoint() {
        if ((curX - this.x0) ** 2 + (curY - this.y0) ** 2 <= pointRadius ** 2 && this.i > 0) {
            vectEnd.checked = "true";
            this.isClosed = true;
            curX = this.x0;
            curY = this.y0;
        }
        this.pathCoords.push({
            x: curX,
            y: curY
        });
        this.i++;
        this.frameArray.push(new lineFrame(curX, curY, curX, curY, this, true),
            new lineFrame(curX, curY, curX, curY, this, true));
        this.pointsArray.push(new point(curX, curY, this, {
            action: "resize",
            attr: this.i * 3 - 1 //точка, отвечающая за предыдущий путь
        }), new point(curX, curY, this, {
            action: "pathTool",
            attr: this.i * 3 //вершина
        }), new point(curX, curY, this, {
            action: "resize",
            attr: this.i * 3 + 1 //точка, отвечающая за следующий путь
        }));
        this.minX = Math.min(this.minX, curX);
        this.minY = Math.min(this.minY, curY);
        this.maxX = Math.max(this.maxX, curX);
        this.maxY = Math.max(this.maxY, curY);
    }
    updateLine() {
        let x = this.pathCoords[this.i].x,
            y = this.pathCoords[this.i].y;
        this.frameArray[this.i * 2].update(x, y, 2 * x - curX, 2 * y - curY);
        this.frameArray[this.i * 2 + 1].update(x, y, curX, curY);
        this.pointsArray[this.i * 3].update(2 * x - curX, 2 * y - curY);
        this.pointsArray[this.i * 3 + 2].update(curX, curY);
    }
    updateFirstPath() {
        this.path += this.newPath;
        this.prevPoint = " C " + curX + "," + curY;
        let x = this.pathCoords[this.i].x,
            y = this.pathCoords[this.i].y;
        this.minX = Math.min(this.minX, curX, 2 * x - curX);
        this.minY = Math.min(this.minY, curY, 2 * y - curY);
        this.maxX = Math.max(this.maxX, curX, 2 * x - curX);
        this.maxY = Math.max(this.maxY, curY, 2 * y - curY);

        if (this.isClosed) {
            this.complete();
        }
    }
    updatePath() {
        this.newPath = this.prevPoint + " " + curX + "," + curY + " " + curX + "," + curY;
        this.setElementAttribute('d', this.path + this.newPath);
        if ((curX - this.x0) ** 2 + (curY - this.y0) ** 2 <= pointRadius ** 2 && this.i > 0)
            this.pointsArray[1].setPointAttribute('fill', "red");
        else
            this.pointsArray[1].setPointAttribute('fill', "blue");
    }
    updateSecondPath() {
        let x = this.pathCoords[this.i].x,
            y = this.pathCoords[this.i].y;
        let newX = 2 * x - curX,
            newY = 2 * y - curY;
        this.newPath = this.prevPoint + " " + newX + "," + newY + " " + x + "," + y;
        this.setElementAttribute('d', this.path + this.newPath);
        this.updateLine();
    }
    complete() {
        if (!vectorIsCompleted) {
            vectorIsCompleted = true;
            scrollPanel.onmousedown = startVector;
            this.pointsArray[1].setPointAttribute('fill', "white");
            this.pathCoords = [];
            for (let i = 1; i < this.pointsArray.length - 2; i++) {
                if (i % 3 == 0) {
                    this.pointsArray[i + 1].circle.after(this.pointsArray[i].circle);
                }
                this.pathCoords.push({
                    x: this.pointsArray[i].x,
                    y: this.pointsArray[i].y
                })
            }
            this.pointsArray[0].remove();
            this.pointsArray[this.pointsArray.length - 1].remove();
            if (this.isClosed) {
                this.pathCoords.push({
                    x: this.pointsArray[1].x,
                    y: this.pointsArray[1].y
                })
                this.pointsArray[this.pointsArray.length - 2].remove();
                this.pointsArray.pop();
                svgcontent.after(this.frameArray[this.frameArray.length - 2].svgElement);
            } else {
                this.pathCoords.push({
                    x: this.pointsArray[this.pointsArray.length - 2].x,
                    y: this.pointsArray[this.pointsArray.length - 2].y
                })
            }
            this.frameArray[0].remove();
            this.frameArray[this.frameArray.length - 1].remove();
            this.pointsArray.pop();
            this.frameArray.pop();
            this.pointsArray.splice(0, 1);
            this.frameArray.splice(0, 1);

            this.pointsArray[0].circle.after(this.pointsArray[1].circle);
            this.cPoint = {
                x: this.minX + (this.maxX - this.minX) / 2,
                y: this.minY + (this.maxY - this.minY) / 2
            };
            this.transform = 'rotate(' + this.angle * 180.0 / Math.PI + ' ' + this.cPoint.x + ' ' + this.cPoint.y + ')';
            super.complete(this.path != "M " + this.x0 + "," + this.y0);
        }
    }
}