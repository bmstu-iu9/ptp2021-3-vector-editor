class object {
    constructor(name) {
        this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", name);
        svgPanel.appendChild(this.svgElement);
        this.x0 = curX;
        this.y0 = curY;
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

        this.updateVertNum = this.updateVertNum.bind(this);
    }
    updateAttributes() {
        let dx = curX - this.x0,
            dy = curY - this.y0,
            r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
            phi = dy > 0 ? Math.acos(dx / r) : -Math.acos(dx / r);
        for (let i = 0; i < this.vertNum; i++) {
            let x = this.x0 + r * Math.cos(phi + 2 * Math.PI * i / this.vertNum);
            let y = this.y0 + r * Math.sin(phi + 2 * Math.PI * i / this.vertNum);
            if (i == 0) this.points = x + " " + y;
            else this.points += ", " + x + " " + y;
        }
        this.svgElement.setAttribute('points', this.points);
    }
    updateVertNum(event) {
        if (event.code == 'ArrowUp') {
            curVertNum++;
            this.vertNum++;
            this.updateAttributes();
        }
        if (event.code == 'ArrowDown' && curVertNum > 3) {
            curVertNum--;
            this.vertNum--;
            this.updateAttributes();
        }
    }
}

//PENCIL
class pencil extends object {
    constructor() {
        super('polyline');
        this.path = curX + " " + curY;
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
    constructor() {
        super('line');
        this.svgElement.setAttribute('x1', curX);
        this.svgElement.setAttribute('y1', curY);
        this.svgElement.setAttribute('x2', curX);
        this.svgElement.setAttribute('y2', curY);
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