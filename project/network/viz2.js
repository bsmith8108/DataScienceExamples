d3.json("try_this_2.json", function(data) {
  var width = 960,
      height = 500;
   
  var n = 20,
    nodes = data.nodes,
    links = data.links;
	   
  var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height]);
  
  var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
    .append("g");

  svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .style("fill","white");
	      
  function zoom() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }
    
   var loading = svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text("Simulating. One moment please…");
      
    // Use a timeout to allow the rest of the page to load first.
    setTimeout(function() {
      
	// Run the layout a fixed number of times.
	// The ideal number of times scales with graph complexity.
	// Of course, don't run too long—you'll hang the page!
	force.start();
        for (var i = n; i > 0; --i) force.tick();
	force.stop();
       
	svg.selectAll("line")
	.data(links)
        .enter().append("line")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; }); 
        
	svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
	.attr("r", function(d)	{ return Math.abs(d.count-30); })
        .on("click", function(d){
	    d3.select("#info").html("<h2>" + d.name + "</h2>");
	    });

	loading.remove(); }, 10);
    });
