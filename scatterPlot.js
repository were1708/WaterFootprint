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


var svg = d3.select("body").append("svg")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("scatterData.csv", rowConverter, function(error, data) {




});