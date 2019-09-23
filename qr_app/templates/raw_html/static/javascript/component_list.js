let menu =document.getElementById('components_list');
menu.addEventListener('click',() =>{
    document.getElementById('myList').classList.toggle("show");
});


//setting cmp_list position
let list_height = ($("#components_state").offset());
let new_position = $("#hih").outerHeight() - list_height.top;
$("#myList").css('margin-top', new_position);

