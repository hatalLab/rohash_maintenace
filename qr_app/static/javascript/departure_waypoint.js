/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    $("#N,#E,#Add").text("");
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
        /* if (count === 0){ //that mean ther isn't such a location
            $("#Add,#add-content").show(); //show add new location
        }else
            $("#Add, #add-content").hide(); */
    }
}

function addLocation() { //adding input content to the add element
    let node, text;
    node = document.getElementById("Add");
    text = input.value;
    let div = "<div id=\"NorthAndEast\"><p id=\"N\"></p><p id=\"E\"></p></div>";
    $("#Add").html("Add: <b>Name:</b> " + `${text}`).append(div);
    $("#N").text(`N: ${nEvent.value}`);
    $("#E").text(`E: ${eEvent.value}`);
    showAddSymbol();
}



let input = document.getElementById("myInput");
input.addEventListener('keyup', () => addLocation());
let nEvent = document.getElementById("newN");
let eEvent = document.getElementById('newE');

nEvent.addEventListener('keyup', () => {
    filterFunction();
    showAddSymbol();
    addLocation();
});

eEvent.addEventListener('keyup', () => {
    filterFunction();
    showAddSymbol();
    addLocation();
});

function showAddSymbol() { //show the plus symbol when the user enter name x and y
    let name = input.value;
    let north = nEvent.value;
    let east = eEvent.value;

    if (name && north && east) {
        $("#addSymbol").show();
    }
}

// $("#addSymbol, #Add, #add-content").hide();

//choosing location from the list
$(".location").click((event) => {
    myFunction(); //close dropdown menu
    let id = event.target.id; //save id
    let text = event.target.textContent;
    $(".location").show();
    $("#selected").remove(); //delete the previous selection
    $("#selector").append("<option id=\"selected\" selected></option>"); //add the new selection
    $("#selected").val(id);
    $("#selection").text(text); //show the selected text on the button
    $("#" + $.escapeSelector(id)).hide();
});

//adding and choosing new location
$("#addSymbol").click(() => { //when clicking on add symbol
    let newId = `Name:${input.value}_N:${nEvent.value}_E:${eEvent.value}`;
    let newText = `${input.value} \n(N${nEvent.value}, E${eEvent.value})`;
    input.value = '';
    nEvent.value = '';
    eEvent.value = '';
    $(".location").show(); //show all locations
    $("#dropdown-locations").append(`<p id="${newId}" class="location">${newText}</p>`)
        .children().last().hide();; //add new p element with the location and hide it
    myFunction(); //close the menu
    // $("#add-content").hide(); //hide plus symbol
    $("#selected").remove(); //delete the previous selection
    $("#selector").append(`<option id=\"selected\" value="${newId}" selected></option>`); //add the new selection
    $("#selection").text(newText); //show the selected text on the button
});