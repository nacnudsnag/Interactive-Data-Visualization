//Duncan Gans
//Interactive Data Visualization
//September 25, 2017
 
//This function builds off of murrays code, but breaks it down into functions
//as much as possible. It implements band scales as a way to cover the x axis 
//for non numeric x values. 

//Global Variables
var W = 500;
var H = 200;
var Padding = 10;
var InnerPadding = .05;

function main() {
  //Makes Dataset, SVG, Scales
  var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
		11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
  var svg = makeSVG("body");

  yScale = makeScale("linear", [0, H], dataset);
  xScale = makeScale("band", [], dataset); 

  //Creates bars
  bars(svg, dataset, xScale, yScale, "entry");
}

function makeSVG(svgLocation) {
  //Takes a location for the svg, and creates one there, returning it later
  var svg = d3.select(svgLocation)
	.append("svg")
	.attr("width", W)
	.attr("height", H);

  //Creating a border around the svg
  /*svg.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("height", H)
	.attr("width", W)
	.style("stroke", "black")
  	.style("fill", "none")
    	.style("stroke-width", 1);
  */
  return svg;
}

function makeScale(type, range, dataset)  {
  //Makes scale when given a range, a dataset, and a type of scale
  if (type == "linear")
  {
    var scale = d3.scaleLinear()
  	.domain([0, d3.max(dataset, function(d) {
	  return d;
	})])
	.range(range);
  }
  else if (type == "band")
  {
    var scale = d3.scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([0, W])
      .paddingInner(InnerPadding);
  }
  return scale;
}	

function bars(svg, dataset, xScale, yScale) {
  //When given an svg, a dataset, and scales, it makes a bar chart
  var blueScaling = 4;
  var labelYoffset = 14;  // distance from the top of the bar
  svg.selectAll("rect")  // added .year to ignore outside rect
	.data(dataset)
    	.enter()
    	.append("rect")
    	.attr("x", function(d, i) {
	//Places bars at appropriate x val
    	  return xScale(i);
    	})
    	.attr("y", function(d) {
	//Places bars at appropriate y val
    	  return H - yScale(d);
    	})
        .attr("width", xScale.bandwidth())
	.attr("height", function(d) { 
	//Puts in the height of the bar
 	  return yScale(d);
	})
    	.attr("fill", function(d) {
	//Scales the blue value of the color based on the value
    	  return "rgb(0, 0, " + Math.round(d * blueScaling) + ")";
    	});
  svg.selectAll("text")
	//Places the data value in the correct place 
	.data(dataset)
	.enter()
	.append("text")
	.attr("text-anchor", "middle")
	.text(function(d) {
	  return d;
	})
	.attr("x", function(d, i) {
          return xScale(i) + Padding + i * InnerPadding;
        })
        .attr("y", function(d) {
          return H - yScale(d) + labelYoffset;
        })
    	.attr("font-family", "sans-serif")
    	.attr("font-size", "11px")
    	.attr("fill", "white");
}

main();
