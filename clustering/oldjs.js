// This was the code I was working on to get clustering working, before I saw
// that she had made a makeClusters function for us

function createClusters(centers, points) { 
    var newCenters = [];
    // var emptyClusters = makeClusterings(centers,);
    // Assign each point to its appropriate clusters
    for (var j=0; j<points.length; j++) {
	var myCenter = findNearestCenter(centers, points[j]);
	emptyClusters[myCenter[0]].addPoint(points[j], myCenter[1]);
    }
    
    // Calculate the new Centers
    for (var i=0; i<emptyClusters.length; i++) {
	var points = emptyClusters[i].getPoints();
	if (!emptyClusters[i].getPoints()[0]) {
	    newCenters.push(0);
	}
	else {
	    var center = findAverageCenter(points);
	    newCenters.push(center);
	}
    }
    
    return [emptyClusters, newCenters];
}

function findNearestCenter(centers, point) {
    var fin = [];
    var distanceTo = point.distTo(centers[0]);
    var myCenter = 0;
    for (var i=0; i<centers.length; i++) {
	if (point.distTo(centers[i]) < distanceTo) {
	    distanceTo = point.distTo(centers[i]);
	    myCenter = i;
	}
    }
    fin.push(myCenter);
    fin.push(distanceTo);

    return fin;
}

function findAverageCenter(points) {
    var fin = [];
    var totals = [];
    for (var i =0; i<points[0].getArray().length; i++) {
	totals.push([]);
    }
    
    for (var j=0; j<points.length; j++) {
	for (var k=0; k<points[j].getArray().length; k++) {
	    totals[k].push(points[j].getArray()[k]);
	}
    }
    
    for (var a=0; a<totals.length; a++) {
	var running_total = 0;
	for (var b=0; b<totals[a].length; b++) {
	    running_total += totals[a][b];
	}
	fin.push(running_total/totals[a].length);
    }

    var fin_point = new Point(fin);
    return fin_point;
}

function createEmptyClusters(new_centers) {
    var fin = [];
    console.log(new_centers)
    for(var i =0; i<new_centers.length; i++){
	var temp = new Cluster(new_centers[i]);
	fin.push(temp);
    }
   
    console.log("empty: ", fin) 
    return fin;
}

function findCenters(points, k) {
    var centers = [];
    var first = points[Math.floor(Math.random()*points.length)];
    centers.push(first);

    for(var i=0; i<k-1; i++) {
	var furthest = 0;
	var newCenter;
	for(var m=0; m<points.length; m++) {
	    for(var j=0; j<points.length; j++) { 
		var distCenters = findTotalDistance(points[j],centers);
		if (furthest < distCenters) { 
		    newCenter = points[j];
		    furthest = distCenters;
		}
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
