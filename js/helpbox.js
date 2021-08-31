helpbutton = document.getElementById("help");
helpbox = document.getElementById("helpbox");
crossbutton = document.getElementById("exit");

helpbutton.onclick = function () {
    helpbox.style.display = "block";
    setTimeout(function(){helpbox.style.opacity = 1;}, 1);
}

crossbutton.onclick = function () {
    helpbox.style.opacity = 0;
    setTimeout(function(){helpbox.style.display = "none";}, 500);
}
