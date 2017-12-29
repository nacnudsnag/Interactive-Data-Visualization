// Lab 6, part 2 javascript
// Duncan Gans

// global variables
//   there might be an argument for making the data and svg global
//   the following  make sense as globals if you think of them as "constants"
//   then it's handy to have at the top here, for updating

var Width = 500;      // of SVG
var Height = 300;     // of SVG
var Padding= 75;      // padding of graph from svg edges; leave room for labels
var Data = "Data/est14_ME.csv"    // the data to work with


//////////////////////////////////////////////////////////////////////
//// functions

function initialize (data) {
  console.log("initialize");

  // make the SVG
  var svg = makeSVG();


  var xScale = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0+Padding,Width-Padding])
    .paddingInner(0.05);
  var yScale = d3.scaleLinear()
    .domain([0, 
	     d3.max(data, 
		    function(d) {return parseInt(d.Count_Poverty)})
	    ])
    .range([Height-Padding,Padding]);

  console.log("y scale domain is 0 to max value");
  console.log("y scale range is " + (Padding) + " to " + (Height-Padding));

  makeAndLabelBars(svg,data,xScale,yScale);

  makeAxes(svg,data,xScale,yScale);

  addListeners(svg, xScale)
}//End initialize

function makeAndLabelBars (svg,dataset,xScale,yScale) {
  var barPadding = 1;     // distance between bars
  var redScaling = .01;   // multiplier from data value to blue shade
  var labelYoffset = 0;  // distance from the top of the bar

  console.log("make and label bars");

svg.selectAll("rect.county")  // added .county to ignore outside rect
//I'm a big red fan, so I switched the coloring
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "county")
    .attr("x", function(d, i) {
      return xScale(i);
    })
    .attr("y", function(d) {
      return yScale(parseInt(d.Count_Poverty));
    })
    .attr("width", (Width-2*Padding) / dataset.length - barPadding)
    .attr("height", function(d) {
      return Height - Padding - yScale(parseInt(d.Count_Poverty));
    })
    .attr("fill", function(d) {
      return "rgb(" + 
	Math.round(parseInt(d.Count_Poverty) * redScaling) + ", 0, 0)";
    });

} // end makeAndLabelBars

function makeAxes (svg, dataset, xScale, yScale) {

  console.log("make axes");

  var xAxis = 
    d3.axisBottom(xScale)
    .tickFormat(function(d) { return dataset[d].County; });

  svg.append('g')
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (Height - Padding) + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", function(d) {
      return "rotate(90), translate(" + 10 + ",-" + 20 + ")" 
    })
    .style("text-anchor", "start");

  var yAxis = 
    d3.axisLeft(yScale)
    .ticks(5);

  svg.append('g')
    .attr("class", "y axis")
    .attr("transform", "translate(" + Padding + "," + 0 + ")")
    .call(yAxis);
} // end makeAxes

function makeSVG () {

  var svg = d3.select("body")
    .append("svg")
    .attr("width", Width)
    .attr("height", Height);
  
  //I removed the border because it was messing with my sorting
  
  return svg
} // end makeSVG

//Adds a listener that sorts the bars when the paragraph is clicked on
function addListeners (svg, xScale) {
  d3.selectAll("p")
    .on("click", function() {
      sortBars(svg, xScale);
  });
}

//Function sorts the bars created. It takes the svg and the xScale, and reorganizes
//the bars. It does not fix the scale, but such is life. ¯\_(ツ)_/¯
var sortBars =  function(svg, xScale) {
  svg.selectAll("rect")
    .sort(function(a, b) {
      return d3.ascending(parseInt(a.Count_Poverty), parseInt(b.Count_Poverty));
    })
    .transition()
    .duration(500)
    .attr("x", function(d, i) {
	return xScale(i);
    });

}

d3.csv(Data, function(error, data) {
    if (error) {
      console.log(error)
    }
    else {
      initialize(data)
    }
});
