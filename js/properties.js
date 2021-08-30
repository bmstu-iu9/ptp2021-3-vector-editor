objPanel = document.getElementById("obj_panel");
rectPanel = document.getElementById("rect_panel");
rectX = document.getElementById("rectX");
rectY = document.getElementById("rectY");
rectW = document.getElementById("rectW");
rectH = document.getElementById("rectH");
rectR = document.getElementById("rectR");

property = document.getElementsByClassName("property");

for (i = 0; i < property.length; i++) {
    property[i].onkeyup = (e) => {
        if (e.key == 'Enter') {
            e.target.blur();
        }
    }
}

/*propertyA = document.getElementsByClassName("property a");
for (i = 0; i < propertyA.length; i++) {
    propertyA[i].onchange = (e) => {
        currentObject.startRotating();
        currentObject.rotate(e.target.value);
        currentObject.stopRotating();
    }
}*/

rectX.onchange = () => {
    currentObject.move(rectX.value - currentObject.x, 0);
    currentObject.stopMoving(rectX.value - currentObject.x, 0);
}

rectY.onchange = () => {
    currentObject.move(0, rectY.value - currentObject.y);
    currentObject.stopMoving(0, rectY.value - currentObject.y);
}

rectW.onchange = () => {
    let w = rectW.value;
    if (w < 1) {
        rectW.value = 1;
        w = 1;
    }
    currentPointTypeAttr = "r";
    currentObject.resize(w - currentObject.width, 0);
    currentObject.stopResize(w - currentObject.width, 0);
}

rectH.onchange = () => {
    let h = rectH.value;
    if (h < 1) {
        rectH.value = 1;
        h = 1;
    }
    currentPointTypeAttr = "b";
    currentObject.resize(0, h - currentObject.height);
    currentObject.stopResize(0, h - currentObject.height);
}

rectR.onchange = () => {
    let r = rectR.value;
    if (r > 50) {
        rectR.value = 50;
        r = 50;
    }
    if (r < 0) {
        rectR.value = 0;
        r = 0;
    }
    currentObject.setElementAttribute('rx', Math.max(currentObject.height, currentObject.width) * r / 100);
    currentObject.r = r;
}