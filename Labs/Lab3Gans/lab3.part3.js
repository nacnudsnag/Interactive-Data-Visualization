// Lab 3 javascript
// Duncan Gans
// September 20, 2017

//Function uses data from the census.csv file to create a scatter plot
//of the data. A scale is used to easily convert the data to the size of
//the svg. Regardless of the data min and max, or the size of the svg
//the scales will scale accordingly
function scatterPlot2() {
  //Removes current svg
  d3.select("svg").remove();

  var dataset;
  var w = 800;
  var h = 500;
  //Data from census is read into dataset variable
  d3.csv('census.csv', function(d) {
    dataset = d;
  });
  //Alert is used to make sure data can adequately finish loading
  alert("Giving some time");
  
  //X Scale is created, it is a linear scale
  var scaleX = d3.scaleLinear()
    //To get the min and max, d3 has a function that iterates through a 
    //set of data and finds the min and max. The range is created based
    //on the dimensions of the svg with a little bit of padding
    .domain([d3.min(dataset, function(d) {
      return parseInt(d.Year);
    })
    , d3.max(dataset, function(d) {
      return parseInt(d.Year);
    })])
    .range([0 + 40, w - 80]); 
  
  //The y Scale is just like the X scale but for the y side
  var scaleY = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) {
      return parseInt(d.Total);
    })
    , d3.max(dataset, function(d) {
      return parseInt(d.Total);
    })])
    .range([h - 40, 40]);  

  //Svg is created with correct dimensions
  var svg = d3.select("body")
	.append("svg")
	.attr("height", h)
	.attr("width", w);

  //Circles are added in appropriate places
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
  //Text is added to circles, for further explanation, earlier javascript
  //documents go into greater detail
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
}
