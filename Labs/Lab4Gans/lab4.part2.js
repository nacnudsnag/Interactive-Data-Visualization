//Duncan Gans
//Interactive Data Visualization
//September 25, 2017


//Same basic functions as before, except affords the opportunity for the user 
//to change the data of the graph by clicking on the paragraph part. To get
//new data, it places random numbers in a dataset of predetermined length

//Declares Global variables
var W = 500;
var H = 200;
var Padding = 10;
var clickBool = 0;
var InnerPadding = .05;
var LabelYOffset = 14; 



function main() {
  //Sets up dataset, svg, scales, and calls the bars
  var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
  var svg = makeSVG("body");

  yScale = makeScale("linear", [0, H], dataset);
  xScale = makeScale("band", [], dataset); 

  bars(svg, dataset, xScale, yScale);

  //This function allows the affordance of changing the values. Unfortunately
  //I could not put the function within a d3.select("p").on("click")
  changeBars(dataset, svg);
}


function changeBars(dataset, svg) {
  d3.select("p")
	//I tried to make this its own function, and just call it, but whenever
	//the function would be created, it would immediately call the function
  	.on("click", function() {
	//Randomly places new data into the dataset
	for (var i = 0; i < dataset.length; i++) {
    	  dataset[i] = Math.floor(Math.random() * 100 + 8);
  	}
	//Makes the scale 
  	yScale = makeScale("linear", [0, H], dataset);
  	svg.selectAll("rect")
		//Repalces all of the bars in the appropriate places
        	.data(dataset)
        	.transition()
        	.delay(function(d, i) {
		//This makes it so that the bars refresh from the left to the 
		//right to create a cool wave effect
        	  return i / dataset.length * 1000;
        	})
        	.duration(500)
        	.attr("y", function(d) {
        	  return H - yScale(d);
        	})
        	.attr("height", function(d) {
        	  return yScale(d);
        	})
        	.attr("fill", function(d) {
        	  return "rgb(0, 0, " + Math.round(d * 10) + ")";
        	});
	
	svg.selectAll("text")
		.data(dataset)
	 	.transition()
		.delay(function(d, i) {
		  return i / dataset.length * 1000;
		})
		.duration(500)
		.text(function(d) {
		  return d;
		})
		.attr("y", function(d) {
		  return H - yScale(d) + LabelYOffset;
                });
	})
      ;
}	
	

function makeSVG(svgLocation) {
  //Creates svg and returns it
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

function makeScale(type, range, dataset)  {
  //Creates a scale with given attributes
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
  //Creates bars in a given svg, when given the scales
  var blueScaling = 4;
  svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")


        .attr("x", function(d, i) {
          return xScale(i);
        })
        .attr("y", function(d) {
          return H - yScale(d);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
          return yScale(d);
        })
        .attr("fill", function(d) {
          return "rgb(0, 0, " + Math.round(d * blueScaling) + ")";
        });
  svg.selectAll("text")
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
          return H - yScale(d) + LabelYOffset;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");
}

main();
              
