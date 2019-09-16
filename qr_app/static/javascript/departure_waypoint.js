/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() { //filter search result
    let input, filter, p, i, div, txtValue, count = 0;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("dropdown-locations");
    p = div.getElementsByClassName("location");
    count = p.length;
    for (i = 0; i < p.length; i++) {
        txtValue = p[i].textContent || p[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            p[i].style.display = "";
            count++;
        } else {
            p[i].style.display = "none";
            count--;
        }
        if (count === 0){
            $("#add-content").show(); //show add new location
            $("#selected-content").hide(); //hide the previous selected location
        }else
            $("#add-content").hide();
    }
}

function addLocation() { //adding input content to the add element
    let node, text;
    node = document.getElementById("Add");
    text = input.value;
    $("#Add").text("Add: " + `${text}`);
}

let input = document.getElementById("myInput");
console.log(input);
input.addEventListener('keyup', () => addLocation());


$("#add-content").hide();

$("#selected-content").css({
    "background-color": "black",
    "color": "white"
}).hide();

$(".location").click((event) => {
    myFunction();   //close dropdown menu
    let id =event.target.id;  //save id
    let text=event.target.textContent;
    $(".location").show();
    $("#selected").remove(); //delete the previous selection
    $("#selector").append("<option id=\"selected\" selected></option>");  //add the new selection
    $("#selected").val(id);
    $("#selection").text(event.target.textContent); //show the selected text on the button
    $("#selected-content").show().text(text);
    $("#"+id).hide();
    console.log(event.target.id);
});

$("#selected-content").click(() =>{
    myFunction(); //close the dropdown menu
});

$("#add-symbol").click(() => { //when clicking on add symbol
    let text=input.value; //copy the new location
    input.value='';
    $(".location").show();//show all locations
    $("#dropdown-locations").append("<p class=\"location\"></p>"); //add new p element with the location
    $("#dropdown-locations").children().last().text(text).hide();
    myFunction();//close the menu
    $("#add-content").hide();
    $("#selected").remove(); //delete the previous selection
    $("#selector").append("<option id=\"selected\" selected></option>");  //add the new selection
    $("#selected").val(text); //add text
    $("#selection").text(text); //show the selected text on the button
    $("#selected-content").show().text(text);
})