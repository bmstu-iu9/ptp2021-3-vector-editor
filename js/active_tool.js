var vertical_panel = document.getElementById("vertical_panel");
var buttons = vertical_panel.getElementsByClassName("tool_button");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("active_tool_button");
  if (current.length > 0){
    current[0].className = "tool_button";
  }
  this.className = "active_tool_button";
  });
}