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

ellCX.onchange = () => {
    currentObject.move(ellCX.value - currentObject.cx, 0);
    currentObject.stopMoving(ellCX.value - currentObject.cx, 0);
}

ellCY.onchange = () => {
    currentObject.move(0, ellCY.value - currentObject.cy);
    currentObject.stopMoving(0, ellCY.value - currentObject.cy);
}

ellRX.onchange = () => {
    let rx = ellRX.value;
    if (rx < 1) {
        ellRX.value = 1;
        rx = 1;
    }
    currentPointTypeAttr = "r";
    currentObject.resize(rx - currentObject.rx, 0);
    currentObject.stopResize(rx - currentObject.rx, 0);
}

ellRY.onchange = () => {
    let ry = ellRY.value;
    if (ry < 1) {
        ellRY.value = 1;
        ry = 1;
    }
    currentPointTypeAttr = "b";
    currentObject.resize(0, ry - currentObject.ry);
    currentObject.stopResize(0, ry - currentObject.ry);
}

lineX1.onchange = () => {
    currentPointTypeAttr = "l";
    currentObject.resize(lineX1.value - currentObject.x0, 0);
    currentObject.stopResize(lineX1.value - currentObject.x0, 0);
}

lineY1.onchange = () => {
    currentPointTypeAttr = "t";
    currentObject.resize(0, lineY1.value - currentObject.y0);
    currentObject.stopResize(0, lineY1.value - currentObject.y0);
}

lineX2.onchange = () => {
    currentPointTypeAttr = "r";
    currentObject.resize(lineX2.value - currentObject.x2, 0);
    currentObject.stopResize(lineX2.value - currentObject.x2, 0);
}

lineY2.onchange = () => {
    currentPointTypeAttr = "b";
    currentObject.resize(0, lineY2.value - currentObject.y2);
    currentObject.stopResize(0, lineY2.value - currentObject.y2);
}

penX.onchange = () => {
    currentObject.move(penX.value - currentObject.minX, 0);
    currentObject.stopMoving(penX.value - currentObject.minX, 0);
}

penY.onchange = () => {
    currentObject.move(0, penY.value - currentObject.minY);
    currentObject.stopMoving(0, penY.value - currentObject.minY);
}