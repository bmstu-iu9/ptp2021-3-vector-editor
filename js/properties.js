property = document.getElementsByClassName("property");

for (i = 0; i < property.length; i++) {
    property[i].onkeyup = (e) => {
        if (e.key == 'Enter') {
            e.target.blur();
        }
    }
}

angleInput = document.getElementById("angle");
angleInput.onchange = () => {
    doFunc("rotate", currentObject, currentObject.angle)
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
    doFunc("move", currentObject, currentObject.getCornerCoords())
    currentObject.move(dx, 0);
    currentObject.stopMoving(dx, 0);
}

function moveY(dy) {
    doFunc("move", currentObject, currentObject.getCornerCoords())
    currentObject.move(0, dy);
    currentObject.stopMoving(0, dy);
}

//rectangle
rectX.onchange = () => {
    moveX(rectX.value - currentObject.x);
}

rectY.onchange = () => {
    moveY(rectY.value - currentObject.y);
}

rectW.onchange = () => {
    let w = rectW.value;
    if (w < 1) {
        rectW.value = 1;
        w = 1;
    } else {
        doFunc("resize", currentObject, currentObject.getResizeAttrs());
        resizeW((w - currentObject.width) / 2);
    }
}

rectH.onchange = () => {
    let h = rectH.value;
    if (h < 1) {
        rectH.value = 1;
        h = 1;
    } else {
        doFunc("resize", currentObject, currentObject.getResizeAttrs());
        resizeH((h - currentObject.height) / 2);
    }
}

rectR.onchange = () => {
    let r = rectR.value;
    if (r > 50) {
        rectR.value = 50;
        r = 50;
    } else if (r < 0) {
        rectR.value = 0;
        r = 0;
    } else {
        doFunc("resize", currentObject, currentObject.getResizeAttrs());
        currentObject.setElementAttribute('rx', Math.max(currentObject.height, currentObject.width) * r / 100);
        currentObject.r = r;
    }
}

//ellipse
ellCX.onchange = () => {
    moveX(ellCX.value - currentObject.cx);
}

ellCY.onchange = () => {
    moveY(ellCY.value - currentObject.cy);
}

ellRX.onchange = () => {
    let rx = ellRX.value;
    if (rx < 1) {
        ellRX.value = 1;
        rx = 1;
    } else {
        doFunc("resize", currentObject, currentObject.getResizeAttrs());
        resizeW(rx - currentObject.rx);
    }
}

ellRY.onchange = () => {
    let ry = ellRY.value;
    if (ry < 1) {
        ellRY.value = 1;
        ry = 1;
    } else {
        doFunc("resize", currentObject, currentObject.getResizeAttrs());
        resizeH(ry - currentObject.ry);
    }
}

//line
lineX1.onchange = () => {
    doFunc("resize", currentObject, currentObject.getResizeAttrs());
    currentPointTypeAttr = "l";
    resizeX(lineX1.value - currentObject.x0);
}

lineY1.onchange = () => {
    doFunc("resize", currentObject, currentObject.getResizeAttrs());
    currentPointTypeAttr = "t";
    resizeY(lineY1.value - currentObject.y0);
}

lineX2.onchange = () => {
    doFunc("resize", currentObject, currentObject.getResizeAttrs());
    currentPointTypeAttr = "r";
    resizeX(lineX2.value - currentObject.x2);
}

lineY2.onchange = () => {
    doFunc("resize", currentObject, currentObject.getResizeAttrs());
    currentPointTypeAttr = "b";
    resizeY(lineY2.value - currentObject.y2);
}

lineL.onchange = () => {
    let l = lineL.value;
    if (l < 1) {
        lineL.value = 1;
        l = 1;
    } else {
        doFunc("resize", currentObject, currentObject.getResizeAttrs());
        let dl = (l - currentObject.len) / 2;
        let dx = currentObject.sin * dl;
        let dy = currentObject.cos * dl;
        resizeW(dx);
        resizeH(dy);
    }
}

//pencil
penX.onchange = () => {
    moveX(penX.value - currentObject.minX);
}

penY.onchange = () => {
    moveY(penY.value - currentObject.minY);
}

//polygon
polR.onchange = () => {
    let r = Number(polR.value);
    if (r < 1) {
        polR.value = 1;
        r = 1;
    } else {
        doFunc("resize", currentObject, currentObject.getResizeAttrs());
        currentObject.r = r;
        currentObject.updateFrameAndPoints();
    }
}

polN.onchange = () => {
    let n = polN.value;
    if (currentObject.type == 'star' && n < 5) n = 5;
    else if (n < 3) n = 3;
    else {
        doFunc("resize", currentObject, currentObject.getResizeAttrs());
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
}

polS.onchange = () => {
    doFunc("resize", currentObject, currentObject.getResizeAttrs());
    let s = Number(polS.value);
    let max = Math.floor((currentObject.vertNum - 3) / 2) + 1;
    if (s < 2) s = 2;
    else if (s > max) s = max;
    else {
        doFunc("resize", currentObject, currentObject.getResizeAttrs());
        polS.value = s;
        currentObject.step = s;
        currentObject.radiusIsFixed = true;
        currentObject.updateFrameAndPoints();
        currentObject.radiusIsFixed = false;
    }
}

polX.onchange = () => {
    doFunc("move", currentObject, currentObject.getCornerCoords())
    currentObject.x0 = Number(polX.value);
    currentObject.updateFrameAndPoints();
}

polY.onchange = () => {
    doFunc("move", currentObject, currentObject.getCornerCoords())
    currentObject.y0 = Number(polY.value);
    currentObject.updateFrameAndPoints();
}

//polyline
pLineX.onchange = () => {
    moveX(pLineX.value - currentObject.minX);
}

pLineY.onchange = () => {
    moveY(pLineY.value - currentObject.minY);
}