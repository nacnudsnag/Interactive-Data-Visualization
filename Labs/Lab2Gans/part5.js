//Duncan Gans
//Interactive Data Visualization
//These functions modify the nature of the circle, whether the size, the color,
//the position, or the transparency

function changeColor() {
  //Finds the circle svg element and changes the color attribute to green
  var c = document.getElementById("c");
  c.setAttribute('fill', 'green');
}

function changeSize() {
  //Shrinks the circle to half its size
  var c = document.getElementById("c");
  c.setAttribute('r', Math.random()*100);
}

function changeTransparency() {
  //Makes the circle more transparent
  var c = document.getElementById("c");
  c.setAttribute('opacity', Math.random());
}

function changeLoc() {
  //Moves the circle to the bottom right corner
  var c = document.getElementById("c");
  c.setAttribute('cx', Math.floor(Math.random() * 500));
  c.setAttribute('cy', Math.floor(Math.random() * 500));
}

function moveRight() {
  //Gets the x coordinate of the circle, and changes that over an interval
  //It continues moving right until hitting the side.
  var c = document.getElementById("c");
  var x = parseFloat(c.getAttribute('cx'))
  var id = setInterval(frame, 20);
  function frame() {
        if (x >= 500) {
            clearInterval(id);
        } else {
            c.setAttribute('cx', x + 1);
            x = x + 2;
        }
    }
}

function bounce() {
  //Regardless of where the circle starts, it will bounce left and right
  //off the walls, switching the direction of motion at each wall
  var timeElapsed = 0;
  var direction = 1;
  var c = document.getElementById("c");
  var x = parseFloat(c.getAttribute('cx'));
  var id = setInterval(frame, 5);
  function frame() {
    if (timeElapsed > 10000) {
      clearInterval(id);
    } else {
      if (x >= 500)  {
        direction = -1
      }
      if (x <= 0)  {
        direction = 1
      }
      c.setAttribute('cx', x + ((Math.floor(timeElapsed/500) + 1) * direction));
      x = x + ((Math.floor(timeElapsed/500) + 1) * direction);
      timeElapsed += 1;
    }
  }
}
