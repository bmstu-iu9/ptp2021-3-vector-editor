property = document.getElementsByClassName("property");

for (i = 0; i < property.length; i++) {
    property[i].onkeyup = (e) => {
        if (e.key == 'Enter')
            e.target.blur();
    }
}

for (i = 0; i < property.length; i++) {
    property[i].onmousedown = (e) =>
        doFunc("property", currentObject, [e.target, e.target.value]);
}

angleInput = document.getElementById("angle");
angleInput.onchange = () => {
    let a = angleInput.value;
    if (a >= 360) a %= 360;
    if (a <= -360) a %= 360;
    angleInput.value = a;
    currentObject.rotateTo(angleInput.value * Math.PI / 180.0);
}

function resizeX(dx) {
    currentObject.startResize();
    currentObject.resize(dx, 0);
    currentObject.stopResize();
    currentObject.updateParameters();
}

function resizeY(dy) {
    currentObject.startResize();
    currentObject.resize(0, dy);
    currentObject.stopResize();
    currentObject.updateParameters();
}

function resizeW(dx) {
    currentPointTypeAttr = "r";
    resizeX(dx);
    currentPointTypeAttr = "l";
    resizeX(-dx);
}

function resizeH(dy) {
    currentPointTypeAttr = "b";
    resizeY(dy);
    currentPointTypeAttr = "t";
    resizeY(-dy);
}

function moveX(dx) {
    currentObject.move(dx, 0);
    currentObject.stopMoving(dx, 0);
}

function moveY(dy) {
    currentObject.move(0, dy);
    currentObject.stopMoving(0, dy);
}

//rectangle
rectX.onchange = () => moveX(rectX.value - currentObject.x);

rectY.onchange = () => moveY(rectY.value - currentObject.y);

rectW.onchange = () => {
    let w = rectW.value;
    if (w < 1) {
        rectW.value = 1;
        w = 1;
    }
    resizeW((w - currentObject.width) / 2);
}

rectH.onchange = () => {
    let h = rectH.value;
    if (h < 1) {
        rectH.value = 1;
        h = 1;
    }
    resizeH((h - currentObject.height) / 2);
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

//ellipse
ellCX.onchange = () => moveX(ellCX.value - currentObject.cx);

ellCY.onchange = () => moveY(ellCY.value - currentObject.cy);

ellRX.onchange = () => {
    let rx = ellRX.value;
    if (rx < 1) {
        ellRX.value = 1;
        rx = 1;
    }
    resizeW(rx - currentObject.rx);
}

ellRY.onchange = () => {
    let ry = ellRY.value;
    if (ry < 1) {
        ellRY.value = 1;
        ry = 1;
    }
    resizeH(ry - currentObject.ry);
}

//line
lineX1.onchange = () => {
    currentPointTypeAttr = "l";
    resizeX(lineX1.value - currentObject.x0);
}

lineY1.onchange = () => {
    currentPointTypeAttr = "t";
    resizeY(lineY1.value - currentObject.y0);
}

lineX2.onchange = () => {
    currentPointTypeAttr = "r";
    resizeX(lineX2.value - currentObject.x2);
}

lineY2.onchange = () => {
    currentPointTypeAttr = "b";
    resizeY(lineY2.value - currentObject.y2);
}

lineL.onchange = () => {
    let l = lineL.value;
    if (l < 1) {
        lineL.value = 1;
        l = 1;
    }
    let dl = (l - currentObject.len) / 2;
    let dx = currentObject.sin * dl;
    let dy = currentObject.cos * dl;
    resizeW(dx);
    resizeH(dy);
}

//pencil
penX.onchange = () => moveX(penX.value - currentObject.minX);

penY.onchange = () => moveY(penY.value - currentObject.minY);

//polygon
polR.onchange = () => {
    let r = Number(polR.value);
    if (r < 1) {
        polR.value = 1;
        r = 1;
    }
    currentObject.r = r;
    currentObject.updateFrameAndPoints();
}

polN.onchange = () => {
    let n = polN.value;
    if (n < 3) n = 3;
    if (currentObject.type == 'star' && n < 5) n = 5;
    polN.value = n;
    currentObject.vertNum = n;
    currentObject.radiusIsFixed = true;
    currentObject.updateVertNum(e = {
        code: "changeN"
    });
    currentObject.radiusIsFixed = false;
    if (currentObject.type == 'star') {
        var event = new Event('change');
        polS.dispatchEvent(event);
    }
}

polS.onchange = () => {
    let s = Number(polS.value);
    let max = Math.floor((currentObject.vertNum - 3) / 2) + 1;
    if (s < 2) s = 2;
    if (s > max) s = max;
    polS.value = s;
    currentObject.step = s;
    currentObject.radiusIsFixed = true;
    currentObject.updateFrameAndPoints();
    currentObject.radiusIsFixed = false;
}
polX.onchange = () => moveX(Number(polX.value) - currentObject.x0);

polY.onchange = () => moveY(Number(polY.value) - currentObject.y0);
//polyline
pLineX.onchange = () => moveX(pLineX.value - currentObject.minX);

pLineY.onchange = () => moveY(pLineY.value - currentObject.minY);

polEnd.onchange = () => {
    if (polEnd.checked) {
        currentObject.hasEnd = true;
        currentObject.updateFrameAndPoints();
    } else {
        currentObject.hasEnd = false;
        currentObject.updateFrameAndPoints();
    }
}

//vector
vectX.onchange = () => moveX(vectX.value - currentObject.minX);

vectY.onchange = () => moveY(vectY.value - currentObject.minY);

vectEnd.onchange = () => {
    if (vectEnd.checked) {
        currentObject.path += "Z";
        currentObject.hasEnd = true;
        currentObject.setElementAttribute('d', currentObject.path);
    } else {
        currentObject.path = currentObject.path.substring(0, currentObject.path.length - 1);
        currentObject.hasEnd = false;
        currentObject.setElementAttribute('d', currentObject.path);
    }
}