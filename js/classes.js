class object{
    constructor(name) {
        this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", name);;
        svgPanel.appendChild(this.svgElement);

        this.svgElement.addEventListener("click", function() {
            if (wasPressed == "cursor"){
                if (currentObject != null){
                    currentObject.setAttribute('stroke', "black");
                    currentObject.setAttribute('stroke-width', "1");
                }
                this.setAttribute('stroke', "red");
                this.setAttribute('stroke-width', "3");
                currentObject = this;
            }
        });
    }
}

//RECTANGLE

class rectangle extends object {
    updateAttributes(x0, y0, curX, curY){
        this.svgElement.setAttribute('width', Math.abs(curX - x0));
        this.svgElement.setAttribute('height', Math.abs(curY - y0));
        this.svgElement.setAttribute('x', Math.min(x0, curX));
        this.svgElement.setAttribute('y', Math.min(y0, curY));
    }
}

//ELLIPSE

class ellipse extends object {
    updateAttributes(x0, y0, curX, curY){
        this.svgElement.setAttribute("rx", Math.abs(curX - x0)/2);
        this.svgElement.setAttribute("ry", Math.abs(curY - y0)/2);
        this.svgElement.setAttribute("cx", Math.min(x0, curX)+Math.abs(curX - x0)/2);
        this.svgElement.setAttribute("cy", Math.min(y0, curY)+Math.abs(curY - y0)/2);
    }
}

//PENCIL

class pencil extends object {
    constructor(name, x0, y0){
        super(name);

        this.path = x0 + " " + y0 + ", ";
        this.svgElement.setAttribute('fill', "none");
        this.svgElement.setAttribute('stroke', "black");
        this.svgElement.setAttribute('points', this.path);
    }
    updateAttributes(curX, curY){
        this.path += curX + " " + curY + ", ";
        this.svgElement.setAttribute('points', this.path);
    }
}