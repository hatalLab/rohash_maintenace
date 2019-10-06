/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show"); //close dropbtn
    $("#N,#E,#Add").text(""); //delete from the duv of the symbol the name,x,y
    $("#myInput, #newN,#newE, #newName").val(""); //delete the value of this fields
    $("#addition").hide(1); //hide newName north and east
    $("#gps-location").text(""); //delete near location
    $("#gps").css("margin-top",'0px');
}

function filterFunction() { //filter search result
    $("#distance").hide(); //hide the distance
    $("#validate").remove();
    let input, filter, p, div, northCoordinate, eastCoordinate;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("dropdown-locations");
    p = div.getElementsByClassName("location");
    $("#newName").val(input.value); //copy the value of input field to new name field
    northCoordinate = northField.value; //value of north and east fields
    eastCoordinate = eastField.value;

    if (input.value.indexOf("_") > -1) {
        input.value = input.value.slice(0, input.value.length - 1);
    } //delete "_" from the user input

   if(input.value === '' && northCoordinate === '' && eastCoordinate === ''){
       $(".location").show();
   }
   else{
    for (i = 0; i < p.length; i++) {
        let {
            name,
            North,
            East
        } = extractIdDetails(p[i].id);

        if ((name.toUpperCase().indexOf(filter) > -1 && filter !== "") || ((East.indexOf(eastCoordinate) > -1 && North.indexOf(northCoordinate) > -1) && eastCoordinate && northCoordinate)) {
            p[i].style.display = "";
        } else {
            p[i].style.display = "none";
        }

    }

    if (northCoordinate && eastCoordinate)
        filterCoordinates();
}
}

function filterCoordinates() { //this function search for nearby place
    let div, p, northCoordinate, eastCoordinate, interval;
    northCoordinate = northField.value;
    eastCoordinate = eastField.value;
    let details = {
        id: '',
        distance: Infinity
    };
    div = document.getElementById("dropdown-locations");
    p = div.getElementsByClassName("location");
    for (let i = 0; i < p.length; i++) {
        let {
            East,
            North
        } = extractIdDetails(p[i].id);
        interval = distance(northCoordinate, eastCoordinate, North, East).toFixed(1); //check the distance
        
        if (interval < 50 && interval < details.distance) {
            details.id = p[i].id;
            details.distance = interval;
        }
    }

    if (details.id) { //if we found nearby place
        $("#dropdown-locations").find("*").css("display", "none");
        $("#" + $.escapeSelector(details.id)).css("display", "");
        let {
            name
        } = extractIdDetails(details.id);
        
        if (details.distance == 0)
            details.distance = 0;
        $("#distance").html(`<b>${name}</b> is  <b>${details.distance} meter</b> from your location`).show();

    }
    return details;
}
       

function addLocation() { //adding input content to the add element
    let node, text;
    node = document.getElementById("Add");
    text = input.value;
    let div = "<div id=\"NorthAndEast\"><p id=\"N\"></p><p id=\"E\"></p></div>";
    $("#Add").html("Add: <b>Name:</b> " + `${text}`).append(div);
    $("#N").text(`N: ${northField.value}`);
    $("#E").text(`E: ${eastField.value}`);
    activateAddSymbol();
}

let input = document.getElementById("myInput"); //the search field
input.addEventListener('keyup', (event) => {
    if (input.value)
        addLocation();
    else {
        $("#NorthAndEast").remove();
        $("#Add").text("");
    }
    if (event.keyCode === 13) {
        $("#newName").unbind('keyup');
        $("#addSymbol").trigger('click');
        $("#newName").focus();
        $("#newName").on('keyup', handleNewName);
    }
});

$("#myInput").keydown((event) => {
    if (event.keyCode === 13)
        event.preventDefault();
});

let northField = document.getElementById("newN");
let eastField = document.getElementById('newE');
let newName = document.getElementById("newName");

northField.addEventListener('keyup', (event) => {
    if (event.key === "ArrowUp")
        $("#newN").prev().focus();
    else if (event.key === "ArrowDown" || event.keyCode === 13)
        $("#newN").next().focus();
    else {
        addLocation();
        filterFunction();
        if (northField.value !== "") {
            $("#newN").css({
                "border": "",
                "outline": "3px solid #ddd"
            });
        }
    }

});


eastField.addEventListener('keyup', (event) => {
    if (event.key === "ArrowUp")
        $("#newE").prev().focus();
    else if (event.keyCode === 13)
        $("#addSymbol").trigger("click");
    else {
        addLocation();
        filterFunction();
        if (eastField.value !== "")
            $("#newE").css({
                "border": "",
                "outline": "3px solid #ddd"
            });
    }
});

newName.addEventListener("keyup", handleNewName);

function handleNewName(event) {
    input.value = newName.value;
    filterFunction();
    addLocation();
    if (event.key === "ArrowDown" || event.keyCode === 13)
        $("#newName").next().focus();
    if (newName.value !== "")
        $("#newName").css({
            "border": "",
            "outline": "3px solid #ddd"
        });
    else {
        $("#NorthAndEast").remove();
        $("#Add").text("");
    }
}

function titleCase() { //change first letter of every word to capital letter
    let content = input.value.split(" ");
    let firstLetter, restWord;
    for (let i = 0; i < content.length; i++) {
        firstLetter = content[i];
        restWord = content[i].slice(1, content[i].length)
        firstLetter = firstLetter.charAt(0).toUpperCase();
        content[i] = firstLetter + restWord;
    }
    content = content.toString().replace(/,/g, " ");
    $("#myInput , #newName").val(content);
}

function distance(lat1, lon1, lat2, lon2) { //calculate the distance
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;
    return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km *1000 m
}

function activateAddSymbol() { //show the plus symbol when the user enter name x and y
    let name = input.value;
    let nameField = newName.value;
    let north = northField.value;
    let east = eastField.value;
    if ((name || nameField) && north && east) {
        return true;
    }
    return false;
}

let x = document.getElementById("dropdown-locations");
//choosing location from the list
$(".location").on('click', handleClick);
$("#addSymbol").on('click', handleAddition);
$("#newName").on('blur', titleCase);
$("#gps").on('click', getLocation);
$("#addition").css({
    "left": $(".dropbtn").outerWidth() + $(".dropbtn").offset().left + 'px',
    "top": $("#addition").offset().top - $("#Add").offset().top + 'px',
    "position": "absolute"
});
$("#addition").hide(1);

function getLocation() { //get the user location
    $("#gps-location").text("");
    let content = document.getElementById('gps-location');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        content.innerHTML = "sorry, can't find your location";
    }

    function showPosition(position) {
        content.innerHTML = "<b>N:</b> " + position.coords.latitude.toFixed(10) +
            "<br><b>E:</b> " + position.coords.longitude +
            "<br> <b>Accuracy:</b>" + position.coords.accuracy + " meter" +
            "<br> <b>add a name and press enter</b>";
        $("#newN").val(position.coords.latitude);
        $("#newE").val(position.coords.longitude);
        $("#addition").show();
        $("#newName").focus();
        let details = filterCoordinates();
        if (details.id) {
            let {
                name
            } = extractIdDetails(details.id);
            $("#myInput").val(name);
            $("#newE").focus();
        }
        addLocation();
        if ($("#gps-location").is(":hidden"))
            $("#gps-location").toggle();
        $("#gps").css("margin-top", $("#gps-location").height() / 2 + 'px');
        filterFunction();
        $("#gps").unbind('click');
        $("#gps").on('click', getLocation)
    }
}

function validate() { //ensure that north and east fields contain only numbers or point
    let answer = true,
        firstIndex, lastIndex;
    let check = /[^\d.]/g;
    let check2 = /[^\d.]/g;
    let wrongNorth = check.test(northField.value);
    let wrongEast = check2.test(eastField.value);
    firstIndex = northField.value.indexOf("."); //ensure there is only one point in the east and north field
    lastIndex = northField.value.lastIndexOf(".");

    if (firstIndex !== lastIndex)
        wrongNorth = true;
    firstIndex = eastField.value.indexOf(".");
    lastIndex = eastField.value.lastIndexOf(".");

    if (firstIndex !== lastIndex)
        wrongEast = true;

    if (wrongNorth) {
        $("#newN").css({
            "outline": "none",
            "border": "1.5px solid red"
        });
        answer = false;
    }

    if (wrongEast) {
        $("#newE").css({
            "outline": "none",
            "border": "1.5px solid red"
        });
        answer = false;
    }

    if (!answer) {
        $("#addition").append(`<p id= "validate"><b>wrong location<b></p>`);
    }

    return answer;
}

function extractIdDetails(id) {//extract name and east and north fields from id
    let variables = ["Name:", "N:", "E:"];
    let firstIndex, lastIndex, newText = [];
    for (let name of variables) { //extract name,n,e
        firstIndex = id.indexOf(name) + name.length;
        lastIndex = id.indexOf("_");
        newText.push(id.slice(firstIndex, lastIndex))
        id = id.slice(lastIndex + 1);
    }
    let value = {
        name: newText[0],
        North: newText[1],
        East: newText[2]
    }
    return value;
}

function handleSelectionCss(){
    let padding = 20; //20px padding
    $(".dropbtn").css("height", ($("#selection").height() + padding + 'px'));
    
}

function handleClick (event) { //handle clicking on location list -choosing location
    myFunction(); //close dropdown menu
    let id = event.target.id; //get id
    let {name,North,East}=extractIdDetails(id);
    $(".location").show(); //show all locations
    $("#selector").empty().append(`<option id="selected" value = "${id}" selected></option>`); //delete the previous selection and add the new selection as the selected one
    $("#selection").html(`${name}` + "<br /> " + `(N:${North}, E:${East})`); //show the selected text on the button
    let temp = $("#" + $.escapeSelector(id)); //copy the selected locaation
    $("#" + $.escapeSelector(id)).remove(); //remove it
    $("#dropdown-locations").prepend(temp.get()[0].outerHTML); //add it as first item
    $(".location").unbind().on('click', handleClick);
    $("#" + $.escapeSelector(id)).hide(); //hide it
    handleSelectionCss();
    }

//adding and choosing new location
function handleAddition(event) { //when clicking on add symbol
    titleCase();
    $("#validate").remove();
    if ((activateAddSymbol()) === false) {
        if ($("#addition").is(":visible")) {
            let children = $("#addition").children().get().reverse();
            for (let child of children) {
                if (child.id !== "")
                    if ($("#" + child.id).val() === "") {
                        $("#" + child.id).css({
                            "border": "1.5px inset red",
                            "outline": "none"
                        });
                        $("#" + child.id).focus();
                    }
            }
        } else { //open addition element
            $("#addition").show(1)
            $("#newName").focus(); //move the focus to the newName field
        }
    } else {
        let details = filterCoordinates();
        if (details.distance < 20) {
            $("#" + $.escapeSelector(details.id)).trigger('click')
        } else if (validate()) {
            let newId = `Name:${newName.value}_N:${northField.value}_E:${eastField.value}_`;
            let newText = `${newName.value} <br> (N${northField.value}, E${eastField.value})`;
            $("#dropdown-locations").prepend(`<p id="${newId}" class="location">${newText}</p>`);
            myFunction(); //close the menu
            $(".location").show(); //show all locations
            $("#" + $.escapeSelector(newId)).hide(); //add new p element with the location and hide it
            $("#selected").remove(); //delete the previous selection
            $("#selector").append(`<option id="selected" value="${newId}" selected></option>`); //add the new selection as selected
            $(".location").unbind().on('click', handleClick);
            $("#selection").html(newText); //show the selected text on the button
            handleSelectionCss();
        }
    }
}