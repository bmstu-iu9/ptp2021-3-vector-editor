class vector extends object {
    constructor() {
        super('path');
        this.path = "M" + this.x0 + " " + this.y0 + " ";
        this.pathCoords = [{
            x: this.x0,
            y: this.y0
        }];
        this.i = 0;
        this.newPath = "";
        this.svgElement.setAttribute('d', this.path);
    }

    updatePoint() {
        this.pathCoords.push({
            x: curX,
            y: curY
        });
        this.i++;
    }
    updateFirstPath() {
        this.path += this.newPath;

        let x = this.pathCoords[this.i].x,
            y = this.pathCoords[this.i].y;
        this.prevPoint = "C" + " " + (2 * x - curX) + " " + (2 * y - curY) + ", ";
    }
    updatePath() {
        this.newPath = this.prevPoint + curX + " " + curY + ", " + curX + " " + curY + " ";
        this.svgElement.setAttribute('d', this.path + this.newPath);
    }
    updateSecondPath() {
        let x = this.pathCoords[this.i].x,
            y = this.pathCoords[this.i].y;
        this.newPath = this.prevPoint + curX + " " + curY + ", " + x + " " + y + " ";
        this.svgElement.setAttribute('d', this.path + this.newPath);
    }
    complete() {
        if (!vectorIsCompleted) {
            vectorIsCompleted = true;
            this.path += "Z";
            this.svgElement.setAttribute('d', this.path);
            svgPanel.onmousedown = startVector;
            super.complete(this.path != "M" + this.x0 + " " + this.y0 + " " + "Z");
        }
    }
}