//Duncan Gans
//Interactive Data Visualization
//September 25, 2016

//Function uses census data to create scatter plots. User can either highlight
//the total per year, or the Percent_Computer per year. It begins with the total
//but allows the user to switch, and then revert it.


//Declares Global variables
var W = 500;
var H = 300;
var Padding = 50;

function main()  {
  //Creates dataset, and allows it to load
  var dataset = [];

  d3.csv('census.csv', function(d) {
    dataset = d;
  }); 
  alert("click here for data to load in");

  //Makes svg, scales, axis, and scatter plot, as well as calling axis
  svg = makeSVG("body");
  var xScale = makeScale("linear", [Padding, W - Padding * 2],
        [1980, d3.max(dataset, function(d) { return parseInt(d.Year);})]);
  var yScale = makeScale("linear", [H - Padding, Padding],
        [80000, d3.max(dataset, function(d) { return parseInt(d.Total);})]);
  var xAxis = makeAxis("bottom", 0, xScale);
  var yAxis = makeAxis("left", 0, yScale);
  scatter(svg, dataset, xScale, yScale);
  callAxis(svg, yAxis, "y");
  callAxis(svg, xAxis, "x");

  //Allows user to update the scatter plot, and then revert it to original
  updateScatter(dataset, svg, xScale, yScale, xAxis, yAxis);
  revertScatter(dataset, svg, xScale, yScale, xAxis, yAxis);
}

function makeAxis(type, ticks, scale) {
  //Make axis given type, num of ticks, and scale
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
  //Calls axis
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
  //Makes axis depending on type of axis
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
  //Creates svg and returns it
  var svg = d3.select(svgLocation)
        .append("svg")
        .attr("width", W)
        .attr("height", H);
  return svg;
}

function scatter(svg, dataset, xScale, yScale) {
  //Initially populates scatter plot with circles
  svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d) {return xScale(parseInt(d.Year));})
        .attr("cy", function(d) {return yScale(parseInt(d.Total));})
        .attr("r", 2);
}

function updateScatter(dataset, svg, xScale, yScale, xAxis, yAxis) {
  //Switches the data being tracked to Percent_Computer
  d3.select("#change")
    .on("click", function() {
	//Switches domain of scales
      xScale.domain([1980, d3.max(dataset, function(d) 
	{return parseInt(d.Year); })]);
      yScale.domain([0, d3.max(dataset, function(d) 
	{return parseInt(d.Percent_Computer); })]);

      svg.selectAll("circle")
	//Moves circles, through transition
        .data(dataset)
        .transition()
        .duration(1000)
        .attr("cx", function(d) {
          return xScale(parseInt(d.Year));
        })
        .attr("cy", function(d) {
          return yScale(parseInt(d.Percent_Computer));
        });

      svg.select(".x.axis")
	//Updates and calls axi
        .transition()
        .duration(1000)
        .call(xAxis);

      svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);

    });
}
function revertScatter(dataset, svg, xScale, yScale, xAxis, yAxis) {
  //Reverts sactter plot back to original
  d3.select("#revert")
    .on("click", function() {
	//Updates domains of scales
      xScale.domain([1980, d3.max(dataset, function(d) 
        {return parseInt(d.Year); })]);
      yScale.domain([80000, d3.max(dataset, function(d)
        {return parseInt(d.Total); })]);

      svg.selectAll("circle")
	//Moves circles back and then updates and calls axi
        .data(dataset)
        .transition()
        .duration(1000)
        .attr("cx", function(d) {
          return xScale(parseInt(d.Year));
        })
        .attr("cy", function(d) {
          return yScale(parseInt(d.Total));
        });

      svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxis);

      svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);

    });



}



main();

