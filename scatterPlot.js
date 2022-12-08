function rowConverter(data) {
    return {
        food: data.Food_Product,
        waterPercentage: data.Water_Percentage,
        waterFootprint: data.Water_Footprint
    }
}

var margin = {left: 60, right: 0, top: 50, bottom: 50 };
width = 900 - margin.left -margin.right;
height = 700 - margin.top - margin.bottom;


var svgScatter = d3.select("#svg1")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("#div1") 
.append("div")	
.attr("class", "tooltip")
.style("opacity", 0);

d3.csv("scatterData.csv", rowConverter, function(error, data) {
    // initilize some empty arrays to populate with values!
    percentage = []
    footprints = []
    // we do this in order to find the max value so we can set x and y domains!

    for (x of data) { // loop through all the rows
        percentage.push(parseFloat(x.waterPercentage)) // append the gdp
        footprints.push(parseFloat(x.waterFootprint)) // append the ecc
    }

        //Define Scales   
        var xScale = d3.scaleLinear()
        .domain([0, d3.max(footprints) + 3]) // defines the domain by finding the max of the footprints
        .range([0, width]);
        
        var yScale = d3.scaleLinear()
        .domain([0,d3.max(percentage) + 10]) // defines the domain by finding the max of percentages
        .range([height, 0]);


        var view = svgScatter.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 5)
            .attr("cx", function(d) {return xScale(d.waterFootprint);})
            .attr("cy", function(d) {return yScale(d.waterPercentage);})
            .on("mouseover", function(d) { // mouse over for tool tip
            div.transition()
            .duration(200)
            .style("opacity", .9) // makes the div visible 
            
            div.html( // html for the tool tip
            "<table>" + "<td colspan = 3 style = 'text-align:center'>" + d.food + "</td>" + " </tr>" 
            + "<tr>" + "<td style = 'text-align:left'>" + 'Percentage' + "</td>" +
            "<td style = 'text-align:center'>" + ':' + "</td>" + 
            "<td style = 'text-align:right'>" + d.waterPercentage + " %" + "</td>" + "</tr>" 
            + "<tr>" + "<td style = 'text-align:left'>" + 'Gallons for a pound of yield' + "</td>" +
            "<td style = 'text-align:center'>" + ':' + "</td>" + 
            "<td style = 'text-align:right'>" + "" + d.waterFootprint + " Gallons per pound of yield" + "</td>" + "</tr>" + "</tr>"
            )
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");
            })

            .on("mouseout", function(d) { // when the mouse leaves the food entry
                div.transition()		
                .duration(500)		
                .style("opacity", 0); // this hides the div            
               });


            

        var xAxis = d3.axisBottom(xScale).tickPadding(2);
        var yAxis = d3.axisLeft(yScale).tickPadding(2).ticks(9);


        var zoom = d3.zoom()
        .scaleExtent([.5, 32])
        .on("zoom", zoomed);

        // x-axis
        var gX = svgScatter.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

        svgScatter.append("text")
        .attr("class", "x label")
        .attr("y", height + 30)
        .attr("x", width/2)
        // these lines position the label
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Gallons per pound of yield");

        // y-axis
        var gY = svgScatter.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        svgScatter.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        // these lines position the label
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Percentage of total water usage");


        svgScatter.call(zoom);

        function zoomed() {
            view.attr("transform", d3.event.transform); // moves the circles
            var new_xScale = d3.event.transform.rescaleX(xScale);
            var new_yScale = d3.event.transform.rescaleY(yScale);
            gX.call(xAxis.scale(new_xScale));
            gY.call(yAxis.scale(new_yScale));
            gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale))); // scales the x axis while zooming and moving
            gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale))); // scales the y axis while zooming and moving
          }
});
