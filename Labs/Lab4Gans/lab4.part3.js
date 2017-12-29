//Duncan Gans
//Interactive Data Visualization
//September 25, 2017


//Creates a scatter plot from randomized data, and allows the opportunity to
//change the values. Unlike the previous two parts, there are now axis,
//and the axis change when the data changes.

//Declares global variables
var W = 500;
var H = 300;
var Padding = 20;

function main()  {
  //Creates dataset of random numbers
  var dataset = []
  var n = 30;

  for (var i = 0; i < n; i++) {
    var newNumber1 = Math.floor(Math.random() * 100);
    var newNumber2 = Math.floor(Math.random() * 100);
    dataset.push([newNumber1, newNumber2]);
  }

  //Creates scales, svgs, and the scatter plot
  svg = makeSVG("body");
  var xScale = makeScale("linear", [Padding, W - Padding * 2],
	[0, d3.max(dataset, function(d) { return d[0];})]);
  var yScale = makeScale("linear", [H - Padding, Padding],
        [0, d3.max(dataset, function(d) { return d[0];})]);
  var xAxis = makeAxis("bottom", 0, xScale);
  var yAxis = makeAxis("left", 0, yScale);
  scatter(svg, dataset, xScale, yScale);

  //Calls and places the axi
  callAxis(svg, yAxis, "y");
  callAxis(svg, xAxis, "x");

  //Allows the opportunity to update the scatter plot
  updateScatter(dataset, svg, xScale, yScale, xAxis, yAxis);
}
function makeAxis(type, ticks, scale) {
  //Makes axis given a type, an amount of ticks, and a scale
  if (type == "left")
  {
    var axis = d3.axisLeft()
		.scale(scale);
  }
  else
  {
    var axis = d3.axisBottom()
                .scale(scale);
  }
  if (ticks > 0)
  {
    axis.ticks(ticks);
  }
  return axis;
}

function callAxis(svg, axis, type) {
  //Places the axis depending on whether it's on the left side or the bottom
  if (type == "x")
  { 
    var g = svg.append("g");
    g.attr("class", "x axis")
    g.attr("transform", "translate(0," + (H - Padding) + ")")
    g.call(axis);
  }
  else
  {
    console.log("asdf");
    var g1 = svg.append("g");
    g1.attr("class", "y axis")
    g1.attr("transform", "translate(" + Padding + ",0)")
    g1.call(axis);
   
  }
}

function makeScale(type, range, domain)  {
  //Makes a scale, given a type, range, and domain
  if (type == "linear")
  {
      var scale = d3.scaleLinear()
          .domain(domain)
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

function makeSVG(svgLocation) {
  //Makes a svg
  var svg = d3.select(svgLocation)
        .append("svg")
        .attr("width", W)
        .attr("height", H);
  /*
  svg.append("rect")
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

function scatter(svg, dataset, xScale, yScale) {
  //Adds all the circles to a given svg, given the x and y values, scaled
  svg.selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle")
	.attr("cx", function(d) {return xScale(d[0]);})
	.attr("cy", function(d) {return yScale(d[1]);})
	.attr("r", 2);
}

function updateScatter(dataset, svg, xScale, yScale, xAxis, yAxis) {
  //Allows affordance to click a paragraph and change the dataset
  d3.select("p")
    .on("click", function() {
      for (var i = 0; i < dataset.length; i++) {
	dataset[i] = [Math.floor(Math.random() * 100), 
		      Math.floor(Math.random() * 100)];
      }
      //Changes the domains of the scales, while keeping the range
      xScale.domain([0, d3.max(dataset, function(d) {return d[0]; })]);
      yScale.domain([0, d3.max(dataset, function(d) {return d[1]; })]);

      svg.selectAll("circle")
	//Moves the circles, with a transition
	.data(dataset)
	.transition()
	.duration(1000)
	.attr("cx", function(d) {
	  return xScale(d[0]);
	})
	.attr("cy", function(d) {
	  return yScale(d[1]);
	});

      svg.select(".x.axis")
	//Modifies and calls the new x axis
	.transition()
	.duration(1000)
	.call(xAxis);

      svg.select(".y.axis")
	//Modifies and calls the new x axis
        .transition()
        .duration(1000)
        .call(yAxis);

    });
}




main();










