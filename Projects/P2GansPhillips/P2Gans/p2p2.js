/*Duncan Gans and Andrew Phillips
  October 25
  Interactive Data Visualization

  This function visualizes a hexbin grid that plots a hexagon for each fire.
  the larger and redder the hexagon, the bigger the fire. Because this doesn't
  actually use longitude and latitude in a good way, but rather a grid system
  there are several less than ideal issues. For one, you have to move the 
  grid onto the map by manipulating the width of the rows and the starting 
  point of the grid. Furthermore, because it is a grid, you cannot use a 
  typical projection of the U.S. but rather a grid style version.  

*/

//Namespace variables
var NS = {};
NS.Dataset = [];
NS.Width = 1000; 
NS.Height = 700; 
NS.Padding = 60;
NS.rows;
NS.cols;
NS.n = 0;
NS.subset = [];
NS.minrow;
NS.mincol;
NS.maxrow;
NS.maxcol

function main() {
  //Gets the data, and waits for it to load
  getData();
  alert("Dataset Loading");
  //Figures out rows and columns so each grid and row makes up 1/4 of a 
  //longitude or latitude
  NS.n = NS.Dataset.length;
  NS.minrow = d3.min(NS.Dataset, function(d) { return parseFloat(d.latitude)});
  NS.maxrow = d3.max(NS.Dataset, function(d) { return parseFloat(d.latitude)});
  NS.rows = 4 * (NS.maxrow - NS.minrow);
  NS.maxcol = d3.max(NS.Dataset, function(d) { return parseFloat(d.longitude)});
  NS.mincol = d3.min(NS.Dataset, function(d) { return parseFloat(d.longitude)});
  NS.cols = 4 * (NS.maxcol - NS.mincol);
  //gets subset of data with date below (for initally setting up)
  NS.subset = getSubset("2017-10-15");

  //Makes svg and adds map to the svg
  var svg = makeSVG("body");
  var map = getMap(svg);
  
  //Sets up the radius of the hexagon
  var hexRadius = d3.min([NS.Width/((NS.cols + 0.5) * Math.sqrt(3)),
    NS.Height/((NS.rows + 1/3) * 1.5)]);
  
  //Prunes the subset to get rid of data way south and way in Canada
  NS.subset = pruneData(NS.subset);
  //Gets points that map better to the hexagon grid
  var points = getPoints(hexRadius);
  //Actually creates the hexagons on the maps
  hexes(svg, points);
  //adds interactivity of the slider, and the animation as well as the legend
  sliderDisplay(svg, hexRadius);
  animate(svg, hexRadius);
  addLegend(svg);
}

function sliderDisplay(svg, hexRadius) {
  //Function finds the slider, and appends the number on the slider to the text
  //elemen in the html. Then, using the date, the graph is updated. 
  var slider = document.getElementById("myRange");
  var number = d3.select("p");
  number.append("text")
  //Sets up intial date that is shown
    .text("" + slider.value + " 2017");
    updateGraph(svg, hexRadius, slider.value);
  slider.oninput = function() {
  //Whenever the slider changes values
    d3.selectAll("text").remove();
    number.append("text")
	.text("" + slider.value + " 2017");
    updateGraph(svg, hexRadius, slider.value)
  }
}//end sliderDisplay

function addLegend(svg) {
  //Adds the two rects and the necessary text to describe the hexagons
  svg.append("rect")
    .attr("x", 800)
    .attr("y", 400)
    .attr("width", 10)
    .attr("height", 10)
    .attr("stroke-width", 2)
    .attr("stroke", "black")
    .attr("fill", "red");
  svg.append("rect")
    .attr("x", 800)
    .attr("y", 415)
    .attr("width", 10)
    .attr("height", 10)
    .attr("stroke-width", 2)
    .attr("stroke", "white")
    .attr("fill", "red");
  svg.append("text")
    .attr("x", 812)
    .attr("y", 409)
    .attr("font-size", 12)
    .attr("text-anchor", "left")
    .text("Data Collected at Night");
  svg.append("text")
    .attr("x", 812)
    .attr("y", 424)
    .attr("font-size", 12)
    .attr("text-anchor", "left")
    .text("Data Collected during Day");
  svg.append("text")
    .attr("x", 800)
    .attr("y", 439)
    .attr("font-size", 12)
    .attr("text-anchor", "left")
    .text("Larger Hexagon indicates bigger fire");
} //end addLegend

function updateGraph(svg, hexRadius, val) {
      //Gets and prunes the subset of data with a given date`
      NS.subset = getSubset("2017-10-" + val + "");
      NS.subset = pruneData(NS.subset);
      //Gets the data in a more hexagon friendly
      var points = getPoints(hexRadius);
      //Adds legend and makes hexagons
      addLegend(svg);
      hexes(svg, points);
} //end updateGraph

function animate(svg, hexRadius) {
  //When the play image is selected, it moves the slider, and updates the 
  //map
  d3.select("#animate")
    .on("click", function() {
      var slider = document.getElementById("myRange");
      var val = 15;
      var id = setInterval(frame, 1000);
      //Sets up animation to change every 1000 milliseconds
      function frame() {
        //Function ends as soon as date passes max date
        if (val >= 23) {
          clearInterval(id);
        } 
        else 
        {
          //Gets and updates data as before
          NS.subset = getSubset("2017-10-" + val + "");
          NS.subset = pruneData(NS.subset);
          var points = getPoints(hexRadius);
          hexes(svg, points); 
	  d3.selectAll("text").remove();
           d3.select("p").append("text")
            .text("" + val + " 2017");
          slider.value = val;

          //Moves value of slider and data forward one, and adds legend
          val = val + 1;
	  addLegend(svg);
        }
      }
  });
} //end animate

function getSubset(date) {
  //Returns all data in the NS.Dataset with a given date
  var dataset = [];
  for (i = 0; i < NS.n; i++)
  {
    if (NS.Dataset[i].acq_date == date)
    {
      dataset.push(NS.Dataset[i]);
    }
  }
  return dataset;
} //end getSubset



function getData() {
  //Reads in a csv file using d3s handy function, and sets it to the 
  //global variable myNS.Dataset
  d3.csv('MODIS_C6_USA_contiguous_and_Hawaii_7d.csv', function(d) {
    NS.Dataset = d;
  });
}

function makeSVG(loc) {
  //Makes svg in a given location with a given weight
  var svg = d3.select(loc)
    .append("svg")
    .attr("width", NS.Width)
    .attr("height", NS.Height)
  return svg;
} 

function getMap(svg) {
  //Appends the map to a svg
  var imgs = svg.selectAll("image").data([0]);
    imgs.enter()
    .append("svg:image")
      .attr("xlink:href", "usa_location_map.png")
      .attr("width", "1000")
      .attr("height", "600");
}

function pruneData(data) {
  //Takes a bunch of data and only returns the data that fall within
  //the places that are actually on the map from before
  var subseta = [];
  for (i = 0; i < data.length; i++)
  {
    if ((parseFloat(data[i].latitude) > 29 || 
	(data[i].longitude > -83 && data[i].latitude > 24)) &&
	parseFloat(data[i].latitude) < 49)
    {
      subseta.push(data[i]);
    }
  }
  return subseta;
}

function getPoints(hexRadius) {
  //Takes the NS.Subset and converts it into a dataset that has necessary
  //information for the hex grid
  var subset = NS.subset;
  var points = [];
  var brightness;
  for (var i = 0; i < subset.length; i++) {
    brightness = parseFloat(subset[i].brightness);
    //Here it uses the data about the columns as well as the hex radius
    //to get the necessary location information
    points.push([hexRadius*(Math.floor(subset[i].longitude) - NS.mincol)*1.75, 
      hexRadius * (NS.maxrow - Math.floor(subset[i].latitude)) * 1.5,
      brightness, subset[i].latitude, subset[i].longitude, subset[i].daynight]);
  }
  return points;
}

function hexes(svg, points) {
  //For me this function is a little bit of a black box. As much as I've tried
  //to figure out everything that's going on, I still think that the hexbin
  //is unecessarily weird and unclear.
  
  //Removes current hexagons and paths
  svg.selectAll("path").remove()
  var hexbin = d3.hexbin();
  //Gets the hexbin set up using this function
  //Selects all the hexagons, and uses the data stored in points
  svg.selectAll("path")
    .data(hexbin(points))
    .enter()
    .append("path")
    .attr("class", "hexagon")
    .attr("transform", function(d) {
      //Moves the hexagon in the right location. Unfortunately, this isn't
      //automatically in a good location, so I had to do some automatic 
      //scaling to move the hexagons in the correct locations. This is
      //another drawback of the hexagons
      return "translate("+(6*d.x - 510)+"," + (8.35 * d.y + 15) + ")";
    })
  //Sets the size of the hexagons
  .attr("d", function(d) {
    return hexbin.hexagon((d[0][2]- 270)/ 8)})
  //The border of the hexagon relies on whether the data collected in night
  //or day
  .attr("stroke", function(d) {
     if (d[0][5] == "D") {return "white"}
     else {return "black"}})
  .attr("stroke-width", "1px")
  .style("fill", function(d) {
  //Color of hexagon dependent on fire brightness
    return "rgb(" + (d[0][2]-290) * 8 + ", 0, 0)"})
  .append("title")
  //Adds latitude and longitude if someone hovers over a hexagon
    .text(function(d) {
       return "Latitude: " + d[0][3] + "\nLongitude: " + d[0][4] +"";});
} //end Hexes

main();






