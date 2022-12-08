//
// References:
// interpolated colors: https://d3-graph-gallery.com/graph/custom_color.html
// animated bar chart: https://d3-graph-gallery.com/graph/barplot_button_data_csv.html
//

var margin = {left: 100, right: 0, top: 50, bottom: 80 };
width = 860 - margin.left -margin.right;
height = 700 - margin.top - margin.bottom;
    
var svg = d3.select("#svg2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);

var yScale = d3.scaleLinear().range([height, 0]);

// define the axes
var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale);

// placeholder for drawing the yAxis
var yAxisDraw = svg.append("g").attr("class", "myYaxis")

// Draws the y axis label
var yAxisLabel = svg.append("text")
        .attr("class", "ylabel")
        .attr("text-anchor", "end")
        .attr("y", -50) 
        .attr("x", -100)
        .attr("font-size", "12px")
        .attr("transform", "rotate(-90)") 
//        .text("Amount of Calories per 50 gallons of water"); 

var formatDecimal = d3.format(",.2f");

const div2 = d3
  .select('body')
  .append('div2')
  .attr('class', 'tooltip2')
  .style('opacity', 0);

// data collected from csv file
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

// used to draw the x axis using the csv file data
d3.csv("barGraphData.csv", rowConverter, function(error, data) {
    // defines the x axis domain
    xScale.domain(data.map(function(d){ return d.food; }));
    // draws the x axis
    svg.append("g") 
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("transform", "rotate(-60)");
});

// defines the color scheme of the graph
var colorGrad = d3.scaleSequential().domain([1,0])
  .interpolator(d3.interpolateViridis);
//    d3.scaleLinear().domain([1,10])
//  .range(["orange", "#db7093"])


// update function that is called when a button is pressed
function update(id) {
    yAxisLabel.remove()
//    yAxisLabel.remove()
//    yAxisLabel.remove()
    // calls the csv file data
    d3.csv("barGraphData.csv", function(data) {
        // identifies which units to add depending on the button pressed
        var units = "";
        if (id == "Mass") {
            units = "lbs/50gal"
        } else if (id == "Calories") {
            units = "cal/50gal"
        } else {
            units = "grams/50gal"
        }
        
        // defines the domain of the x axis
        xScale.domain(data.map(function(d){ return d.Food; }));
        // defines the domain of the y axis, from 0 to the max value
        yScale.domain([0,d3.max(data, function(d) {return +d[id] })]);
        
        var maxVal = d3.max(data, function(d) {return +d[id] }) * 1/3
        // bright colors: purple, blue, teal, green, yellow
//        var color = d3.scaleSequential().domain([d3.min(data, function(d) {return +d[id] }),d3.max(data, function(d) {return +d[id] })]).interpolator(d3.interpolatePuBuGn);
//        
        
        var color = d3.scaleLinear().domain([d3.min(data, function(d) {return +d[id] }),d3.max(data, function(d) {return +d[id] })]).range(["#b3c3f3", "#28666e"])
        
        yAxisLabel = svg.append("text")
        .attr("class", "ylabel")
        .attr("text-anchor", "end")
        .attr("y", -50) 
        .attr("x", -50)
        .attr("font-size", "13px")
        .attr("transform", "rotate(-90)") 
        .text("Amount of " +id+ " per 50 gallons of water (grams)"); 
        
        // draws the y axis for transitions between buttons
        yAxisDraw.transition().duration(1000).call(d3.axisLeft(yScale));
        
        // temporary placeholder for chart drawing
        var drawChart = svg.selectAll("rect").data(data)
    
        var mouseover = function(d) {
            div2
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);
                  div2 
                      .html(id)
            
        }
        
        
        // draws the bar chart
        drawChart
        .enter().append("rect")
            .merge(drawChart) // used for transitions between buttons
            .transition()
            .duration(1000)
            .attr("x", function(d) { return xScale(d.Food); })
            .attr("y", function(d) { return yScale(d[id]); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - yScale(d[id]); })
            .attr("fill", function(d){return color(d[id]);})
//             .style("stroke", "#28666e")
//        .style("stroke-width", 1)
            .style('cursor', 'pointer') 
        
        
        drawChart.on('mouseover', function(d, i){
            div2
            .transition()
            .duration(200)
            .style('opacity', 0.9);
            div2
            .html("<table>" 
                + "<tr>" + "<td colspan = 3 style = 'text-align:center'>" + id + " in " + "</td>" + " </tr>"  
                + "<tr>" + "<td colspan = 3 style = 'text-align:center'>" + d.Food + ": </td>" + " </tr>"
                + "<tr>" + "<td colspan = 3 style = 'text-align:center'>" + formatDecimal(d[id]) + "</td>" + " </tr>" 
                + "<tr>" + "<td colspan = 3 style = 'text-align:center'>" + units + "</td>" + " </tr>" 
                 )
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', function(d, i){
            div2
            .transition()
            .duration(500)
            .style('opacity', 0);
        });

    })
}

// updates the tooltip page when the viewer first loads the page
function updateTooltip (id) {
    
    yAxisLabel.remove()
//    yAxisLabel.remove()
//    yAxisLabel.remove()
    // calls the csv file data
    d3.csv("barGraphData.csv", function(data) {
        
        // identifies which units to add depending on the button pressed
        var units = "";
        if (id == "Mass") {
            units = "lbs/50gal"
        } else if (id == "Calories") {
            units = "cal/50gal"
        } else {
            units = "grams/50gal"
        }
        
        // defines the domain of the x axis
        xScale.domain(data.map(function(d){ return d.Food; }));
        // defines the domain of the y axis, from 0 to the max value
        yScale.domain([0,d3.max(data, function(d) {return +d[id] })]);
        
        // bright colors: purple, blue, teal, green, yellow
        var color = d3.scaleSequential().domain([1,d3.max(data, function(d) {return +d[id] })]).interpolator(d3.interpolatePuRd);

        
        // draws the y axis for transitions between buttons
        yAxisDraw.transition().duration(1000).call(d3.axisLeft(yScale));
        
        // temporary placeholder for chart drawing
        var drawChart = svg.selectAll("rect").data(data)
    
        var mouseover = function(d) {
            div2
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);
                  div2 
                      .html(id)
            
        }
        
        
        // draws the bar chart
        drawChart
        .enter().append("rect")
 
        drawChart.on('mouseover', function(d, i){
            div2
            .transition()
            .duration(200)
            .style('opacity', 0.9);
            div2
            .html("<table>" 
                + "<tr>" + "<td colspan = 3 style = 'text-align:center'>" + id + " in " + "</td>" + " </tr>"  
                + "<tr>" + "<td colspan = 3 style = 'text-align:center'>" + d.Food + ": </td>" + " </tr>"
                + "<tr>" + "<td colspan = 3 style = 'text-align:center'>" + formatDecimal(d[id]) + "</td>" + " </tr>" 
                + "<tr>" + "<td colspan = 3 style = 'text-align:center'>" + units + "</td>" + " </tr>" 
                 )
            .style('left', d3.event.pageX + 'px')
            .style('top', d3.event.pageY - 28 + 'px');
        })
        .on('mouseout', function(d, i){
            div2
            .transition()
            .duration(500)
            .style('opacity', 0);
        });

    })
    
}

update('Mass')
updateTooltip('Mass')
