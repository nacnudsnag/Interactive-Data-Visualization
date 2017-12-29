// Lab 3 javascript
// Duncan Gans
// September 20, 2017

//Function is identical to previous scatter plot, but adds axis
//Therefore, I will comment only on the new additions, to see further detail
//look at earlier javascript files for the other parts
function scatterPlot3() {

  d3.select("svg").remove();
  var dataset;
  var w = 800;
  var h = 500;

  d3.csv('census.csv', function(d) {
    dataset = d;
  });
  alert("Giving some time");

  var scaleX = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
      return parseInt(d.Year) - 5;
    })
    , d3.max(dataset, function(d) {
      return parseInt(d.Year);
    })])
    .range([0 + 40, w - 80]);

  var scaleY = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
      return parseInt(d.Total) - 2000;
    })
    , d3.max(dataset, function(d) {
      return parseInt(d.Total);
    })])
    .range([h - 40, 40]);
  //Axis takes the x scale made earlier and makes it into an x axis
  var xAxis = d3.axisTop()
	.scale(scaleX)
  //Y Axis takes the y scale made earlier and makes it into a y axis
  var yAxis = d3.axisLeft()
	.scale(scaleY)

  var svg = d3.select("body")
        .append("svg")
        .attr("height", h)
        .attr("width", w);

  svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("fill", "green")
        .attr("r", 10)
        .attr("cx", function(d) {
          return scaleX(d.Year);
        })
        .attr("cy", function(d) {
          return scaleY(d.Total);
        });

  svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
          return d.Year + ", " + d.Total;
        })
        .attr("x", function(d) {
          return scaleX(d.Year);
        })
        .attr("y", function(d) {
          return scaleY(d.Total);
        })
        .attr("fill", "black")
        .attr("text-anchor", "begin");

  //Appends g element that is an axis, and moves it so that the x axis is
  //on the bottom of the graph instead of the top. The axis is then made
  svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + (h-40) + ")")
	.call(xAxis);
  //Appends a g element that is an axis, and moves it so that the axis (a
  //y axis) sits on the left side of the graph. The axis is then called
  svg.append("g")
        .attr("class", "axis")
	.attr("transform", "translate(45, 0)")
        .call(yAxis);

}

