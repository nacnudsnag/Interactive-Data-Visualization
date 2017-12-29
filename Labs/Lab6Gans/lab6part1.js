// Lab 6, part 1 javascript
// Duncan Gans

//////////////////////////////////////////////////////////////////////
// global variables
//   there might be an argument for making the data and svg global
//   the following  make sense as globals if you think of them as "constants"
//   then it's handy to have at the top here, for updating

var Width = 500;      // of SVG
var Height = 200;     // of SVG


//////////////////////////////////////////////////////////////////////
// functions

function initialize () {
  console.log("initialize");

  dataset = [5, 10, 15, 20]  // but we don't really care about data 
                             // for this exercise

  // make the SVG
  var svg = makeSVG();

  // draw some circles
  drawCircles(svg,dataset);

  // set up interactions
  addListeners(svg, dataset);
} // end initialize


// draw a circle for each data point
function drawCircles (svg, dataset) {
  var blueScaling = 10;   // just to make different shades of blue
  var xSpacing = 100;     // spacing between the circle centers
  var xPadding = 50;      // spacing from the left edge

  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("id", function (d, i) {   // make a unique ID for each circle
      var id = "circle" + i;        // extra lines just to show you the ids
      console.log("id is " + id);
      return id;
      })
    .attr("cx", function (d, i) {
      return (i*xSpacing) + xPadding;
      })
    .attr("cy", Height/2)
    .attr("r", function (d) {      // radius is the data value
      return d;
    })
    .attr("fill", function(d) {    // color reflects the data value
      return "rgb(0,0, " + Math.round(d * blueScaling) + ")";
    });

} // end drawCircles


// add and define event listeners
function addListeners (svg, dataset) {

  svg.selectAll("circle")
    .on("click", function() {
      var circleID = d3.select(this).attr("id");
      console.log("you clicked + ", circleID);
    });
    svg.select("#circle3")
      .on("mouseover", function() {
        svg.selectAll("circle")
	  .attr("fill", "green");
        svg.select("rect")
	  .style("stroke-width", 30)
	  .style("fill", "pink");
    })
      .on("mouseout", function() {
        svg.selectAll("circle")
	  .attr("fill", "blue");
	svg.select("rect")
          .style("stroke-width", 1)
          .style("fill", "white");
    });
} // end addListeners


// create the SVG context and return it
function makeSVG () {

  // add svg element
  var svg = d3.select("body")
    .append("svg")
    .attr("width", Width)
    .attr("height", Height)
  ;

  // draw the border of the SVG area
  svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", Height)
    .attr("width", Width)
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 1);

  return svg
}


//////////////////////////////////////////////////////////////////////
// no data file to read; set up the initial visualization
initialize();
