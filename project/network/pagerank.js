//This is where I am going to calculate the page rank for each
// of the nodes.

d3.json("test.json", function(data) {
    var graph = new Graph(data);
    
    // Page rank:
    // Need to calculate it for each node and then set all of the new
    // values for the nodes at the end, so that you don't mess up the
    // formula in the current iteration.
    // Formula:
    // d = .85
    // N = Total # of points
    // Sum over all the points coming in, denoted as v
    // PR(point) = [(1-d)/N] + d*Sum(PR(v)/abs(Out(v)))
    // Perform this until it converges
    
    var pageranks = [];
    var d = .85;
    var N = graph.nodes.length;
    var constant = (1-d)/N;
    for (var i = 0; i<N; i++) {
	node_final = 0;
	node = graph.nodes[i];
	incoming = graph.getIn(node);
	for (var j=0; j<incoming.length; j++){
	    v_pr = graph.getOut(incoming[j]);
	    v_out = Math.abs(graph.getOut(incoming[j]).length);
	    node_final = node_final + (v_pr/v_out);
	}
	node_final = constant + d*node_final;
	pageranks.push(node_final);
    }

});
