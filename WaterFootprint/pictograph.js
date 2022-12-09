
d3.csv("people.csv", function(error, data) {
    makeVis(data);
});

var makeVis = function(data) {
    console.log(data)    

    //create svg element
    var svg=d3.select("#svg3").append("svg").attr("viewBox","0 0 660 660");

     //define an icon store it in svg <defs> elements as a reusable component - this geometry can be generated from Inkscape, Illustrator or similar
    svg.append("defs")
        .append("g")
        .attr("id","iconCustom")
        .append("path")
        .attr("d","M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z")
        .attr("transform", "translate(0,0) scale(2.5)");


    //background rectangle
    svg.append("rect").attr("fill","#f7f4ed")
        .attr("width",660)
        .attr("height",660)
        .attr('stroke', "#28666e")
        .attr("stroke-width", '4');
    

    //specify the number of columns and rows for pictogram layout
    var numCols = 20;
    var numRows = 25;

    //padding for the grid
    var xPadding = 15;
    var yPadding = 15;

    //horizontal and vertical spacing between the icons
    var hBuffer = 21;
    var wBuffer = 20;

    //generate a d3 range for the total number of required elements
    var myIndex=d3.range(numCols*numRows);

    //text element to display number of icons highlighted
    svg.append("text")
        .attr("class","number")
        .attr("id","txtValue")
        .attr("x",430)
        .attr("y",0)
        .attr("dy",95)
        .attr("fill", "#bb6d82")
        .text("482")
        .attr("transform", "translate(0,0) scale(1, 3)");
    
    svg.append("text")
        .attr("id","txtState")
        .attr("x",xPadding)
        .attr("y",yPadding)
        .attr("dy",30)
        .text("Number of People who can be provided water for a day");
    
    svg.append("text")
        .attr("id","txtName")
        .attr("x",xPadding)
        .attr("y",yPadding)
        .attr("dy",60)
        .text(function(d) { return "Per Water Needed to Produce a Pound of Wheat gluten:"})
        
    //create group element and create an svg <use> element for each icon
    svg.append("g")
        .attr("id","pictoLayer")
        .attr("transform", "translate(0,75)")
        .selectAll("use")
        .data(myIndex)
        .enter()
        .append("use")
            .attr("xlink:href","#iconCustom")
            .attr("id",function(d)    {
                return "icon"+d;
            })
            .attr("x",function(d) {
                var remainder=d % numCols;//calculates the x position (column number) using modulus
                return xPadding+(remainder*wBuffer);//apply the buffer and return value
            })
              .attr("y",function(d) {
                var whole=Math.floor(d/numCols)//calculates the y position (row number)
                return yPadding+(whole*hBuffer);//apply the buffer and return the value
            })
            .classed("iconPlain",true);

    // Handler for dropdown value change
    var dropdownChange = function() {
        var newFood = d3.select(this).property('value')
        
        var result = [];
        data.forEach(function(food){if (food.Food_Product == newFood) result.push(food);} );
        d3.select("#txtValue").text(Math.floor(result[0].Water_People));
        d3.select("#txtName").text(function(d) { return "Per Water Needed to Produce a Pound of " + result[0].Food_Product + ":"});
    
    d3.selectAll("use")
        .filter(function() {
          return !this.classList.contains('active')
        })
        .attr("class","iconPlain")
        .transition()
        .delay(function(d,i){ return 12*i; }) 
        .duration(1000)
        .attr("class",function(d){
            if (d<Math.floor(result[0].Water_People/10))  {
               return "iconSelected";
            }    else    {
               return "iconPlain";
            }
        });
    };
    
    //Set icons according to Wheat Gluten to start
    d3.selectAll("use")
    .filter(function() {
      return !this.classList.contains('active')
    })
    .attr("class","iconPlain")
    .transition()
    .delay(function(d,i){ return 7*i; }) 
    .duration(1000)
    .attr("class",function(d){
        if (d<Math.floor(482/10))  {
           return "iconSelected";
        }    else    {
           return "iconPlain";
        }
    });

    var foodNames = data.map(function(food) {return food.Food_Product;});

    var dropdown = d3.select("#selectButton")
        .on("change", dropdownChange);
    
    dropdown
        .selectAll("myOptions")
        .data(foodNames)
        .enter()
        .append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) {
            return d; // capitalize 1st letter
        });
    
    svg.append("use")
        .classed("active", true)
        .attr("id", "legend")
        .attr("xlink:href", "#iconCustom")
        .attr("x", 315)
        .attr("y", 625)
        .attr("fill", "#28666e")
    
    svg.append("text")
        .attr("id","total")
        .attr("x",15)
        .attr("y",640)
        .text("5000")
        .attr("fill", "#28666e")
        .style("font-size","22px")
    
    svg.append("text")
        .style("font-size", "16px")
        .attr("x",330)
        .attr("y",640)
        .text(" = 10 People");
}
