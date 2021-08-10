strokeWidth=document.getElementById("strokeWidth");

//COLOR CHANGE
strokeColor = document.getElementById("strokeColor");

strokeColor.onchange = changeStroke;

function changeStroke() {
  if (currentObject != null) {
    currentObject.svgElement.setAttribute('stroke', getCurrentStrokeColor());
  }
}

fillColor = document.getElementById("fillColor");

fillColor.onchange = changeFill;

function changeFill() {
  if (currentObject != null && currentObject.type != 'pencil') {
    currentObject.svgElement.setAttribute('fill', getCurrentFillColor());
  }
}

s = document.getElementById("stroke");
f = document.getElementById("fill");
sImg = document.getElementById("sImg");
fImg = document.getElementById("fImg");

//presence of stroke & fill
s.onchange = () => {
  if (s.checked) {
    sImg.src = "img/stroke/no.svg";
  } else sImg.src = "img/stroke/yes.svg";
  changeStroke();
}

f.onchange = () => {
  if (f.checked) {
    fImg.src = "img/stroke/no.svg";
  } else fImg.src = "img/stroke/yes.svg";
  changeFill();
}

//CURRENT COLOR
function getCurrentFillColor() {
  if (f.checked) {
    return "none";
  }
  return fillColor.value;
}

function getCurrentStrokeColor() {
  if (s.checked) {
    return "none";
  }
  return strokeColor.value;
}

//fill tool
fill = document.getElementById("filling");
fill.onclick = function () {
  wasPressed = "fill";
  svgPanel.style.cursor = "url(img/fill.ico), default";
}