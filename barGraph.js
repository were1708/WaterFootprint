var margin = {top: 10, right: 40, bottom: 100, left: 100};
var width = 860 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right) 
    .attr("height", height + margin.top + margin.bottom) 

var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);

// range represents the biggest values on the left and the smallest values on the right
var yScale = d3.scaleLinear().range([height, 0]);

// Define X and Y AXIS
var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale).ticks(5, "$5f");

function rowConverter(data) {
    return {
        food : data.Food,
        mass : +data.Mass,
        cal : +data.Calories,
        protein : +data.Protein,
        fiber : +data.Fiber,
        fat : +data.Fat,
    } 
}

d3.csv("barGraphData.csv", rowConverter, function(error, data) {
//d3.csv("barGraphData.csv",rowConverter).then(function(data){
  
  xScale.domain(data.map(function(d){ return d.food; }));
  yScale.domain([0,d3.max(data, function(d) {return d.mass; })]);
  
  var colorGrad = d3.scaleLinear().domain([1,2])
  .range(["orange", "#db7093"])
  
  // draw bars 
  svg.selectAll("rect") // creates an svg for rectangles
        .data(data) // load the data
        .enter()
        .append("rect") // shape of the bars
        .transition().duration(500) // animation
       .delay(function(d,i) {return i * 100;}) // animation timing delay
        .attr("x", function(d) { // returns the x values for the bars in the bar chart
            return xScale(d.food);
        })
        .attr("y", function(d) { // returns the y values for the bars in the bar chart
            return yScale(d.mass); 
        })
        .attr("width", xScale.bandwidth()) // width of each bar
        .attr("height", function(d) {
			 return height- yScale(d.mass); // height of each bar
        })
        .attr("fill", function(d){return colorGrad(d.mass); 
        });
  
  
  svg.append("g") 
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em") // styling of the x axis labels
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("transform", "rotate(-60)");
        
//    
//    // Draw yAxis and position the label
//    svg.append("g")
//        .attr("class", "y axis")
//        .attr("transform", "translate(0," - height + ")")
//        .call(yAxis)
//        .selectAll("text")
//        .style("text-anchor", "end")
//        .attr("font-size", "10px");
  
  
  // y axis label
  svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 20) // position
        .attr("x", -100)
        .attr("transform", "rotate(-90)") // rotates the label
        .text("Amount of ___ per 50 gallons of water"); // EDIT THIS LATER WITH TOOLTIP
  
});