/**
 * Given an array of point objects, uses k-means (Lloyd's algorithm) to compute a clustering
 * of those points.

    pick k centers
    while you haven't reached a steady state:
	assign each point to its nearest center
	compute a new center for each cluster by finding the centroid of the cluster

    Note: The new center does not have to be an actual point

    How to pick the k centers:
    -use some other clustering algorithm
    -Pick the points that are far away from each other
	-pick the furthest point (like k-center)
 */

function kmeans_withK(points) {
    var counter = 0;
    var foundElbow = false;
    var K = 1;
    var n = points.length;

    // calculate the total variance
    console.log("here")
    var singleClustering = kmeans(points, 0);
    console.log("end of original kmeans")
    var centroid = singleClustering.getClusters()[0].getCenter();
    var totalVariance = 0;
    var total = 0;
    for (var i=0; i<n; i++) {
	var temp = centroid.distTo(points[i])
	total = total + Math.pow(temp,2);
    }

    totalVariance = total/n;
    
    var oldVar = 0;
    while(!foundElbow) {
	// console.log("k in loop: ", K)
	// console.log("foundElbow: ", foundElbow)
	var clustering = kmeans(points, K);
	// I want to find the percentage of variance changed, which is:
	// between group variance/total variance
	// total variance was calculated above and the between
	// group is calculated below
	
	var btwGrpVar = 0;
	console.log("K: ", K)
	for (var j=0; j < K; j++) {
	    var n_cluster = clustering.getClusters()[j];
	    var n_i = n_cluster.getPoints().length;
	    var u_i = n_cluster.getCenter();
	    btwGrpVar = btwGrpVar +(n_i*Math.pow((centroid.distTo(u_i)), 2))/n; 
	    console.log("inside for loop: ", btwGrpVar)
	}
	var percentVar = btwGrpVar/totalVariance;
	console.log("btwGrpVar: ", btwGrpVar)
	console.log("totalVariance: ", totalVariance)
	var percentVarChange = percentVar-oldVar;
	console.log("percentVar: ", percentVar)
	console.log("oldVar: ", oldVar)
	console.log("percent variance change: ", percentVarChange)
	if (percentVarChange <= .05 && K>=3) {
	    foundElbow = true;
	}
	else {
	    K = K+1;
	    oldVar = percentVar;
	}
    }
    return K;
}


function kmeans(points, k) {
  // TODO: Implement this.  Make it return a clustering.
    console.log("K before entering findCenters: ", k)
    var centers = findCenters2(points, k);
    // var centers = [points[1],points[10],points[40], points[3]];
    var changed = true;
    var myClusterings;
    var newCenters;
    var counter = 0;
    while (changed) {
	//console.log("centers: ", centers)
	myClusterings = makeClustering(centers, points);
	newCenters = getCenters(myClusterings);
	if (centerEquals(centers, newCenters)) {
	    changed = false;
	}
	centers = newCenters;
	counter = counter + 1;
    }
    console.log(myClusterings)
    return myClusterings;   
}

function getCenters(myClusters) {
    var fin =[];
    // console.log("getCenters: ", myClusters)
    for (var i=0;i<myClusters.getClusters().length; i++) {
	var newCenter = myClusters.getClusters()[i].getNewCenter();
	fin.push(newCenter);
    }

    return fin;
}

function findCenters2(points, k) {
    var centers = [];
    var first = points[Math.floor(Math.random()*points.length)];
    centers.push(first);

    var new_center;
    
    for (var i=0; i<k; i++) {
	// make a cluster using the current centers and points
	var temp_clustering = makeClustering(centers, points);
	var furthest = 0;
	// console.log("clustering in find Centers: ", temp_clustering)
	var clusters = temp_clustering.getClusters();
	console.log("cluster lengths: ", clusters.length)
	console.log("clusters: ", clusters)
	// loop through each cluster and find the point in each cluster
	// that is the furthest away from its center
	var distances =[]
	for (var j=0; j<clusters.length; j++) {
	    var cluster_furthest = clusters[j].getFurthestPointFromCenter();
	    // console.log("cluster furthest: ", cluster_furthest);
	    var dist = cluster_furthest.distTo(clusters[j].center);
	    distances.push([]);
	    distances[j].push(cluster_furthest);
	    distances[j].push(dist);
	}
	
	var index = 0;
	for (var m=0; m<distances.length; m++) {
	    if (distances[m][1] >= furthest) {
		furthest = distances[m][1];
		index = m;
	    }
	}
	new_center = distances[index][0];
	// console.log("center in find Centers: ", new_center)
	centers.push(new_center);
    }
    
    return centers;	
    
}

var counter = 0;
function findCenters1(points, k) {
    var centers = [];
    var first = points[Math.floor(Math.random()*points.length)];
    centers.push(first);

    for(var i=0; i<k-1; i++) {
	var furthest = 0;
	var newCenter;
	for(var j=0; j<points.length; j++) { 
	    var distCenters = findTotalDistance(points[j],centers); 
	    if (furthest < distCenters) { 
		newCenter = points[j];
		furthest = distCenters;
	    }
	}
	centers.push(newCenter);
    }
    
    for (var n=0; n<centers.length; n++) {
	for (var m=0; m<centers.length; m++) {
	    if (centers[n].id == centers[m].id && m != n && counter<=10) {
		// console.log(centers);
		counter = counter + 1;
		centers = findCenters1(points, k);
	    }
	}
    }

    return centers;
}

function findTotalDistance(point, centers) {
    var dist = 0;
    for(var i=0; i<centers.length; i++) {
	dist = dist + point.distTo(centers[i]);
    }
    return dist;
}

