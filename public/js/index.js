let btn = document.querySelector("#btn");
let sidebar = document.querySelector(".sidebar");
let searchBtn = document.querySelector(".bx-search");


btn.onclick = function () {
    sidebar.classList.toggle("active");
}

searchBtn.onclick = function () {
    sidebar.classList.toggle("active");
}

// Highlight active menu
$('.nav_list a').click(function(event){
    event.preventDefault();
    $('.nav_list a').removeClass('active-menu')
    $(this).addClass('active-menu');
});