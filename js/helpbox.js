helpbutton = document.getElementById("help");
helpbox = document.getElementById("helpbox");
crossbutton = document.getElementById("exit");
helppage = document.getElementById("helppage");
prev = document.getElementById("prev");
next = document.getElementById("next");
pagecount = document.getElementById("page_count");
let pagecounter = 1;

function help () {
    if (pagecounter > 3) {
        pagecounter = 1;
    }
    if (pagecounter < 1) {
        pagecounter = 3;
    }
    if (pagecounter == 1) {
        helppage.innerHTML =
            '<div class="instruction"> \
                <p class="help_text">\
                    Инструмент <b>"Курсор"</b> позволяет выбирать созданные объекты. \
                    Чтобы выбрать объект, просто кликните по нему. \
                </p> \
                <button title="Курсор" class="help_button" style="background-image: url(img/cursor.svg)" disabled></button> \
            </div>';
    }
    else if (pagecounter == 2) {
        helppage.innerHTML = 
            '<div class="instruction"> \
                <p class="help_text"> \
                    Инструмент <b>"Рука"</b> позволяет менять расположение рабочего пространства. \
                    Чтобы сделать это, нажмите и удерживайте левую кнопку мыши, перемещая её в нужном направлении. \
                </p> \
                <button title="Рука" class="help_button" style="background-image: url(img/hand.svg)" disabled></button> \
            </div>';
    } else if (pagecounter == 3) {
        helppage.innerHTML =
            '<div class="instruction"> \
                <p class="help_text"> \
                    Инструмент <b>"Лупа"</b> позволяет приблизить/отдалить изображение рабочего пространства. \
                    Чтобы приблизить изображение вокруг курсора, нажмите левую кнопку мыши; \
                    чтобы отдалить его, зажмите клавишу <strong>Ctrl</strong> и нажмите левую кнопку мыши. \
                </p> \
                <button title="Лупа" class="help_button" style="background-image: url(img/scale.svg)" disabled></button> \
            </div>';
    }
    pagecount.innerHTML = 'Страницы: ' + pagecounter + '/3';
}

helpbutton.onclick = function () {
    helpbox.style.display = "block";
    setTimeout(function(){helpbox.style.opacity = 1;}, 10);
    help();
}

crossbutton.onclick = function () {
    helpbox.style.opacity = 0;
    setTimeout(function(){helpbox.style.display = "none";}, 500);
}

prev.onclick = function () {
    pagecounter--;
    help();
}

next.onclick = function () {
    pagecounter++;
    help();
}
