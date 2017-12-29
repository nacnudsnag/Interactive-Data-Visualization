// Lab 3 javascript
// Duncan Gans
// September 20, 2017

//Function makes a bar graph from a sample set of data. The bar graph is
//added to a svg element that is created, and text is added to each of the
//bars to serve as a label
function barGraph() {
  //SVG is removed if there are any hanging around
  d3.select("svg").remove();
  //Data set is created and weight height, and padding are initalized
  var dataset = [42, 154, 173, 192, 210, 313, 345, 427];
  var w = 500;
  var h = 500;
  var padding = 5

  //Svg is created within a div with the given height and weight
  var svg = d3.select("div")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

  //A rectangle is added to the svg for each data element. It's location
  //is set along the x axis to make sure they are evenly split, and the
  //y position is set at the tallest point of the bar, according to the
  //data values height
  svg.selectAll("rect")
	.data(dataset)
	.enter()
	.append("rect")
	.attr("fill", "blue")
	.attr("x", function(d, i) {
	  return i * (w / dataset.length);
	})
	.attr("y", function(d) {
	  return h - d;
	})
	.attr("width", (w / dataset.length) - padding)
	.attr("height", function(d) {
	  return d;
	});
  svg.selectAll("text")
  //Text is added at the bottom of the chart for each corresponding bar in
  //the bar chart.
	.data(dataset)
	.enter()
	.append("text")
	.text(function(d) {
	  return d;
	})
	.attr("x", function(d, i) {
	  return (i * (w / dataset.length)) + (w/dataset.length/2);
	})
	.attr("y", w - 5)	
	.attr("text-anchor", "middle")
	.attr("fill", "white");

}
//This function uses two-dimensional data to create a scatter plot.
//A svg is created and then circles are put in it according to the x and
//y values of the dataset. Finally, labels are added
function scatterPlot() {
  //Any svgs hanging around are removed
  d3.select("svg").remove();
  //Dataset is created, and width and height are created
  var dataset = [[73, 16], [26, 76],[47, 73],[69, 21],[01, 34],[34, 45],
	[72, 38],[94, 59],[95, 25],[25, 45],[45, 54]]
  var w = 520;
  var h = 500;
  
  //svg is created with corresponding height and width
  var svg = d3.select("div")
	.append("svg")
	.attr("width", w)
	.attr("height", h)
  //a circle is created for each data point, and it's location is the x
  //and y value for the data element
  svg.selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle")
	.attr("fill", "green")
	.attr("cx", function(d) {
	  return d[0] * 5 + 20;
	})
	.attr("cy", function(d) {
	  return h - (5 * d[1]);
	})
	.attr("r", 5);
  //A bit of text serves as a label, and is placed at the correct x and y
  //coordinate to be within the circle
  svg.selectAll("text")
	.data(dataset)
	.enter()
	.append("text")
	.text(function (d) {
	  return d;
	})
	.attr("x", function(d) {
	  return d[0] * 5 + 20;
	})
	.attr("y", function(d) {
	  return h - (5 * d[1]);
	})
	.attr("text-anchor", "middle")
	.attr("fill", "black"); 
}
