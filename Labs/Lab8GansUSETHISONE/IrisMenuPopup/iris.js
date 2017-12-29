// Iris data visualization, with menu for changeable axes
//   data from: https://archive.ics.uci.edu/ml/datasets/iris
// Author: Clare Bates Congdon

// Notes:
// 1. The basic controls are created in the HTML file, with menu options
//    filled in after the data is read.
// 2. The title is in a separate SVG context. 
//    There are other ways to handle the placement.
// 3. The style of this visualization is to erase everything and redraw it
//    instead of transitioning... you should transition for Project 1
// 4. This uses a namespace instead of lots of global variables
//    (in effect, there is one global, with variables piled into it)
//    You should also avoid globals, either by using a namespace or by 
//    passing parameters 

//////////////////////////////////////////////////////////////////////
// Create a namespace to hold global variables

var myNS = {}

//Width and height of SVG drawing area
myNS.width = 600;
myNS.height = 300;
myNS.padding = 60;   // padding around edges, to make room for axes
myNS.currView = 1;

// for menus, the choice for each one
myNS.xData = "";
myNS.yData = "";

// dataset -- will read this from CSV file
myNS.dataset = [];                   //Initialize empty array


//////////////////////////////////////////////////////////////////////
// read the data file
d3.csv("iris.csv", function(error, data) {
  myNS.dataset = data;         // store data in namespace variable

  // error checking
  if (error) {
    console.log(error)
  }
  else {
    createVis()
  }
});


// create the visualization
var createVis = function (){

  // make the menu once (not every time the vis gets redrawn)
  if (myNS.xData == "") {
    makeMenu(); // note: the menu items have the on change functionality
  }
  
  // create scales, axes, and title
  createScales();
  createAxes();

  makeTitle();  // note: this makes its own SVG

  //Create SVG element
  var svg = d3.select("body")
    .append("svg")
    .attr("width", myNS.width)
    .attr("height", myNS.height);

  // draw stuff
  makeCircles(svg);
  makeAxesAndLabels(svg);
  makeLegend(svg);
  

} // end createVis


// draw all the data
function makeCircles (svg) {
  var radius = 5     // radius for circles

  // create circles
  var circles = svg.selectAll("circle")
    .data(myNS.dataset);

  // enter
  circles.enter()
    .append("circle")

    // use css to set the color of the dot
    .attr("class", function(d) {
      return d.classname;
    })

    .attr('fill', function(d) {
      return myNS.colorScale(d.classname);
    })
    .attr('stroke', 'black')

    // circle x, y, and radius
    .attr("cx", function(d) {
      return myNS.xScale(+d[myNS.xData]);  ///
    })
    .attr("cy", function(d) {
      return myNS.yScale(+d[myNS.yData]); ///
    })
    .attr("r", radius);

} // end, create circles


// add the menu options, using data columns
function makeMenu() {
  // from the html
  var xmenu = d3.select("#xmetrics");
  var ymenu = d3.select("#ymetrics");

  // set initial x and y
  myNS.xData = "petal_length";
  myNS.yData = "petal_width";

  // exclude one or more attributes, to not be plotted
  // add the others to the menu
  for (prop in myNS.dataset[0]){
    if (prop != "classname"){
      xmenu.append("option").attr("value", prop).text(prop);
      ymenu.append("option").attr("value", prop).text(prop);
    }
  }

  // set the initial menu items displayed/chosen
  document.getElementById('xSelect').value = "petal_length";
  document.getElementById('ySelect').value = "petal_width";

  // if a menu item is chosen, setX and redraw
  d3.select("#xSelect").on("change", function(){
    myNS.xData = this.value;      // set the menu 
    d3.selectAll("svg").remove(); // remove the old svgs
    createVis();                  // create the whole thing again
  });

  // if a menu item is chosen, setX and redraw
  d3.select("#ySelect").on("change", function(){
    myNS.yData = this.value;      // set the menu
    d3.selectAll("svg").remove(); // remove the old svgs
    createVis();                  // create the whole thing again
  });
  
} // end, make Menu


// create scale functions
function createScales () {
  
  // map x values to pixels
  myNS.xScale = d3.scaleLinear()
    .domain([0, d3.max(myNS.dataset, function(d) { return +d[myNS.xData]; })])
    .range([myNS.padding, myNS.width - myNS.padding * 2]);

  // map y values to pixels
  myNS.yScale = d3.scaleLinear()
    .domain([0, d3.max(myNS.dataset, function(d) { return +d[myNS.yData]; })])
    .range([myNS.height - myNS.padding, myNS.padding]);

  // map class names to colors
  myNS.colorScale = d3.scaleOrdinal()
    .domain(['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'])
    .range(['red', 'blue', 'orange']);

} // end, createScales

// create axes functions
function createAxes() {

  //Define X axis
  myNS.xAxis = d3.axisBottom(myNS.xScale).ticks(5)

  //Define Y axis
  myNS.yAxis =  d3.axisLeft(myNS.yScale).ticks(5)

} // end, createAxes


// put a title at the top. this is a distinct SVG element
function makeTitle () {

  // title is a separate SVG element... named just to make it clear
  var headingsvg = d3.select("body")
    .append("svg")
    .attr("width", myNS.width)
    .attr("height", 30)   // height for the heading is 30 pixels

  headingsvg.append("g")
    .append("text")
    .attr("class", "heading")
    .attr("text-anchor", "middle")
    .attr("x", myNS.width/2)      // half of width
    .attr("y", 25)       // half of height
    .text("Interactive Iris Data Visualization")

} // end, createAxes


// draw the axes and labels
function makeAxesAndLabels (svg) {

  // create X axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (myNS.height - myNS.padding) + ")")
    .call(myNS.xAxis);

  // create Y axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + myNS.padding + ",0)")
    .call(myNS.yAxis);

  // create X labels
  svg.append("g")
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + myNS.width/2 + "," + 
	  (myNS.height - myNS.padding/3) + ")")
    .text("This is the X axis: " + myNS.xData);

  // create Y labels
  svg.append("g")
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(10," + (myNS.height/2) + ")" +
	  "rotate(-90)")
    .text("This is the Y axis: " + myNS.yData);
}
function toggleInfo() {
  info = document.getElementById("info");
  if(myNS.currView)
  {
    info.style.visibility = 'hidden';  
    myNS.currView = 0;
  }
  else
  {
    info.style.visibility = 'visible';
    myNS.currView = 1;
  }
}
// this is a "roll your own" legend 
// There is a legend library, http://d3-legend.susielu.com/
//   but using it is a little complicated
// note: there are lots of fiddly "magic numbers in here for alignment
function makeLegend (svg) {

  // make a new 'legend' element in the SVG
  // each element in the legend will be 12 pixels below the previous one
  var legend = svg.selectAll('legend')
    .data(myNS.colorScale.domain())
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', function(d,i){ return 'translate(0,' + i * 12 + ')'; });

  // rects for the legend
  //   10x10 boxes, a smidge off the left edge
  legend.append('rect')
    .attr('x', myNS.padding+5)           
    .attr('width', 10)
    .attr('height', 10)
    .attr('stroke', 'black')
    .style('fill', myNS.colorScale);

  // text for the legend elements
  //   further right than the boxes, y is the baseline for the text
  legend.append('text')
    .attr('x', myNS.padding+20)
    .attr('y', 10)
    .text(function(d){ return d; });
} // end, makeLegend

