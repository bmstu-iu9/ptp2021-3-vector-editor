class object {
    constructor(name) {
        this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", name);
        svgPanel.appendChild(this.svgElement);
        this.type = name;
        this.x0 = curX;
        this.y0 = curY;
        this.pointsArray = [];
        this.svgElement.setAttribute('fill', getCurrentColor());

        this.svgElement.addEventListener("click", function () {
            if (wasPressed == "cursor") {
                if (currentObject != null) {
                    currentObject.setAttribute('stroke', strokeColor);
                    currentObject.setAttribute('stroke-width', "1");
                }
                strokeColor = this.getAttribute('fill');
                this.setAttribute('stroke', "red");
                this.setAttribute('stroke-width', "3");
                currentObject = this;
            }
        });
    }
    remove() {
        svgPanel.removeChild(this.svgElement);
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].remove();
        }
    }
    setElementAttribute(attributeName, value) {
        this.svgElement.setAttribute(attributeName, value);
    }
    getElementAttribute(attributeName) {
        return this.svgElement.getAttribute(attributeName);
    }
    hidePoints() {
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].hide();
        }
    }
    showPoints() {
        for (let i = 0; i < this.pointsArray.length; i++) {
            this.pointsArray[i].show();
        }
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
        this.svgElement.setAttribute('width', absW);
        this.svgElement.setAttribute('height', absH);
        this.svgElement.setAttribute('x', Math.min(this.x0, this.x0 + signW * absW));
        this.svgElement.setAttribute('y', Math.min(this.y0, this.y0 + signH * absH));
    }
}

//ELLIPSE
class ellipse extends object {
    constructor() {
        super('ellipse');
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
        this.svgElement.setAttribute('rx', absW);
        this.svgElement.setAttribute('ry', absH);
        this.svgElement.setAttribute('cx', Math.min(this.x0, this.x0 + 2 * signW * absW) + absW);
        this.svgElement.setAttribute('cy', Math.min(this.y0, this.y0 + 2 * signH * absH) + absH);
    }
}

//POLYGON
class polygon extends object {
    constructor() {
        super('polygon');
        this.vertNum = curVertNum;
        this.points = "";
    }
    updateAttributes(current) {
        let dx = curX - this.x0,
            dy = curY - this.y0,
            r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
            phi = 0;
        if (current.shiftKey) phi = (this.vertNum - 2) * Math.PI / (this.vertNum * 2);
        else if (r > 0) phi = dy > 0 ? Math.acos(dx / r) : -Math.acos(dx / r);
        for (let i = 0; i < this.vertNum; i++) {
            let x = this.x0 + r * Math.cos(phi + 2 * Math.PI * i / this.vertNum);
            let y = this.y0 + r * Math.sin(phi + 2 * Math.PI * i / this.vertNum);
            if (i == 0) this.points = x + " " + y;
            else this.points += ", " + x + " " + y;
        }
        this.svgElement.setAttribute('points', this.points);

    }
    addHotKeys() {
        document.addEventListener('keydown', this.updateVertNum.bind(this));
    }
    removeHotKeys() {
        document.removeEventListener('keydown', this.updateVertNum.bind(this));
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
}

//PENCIL
class pencil extends object {
    constructor() {
        super('polyline');
        this.path = this.x0 + " " + this.y0;
        this.svgElement.setAttribute('fill', "none");
        this.svgElement.setAttribute('stroke', getCurrentColor());
        this.svgElement.setAttribute('points', this.path);
    }
    updateAttributes() {
        this.path += ", " + curX + " " + curY;
        this.svgElement.setAttribute('points', this.path);
    }
}

//LINE
class line extends object {
    constructor(x1 = curX, y1 = curY, x2 = curX, y2 = curY) {
        super('line');
        this.x0 = x1;
        this.y0 = y1;
        this.svgElement.setAttribute('x1', x1);
        this.svgElement.setAttribute('y1', y1);
        this.svgElement.setAttribute('x2', x2);
        this.svgElement.setAttribute('y2', y2);
        this.svgElement.setAttribute('stroke', getCurrentColor());
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
        this.svgElement.setAttribute('x2', this.x0 + signW * absW);
        this.svgElement.setAttribute('y2', this.y0 + signH * absH);
    }
}

//POLYLINE
class polyline extends object {
    constructor() {
        super('polyline');
        this.points = this.x0 + " " + this.y0;
        this.svgElement.setAttribute('fill', getCurrentColor());
        this.svgElement.setAttribute('stroke', getCurrentColor());
        this.svgElement.setAttribute('points', this.points);
        this.pointsArray.push(new point(this.x0, this.y0, this));
        this.pointsArray[0].setPointAttribute('fill', "blue");
        this.line = new line();
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
            this.completePolyline();
            return;
        }
        if (x != this.x0) {
            this.points += ", " + x + " " + y;
            this.svgElement.setAttribute('points', this.points);
            this.pointsArray.push(new point(x, y, this));
            this.line.remove();
            this.line = new line(x, y, curX, curY);
            this.line.setElementAttribute('stroke-opacity', "0.3");
            this.line.setElementAttribute('stroke', this.svgElement.getAttribute('stroke'));
        }
    }
    completePolyline() {
        if (!completed) {
            if (this.pointsArray.length < 2) {
                this.remove();
            }
            this.line.remove();
            this.points += ", " + this.x0 + " " + this.y0;
            this.svgElement.setAttribute('points', this.points);
            completed = true;
            this.hidePoints();
            document.onmousemove = null;
            svgPanel.onmouseup = null;
            document.onclick = null;
        }
    }
}

//POINT
class point {
    constructor(x, y, object) {
        this.circle = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
        svgPanel.appendChild(this.circle);
        this.x = x;
        this.y = y;
        this.object = object;
        this.circle.setAttribute('fill', "white");
        this.circle.setAttribute('stroke', "black");
        this.circle.setAttribute('cx', x);
        this.circle.setAttribute('cy', y);
        this.circle.setAttribute('rx', pointRadius);
        this.circle.setAttribute('ry', pointRadius);
    }
    hide() {
        this.circle.setAttribute('fill-opacity', 0);
        this.circle.setAttribute('stroke-opacity', 0);
    }
    remove() {
        svgPanel.removeChild(this.circle);
    }
    show() {
        this.circle.setAttribute('fill-opacity', 1);
        this.circle.setAttribute('stroke-opacity', 1);
    }
    setPointAttribute(attributeName, value) {
        this.circle.setAttribute(attributeName, value);
    }
}