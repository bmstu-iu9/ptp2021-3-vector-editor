//COLOR CHANGE
function changeStroke(c, w, l, d, j) {
  if (currentObject != null) {
    updateStroke(currentObject, c, w, l, d, j);
  }
}

function changeFill(i) {
  if (currentObject != null && currentObject.type != 'pencil') {
    updateFill(currentObject.svgElement, i);
  }
}
strokeColor = document.getElementById("strokeColor");
strokeColor.onchange = () => changeStroke(1, 0, 0, 0, 0);

fillColor = document.getElementById("fillColor");
fillColor.onchange = () => changeFill(2);

//presence of stroke & fill
s = document.getElementById("stroke");
f = document.getElementById("fill");
sImg = document.getElementById("sImg");
fImg = document.getElementById("fImg");

s.onchange = () => {
  if (s.checked && (currentObject == null || (currentObject.type != 'pencil' && currentObject.type != 'line'))) {
    sImg.src = "img/stroke/no.svg";
    f.checked = false;
    fImg.src = "img/stroke/yes.svg";
    changeFill();
  } else sImg.src = "img/stroke/yes.svg";
  changeStroke();
}

f.onchange = () => {
  if (f.checked) {
    fImg.src = "img/stroke/no.svg";
    s.checked = false;
    sImg.src = "img/stroke/yes.svg";
    changeStroke();
  } else fImg.src = "img/stroke/yes.svg";
  changeFill();
}

//OPACITY
opacity = document.getElementsByClassName("opacity");
opValue = document.getElementsByClassName("opValue");

for (i = 0; i < 2; i++) {
  opacity[i].i = i;
  opacity[i].onmousedown = (e) => {
    let i = e.target.i;
    rightPanel.onmousemove = () => {
      changeFill(i);
      opValue[i].textContent = Math.round(opacity[i].value * 100);
    }
    document.onmouseup = () => {
      rightPanel.onmousemove();
      rightPanel.onmousemove = null;
      document.onmouseup = null;
    }
  }
}

//CURRENT COLOR
function updateFill(obj, i = -1) {
  if (f.checked) {
    obj.setAttribute('fill', "transparent");
    return;
  }
  if (i == 0 || i == -1) obj.setAttribute('opacity', opacity[0].value);
  if (i == 1 || i == -1) obj.setAttribute('fill-opacity', opacity[1].value);
  if (i == 2 || i == -1) obj.setAttribute('fill', fillColor.value);
}

//stroke style
caps = document.querySelectorAll('input[type=radio][name="cap"]');
caps.forEach(s => s.addEventListener('change', () => changeStroke(0, 0, 1, 0, 0)));
dashs = document.querySelectorAll('input[type=radio][name="dash"]');
dashs.forEach(s => s.addEventListener('change', () => changeStroke(0, 0, 0, 1, 0)));
join = document.querySelectorAll('input[type=radio][name="join"]');
join.forEach(s => s.addEventListener('change', () => changeStroke(0, 0, 0, 0, 1)));

strokeWidth = document.getElementById("strokeWidth");
strokeWidth.onchange = () => {
  changeStroke(0, 1, 0, 0, 0);
}

function updateStroke(object, c = 1, width = 1, l = 1, d = 1, j = 1) {
  let obj = object.svgElement;
  if (s.checked && (object == null || (object.type != 'pencil' && object.type != 'line'))) {
    obj.removeAttribute('stroke');
    object.strokeWidth = 0;
    if (object.isCompleted) object.updateFrameAndPoints();
    return;
  }
  if (c) obj.setAttribute('stroke', strokeColor.value);
  if (width) {
    let wid = Number(strokeWidth.value);
    obj.setAttribute('stroke-width', wid);
    object.strokeWidth = wid;
  }
  let w = object.strokeWidth;
  let cap = 0;
  if (l)
    switch (true) {
      case caps[0].checked:
        obj.removeAttribute('stroke-linecap');
        break;
      case caps[1].checked:
        obj.setAttribute('stroke-linecap', "square");
        break;
      case caps[2].checked:
        obj.setAttribute('stroke-linecap', "round");
        break;
    }
  if (d || l || w) {
    let capAttr = obj.getAttribute('stroke-linecap');
    if (capAttr == "square" || capAttr == "round") cap = w;
    switch (true) {
      case dashs[0].checked:
        obj.removeAttribute('stroke-dasharray');
        break;
      case dashs[1].checked:
        obj.setAttribute('stroke-dasharray', (4 * w - cap) + " " + (1.5 * w + cap));
        break;
      case dashs[2].checked:
        obj.setAttribute('stroke-dasharray', (4 * w - cap) + " " + (4 * w + cap));
        break;
      case dashs[3].checked:
        obj.setAttribute('stroke-dasharray', (w - cap) + " " + (w + cap));
        break;
      case dashs[4].checked:
        obj.setAttribute('stroke-dasharray', (4 * w - cap) + " " + (w + cap) + " " + (w - cap) + " " + (w + cap) + " " + (w - cap) + " " + (w + cap));
        break;
      case dashs[5].checked:
        obj.setAttribute('stroke-dasharray', (4 * w - cap) + " " + (w + cap) + " " + (w - cap) + " " + (w + cap));
        break;
    }
  }
  if (j)
    switch (true) {
      case join[0].checked:
        obj.removeAttribute('stroke-linejoin');
        break;
      case join[1].checked:
        obj.setAttribute('stroke-linejoin', "round");
        break;
      case join[2].checked:
        obj.setAttribute('stroke-linejoin', "bevel");
        break;
    }
  if (object.isCompleted) object.updateFrameAndPoints(); //исправить!
}

//fill tool
fill = document.getElementById("filling");
fill.onclick = function () {
  wasPressed = "fill";
  svgPanel.style.cursor = "url(img/fill.ico) 4 28, default";
  svgPanel.onmousedown = function (event) {
    if (event.target == svgBackground) svgPanel.style.background = getCurrentFillColor();
  }
}