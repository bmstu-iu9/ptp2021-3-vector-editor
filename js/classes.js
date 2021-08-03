class object {
    constructor(name) {
        this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", name);;
        svgPanel.appendChild(this.svgElement);
        this.x0 = curX;
        this.y0 = curY;
        this.svgElement.setAttribute('fill', getCurrentColor());
        /*console.log(getCurrentColor());*/

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
    updateAttributes() {
        this.svgElement.setAttribute('width', Math.abs(curX - this.x0));
        this.svgElement.setAttribute('height', Math.abs(curY - this.y0));
        this.svgElement.setAttribute('x', Math.min(this.x0, curX));
        this.svgElement.setAttribute('y', Math.min(this.y0, curY));
    }
}

//ELLIPSE

class ellipse extends object {
    constructor() {
        super('ellipse');
    }
    updateAttributes() {
        this.svgElement.setAttribute("rx", Math.abs(curX - this.x0) / 2);
        this.svgElement.setAttribute("ry", Math.abs(curY - this.y0) / 2);
        this.svgElement.setAttribute("cx", Math.min(this.x0, curX) + Math.abs(curX - this.x0) / 2);
        this.svgElement.setAttribute("cy", Math.min(this.y0, curY) + Math.abs(curY - this.y0) / 2);
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