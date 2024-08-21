document.getElementById('btn-select').addEventListener('click',() => {
    document.getElementById("demo").innerHTML = "select";
})

document.getElementById('btn-unselect').addEventListener('click',() => {
    document.getElementById("demo").innerHTML = "unselect";
})

const element = document.getElementById("myBtn");
element.addEventListener("click", function() {
  document.getElementById("demo").innerHTML = "Hello World";
});
