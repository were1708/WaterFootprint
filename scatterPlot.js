function rowConverter1(data) {
    return {
        food: data.Food_Product,
        waterPercentage: data.Water_Percentage,
        waterFootprint: data.Water_Footprint,
        type: data.type
    }
}

var margin = {left: 60, right: 0, top: 50, bottom: 50 };
width = 900 - margin.left -margin.right;
height = 700 - margin.top - margin.bottom;


var colorScale = d3.scaleOrdinal()
.domain(["carb", "protein", "fat"])
.range(["#2e75f0", "#3d0b85", "#0db8b8"])

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


var view = svgScatter.selectAll(".dot");
var gX = svgScatter.append("g")
var gY = svgScatter.append("g")
var xText = svgScatter.append("text")
var yText = svgScatter.append("text")

function doFilter(type) {
    console.log(type)


d3.csv("scatterData.csv", rowConverter1, function(error, data) {
    console.log(data)
    view.remove()
    gX.remove()
    gY.remove()
    xText.remove()
    yText.remove()
    function filterNodes(type) {
        if (type == "all") {
            return data
        }
        var filterNodes = data.filter((node) => node.type === type);
        return filterNodes;
    }
    
    // initilize some empty arrays to populate with values!
    percentage = []
    footprints = []
    // we do this in order to find the max value so we can set x and y domains!
    data = filterNodes(type);
    console.log(data)
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


        view = svgScatter.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .style("fill", function(d) {return colorScale(d.type)})
            .attr("cy", function (d) { return yScale(d.waterPercentage); } )
            .attr("r", 5);
            
            view.transition()
            .delay(function(d,i){return(i*3)})
            .duration(1000)
            .attr("cx", function (d) { return xScale(d.waterFootprint); } )
            


            view.on("mouseover", function(d) { // mouse over for tool tip
            div.transition()
            .duration(200)
            .style("opacity", .9) // makes the div visible 
            
            div.html( // html for the tool tip
            "<table>" + "<td colspan = 3 style = 'text-align:center'>" + d.food + "</td>" + " </tr>" 
            + "<tr>" + "<td style = 'text-align:left'>" + 'Calories per pound of food' + "</td>" +
            "<td style = 'text-align:center'>" + ':' + "</td>" + 
            "<td style = 'text-align:right'>" + d.waterPercentage + " Calories" + "</td>" + "</tr>" 
            + "<tr>" + "<td style = 'text-align:left'>" + 'Gallons of water for a pound of yield' + "</td>" +
            "<td style = 'text-align:center'>" + ':' + "</td>" + 
            "<td style = 'text-align:right'>" + "" + d.waterFootprint + " Gallons" + "</td>" + "</tr>" + "</tr>"
            )
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");
            });

            view.on("mouseout", function(d) { // when the mouse leaves the food entry
                div.transition()		
                .duration(500)		
                .style("opacity", 0); // this hides the div            
               });


            

        var xAxis = d3.axisBottom(xScale).tickPadding(2);
        var yAxis = d3.axisLeft(yScale).tickPadding(2).ticks(9);

        // x-axis
        gX = svgScatter.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("opacity", 0)
        .call(xAxis);

        gX.transition()
        .duration(1000)
        .style("opacity", 1)
        

        xText = svgScatter.append("text")
        .attr("class", "x label")
        .attr("y", height + 40)
        .attr("x", width/2)
        // these lines position the label
        .style("text-anchor", "middle")
        .style("opacity", 0)
        .attr("font-size", "14px")
        .text("Gallons of water per pound of yield");

        xText.transition()
        .duration(1000)
        .delay(500)
        .style("opacity", 1)

        // y-axis
        gY = svgScatter.append("g")
        .attr("class", "y axis")
        .style("opacity", 0)
        .call(yAxis)

        gY.transition()
        .duration(1000)
        .style("opacity", 1)

        yText = svgScatter.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -55)
        .attr("x", -110)
        // these lines position the label
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("opacity", 0)
        .attr("font-size", "14px")
        .text("Calories per pound of food");

        yText.transition()
        .duration(1000)
        .delay(500)
        .style("opacity", 1)

});
}
doFilter("all")
