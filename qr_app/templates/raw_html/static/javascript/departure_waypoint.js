/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    $("#N,#E,#Add").text(""); //delete from the duv of the symbol the name,x,y
    $("#myInput, #newN,#newE, #newName").val(""); //delete the value of this fields
  //  $(".location").show();
}

function filterFunction() { //filter search result
    let input, filter, p, i, div, txtValue, count = 0;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("dropdown-locations");
    p = div.getElementsByClassName("location");
    count = p.length;
    $("#newName").val(input.value);
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
    text = newName.value==="" ? input.value : newName.value; 
    let div = "<div id=\"NorthAndEast\"><p id=\"N\"></p><p id=\"E\"></p></div>";
    $("#Add").html("Add: <b>Name:</b> " + `${text}`).append(div);
    $("#N").text(`N: ${northField.value}`);
    $("#E").text(`E: ${eastField.value}`);
    activateAddSymbol();
}



let input = document.getElementById("myInput");  //the search field
input.addEventListener('keyup', () => addLocation());
let northField = document.getElementById("newN");
let eastField = document.getElementById('newE');
let newName=document.getElementById("newName");

northField.addEventListener('keyup', () => {
    //filterFunction();
   // showAddSymbol();
    addLocation();
});

eastField.addEventListener('keyup', () => {
    // filterFunction();
    // showAddSymbol();
    addLocation();
});

newName.addEventListener("keyup", () => {
    input.value=newName.value;
    filterFunction();
    addLocation()
});

function activateAddSymbol() { //show the plus symbol when the user enter name x and y
    let name = input.value;
    let nameField=newName.value;
    let north = northField.value;
    let east = eastField.value;
    if ((name || nameField) && north && east) {
        // $("#addSymbol").show();
        return true;
    }
    return false;
}

// $("#addSymbol, #Add, #add-content").hide();

let x=document.getElementById("dropdown-locations");
//choosing location from the list
$(".location").on('click', handleClick);

function handleClick(event){
    myFunction(); //close dropdown menu
    let id = event.target.id;     //copy id
    let text = new RegExp (id); //copy textContrnt
    let name=/(?<=Name:)\w*(?=_)/.exec(text)[0];
    let east=/(?<=E:)\d*\.?\d*(?=_)/.exec(text)[0];
    let north=/(?<=N:)\d*\.?\d*(?=_)/.exec(text)[0];
    let padding=20;
    $(".location").show();  //show all locations
    $("#selector").empty().append(`<option id="selected" value = "${id}" selected></option>`); //delete the previous selection and add the new selection as the selected one
    $("#selection").html(`${name}`+"<br /> &emsp;&emsp;"  +`(N:${north}, E:${east})`); //show the selected text on the button
    $("#" + $.escapeSelector(id)).hide();
    $(".dropbtn").css("height",($("#selection").height()+padding+'px'));
};

//adding and choosing new location
$("#addSymbol").click(() => { //when clicking on add symbol
    if(activateAddSymbol()){
    let newId = `Name:${newName.value==="" ? input.value : newName.value}_N:${northField.value}_E:${eastField.value}_`;
    let newText = `${newName.value==="" ? input.value : newName.value} <br> &emsp;&emsp;(N${northField.value}, E${eastField.value})`;
    let padding=20;
    input.value = '';
    newName.value="";
    northField.value = '';
    eastField.value = '';
    $(".location").show(); //show all locations
    $("#dropdown-locations").append(`<p id="${newId}" class="location">${newText}</p>`)
        .children().last().hide();; //add new p element with the location and hide it
    myFunction(); //close the menu
    // $("#add-content").hide(); //hide plus symbol
    $("#selected").remove(); //delete the previous selection
    $("#selector").append(`<option id="selected" value="${newId}" selected></option>`); //add the new selection as selected
    $(".location").unbind().on('click', handleClick);
    $("#selection").html(newText); //show the selected text on the button
    $(".dropbtn").css("height",($("#selection").height()+padding+'px'));
    }
});