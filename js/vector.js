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
        this.setElementAttribute('d', this.path);
        this.frameArray = [new lineFrame(curX, curY, curX, curY, this)];
        this.pointsArray = [new point(curX, curY, this, {
            action: "vector",
            attr: this.i * 3
        }), new point(curX, curY, this, {
            action: "vector",
            attr: this.i * 3 + 1
        }), new point(curX, curY, this, {
            action: "vector",
            attr: this.i * 3 + 2
        })];
    }
    addParameters() {
        vect_panel.style.display = "flex";
    }
    updateParameters() {}
    removeParameters() {
        vect_panel.style.display = "none";
    }
    updateFrameAndPoints(dx = 0, dy = 0) {
        for (let i = 0; i < this.pathCoords.length; i++) {
            let x = this.pathCoords[i].x + dx,
                y = this.pathCoords[i].y + dy;
            this.pointsArray[i].update(x, y);
            if (i == 0) {
                this.x1 = x;
                this.y1 = y;
                continue;
            }
            if (i == 1) {
                this.path = "M" + " " + x + " " + y + " ";
                continue;
            }
            if (i == this.pathCoords.length - 1) {
                this.frameArray[i / 3 | 0].update(x, y, this.x1, this.y1);
                continue;
            }
            if (i % 3 == 2) {
                this.frameArray[i / 3 | 0].update(x, y, this.x1, this.y1);
                this.path += "C" + " " + x + " " + y + ", ";
            }
            if (i % 3 == 0) {
                this.x1 = x;
                this.y1 = y;
                this.path += x + " " + y + ", ";
            }
            if (i % 3 == 1) this.path += x + " " + y + " ";

            //currentPointTypeAttr = this.i * 3 + 2;
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
        for (let i = 0; i < this.pathCoords.length; i++) {
            this.pathCoords[i].x += dx,
                this.pathCoords[i].y += dy;
        }
        this.updateFrameAndPoints();
    }
    updatePoint() {
        this.pathCoords.push({
            x: curX,
            y: curY
        });
        this.i++;
        this.frameArray.push(new lineFrame(curX, curY, curX, curY, this));
        this.pointsArray.push(new point(curX, curY, this, {
            action: "vector",
            attr: this.i * 3
        }), new point(curX, curY, this, {
            action: "vector",
            attr: this.i * 3 + 1
        }), new point(curX, curY, this, {
            action: "vector",
            attr: this.i * 3 + 2
        }));
    }
    updateLine() {
        let x = this.pathCoords[this.i].x,
            y = this.pathCoords[this.i].y;
        this.frameArray[this.i].update(curX, curY, 2 * x - curX, 2 * y - curY);
        currentPointTypeAttr = this.i * 3 + 2;
        this.pointsArray[this.i * 3 + 2].update(curX, curY);
        this.pointsArray[this.i * 3].update(2 * x - curX, 2 * y - curY);
    }
    updateFirstPath() {
        this.path += this.newPath;
        this.prevPoint = "C" + " " + curX + " " + curY + ", ";
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
                this.pathCoords.push({
                    x: this.pointsArray[i].x,
                    y: this.pointsArray[i].y
                })
            }
            super.complete(this.path != "M" + " " + this.x0 + " " + this.y0 + " ");
        }
    }
}