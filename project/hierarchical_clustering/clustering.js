/* This file will contain all of the functions to actually create the tree
    that will create my visualization
    I will have use one object: ClusterNode with the properties:
	-Children
	-rep_Point
	-details (which is an optional parameter)

*/

var id_counter = 0;

function ClusterNode(children, rep_point, details) {
    if (typeof(details)==='undefined') details="";
    this.details = details;
    this.children = children;
    this.rep_point = rep_point;
    this.id = id_counter;
    id_counter = id_counter+1;
}

ClusterNode.prototype.getRep = function() { 
    return this.rep_point;
}

ClusterNode.prototype.getID = function() {
    return this.id;
}

ClusterNode.prototype.equal = function(other) {
    return this.rep_point == other.rep_point;
}

ClusterNode.prototype.makeDictionary = function() {
    var fin = "";
    if(!(this.details === "")){
	fin = "{ 'name': '" + this.id.toString() + "', 'details' : '" + this.details + "' }" ;
    }
    else {
	fin = "{ 'name': '" + this.id.toString() + "', 'children' : [ \n";
	for (var i=0;i<this.children.length-1; i++) {
	    fin = fin + this.children[i].makeDictionary() + ",\n";
	}	
	fin = fin + this.children[this.children.length-1].makeDictionary() + "\n"
	fin = fin + "] }";
    }
    return fin;	
}
function get_rep_points_list(list_of_clusters, exclude) {
    var fin = [];
    for (var i=0; i<list_of_clusters.length; i++) {
        fin.push(list_of_clusters[i].getRep());
    }
    return fin;
}

function findClosest(nearestArr) {
    var final_cluster_list = [];
    var closest = nearestArr[0][2];
    var closest_points = [nearestArr[0][0], nearestArr[0][1]]
    for (var i=0; i<nearestArr.length; i++) {
	if (closest > nearestArr[i][2]) {
	    closest = nearestArr[i][2];
	    closest_points = [nearestArr[i][0], nearestArr[i][1]];
	}
    }
    return closest_points;
}

function makeClusteringTree(list_of_clusters, numClusters) {
    if (numClusters <= 1) { 
	return list_of_clusters;
    }
    else {
	// this is where my clustering algorithm shoud go
	// console.log(points)
	// console.log(numClusters)

       var all_points = get_rep_points_list(list_of_clusters, -1);
       for (var i=0; i<list_of_clusters.length-1; i++) {
	    var points = get_rep_points_list(list_of_clusters, i);
	    var kdtree = new kdTree(points);
	    var n = kdtree.tree;
	    var t = kdtree.tree.val;
	    var nearestArr = [];
	    var qp = all_points[i];
	    var start_d =  qp.distance_between(t);
	    var nearN = findNearest(n,qp, [start_d, t]);
	    nearestArr.push([qp, nearN[1], nearN[0]]);
	}
	
	var closest = findClosest(nearestArr);
	var new_list_of_clusters = [];
	var rep_point = new Point(closest[1]);
	var children = [];
	for (var j=0; j<list_of_clusters.length-1; j++) {
	    if (points[j] != closest[0] && points[j] != closest[1]) {
		new_list_of_clusters.push(list_of_clusters[j]);	
	    }
	    else {
		console.log(closest[0])
		console.log(closest[1])
		children.push(list_of_clusters[j]);
	    }
	}
	
	var combine = new ClusterNode(children, rep_point);

	new_list_of_clusters.push(combine);

	return makeClusteringTree(new_list_of_clusters, new_list_of_clusters.length);    
    }
}

function findCluster(point, list_of_clusters) {
    for (var i=0; i<list_of_clusters.length; i++) {
	if (point == list_of_clusters[i].getRep()) {
	    return list_of_clusters[i];
	}
    }
    console.log("this is bad");
}

function newClusterList(list_of_clusters, remove) {
    var fin = [];
    for (var i=0; i<list_of_clusters.length; i++) {
	if (!(remove.equal(list_of_clusters[i]))) {
	    fin.push(list_of_clusters[i]);
	}
    } 
    return fin;
}

function makeClustering(list_of_clusters, numClusters) {
    if (numClusters <=1 ) {
	return list_of_clusters;
    }
    else {
	var points = get_rep_points_list(list_of_clusters);
        var kdtree = new kdTree(points.slice(1));
        var n = kdtree.tree;
        var t = kdtree.tree.val;
        var nearestArr = [];
        var qp = points[0];
        var start_d =  qp.distance_between(t);
        var nearN = findNearest(n,qp, [start_d, t]);
	
	var cNear = findCluster(nearN[1], list_of_clusters);
	var cNew = new ClusterNode([list_of_clusters[0], cNear], nearN[1]);
	
	var new_list_of_clusters = newClusterList(list_of_clusters.slice(1), cNear);
	new_list_of_clusters.push(cNew);
	
	return makeClustering(new_list_of_clusters, new_list_of_clusters.length);
    }	
}
var point3 = new Point([1,2]);
var point2 = new Point([5,6]);
var point1 = new Point([9,10]);

var point4 = new Point([6,4]);
var point5 = new Point([1,3]);
var point6 = new Point([19,1]);
var point7 = new Point([11,12]);

var cnode1 = new ClusterNode([],point1, "Testing");
var cnode2 = new ClusterNode([],point2, "This out should");   
var cnode3 = new ClusterNode([],point3, "be cool");
var cnode4 = new ClusterNode([],point4, "A");
var cnode5 = new ClusterNode([],point5, "B");
var cnode6 = new ClusterNode([],point6, "C");
var cnode7 = new ClusterNode([],point7, "S");

var clusters = [cnode1, cnode2, cnode3, cnode4, cnode5, cnode6, cnode7];

var fin = makeClustering(clusters, clusters.length);
var test = fin[0];
// console.log(test)
// console.log(test.makeDictionary())
