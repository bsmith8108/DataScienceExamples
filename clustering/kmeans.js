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

// I need to have functions to normalize

function deNormalize(point) {
    var fin = [];
    for (var i=0; i<point.length; i++) {
	// multipy by the standard deviation
	var temp = point[i] * std_mean_data[0][i];
	// add the mean
	temp = parseFloat(temp)+parseFloat(std_mean_data[1][i]);
	fin.push(Number((temp).toFixed(4)));
    }
    return fin;
}	

function normalize(my_data, not_axis) {
    if ((typeof not_axis) == "undefined") not_axis=[];
	// This will normalize the data, so that the kdtree is not skewed
        // although this will not account for outliers that throw off the
	// mean and standard deviation
	var fin = [];
	for (var k=0; k<my_data.length; k++) {
	    fin.push([]);
	}
	var counter = 0;

    for (var i=0; i<not_axis.length+my_data.length; i++) {
	if (not_axis.indexOf(i) <=-1) {
	    for (var j=0; j<my_data[0].length; j++) {
		// subtract the mean
		var temp = my_data[counter][j] - std_mean_data[1][i];
		// divide by the standard deviation
		temp = temp/std_mean_data[0][i];
		fin[counter].push(temp);
	    }
	counter = counter + 1;
	}
    }
    return fin;
}

function kmeans_withK(points) {
    var counter = 0;
    var foundElbow = false;
    var K = 1;
    var n = points.length;

    // calculate the total variance
    console.log("here")
    var singleClustering = kmeans(points, 1);
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
    while(K <= 10 && !foundElbow) {
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
	if (percentVarChange <= .05 && percentVarChange != 0) {
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
    var centers = findCenters(points, k);
    // var centers = [points[1],points[10],points[40], points[3]];
    var changed = true;
    var myClusterings;
    var newCenters;
    var counter = 0;
    while (changed) {
	myClusterings = makeClustering(centers, points);
	newCenters = getCenters(myClusterings);
	if (centerEquals(centers, newCenters)) {
	    changed = false;
	}
	centers = newCenters;
	counter = counter + 1;
    }
    return myClusterings;   
}

function getCenters(myClusters) {
    var fin =[];
    for (var i=0;i<myClusters.getClusters().length; i++) {
	var newCenter = myClusters.getClusters()[i].getNewCenter();
	fin.push(newCenter);
    }

    return fin;
}

function findCenters(points, k) {
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
    return centers;
}

function findTotalDistance(point, centers) {
    var dist = 0;
    for(var i=0; i<centers.length; i++) {
	dist = dist + point.distTo(centers[i]);
    }
    return dist;
}

