function rowConverter(data) {
    return {
        food: data.Food_Product,
        waterPercentage: data.Water_Percentage,
        waterFootprint: data.Water_Footprint
    }
}

var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
width = 960 - margin.left -margin.right,
height = 500 - margin.top - margin.bottom;


var svg = d3.select('#svg1')
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        .domain([0, d3.max(footprints) + 3]) // defines the domain by finding the max of the gdps
        .range([0, width]);
        
        var yScale = d3.scaleLinear()
        .domain([0,d3.max(percentage) + 10]) // defines the domain by finding the max of eccs
        .range([height, 0]);
        console.log(data)
        var view = svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 5)
            .attr("cx", function(d) {return xScale(d.waterFootprint);})
            .attr("cy", function(d) {return yScale(d.waterPercentage);});

        var xAxis = d3.axisBottom(xScale).tickPadding(2);
        var yAxis = d3.axisLeft(yScale).tickPadding(2).ticks(9);

        // x-axis
        var gX = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

        svg.append("text")
        .attr("class", "x label")
        .attr("y", height + 30)
        .attr("x", width/2)
        // these lines position the label
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("GDP (in Trillion US Dollars) in 2010");

        // y-axis
        var gY = svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        // these lines position the label
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Energy Consumption per Capita (in Million BTUs per person)");
});