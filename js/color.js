var fills = document.querySelectorAll('input[type=radio][name="fill"]');
var strokes = document.querySelectorAll('input[type=radio][name="stroke"]');

//COLOR CHANGE
strokeColor = document.getElementById("strokeColor");

strokeColor.onchange = changeStroke;
strokes.forEach(s => s.addEventListener('change', () => changeStroke()));

function changeStroke() {
    if (currentObject != null) {
        currentObject.svgElement.setAttribute('stroke', getCurrentStrokeColor());
    }
}

fillColor = document.getElementById("fillColor");

fillColor.onchange = changeFill;
fills.forEach(f => f.addEventListener('change', () => changeFill()));

function changeFill() {
    if (currentObject != null && currentObject.type != 'pencil') {
        currentObject.svgElement.setAttribute('fill', getCurrentFillColor());
    }
}

//CURRENT COLOR
function getCurrentFillColor() {
  if(fills[0].checked) {
    return "none";
  }
  return fillColor.value;
}

function getCurrentStrokeColor() {
  if(strokes[0].checked) {
    return "none";
  }
  return strokeColor.value;
}

//fill tool
fill = document.getElementById("fill");
fill.onclick = function () {
  wasPressed = "fill";
  svgPanel.style.cursor = "url(img/fill.ico), default";
}

//style lists

strokeChoise = document.getElementById("strokeChoise");
strokeStyle = document.getElementById("strokeStyle");
fillChoise = document.getElementById("fillChoise");
fillStyle = document.getElementById("fillStyle");
strokeChoiseChecked = false, fillChoiseChecked = false;

strokeChoise.onclick = () => {
  if (!strokeChoiseChecked) {
    strokeStyle.style.display = "block";
    fillStyle.style.display = "none";
    fillChoiseChecked = false;
    strokeChoiseChecked = true;
  } else {
    strokeStyle.style.display = "none";
    strokeChoiseChecked = false;
  }
  document.onclick = (event) => {
    if (event.target != strokeChoise) {
      strokeStyle.style.display = "none";
      strokeChoiseChecked = false;
      document.onclick = null;
    }
  }
}
fillChoise.onclick = () => {
  if (!fillChoiseChecked) {
    fillStyle.style.display = "block";
    fillChoiseChecked = true;
  } else {
    fillStyle.style.display = "none";
    fillChoiseChecked = false;
  }
  document.onclick = (event) => {
    //for(strokeStyle.children.length);
    if (event.target != fillChoise) {
      fillStyle.style.display = "none";
      fillChoiseChecked = false;
      document.onclick = null;
    }
  }
}