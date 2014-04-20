function Cluster(center) {
    this.center = center;
    this.points = [];
    // Ideally this would be kept in a max heap.  Oh well.  I blame javascript.
    this.pointDistancesToCenter = [];
}

Cluster.prototype.getCenter = function() {
    return this.center;
}

Cluster.prototype.addPoint = function(point, distToPoint) {
    this.points.push(point);
    this.pointDistancesToCenter.push(distToPoint);    
}

Cluster.prototype.getPoints = function() {
    return this.points;
}

Cluster.prototype.getDistToCenter = function(pointIndex) {
    return this.pointDistancesToCenter[pointIndex];
}

Cluster.prototype.setLabel = function(label) {
    this.label = label;
}

Cluster.prototype.getLabel = function() {
    return this.label;
}

Cluster.prototype.getFurthestPointFromCenter = function() {
    var far = 0;
    var farPoint = null;
    for (var i = 0; i < this.pointDistancesToCenter.length; i++) {
        if (this.pointDistancesToCenter[i] >= far) {
            far = this.pointDistancesToCenter[i];
            farPoint = this.points[i];
        }
    }
    return farPoint;
}

Cluster.prototype.getNewCenter = function() {
    var newCenterArr = [];
    var lengthOfPoints = this.points[0].getArray().length;
    
    var totalPoints = this.points.length;
    for (var i=0; i<lengthOfPoints; i++) {
	var total = 0;
	for (var j=0; j<this.points.length; j++) {
	    total = total + parseFloat(this.points[j].getDim(i));
	}
	var fin = total/totalPoints;
	newCenterArr.push(fin);
    }
    var newCenter = new Point(newCenterArr);
    return newCenter;
}

function Clustering(clusters) {
    this.clusters = clusters;
    this.k = clusters.length;
}

Clustering.prototype.getClusters = function() {
    return this.clusters;
}

Clustering.prototype.equals = function(otherClustering) {
    if (this.k != otherClustering.k) {
        return false;
    }
    for (var i = 0; i < this.k; i++) {
        if (!this.clusters[i].center.equals(otherClustering.clusters[i].center)) {
            return false;
        }
    }
    return true;
}

/* Warning: this only checks the centers in the same order.  It is NOT a set equality check. */
function centerEquals(centersList1, centersList2) {
    if (!centersList1 || !centersList2) {
        return false;
    }
    if (centersList1.length !== centersList2.length) {
        return false;
    }
    for (var i = 0; i < centersList1.length; i++) {
        if (!centersList1[i].equals(centersList2[i])) {
            return false;
        }
    }
    return true;
}

function makeClustering(centers, points) {
    var clusters = [];
    // console.log("centers in makeClustering: ", centers)
    for (var c = 0; c < centers.length; c++) {
        clusters.push(new Cluster(centers[c]));
    }
    for (var p = 0; p < points.length; p++) {
        var point = points[p];
        var closestClusterIndex = 0;
        var closestClusterDist = centers[0].distTo(point); 
        for (var c = 0; c < centers.length; c++) {
            var dist = centers[c].distTo(point);
            if (dist < closestClusterDist) {
                closestClusterDist = dist;
                closestClusterIndex = c;
            }
        }
        clusters[closestClusterIndex].addPoint(point, closestClusterDist);
    }
    return new Clustering(clusters);
}
