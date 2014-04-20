var width = 500,
    height = 300;

var color = d3.scale.category20();

// The clustering can't handle actually drawing all of these, so
// choose some sampling of the nodes to include.
var samplingProb = 0.05;

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(1)
    .size([width, height]);

var svg = d3.select("#clustering").append("svg")
    .attr("width", width)
    .attr("height", height);

function drawClustering(points, k) {
  var clustering = kmeans(points, k);
  var graph = makeGraphFromClustering(clustering);
  displayGraph(graph);
  return clustering;
}

function makeGraphFromClustering(clustering) {
  var clusters = clustering.getClusters();
  var graph = {};
  var nodes = [];
  var links = [];
  var nodeNum = 0;
  for (var i = 0; i < clusters.length; i++) {
    var points = clusters[i].getPoints();
    
   for (var x=0; x<points.length; x++) {
	points[x].denormalize(x);
    }
    var label = makeClusterLabelPoints(points, dimensionNames); 
    clusters[i].setLabel(label);
    nodes.push({"name": "center", "group": i, "label": label});
    var centerNum = nodeNum;
    nodeNum++;
    for (var p = 0; p < points.length; p++) {
      points[p].assignGroup(i);
     
      var rand = Math.random();
      if (rand <= samplingProb) {  
        nodes.push({"name": points[p].getDim(p), "group": i, "id": points[p].id});
        var distToCenter = clusters[i].getDistToCenter(p) * 10;
        links.push({"source": nodeNum, "target": centerNum, "value": distToCenter});
        nodeNum++;
      }
    }
  }

  graph['nodes'] = nodes;
  graph['links'] = links;
  return graph;
}

function displayGraph(graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var k = Math.sqrt(graph.nodes.length / (width * height));

  force
    .charge(-10 / k)
    .gravity(80 * k)

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var gnodes = svg.selectAll('g.gnode')
     .data(graph.nodes)
     .enter()
     .append('g')
     .classed('gnode', true);

  var r = 3;
  var node = gnodes.append("circle")
      .attr("class", "node")
      .attr("r", r)
      .attr("id", function(d) { return "nodeid" + d.id; })
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("cx", function(d) { return d.x = Math.max(r, Math.min(width - r, d.x)); }) 
        .attr("cy", function(d) { return d.y = Math.max(r, Math.min(height - r, d.y)); });
  });
}
