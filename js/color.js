fill = document.getElementById("fill");
fill.onclick = function () {
  wasPressed = "fill";
  svgPanel.style.cursor = "url(img/fill.ico), default";
}

strokeChoise = document.getElementById("strokeChoise");
strokeStyle = document.getElementById("strokeStyle");
fillChoise = document.getElementById("fillChoise");
fillStyle = document.getElementById("fillStyle");
strokeChoiseChecked=false, fillChoiseChecked=false;

strokeChoise.onclick = () => {
  if (!strokeChoiseChecked) {
    strokeStyle.style.display = "block";
    fillStyle.style.display = "none";
    fillChoiseChecked=false;
    strokeChoiseChecked=true;
  } else {
    strokeStyle.style.display = "none";
    strokeChoiseChecked=false;
  }
  document.onclick = (event) => {
    if (event.target != strokeChoise) {
      strokeStyle.style.display = "none";
      strokeChoiseChecked=false;
      document.onclick=null;
    }
  }
}
fillChoise.onclick = () => {
  if (!fillChoiseChecked) {
    fillStyle.style.display = "block";
    fillChoiseChecked=true;
  } else {
    fillStyle.style.display = "none";
    fillChoiseChecked=false;
  }
  document.onclick = (event) => {
    //for(strokeStyle.children.length);
    if (event.target != fillChoise) {
      fillStyle.style.display = "none";
      fillChoiseChecked=false;
      document.onclick=null;
    }
  }
}