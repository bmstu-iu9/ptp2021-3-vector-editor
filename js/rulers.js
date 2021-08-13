function updateRulers() {
  rulerX.style.width = scrollPanel.clientWidth - 15 + "px";
  rulerY.style.height = scrollPanel.clientHeight - 15 + "px";
  ruler_x_line.setAttribute("width", scrollPanel.clientWidth - 15);
  ruler_y_line.setAttribute("height", scrollPanel.clientHeight - 15);
  rulerXcoords = getCoords(rulerX);
  rulerYcoords = getCoords(rulerY);
  ruler_x_pattern.setAttribute("x", svgPanelCoords.left - rulerXcoords.left);
  ruler_y_pattern.setAttribute("y", svgPanelCoords.top - rulerYcoords.top);
  var text_dist = 50 * scaleСoef;
  var coef = 1; 
  if (text_dist > 100) {
    for (text_dist; text_dist > 60; text_dist /= 2) {
      coef *= 1 / 2;
    }
  } else {
    if (text_dist < 50) {
      for (text_dist; text_dist < 60; text_dist *= 2) {
        coef *= 2;
      }
    }
  }
  ruler_x_pattern.setAttribute("width", text_dist);
  ruler_y_pattern.setAttribute("height", text_dist);
  ruler_x_text.innerHTML = "";
  var text = 0;
  for (var i = parseFloat(ruler_x_pattern.getAttribute("x")); i < parseInt(rulerX.style.width);) {
    var newText = document.createElement("text");
    newText.setAttribute("x", i);
    newText.setAttribute("y", 8);  
    ruler_x_text.innerHTML += "<text x=" + newText.getAttribute("x") + " " + "y=" + newText.getAttribute("y") + ">" + text + "</text>";
    text += 50 * coef;
    i += text_dist;
  } 
  text = -50 * coef;
  for (var i = svgPanelCoords.left - rulerXcoords.left - text_dist; i > 0;) {
    var newText = document.createElement("text");
    newText.setAttribute("x", i);
    newText.setAttribute("y", 8);
    ruler_x_text.innerHTML += "<text x=" + newText.getAttribute("x") + " " + "y=" + newText.getAttribute("y") + ">" + text + "</text>";
    text -= 50 * coef;
    i -= text_dist;
  }
  text = 0;
  ruler_y_text.innerHTML = "";
  for (var i = parseFloat(ruler_y_pattern.getAttribute("y")); i < parseInt(rulerY.style.height);) {
    var newText = document.createElement("text");
    newText.textContent = String(text);
    newText.setAttribute("x", 8);
    newText.setAttribute("y", i); 
    newText.setAttribute("transform", "rotate(-90 8 " + i + ")");  
    ruler_y_text.appendChild(newText); 
    text += 50 * coef;
    i += text_dist;
  } 
  ruler_y_text.innerHTML = ruler_y_text.innerHTML;
  text = -50 * coef;
  for (var i = svgPanelCoords.top - rulerYcoords.top - text_dist; i > 0;) {
    var newText = document.createElement("text");
    newText.textContent = String(text);
    newText.setAttribute("x", 8);
    newText.setAttribute("y", i);
    newText.setAttribute("transform", "rotate(-90 8 " + i + ")");  
    ruler_y_text.appendChild(newText);
    text -= 50 * coef;
    i -= text_dist;
  }
  ruler_y_text.innerHTML = ruler_y_text.innerHTML;
  ruler_x_pattern.innerHTML = '<rect width="100%" height="100%"></rect>'
  var dist = 0.5;
  for (var i = 0; i < 10; i++) {
    var newLine = document.createElement("line");
    if (i == 0) {
      newLine.setAttribute("y1", 0); 
    } else {
      newLine.setAttribute("y1", 10); 
    }
    newLine.setAttribute("x1", dist);
    newLine.setAttribute("x2", dist);
    newLine.setAttribute("y2", 15);
    ruler_x_pattern.appendChild(newLine);
    dist += text_dist / 10;
  }
  ruler_x_pattern.innerHTML = ruler_x_pattern.innerHTML;
  ruler_y_pattern.innerHTML = '<rect width="100%" height="100%"></rect>';
  dist = 0.5;
  for (var i = 0; i < 10; i++) {
    var newLine = document.createElement("line");
    if (i == 0) {
      newLine.setAttribute("x1", 0); 
    } else {
      newLine.setAttribute("x1", 10); 
    }
    newLine.setAttribute("y1", dist);
    newLine.setAttribute("y2", dist);
    newLine.setAttribute("x2", 15);
    ruler_y_pattern.appendChild(newLine);
    dist += text_dist / 10;
  }
  ruler_y_pattern.innerHTML = ruler_y_pattern.innerHTML;
}
