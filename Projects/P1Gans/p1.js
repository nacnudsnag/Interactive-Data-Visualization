//Project 1 Javascript
//Duncan Gans

//These functions create two graphs. One of them is a bar chart that shows
//two different weights of shells. The second is a scatter plot that allows
//the user to compare any of the two variables listed. 

//Global Variables
var myNS = {};
myNS.Dataset;
myNS.Width = 600;
myNS.Height = 500;
myNS.Padding = 50;
myNS.BarPadding = 5;
myNS.RedScaling = 300;
myNS.GreenScaling = 400;
var CurrX = "xWh";
var CurrY = "ySu";

//Function with all the embedded functions that creates the graphs
//this is essentially the "main()" function
function init() {
  //Reads the data into the dataset
  getData();
  //Gets a reasonably sized subset of the data
  var barData = getSubset(20);
  
  //Makes the svg in the #first div
  var svg = makeSVG("#first");

  //Creates a yScale with the domain being the amount of elements in the dataset
  //and the range being the height of the svg without the padding
  var yScale = d3.scaleBand()
    .domain(d3.range(barData.length))
    .range([myNS.Height - myNS.Padding, myNS.Padding])
    .paddingInner(0.05);
  
  //Creates a xScale with the domain being the range of values in the dataset
  //and the range being the width of the svg
  var xScale = d3.scaleLinear()
   .domain([0, d3.max(barData, function(d){return parseFloat(d.WholeWeight);})])
    .range([myNS.Padding, myNS.Width - myNS.Padding])
  
  //Creates all the bars, adds all the titles, and makes the axes
  bars(svg, barData, xScale, yScale);
  addTitleBars(svg);
  makeAxes (svg, barData, xScale, yScale);
  
  //adds event listeners for interactivity
  eventListeners(svg, barData, xScale, yScale);

  //Creates second svg and places it in the #second div. The subset of data is
  //created
  var svg2 = makeSVG("#second");
  var scatterData = getSubset(500);
  
  //Scales are created in similar manner as mentioned before
  var yScale2 = d3.scaleLinear()
    .domain([0, d3.max(scatterData, function(d) {
       return parseFloat(d.WholeWeight);}
    )])
    .range([myNS.Height - myNS.Padding, myNS.Padding])
  var xScale2 = d3.scaleLinear()
    .domain([0, d3.max(scatterData, function(d) {
       return parseFloat(d.ShuckedWeight);}
    )])
   .range([myNS.Padding, myNS.Width - myNS.Padding])

  //Initial chart is created, titles and axes are added, and the chart
  //allows for updates to the X and Y axis
  scatter(svg2, scatterData, xScale2, yScale2) ;
  addTitleScatter(svg2);
  makeAxes(svg2, scatterData, xScale2, yScale2);
  updateScatterX(svg2, scatterData, xScale2, yScale2);
  updateScatterY(svg2, scatterData, xScale2, yScale2);
}

function scatter(svg, dataset, xScale, yScale)  {
  //All the circles are selected(they don't exist yet)
  svg.selectAll("circle")
    //For each element in the dataset, a circle is appended
    .data(dataset)
    .enter()
    .append("circle")
      //The position attributes as well as the color and size attributes are
      //selected
      .attr("cx", function(d) {return xScale(parseFloat(d.ShuckedWeight))})
      .attr("cy", function(d) {return yScale(parseFloat(d.WholeWeight))})
      .attr("fill", function(d) {
        if (parseInt(d.Rings) < 10) {return "rgb(0, 0, 300)";}
        else if (parseInt(d.Rings) < 15) {return "rgb(0, 300, 0)";}
        else {return "rgb(300, 0, 0)";}
      })
      .attr("r", function(d) {return parseInt(d.Rings)/3});
  //Labels are added to the svg
  addLabels(svg)
}

function addTitleBars(svg) {
  //Adds title to the bars
  //This below is the main title
  svg.append("text")
    .text("Shucked Weight and Whole Weight Distribution")
    .attr("text-anchor", "middle")
    .attr("x", myNS.Width / 2)
    .style("font-size", 40)
    .attr("y", myNS.Padding / 2);
  //This addds two little squares to the svg to serve as squares for a legend
  svg.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "green")
    .attr("x", myNS.Width - myNS.Padding*3)
    .attr("y", myNS.Height -myNS.Padding*2);
  svg.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "red")
    .attr("x", myNS.Width - myNS.Padding*3)
    .attr("y", myNS.Height -myNS.Padding*2 + 20);
  //This is where the text element of the legend is added
  svg.append("text")
    .text("Shucked Weight (g)")
    .attr("text-anchor", "middle")
    .attr("x", myNS.Width - myNS.Padding*1.5)
    .attr("y", myNS.Height - myNS.Padding*2 + 10); 
  svg.append("text")
    .text("Whole Weight (g)")
    .attr("text-anchor", "middle")
    .attr("x", myNS.Width - myNS.Padding*1.6)
    .attr("y", myNS.Height - myNS.Padding*2 + 30);
}

function addTitleScatter(svg) {
  //Same deal as before, but for the scatter graph
  svg.append("text")
    .text("Variable Comparer (Larger Circle Size is Older Abalone)")
    .attr("text-anchor", "middle")
    .attr("x", myNS.Width / 2)
    .style("font-size", 40)
    .attr("y", myNS.Padding / 2);
  //Thre legend circles (instead of rects) are added
  svg.append("circle")
    .attr("r", 5)
    .attr("cx", myNS.Padding * 1.6)
    .attr("cy", myNS.Padding * 2)
    .attr("fill", "green");
  svg.append("circle")
    .attr("r", 5)
    .attr("cx", myNS.Padding * 1.6)
    .attr("cy", myNS.Padding * 2.3)
    .attr("fill", "red");
  svg.append("circle")
    .attr("r", 5)
    .attr("cx", myNS.Padding * 1.6)
    .attr("cy", myNS.Padding * 1.7)
    .attr("fill", "blue");
  //Necessary text is added
  svg.append("text")
    .text("Age < 10")
    .attr("text-anchor", "middle")
    .attr("x", myNS.Padding * 2.5)
    .attr("y", myNS.Padding * 1.8)
  svg.append("text")
    .text("Age < 15")
    .attr("text-anchor", "middle")
    .attr("x", myNS.Padding * 2.5)
    .attr("y", myNS.Padding * 2.1)
  svg.append("text")
    .text("Age > 15")
    .attr("text-anchor", "middle")
    .attr("x", myNS.Padding * 2.5)
    .attr("y", myNS.Padding * 2.4)
}

function addLabels(svg) {
  //Current x labels for the axi are added
  svg.selectAll("text.xLab").remove();
  svg.selectAll("text.yLab").remove();
  //New x axis label is created.
  svg.append("text")
    //Given the xLab class so it can be removed, position is indicated
    .attr("class", "xLab")
    .attr("text-anchor", "middle")
    .attr("x", myNS.Width/2 + myNS.Padding)
    .attr("y", myNS.Height - 5)
    .text(function() {
      //The actual words are determined by whichever is the current x
      //axis being used
      if (CurrX == "xDi") {return "Diameter (mm)";}
      else if (CurrX == "xWh") {return  "Whole Weight (g)";}
      else if (CurrX == "xLe") {return  "Length (mm)";}
      else if (CurrX == "xSe") {return   "Shelled Weight (g)";}
      else if (CurrX == "xSu") {return   "Shucked Weight (g)";}
      else if (CurrX == "xHe") {return   "Height (mm)" ;}
      else { return  "Visceral Weight (g)";}})

  //Same thing as above, but for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("class", "yLab")
    .attr("text-anchor", "middle")
    .attr("x", - (myNS.Height / 2))
    .attr("y", myNS.Padding / 3)
    .text(function() {
      if (CurrY == "yDi") {return "Diameter (mm)";}
      else if (CurrY == "yWh") {return  "Whole Weight (g)";}
      else if (CurrY == "yLe") {return  "Length (mm)";}
      else if (CurrY == "ySe") {return   "Shelled Weight (g)";}
      else if (CurrY == "ySu") {return   "Shucked Weight (g)";}
      else if (CurrY == "yHe") {return   "Height (mm)" ;}
      else if (CurrY == "yVi") {return   "Visceral Weight (g)";}})
}
function updateScatterX(svg, dataset, xScale, yScale) {
  //The x axis update for the scatter chart
  d3.select("#xForm")
    //It chooses the html form with the id xForm
    .selectAll("option")
    //Selects the options
    .on("click", function() {
      //Whichever one is clicked on becomes the current x attribute
      CurrX = d3.select(this).attr("id");
      xScale.domain([0, d3.max(dataset, function(d) { 
	//The values for the x scale domain become whatever the new
	//current x attribute is
	//(I'm sure there is a more elegant way to do this, as was described
	//in class, but I didn't get a good enough look to do it well
        if (CurrX == "xDi") {return parseFloat(d.Diameter);}    
        else if (CurrX == "xLe") {return parseFloat(d.Length);}
        else if (CurrX == "xSe") {return parseFloat(d.ShellWeight);}
        else if (CurrX == "xSu") {return parseFloat(d.ShuckedWeight);}
        else if (CurrX == "xHe") {return parseFloat(d.Height);}
        else if (CurrX == "xVi") {return parseFloat(d.ViscWeight);}
        else if (CurrX == "xWh") {return parseFloat(d.WholeWeight);}})])

      //Now, a circle is added at the correct place. The y value is the 
      //same, but the x value is now changed
      svg.selectAll("circle")
        .data(dataset)
	.transition()
	.duration(1000)
	.attr("cx", function(d) {
          if (CurrX == "xDi") {return xScale(parseFloat(d.Diameter));}	  
          else if (CurrX == "xLe") {return xScale(parseFloat(d.Length));}
          else if (CurrX == "xSe") {return xScale(parseFloat(d.ShellWeight));}
          else if (CurrX == "xSu") {return xScale(parseFloat(d.ShuckedWeight));}
          else if (CurrX == "xHe") {return xScale(parseFloat(d.Height));}
          else if (CurrX == "xVi") {return xScale(parseFloat(d.ViscWeight));}
          else if (CurrX == "xWh") {return xScale(parseFloat(d.WholeWeight));}})
        
      //Current axi are removed, and new axi replace them, finally labels
      //are back
      svg.selectAll("g").remove();
      makeAxes(svg, dataset, xScale, yScale);      
      addLabels(svg);
    });
}

function updateScatterY(svg, dataset, xScale, yScale) {
  //Same thing as above but for the y axis
  d3.select("#yForm")
    .selectAll("option")
    .on("click", function() {
      CurrY = d3.select(this).attr("id");
      console.log("ASDfA");

      yScale.domain([0, d3.max(dataset, function(d) {
        if (CurrY == "yDi") {return parseFloat(d.Diameter);}
        else if (CurrY == "yLe") {return parseFloat(d.Length);}
        else if (CurrY == "ySe") {return parseFloat(d.ShellWeight);}
        else if (CurrY == "ySu") {return parseFloat(d.ShuckedWeight);}
        else if (CurrY == "yHe") {return parseFloat(d.Height);}
        else if (CurrY == "yVi") {return parseFloat(d.ViscWeight);}
        else if (CurrY == "yWh") {return parseFloat(d.WholeWeight);}})])

      svg.selectAll("circle")
        .data(dataset)
        .transition()
        .duration(1000)
        .attr("cy", function(d) {
          if (CurrY == "yDi") {return yScale(parseFloat(d.Diameter));}
          else if (CurrY == "yLe") {return yScale(parseFloat(d.Length));}
          else if (CurrY == "ySe") {return yScale(parseFloat(d.ShellWeight));}
          else if (CurrY == "ySu") {return yScale(parseFloat(d.ShuckedWeight));}
          else if (CurrY == "yHe") {return yScale(parseFloat(d.Height));}
          else if (CurrY == "yVi") {return yScale(parseFloat(d.ViscWeight));}
          else if (CurrY == "yWh") {return yScale(parseFloat(d.WholeWeight));}})

      svg.selectAll("g").remove();
      makeAxes(svg, dataset, xScale, yScale);
      addLabels(svg);

    });
}

//These are the event listeners for the bar chart
function eventListeners(svg, dataset, xScale, yScale) {
  //When the sortWhole html object is clicked, it will sort the bars by whole
  //weight
  d3.select("#sortWhole")
    .on("click", function() {
      sortBarsWhole(svg, dataset, xScale, yScale);
    });
  //Same as above but for shucked weight
  d3.select("#sortShucked")
    .on("click", function() {
      sortBarsShucked(svg, dataset, xScale, yScale);
    });
  svg.selectAll("rect.Whole")
  //When a rect (a bar) is hovered over, it changes the color and adds a title
  //The mouseout aspect just ends what happens when it is mouseovered
    .on("mouseout", function(d) {
      d3.select(this)
        .transition()
        .duration(10)
        .attr("fill", "rgb(" +
          Math.round(parseFloat(d.WholeWeight) * myNS.RedScaling) + ", 0, 0)")})
    .on("mouseover", function(d) {
      d3.select(this)
        .attr("fill", "rgb(0, 0, "+ (parseFloat(d.WholeWeight)*300) + ")")})
        .append("title")
	  .text(function(d) { 
	    return "Whole weight is " + d.WholeWeight + 
	           " Shucked weight is " + d.ShuckedWeight + ""});
  svg.selectAll("rect.Shucked")
  //Does the same but for the shucked rectangles (note: the title does NOT
  //appear if you hover over the shucked weight.
    .on("mouseover", function(d) {
      d3.select(this)
        .attr("fill", "rgb(0, 0, "+ (parseFloat(d.WholeWeight)*400) + ")")})
    .on("mouseout", function(d) {
      d3.select(this)
        .transition()
        .duration(10)
	.attr("fill",  "rgb(0, " +
       Math.round(parseFloat(d.ShuckedWeight) * myNS.GreenScaling) + ", 0)")});
}

function sortBarsShucked(svg, dataset, xScale, yScale) {
  //Selects all of the whole rects
  svg.selectAll("rect.Whole")
    //Sorts them in an ascending order based on their shucked weight
    .sort(function(a, b) {
      return d3.ascending(
        parseFloat(a.ShuckedWeight),parseFloat(b.ShuckedWeight));
    })
    .transition()
    .duration(1000)
    .attr("y", function(d, i) {
      return yScale(i);
    });

  svg.selectAll("rect.Shucked")
  //Selects all the shucked rects and sorts them based on their shucked weight
    .sort(function(a, b) {
      return d3.ascending(
        parseFloat(a.ShuckedWeight), parseFloat(b.ShuckedWeight));
    })
    .transition()
    .duration(1000)
    .attr("y", function(d, i) {
      return yScale(i) + ((myNS.Height-2*myNS.Padding)/
	dataset.length-myNS.BarPadding)/2;
    });
}

function sortBarsWhole(svg, dataset, xScale, yScale) {
  //Does the same thing but for the whole weight
  svg.selectAll("rect.Whole")
    .sort(function(a, b) {
      return d3.ascending(parseFloat(a.WholeWeight), parseFloat(b.WholeWeight));
    })
    .transition()
    .duration(1000)
    .attr("y", function(d, i) {
      return yScale(i);
    });
  svg.selectAll("rect.Shucked")
    .sort(function(a, b) {
      return d3.ascending(parseFloat(a.WholeWeight), parseFloat(b.WholeWeight));
    })
    .transition()
    .duration(1000)
    .attr("y", function(d, i) {
      return yScale(i)+((myNS.Height-2*myNS.Padding)/
	dataset.length-myNS.BarPadding)/2;
    });
}

function makeAxes(svg, dataset, xScale, yScale) {
  //Makes axis. It takes the dataset, the svg, and calls the axi in the
  //apropriate position. The scales are already created so it just appends
  //them. When using this funciton, it is necessary to delete the current 
  //axi before the function is called
  var xAxis = d3.axisBottom(xScale)
    d3.axisBottom(xScale)
      .tickFormat(function(d) {return dataset[d].WholeWeight;});

    svg.append('g')
      .attr("class", "xAxis")
      .attr("transform", "translate(0, " + (myNS.Height - myNS.Padding) + ")")
      .call(xAxis)

  var yAxis = 
    d3.axisLeft(yScale)
    .ticks(5);

  svg.append('g')
    .attr("class", "yAxis")
    .attr("transform", "translate(" + myNS.Padding + "," + 0 + ")")
    .call(yAxis);
}

//A x and y axis label are created
function labelBars(svg)  {
  //Appends text at the bottom of the graph for the x axis label
  svg.append("text")
    .attr("class", "xLab")
    .attr("text-anchor", "middle")
    .attr("x", myNS.Width/2 + myNS.Padding)
    .attr("y", myNS.Height - 5)
    .text("Weight (Shucked/Whole) (g)");
  svg.append("text")
  //Does the same for the y axis (working with rotation is wayyy harder than
  //it need to be in my opinion
    .attr("transform", "rotate(-90)")
    .attr("class", "yLab")
    .attr("text-anchor", "middle")
    .attr("x", - (myNS.Height / 2))
    .attr("y", myNS.Padding / 3)
    .text("Abalone Number");
}

function bars(svg, dataset, xScale, yScale) {
  //Function creates all the bars initially in no sorted order
  var labelXoffset = 0;

  //Selects all the rects with the whole tag. (they don't exist yet (:   )
  svg.selectAll("rect.Whole")
    //For each element in the dataset, one is created
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "Whole")
    //Their class becomes whole
    //Their positioning and sizing is dictated by the scales passed in earlier
    //as well as the data of the individual element
    .attr("x", myNS.Padding)
    .attr("y", function(d, i) {return yScale(i)})
    .attr("width", function(d) {
      return xScale(parseFloat(d.WholeWeight) - .1);})
    .attr("height", ((myNS.Height - 2*myNS.Padding) 
	/ dataset.length - myNS.BarPadding)/2)
    .attr("fill", function(d) {
    //Color of the bars is dictated by the magnitude of the data
       return "rgb(" + 
       Math.round(parseFloat(d.WholeWeight) * myNS.RedScaling) + ", 0, 0)";
    });
 
  //The same is done but for the shucked weights
  svg.selectAll("rect.ShuckedWeight")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "Shucked")
    .attr("x", myNS.Padding)
    .attr("y", function(d, i) {
      return yScale(i) + (((myNS.Height - 2*myNS.Padding)
	/dataset.length-myNS.BarPadding)/2);})
    .attr("width", function(d) {
      return xScale(parseFloat(d.ShuckedWeight) - .1);})
    .attr("height", ((myNS.Height - 2*myNS.Padding) 
	/ dataset.length - myNS.BarPadding)/2)
    .attr("fill", function(d) {
       return "rgb(0, " +
       Math.round(parseFloat(d.ShuckedWeight) * myNS.GreenScaling) + ", 0)";
    });
  labelBars(svg);

}

function getData() {
  //Reads in a csv file using d3s handy function, and sets it to the 
  //global variable myNS.Dataset
  d3.csv('abalone.data', function(d) {
    myNS.Dataset = d;
  });
}


function getSubset(n) {
  //When given a n value, it returns a subset of the whole dataset
  var subset = [];
  alert("Waiting for Dataset to Load");
  for (i = 0; i < n; i++)
  {
    subset.push(myNS.Dataset[i]);
  }
  return subset;
}

function makeSVG (loc) {
  //Makes a svg in a given location within the html document
  var svg = d3.select(loc)
    .append("svg")
    .attr("width", myNS.Width)
    .attr("height", myNS.Height);
  
  //I removed the border because it was messing with my sorting
   
  return svg
} 

init();
