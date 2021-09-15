class vector extends object {
    constructor() {
        super('path');
        this.type = 'vector';
        this.path = "M" + " " + this.x0 + " " + this.y0 + " ";
        this.pathCoords = [{
            x: this.x0,
            y: this.y0
        }];
        this.i = 0;
        this.newPath = "";
        this.hasEnd = false;
        this.minX = this.x0;
        this.minY = this.y0;
        this.maxX = this.x0;
        this.maxY = this.y0;
        this.cPoint = {
            x: this.minX + (this.maxX - this.minX) / 2,
            y: this.minY + (this.maxY - this.minY) / 2
        };
        this.setElementAttribute('d', this.path);
        this.frameArray = [new lineFrame(curX, curY, curX, curY, this),
            new lineFrame(curX, curY, curX, curY, this)
        ];
        this.pointsArray = [new point(curX, curY, this, {
            action: "resize",
            attr: this.i * 3 //точка, отвечающая за предыдущий путь
        }), new point(curX, curY, this, {
            action: "resize",
            attr: this.i * 3 + 1 //точка угла
        }), new point(curX, curY, this, {
            action: "resize",
            attr: this.i * 3 + 2 //точка, отвечающая за следующий путь
        })];
    }
    createClone() {
        let clone = new vector();
        this.clone = clone;
        super.createClone();
        clone.hasEnd = this.hasEnd;
        clone.minX = this.minX;
        clone.minY = this.minY;
        clone.maxX = this.maxX;
        clone.maxY = this.maxY;
        clone.cPoint = this.cPoint;
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
        //angleInput.value = this.angle * 180.0 / Math.PI;
    }
    removeParameters() {
        vect_panel.style.display = "none";
    }
    updateFrameAndPoints(dx = 0, dy = 0) {
        this.minX = 10000;
        this.minY = 10000;
        this.maxX = -10000;
        this.maxY = -10000;
        for (let i = 0; i < this.pathCoords.length; i++) {
            let x = this.pathCoords[i].x + dx,
                y = this.pathCoords[i].y + dy;
            this.pointsArray[i].update(x, y);
            this.minX = Math.min(this.minX, x);
            this.minY = Math.min(this.minY, y);
            this.maxX = Math.max(this.maxX, x);
            this.maxY = Math.max(this.maxY, y);
            if (i == 0) {
                let newX = 2 * (this.pathCoords[i + 1].x + dx) - (this.pathCoords[i + 2].x + dx),
                    newY = 2 * (this.pathCoords[i + 1].y + dy) - (this.pathCoords[i + 2].y + dy);
                this.pointsArray[0].update(newX, newY);
                this.frameArray[0].update(this.pathCoords[i + 1].x + dx, this.pathCoords[i + 1].y + dy, newX, newY);
                continue;
            }
            if (i == 1) {
                this.path = "M" + " " + x + " " + y + " ";
                continue;
            }
            if (i == this.pathCoords.length - 1) {
                let newX = 2 * (this.pathCoords[i - 1].x + dx) - (this.pathCoords[i - 2].x + dx),
                    newY = 2 * (this.pathCoords[i - 1].y + dy) - (this.pathCoords[i - 2].y + dy);
                this.pointsArray[i].update(newX, newY);
                this.frameArray[(i / 3 | 0) * 2 + 1].update(this.pathCoords[i - 1].x + dx, this.pathCoords[i - 1].y + dy, newX, newY);
                continue;
            }
            if (i % 3 == 2) {
                this.frameArray[(i / 3 | 0) * 2 + 1].update(this.pathCoords[i - 1].x + dx, this.pathCoords[i - 1].y + dy, x, y);
                this.path += "C" + " " + x + " " + y + ", ";
            }
            if (i % 3 == 0) {
                this.frameArray[(i / 3 | 0) * 2].update(this.pathCoords[i + 1].x + dx, this.pathCoords[i + 1].y + dy, x, y);
                this.path += x + " " + y + ", ";
            }
            if (i % 3 == 1) {
                this.path += x + " " + y + " ";
            }
        }
        if (this.hasEnd) this.path += 'Z';
        this.setElementAttribute('d', this.path);
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
        this.cPoint = {
            x: this.minX + (this.maxX - this.minX) / 2,
            y: this.minY + (this.maxY - this.minY) / 2
        }
        for (let i = 0; i < this.pathCoords.length; i++) {
            this.pathCoords[i].x += dx;
            this.pathCoords[i].y += dy;
        }
        this.updateFrameAndPoints();
    }
    moveTo(x, y) {
        let dx = x + pointRadius - this.minX,
            dy = y + pointRadius - this.minY;
        this.move(dx, dy);
        this.stopMoving(dx, dy);
    }
    resize() {
        let i = currentPointTypeAttr;
        if (i == 0) {
            i = 2;
            curX = 2 * this.pathCoords[1].x - curX;
            curY = 2 * this.pathCoords[1].y - curY;
        }
        if (i == this.pathCoords.length - 1) {
            i = this.pathCoords.length - 3;
            curX = 2 * this.pathCoords[i + 1].x - curX;
            curY = 2 * this.pathCoords[i + 1].y - curY;
        }
        if (i % 3 == 1) {
            let dx = curX - this.pathCoords[i].x,
                dy = curY - this.pathCoords[i].y;
            this.pathCoords[i - 1].x += dx;
            this.pathCoords[i - 1].y += dy;
            this.pathCoords[i + 1].x += dx;
            this.pathCoords[i + 1].y += dy;
        }
        this.pathCoords[i].x = curX;
        this.pathCoords[i].y = curY;
        this.minX = Math.min(this.minX, curX);
        this.minY = Math.min(this.minY, curY);
        this.maxX = Math.max(this.maxX, curX);
        this.maxY = Math.max(this.maxY, curY);
        this.updateFrameAndPoints();
    }
    stopResize() {
        this.cPoint = {
            x: this.minX + (this.maxX - this.minX) / 2,
            y: this.minY + (this.maxY - this.minY) / 2
        };
        this.updateFrameAndPoints();
    }
    updatePoint() {
        this.pathCoords.push({
            x: curX,
            y: curY
        });
        this.i++;
        this.frameArray.push(new lineFrame(curX, curY, curX, curY, this),
            new lineFrame(curX, curY, curX, curY, this));
        this.pointsArray.push(new point(curX, curY, this, {
            action: "resize",
            attr: this.i * 3
        }), new point(curX, curY, this, {
            action: "resize",
            attr: this.i * 3 + 1
        }), new point(curX, curY, this, {
            action: "resize",
            attr: this.i * 3 + 2
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
        this.prevPoint = "C" + " " + curX + " " + curY + ", ";
        let x = this.pathCoords[this.i].x,
            y = this.pathCoords[this.i].y;
        this.minX = Math.min(this.minX, curX, 2 * x - curX);
        this.minY = Math.min(this.minY, curY, 2 * y - curY);
        this.maxX = Math.max(this.maxX, curX, 2 * x - curX);
        this.maxY = Math.max(this.maxY, curY, 2 * y - curY);
    }
    updatePath() {
        this.newPath = this.prevPoint + curX + " " + curY + ", " + curX + " " + curY + " ";
        this.setElementAttribute('d', this.path + this.newPath);
    }
    updateSecondPath() {
        let x = this.pathCoords[this.i].x,
            y = this.pathCoords[this.i].y;
        let newX = 2 * x - curX,
            newY = 2 * y - curY;
        this.newPath = this.prevPoint + newX + " " + newY + ", " + x + " " + y + " ";
        this.setElementAttribute('d', this.path + this.newPath);
        this.updateLine();
    }
    complete() {
        if (!vectorIsCompleted) {
            vectorIsCompleted = true;
            svgPanel.onmousedown = startVector;
            this.pathCoords = [];
            for (let i = 0; i < this.pointsArray.length; i++) {
                if (i % 3 == 0) {
                    this.pointsArray[i + 1].circle.after(this.pointsArray[i].circle);
                }
                this.pathCoords.push({
                    x: this.pointsArray[i].x,
                    y: this.pointsArray[i].y
                })
            }
            //this.pointsArray[0].circle.style.pointerEvents = "none";
            super.complete(this.path != "M" + " " + this.x0 + " " + this.y0 + " ");
        }
    }
}