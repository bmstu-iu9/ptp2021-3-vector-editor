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
        this.svgElement.setAttribute('d', this.path);
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
    updateParameters() {
    }
    removeParameters() {
        vect_panel.style.display = "none";
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
        this.pointsArray[this.i * 3 + 1].update(2 * x - curX, 2 * y - curY);
    }
    updateFirstPath() {
        this.path += this.newPath;
        this.prevPoint = "C" + " " + curX + " " + curY + ", ";
    }
    updatePath() {
        this.newPath = this.prevPoint + curX + " " + curY + ", " + curX + " " + curY + " ";
        this.svgElement.setAttribute('d', this.path + this.newPath);
    }
    updateSecondPath() {
        let x = this.pathCoords[this.i].x,
            y = this.pathCoords[this.i].y;
        let newX = 2 * x - curX,
            newY = 2 * y - curY;
        this.newPath = this.prevPoint + newX + " " + newY + ", " + x + " " + y + " ";
        this.svgElement.setAttribute('d', this.path + this.newPath);
        this.updateLine();
    }
    complete() {
        if (!vectorIsCompleted) {
            vectorIsCompleted = true;
            this.path += "Z";
            this.svgElement.setAttribute('d', this.path);
            svgPanel.onmousedown = startVector;
            super.complete(this.path != "M" + " " + this.x0 + " " + this.y0 + " " + "Z");
        }
    }
}