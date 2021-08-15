//COLOR CHANGE
function changeStroke() {
  if (currentObject != null) {
    updateStroke(currentObject);
  }
}

function changeFill() {
  if (currentObject != null && currentObject.type != 'pencil') {
    currentObject.svgElement.setAttribute('fill', getCurrentFillColor());
  }
}
strokeColor = document.getElementById("strokeColor");
strokeColor.onchange = changeStroke;

fillColor = document.getElementById("fillColor");
fillColor.onchange = changeFill;

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
  if (currentObject != null) {
    currentObject.updateFrameAndPoints();
  }
}

f.onchange = () => {
  if (f.checked) {
    fImg.src = "img/stroke/no.svg";
    s.checked = false;
    sImg.src = "img/stroke/yes.svg";
    changeStroke()
    if (currentObject != null) {
      currentObject.updateFrameAndPoints();
    }
  } else fImg.src = "img/stroke/yes.svg";
  changeFill();
}

//CURRENT COLOR
function getCurrentFillColor() {
  if (f.checked) {
    return "transparent";
  }
  return fillColor.value;
}

//stroke style
dashs = document.querySelectorAll('input[type=radio][name="dash"]');
dashs.forEach(s => s.addEventListener('change', () => changeStroke()));
join = document.querySelectorAll('input[type=radio][name="join"]');
join.forEach(s => s.addEventListener('change', () => changeStroke()));
cap = document.querySelectorAll('input[type=radio][name="cap"]');
cap.forEach(s => s.addEventListener('change', () => changeStroke()));

strokeWidth = document.getElementById("strokeWidth");
strokeWidth.onchange = () => {
  changeStroke();
  if (currentObject != null) {
    currentObject.updateFrameAndPoints();
  }
}

function updateStroke(object) {
  obj = object.svgElement;
  if (s.checked && (currentObject == null || (currentObject.type != 'pencil' && currentObject.type != 'line'))) {
    obj.removeAttribute('stroke');
    object.strokeWidth = 0;
    return;
  }
  obj.setAttribute('stroke', strokeColor.value);
  let w = strokeWidth.value;
  obj.setAttribute('stroke-width', w);
  object.strokeWidth = w;
  switch (true) {
    case dashs[0].checked:
      obj.removeAttribute('stroke-dasharray');
      break;
    case dashs[1].checked:
      obj.setAttribute('stroke-dasharray', 4 * w + " " + 1.5 * w);
      break;
    case dashs[2].checked:
      obj.setAttribute('stroke-dasharray', 4 * w + " " + 4 * w);
      break;
    case dashs[3].checked:
      obj.setAttribute('stroke-dasharray', w);
      break;
    case dashs[4].checked:
      obj.setAttribute('stroke-dasharray', 4 * w + " " + w + " " + w + " " + w + " " + w + " " + w);
      break;
    case dashs[5].checked:
      obj.setAttribute('stroke-dasharray', 4 * w + " " + w + " " + w + " " + w);
      break;
  }
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
  switch (true) {
    case cap[0].checked:
      obj.removeAttribute('stroke-linecap');
      break;
    case cap[1].checked:
      obj.setAttribute('stroke-linecap', "square");
      break;
    case cap[2].checked:
      obj.setAttribute('stroke-linecap', "round");
      break;
  }
}

//fill tool
fill = document.getElementById("filling");
fill.onclick = function () {
  wasPressed = "fill";
  svgPanel.style.cursor = "url(img/fill.ico), default";
}