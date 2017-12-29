//Duncan Gans
//September 27, 2017
//Interactive Data Visualization

//Murray's code, but restructured in ways to make it more concise. Transitions
//are removed and simplified, global variables are used, and scales are 
//recreated every time


//Global variable creation
var w = 600;
var h = 250;
var minValue = 2;
var maxValue = 50;
var ColorMultiplier = 10;
var yOffset = 14;

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


function key (d) {
  return d.key;
}
var xScale = d3.scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([0, w])
      .paddingInner(0.05);

var yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, function(d) { return d.value; })])
      .range([0, h]);

var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

svg.selectAll("rect")
  .data(dataset, key)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return xScale(i);
  })
  .attr("y", function(d) {
    return h - yScale(d.value);
  })
  .attr("width", xScale.bandwidth())
  .attr("height", function(d) {
    return yScale(d.value);
  })
  .attr("fill", function(d) {
    return "rgb(0, 0, " + (d.value * ColorMultiplier) + ")";
  });

svg.selectAll("text")
  .data(dataset, key)
  .enter()
  .append("text")
  .text(function(d) {
    return d.value;
  })
  .attr("text-anchor", "middle")
  .attr("x", function(d, i) {
    return xScale(i) + xScale.bandwidth() / 2;
  })
  .attr("y", function(d) {
    return h - yScale(d.value) + yOffset;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "white");

d3.selectAll("p")
  .on("click", function() {

    var paragraphID = d3.select(this).attr("id");
    
    if (paragraphID == "add") {
      var newNumber = Math.floor(Math.random() * maxValue) + minValue;
      var lastKeyValue = dataset[dataset.length - 1].key;
      dataset.push({
	key: lastKeyValue + 1,
	value: newNumber
      });
    } else {
      dataset.shift();
    }
    
    var xScale = d3.scaleBand()
    //Completely redefines scales
      .domain(d3.range(dataset.length))
      .rangeRound([0, w])
      .paddingInner(0.05);

    var yScale = d3.scaleLinear()
    //Completely redefines scales
      .domain([0, d3.max(dataset, function(d) { return d.value; })])
      .range([0, h]);


    var bars = svg.selectAll("rect")
      .data(dataset, key);
    
    bars.enter()
      .append("rect")
      .merge(bars)      
      //All attributes follow the merge
      .attr("fill", function(d) {
        return "rgb(0, 0, " + (d.value * ColorMultiplier) + ")";
	//Uses global variable instead of 14
      })
      .attr("x", function(d, i) {
	     return xScale(i);
      })
      .attr("y", function(d) {
	      return h - yScale(d.value);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
	       return yScale(d.value);
      });

    bars.exit()
      .attr("x", -xScale.bandwidth())
      .remove();

      var labels = svg.selectAll("text")
      .data(dataset, key);

    labels.exit()
      .attr("x", -xScale.bandwidth())
      .remove();
    
    labels.enter()
      .append("text")
      .merge(labels)  
      //No transitions
      //Meow all the attributes are are after the merge instead of before it
      .text(function(d) {
         return d.value;
      })
      .attr("text-anchor", "middle")
      .attr("y", function(d) {
         return h - yScale(d.value) + yOffset;
      })                                                
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white")
      .attr("x", function(d, i) {
	       return xScale(i) + xScale.bandwidth() / 2;
      });

  });

