var margin = {top: 10, right: 40, bottom: 150, left: 100},
    width = 760 - margin.left - margin.right, 
    height = 500 - margin.top - margin.bottom; 
    
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right) 
    .attr("height", height + margin.top + margin.bottom) 
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);

var yScale = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(xScale);

//
//var xAxisDraw = svg.append("g")
//  .attr("transform", "translate(0," + height + ")")

//    svg.append("g") 
//        .attr("class", "xaxis")
//        .attr("transform", "translate(0," + height + ")")
//        .call(xAxis)
//        .selectAll("text")
//        .attr("dx", "-.8em")
//        .attr("dy", ".25em")
//        .style("text-anchor", "end")
//        .attr("font-size", "10px")
//        .attr("transform", "rotate(-60)");

var yAxis = d3.axisLeft(yScale);


   var yAxisDraw   = svg.append("g")
  .attr("class", "myYaxis")
//       svg.append("g")
//        .attr("class", "yaxis")
//        .call(yAxis)
//        .selectAll("text")
//        .attr("dx", "-0.1em")
//        .style("text-anchor", "end")
//        .attr("font-size", "10px");

// y axis label
  svg.append("text")
        .attr("class", "ylabel")
        .attr("text-anchor", "end")
        .attr("y", -50) 
        .attr("x", -100)
        .attr("font-size", "12px")
        .attr("transform", "rotate(-90)") 
        .text("Amount of ___ per 50 gallons of water"); 

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
    xScale.domain(data.map(function(d){ return d.food; }));
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

var colorGrad = d3.scaleLinear().domain([1,2])
  .range(["orange", "#db7093"])


function update(id) {
    d3.csv("barGraphData.csv", function(data) {
        xScale.domain(data.map(function(d){ return d.Food; }));
        
//        xAxisDraw.transition().duration(1000).call(d3.axisBottom(xScale))
//        xAxisDraw = svg.append("g")
//        .style("text-anchor", "end")
//        .attr("font-size", "10px")
//.attr("transform", "rotate(-60)")
        
        yScale.domain([0,d3.max(data, function(d) {return +d[id] })]);
        
        yAxisDraw.transition().duration(1000).call(d3.axisLeft(yScale));
//        yAxisDraw =  svg.append("g")
//          .transition().duration(1000)
//        .attr("class", "yaxis")
//        .call(yAxis)
//        .selectAll("text")
//        .attr("dx", "-0.1em")
//        .style("text-anchor", "end")
//        .attr("font-size", "10px") ;
        
        var u = svg.selectAll("rect")
      .data(data)
        
        u
      .enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
        .attr("x", function(d) { return xScale(d.Food); })
        .attr("y", function(d) { return yScale(d[id]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d[id]); })
        .attr("fill", "#69b3a2")
    })
}

update('Mass')

// AHHHHHHHHHH

//d3.csv("barGraphData.csv", rowConverter, function(error, data) {
//
//  
//  xScale.domain(data.map(function(d){ return d.food; }));
//  yScale.domain([0,d3.max(data, function(d) {return d.mass; })]);
//  
//  // draw the x axis
//  svg.append("g") 
//        .attr("class", "xaxis")
//        .attr("transform", "translate(0," + height + ")")
//        .call(xAxis)
//        .selectAll("text")
//        .attr("dx", "-.8em")
//        .attr("dy", ".25em")
//        .style("text-anchor", "end")
//        .attr("font-size", "10px")
//        .attr("transform", "rotate(-60)");
//    
//
//  
//  // draw bars 
//  svg.selectAll("rect") 
//      .data(data) 
//      .enter()
//      .append("rect") 
//      .transition().duration(500) 
//      .delay(function(d,i) {return i * 100;}) 
//      .attr("x", function(d) { return xScale(d.food);})
//      .attr("y", function(d) { return yScale(d.mass);  })
//      .attr("width", xScale.bandwidth()) 
//      .attr("height", function(d) { return height- yScale(d.mass);  })
//      .attr("fill", function(d){return colorGrad(d.mass); });
//    
//    d3.selectAll("button").on("click", function () {
//        svg.selectAll("rect", "#yAxis").remove(); 
//        
//        yAxisDraw.remove();
//        var val = d3.select(this).node().id; 
//        
////        update(data, val);
//    })
//  
//});
//
//function update(data, val) {
//    if (val == "fat") {
//          yScale.domain([0,d3.max(data, function(d) {return d.fat; })]);
//          yAxis = d3.axisLeft(yScale).ticks(13);
//          yAxisDraw =  svg.append("g")
//          .transition().duration(1000)
//        .attr("class", "yaxis")
//        .call(yAxis)
//        .selectAll("text")
//        .attr("dx", "-0.1em")
//        .style("text-anchor", "end")
//        .attr("font-size", "10px") ;
//  
//          svg.selectAll("rect") 
//              .data(data) 
//              .enter()
//              .append("rect") 
//              .transition().duration(500) 
//              .delay(function(d,i) {return i * 100;}) 
//              .attr("x", function(d) { return xScale(d.food);})
//              .attr("y", function(d) { return yScale(d.fat);  })
//              .attr("width", xScale.bandwidth()) 
//              .attr("height", function(d) { return height- yScale(d.fat);  })
//              .attr("fill", function(d){return colorGrad(d.fat); });
//      }
//    
//}
//  



// AHHHHHHHHH



//  d3.selectAll("button").on("click", function () {
//      console.log("hello")
//      svg.selectAll("rect").remove(); 
//      
//      console.log(yAxis)
//      yAxisDraw.remove();
////      yScale.remove();
////      yAxisDraw.selectAll("g.yaxis").remove();
//      
//     
//      
//      // action selects the id of the radio button pressed
//      var val = d3.select(this).node().id; 
////      console.log(typeof(val), val)
//
//      if (val == "fat") {
//          yScale.domain([0,d3.max(data, function(d) {return d.fat; })]);
//          yAxis = d3.axisLeft(yScale).ticks(13);
//          yAxisDraw =  svg.append("g")
//          .transition().duration(1000)
//        .attr("class", "yaxis")
//        .call(yAxis)
//        .selectAll("text")
//        .attr("dx", "-0.1em")
//        .style("text-anchor", "end")
//        .attr("font-size", "10px") ;
//  
//          svg.selectAll("rect") 
//              .data(data) 
//              .enter()
//              .append("rect") 
//              .transition().duration(500) 
//              .delay(function(d,i) {return i * 100;}) 
//              .attr("x", function(d) { return xScale(d.food);})
//              .attr("y", function(d) { return yScale(d.fat);  })
//              .attr("width", xScale.bandwidth()) 
//              .attr("height", function(d) { return height- yScale(d.fat);  })
//              .attr("fill", function(d){return colorGrad(d.fat); });
//      }
//    })




//d3.csv("barGraphData.csv", rowConverter, function(error, data) {
//
//  
//  xScale.domain(data.map(function(d){ return d.food; }));
//  yScale.domain([0,d3.max(data, function(d) {return d.mass; })]);
//  
//  // draw the x axis
//  svg.append("g") 
//        .attr("class", "xaxis")
//        .attr("transform", "translate(0," + height + ")")
//        .call(xAxis)
//        .selectAll("text")
//        .attr("dx", "-.8em")
//        .attr("dy", ".25em")
//        .style("text-anchor", "end")
//        .attr("font-size", "10px")
//        .attr("transform", "rotate(-60)");
//    
//    var yAxisDraw =  svg.append("g")
//        .attr("class", "yaxis")
//        .attr("id", "yAxis")
//        .call(yAxis)
//        .selectAll("text")
//        .attr("dx", "-0.1em")
//        .style("text-anchor", "end")
//        .attr("font-size", "10px");
//  
//  // draw bars 
//  svg.selectAll("rect") 
//      .data(data) 
//      .enter()
//      .append("rect") 
//      .transition().duration(500) 
//      .delay(function(d,i) {return i * 100;}) 
//      .attr("x", function(d) { return xScale(d.food);})
//      .attr("y", function(d) { return yScale(d.mass);  })
//      .attr("width", xScale.bandwidth()) 
//      .attr("height", function(d) { return height- yScale(d.mass);  })
//      .attr("fill", function(d){return colorGrad(d.mass); });        
//  
//  
//  d3.selectAll("button").on("click", function () {
//      console.log("hello")
//      svg.selectAll("rect").remove(); 
//      yAxisDraw.remove();
////      yScale.remove();
////      yAxisDraw.selectAll("g.yaxis").remove();
//      
//     
//      
//      // action selects the id of the radio button pressed
//      val = d3.select(this).node().id; 
////      console.log(typeof(val), val)
//      if (val == "fat") {
//          yScale.domain([0,d3.max(data, function(d) {return d.fat; })]);
//          yAxis = d3.axisLeft(yScale).ticks(13);
//          yAxisDraw =  svg.append("g")
//          .transition().duration(1000)
//        .attr("class", "yaxis")
//        .call(yAxis)
//        .selectAll("text")
//        .attr("dx", "-0.1em")
//        .style("text-anchor", "end")
//        .attr("font-size", "10px");
//  
//          svg.selectAll("rect") 
//              .data(data) 
//              .enter()
//              .append("rect") 
//              .transition().duration(500) 
//              .delay(function(d,i) {return i * 100;}) 
//              .attr("x", function(d) { return xScale(d.food);})
//              .attr("y", function(d) { return yScale(d.fat);  })
//              .attr("width", xScale.bandwidth()) 
//              .attr("height", function(d) { return height- yScale(d.fat);  })
//              .attr("fill", function(d){return colorGrad(d.fat); });
//      }
////     else if (val == "fiber") {
////          yScale.domain([0,d3.max(data, function(d) {return d.fiber; })]);
////          svg.selectAll("rect") 
////              .data(data) 
////              .enter()
////              .append("rect") 
////              .transition().duration(500) 
////              .delay(function(d,i) {return i * 100;}) 
////              .attr("x", function(d) { return xScale(d.food);})
////              .attr("y", function(d) { return yScale(d.fiber);  })
////              .attr("width", xScale.bandwidth()) 
////              .attr("height", function(d) { return height- yScale(d.fiber);  })
////              .attr("fill", function(d){return colorGrad(d.fiber); });
////      }
////      else if (val == "cal") {
////          yScale.domain([0,d3.max(data, function(d) {return d.cal; })]);
////          svg.selectAll("rect") 
////              .data(data) 
////              .enter()
////              .append("rect") 
////              .transition().duration(500) 
////              .delay(function(d,i) {return i * 100;}) 
////              .attr("x", function(d) { return xScale(d.food);})
////              .attr("y", function(d) { return yScale(d.cal);  })
////              .attr("width", xScale.bandwidth()) 
////              .attr("height", function(d) { return height- yScale(d.cal);  })
////              .attr("fill", function(d){return colorGrad(d.cal); });
////      }
////      else if (val == "protein") {
////          yScale.domain([0,d3.max(data, function(d) {return d.protein; })]);
////          svg.selectAll("rect") 
////              .data(data) 
////              .enter()
////              .append("rect") 
////              .transition().duration(500) 
////              .delay(function(d,i) {return i * 100;}) 
////              .attr("x", function(d) { return xScale(d.food);})
////              .attr("y", function(d) { return yScale(d.protein);  })
////              .attr("width", xScale.bandwidth()) 
////              .attr("height", function(d) { return height- yScale(d.protein);  })
////              .attr("fill", function(d){return colorGrad(d.protein); });
////      }
////      else if (val == "mass") {
////          yScale.domain([0,d3.max(data, function(d) {return d.mass; })]);
////          svg.selectAll("rect") 
////              .data(data) 
////              .enter()
////              .append("rect") 
////              .transition().duration(500) 
////              .delay(function(d,i) {return i * 100;}) 
////              .attr("x", function(d) { return xScale(d.food);})
////              .attr("y", function(d) { return yScale(d.mass);  })
////              .attr("width", xScale.bandwidth()) 
////              .attr("height", function(d) { return height- yScale(d.mass);  })
////              .attr("fill", function(d){return colorGrad(d.mass); });
////      }
////        
//      
//    })
//});

