// example js file, from Clare

function init () {
  //alert("the page is loading! woo!");
  //example of grabbing an HTML element by its ID
  var btag;
  btag = document.getElementById("boldstuff");  // get the object with that ID
  //alert("bold content is: " + btag.innerHTML);  // look at the text
  btag.style.color = 'red';
  //alert("I changed the color!");   // slow things down

} 

function myMove() {
    var c = document.getElementById("circ"); 
    var x = parseFloat(c.getAttribute('cx'))      // get cx, as a number
    var stopper = x + 100
    var id = setInterval(frame, 500);
    function frame() {
        if (x == stopper) {
            clearInterval(id);
        } else {
            c.setAttribute('cx', x + 10); 
            x = x + 10;
        }
    }
}

function moveRight() {
  var c = document.getElementById("circ");
  var x = parseFloat(c.getAttribute('cx'))      // get cx, as a number
  c.setAttribute('cx', x+50)                    // set cx
}

function moveLeft() {
  var c = document.getElementById("circ");
  var x = parseFloat(c.getAttribute('cx'))      // get cx, as a number
  c.setAttribute('cx', x-50)                    // set cx
}

function changeSize()  {
  //alert("DOUBLING SIZE!!!");
  var btag;
  btag = document.getElementById("boldstuff");
  btag.style.fontSize = "200%";

}
