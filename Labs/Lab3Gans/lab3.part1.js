// Lab 3 javascript
// Duncan Gans
// September 20, 2017


function census() {
  //Creates a dataset and fills it with data from a csv file. 
  var dataset;

  d3.csv('census.csv', function(d) {
    dataset = d;
    });
  alert("To give data time to load in");
  //Selects all the paragraphs in the document (this creates them if they
  //don't exist) and then for each element in the data set, a p element
  //is added with the text being the contents of the data piece
  var svg = d3.select("p")
    .selectAll("p")
    .data(dataset)
    .enter()
    .append("p")
    .text(function(d){
      return (d.Year + "  " + d.Total + "  " + d.Percent_Computer + "  " + 
		d.Percent_Internet);
    });
}

function endPart1() {
  //This removes the census file for aesthetic reasons. After doing so, one
  //cannot create and show the census data again. 
  d3.select("p").remove();

}


