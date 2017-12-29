//Duncan Gans
////Interactive Data Visualization
////September 25, 2017

//Creates Global Variables
var W = 500;
var H = 200;
var Padding = 10;
var clickBool = 0;
var InnerPadding = .05;
var LabelYOffset = 14;



function main() {
  //Dataset is created with keys and values
  var dataset = [ { key: 0, value: 5 },
		{ key: 1, value: 10 },	
		{ key: 2, value: 13 },
		{ key: 3, value: 19 },
		{ key: 4, value: 21 },
		{ key: 5, value: 25 },
		{ key: 6, value: 22 },
		{ key: 7, value: 18 },
		{ key: 8, value: 15 },
		{ key: 9, value: 13 },
		{ key: 10, value: 11 },
		{ key: 11, value: 12 },
		{ key: 12, value: 15 },
		{ key: 13, value: 20 },
		{ key: 14, value: 18 },
		{ key: 15, value: 17 },
		{ key: 16, value: 16 },
		{ key: 17, value: 18 },
		{ key: 18, value: 23 },
		{ key: 19, value: 25 } ];

  //Function so that you can just implicitly call key
  var key = function(d) {
	return d.key;
  };
  //Creates svg, scales, and bars
  var svg = makeSVG("body");

  yScale = makeScale("linear", [0, H], dataset);
  xScale = makeScale("band", [], dataset);

  bars(svg, dataset, xScale, yScale);

  //Allows opportunity to updates scales, and data
  updateData(svg, dataset, xScale, yScale)
}


function makeSVG(svgLocation) {
  //Makes svg
  var svg = d3.select(svgLocation)
        .append("svg")
        .attr("width", W)
        .attr("height", H);
  return svg;
}

function makeScale(type, range, dataset)  {
  //Makes scale based on parameters passed in
  if (type == "linear")
  {
    var scale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) {
          return d.value;
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

function updateData(svg, dataset, xScale, yScale) {
  //Updates the data in the bar graph by either removing or adding a bar to
  //the bar chart
  var key = function(d) {
        return d.key;
  };
  d3.selectAll("p")
     //Selects ALL paragraphs
    .on("click", function() {
      var id = d3.select(this).attr("id");
      //Creates id to determine whether to add or subtract a bar from the graph

      if (id == "add") {
	//If add, create a random value, and add it to the dataset
	var minVal = 2;
	var maxVal = 25 - minVal;
	var newNum = Math.floor(Math.random() * maxVal) + minVal;
	var newKey = dataset[dataset.length - 1].key + 1;
	dataset.push({key: newKey, value: newNum});
      }
      else if (id == "remove") {
	//Otherwise, remove one element from the dataset
	dataset.shift();
      }
      //Updates the scales of the domain
      xScale.domain(d3.range(dataset.length));
      yScale.domain([0, d3.max(dataset, function(d) { return d.value; })]);
      
      var bars = svg.selectAll("rect")
	.data(dataset, key);

      bars.enter()
	//For the bar graph add all of the necessary bars to the rectangle
	.append("rect")
	.attr("x", W)
	.attr("y", function(d) {
  	  return H - yScale(d.value);
	})
	.attr("width", xScale.bandwidth())
	.attr("height", function(d) {
	  return yScale(d.value);
	})
	.attr("fill", function(d) {
	  return "rgb(0, 0, " + (d.value * 10) + ")";
	})
	.merge(bars)	//Update…
	//Merge the new bars
	.transition()
	.duration(500)
	.attr("x", function(d, i) {
	  return xScale(i);
	})
	.attr("y", function(d) {
	  return H - yScale(d.value);
	})
	.attr("width", xScale.bandwidth())
	.attr("height", function(d) {
	  return yScale(d.value);
	});
	
	bars.exit()
	  .transition()
	  .duration(500)
	  .attr("x", -xScale.bandwidth())
	  //Takes the bar that is now on the far left side, and removes it
	  .remove();
	var labels = svg.selectAll("text")
	  .data(dataset, key);

	labels.exit()
	  //Does the same with the label
	  .transition()
	  .duration(500)
	  .attr("x", -xScale.bandwidth())
	  .remove();

	labels.enter()
		//For the bars, add the necessary labels, using merge to update
		//the new elements
		.append("text")
		.text(function(d) {
		  return d.value;
		})
		.attr("text-anchor", "middle")
		.attr("x", W)
		.attr("y", function(d) {
		  return H - yScale(d.value) + 14;
		})						
		.attr("font-size", "11px")
		.attr("fill", "white")
	 	.merge(labels)
		.transition()
		.duration(500)
		.attr("x", function(d, i) {
		  return xScale(i) + xScale.bandwidth() / 2;
		});
    });





}
function bars(svg, dataset, xScale, yScale) {
  //Creates bars given a svg, a dataset, and scales
  var blueScaling = 4;
  svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")


        .attr("x", function(d, i) {
          return xScale(i);
        })
        .attr("y", function(d) {
          return H - yScale(d.value);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
          return yScale(d.value);
        })
        .attr("fill", function(d) {
          return "rgb(0, 0, " + Math.round(d.value * blueScaling) + ")";
        });

  svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .text(function(d) {
          return d.value;
        })
        .attr("x", function(d, i) {
          return xScale(i) + Padding + i * InnerPadding;
        })
        .attr("y", function(d) {
          return H - yScale(d.value) + LabelYOffset;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");
}



main();

