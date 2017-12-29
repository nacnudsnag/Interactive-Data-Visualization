Duncan Gans
Interactive Data Visualization
October 6, 2017

Reading in Data
 To read in the data, I first downloaded the data using wget and the url 
 provided by the UCI Machine Learning Repository. As I hoped, it was in csv
 format, but there was no headers to the columns. So I manually added the
 headers using the information provided on the UCI Abalone Dataset's page.
 From there it was as simple as running the d3.csv function on the data,
 and reading it into the dataset variable


Bugs:
  There aren't any known bugs that I have come across yet. My Y label in the 
  first chart doesn't update, which is okay, because it was okayed by the 
  professor, and the abalones don't have clear labels that would even make 
  sense to update
