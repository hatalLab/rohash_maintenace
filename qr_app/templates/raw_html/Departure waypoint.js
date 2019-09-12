/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
    let input, filter, a, i, div, txtValue, count = 0;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("dropdown-contentA");
    a = div.getElementsByTagName("a");
    count = a.length;
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
            count++;
        } else {
            a[i].style.display = "none";
            count--;
        }
        if (count === 0)
            $("#Add").show();
        else
            $("#Add").hide();
    }
}

function addLocation() {
    let node, text, oldTxt;
    node = document.getElementById("Add");
    text = input.value;
    $("#Add").text("Add: " + `${text}`);
}

let input = document.getElementById("myInput");
input.addEventListener('keyup', () => addLocation());


$("#Add").hide();