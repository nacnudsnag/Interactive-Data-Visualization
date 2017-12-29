// Lab 4 javascript
// Duncan Gans

// This is set up to vaguely follow Murray, Chapter 9
// ... but using functions 
//     and explicit globals or locals instead of magic numbers 


//////////////////////////////////////////////////////////////////////
// global variables
//   there might be an argument for making the data and svg global
//   the following  make sense as globals if you think of them as "constants"
//   then it's handy to have at the top here, for updating

var Width = 500;      // of SVG
var Height = 200;     // of SVG


//////////////////////////////////////////////////////////////////////
// functions


function main (dataset) {
  console.log("main function");

  // hardwired data set
  var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
		  11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

  // make the SVG
  var svg = makeSVG();

  // create the bars
  makeAndLabelBars(svg,dataset);
}

function makeAndLabelBars (svg,dataset) {
  var barPadding = 1;     // distance between bars
  var yScaling = 4;       // multiplier from data value to pixels
  var blueScaling = 10;   // multiplier from data value to blue shade
  var labelYoffset = 14;  // distance from the top of the bar

  console.log("make and label bars");

  // draw the bars
  svg.selectAll("rect.year")  // added .year to ignore outside rect
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return i * (Width / dataset.length);
    })
    .attr("y", function(d) {
      return Height - (d * yScaling);
    })
    .attr("width", Width / dataset.length - barPadding)
    .attr("height", function(d) {
      return d * yScaling;
    })
    .attr("fill", function(d) {
      return "rgb(0, 0, " + Math.round(d * blueScaling) + ")";
    });

  // draw the labels
  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
      return d;
    })
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) {
      return i * (Width / dataset.length) 
	+ (Width / dataset.length - barPadding) / 2;
    })
    .attr("y", function(d) {
      return Height - (d * yScaling) + labelYoffset;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "white");

}


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
// start the ball rolling here

main()
