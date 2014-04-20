/**
 * Given an array of values (either numerical or categorical) where there is one
 * value per dimension, creates a point object.
 */
function Point(valuesArr) {
    this.values = valuesArr;
    this.d = valuesArr.length;
    this.std_data = [];
    this.isNumerical = true;
    if (this.d > 0 && (typeof valuesArr[0] != "number")) {
        this.isNumerical = false;
    }
}

/**
 * Given the index of a dimension, returns the value of the point along that axis.
 */
Point.prototype.getDim = function(dimIndex) {
    return this.values[dimIndex];
}

Point.prototype.getArray = function() {
    return this.values;
}

Point.prototype.assignGroup = function(groupNum) {
    this.group = groupNum;
}

Point.prototype.setId = function(id) {
    this.id = id;
}

/**
 * Given a point, returns true if this point is the same as the other point.
 */
Point.prototype.equals = function(otherPoint) {
    if (!otherPoint) {
        return false;
    }
    if (this.d !== otherPoint.d) {
        return false;
    } 
    for (var i = 0; i < this.d; i++) {
        if (this.getDim(i) !== otherPoint.getDim(i)) {
            return false;
        }
    }
    return true;
}

/**
 * Finds the distance from the current point (this) to the given other point.
 * If both points contain numerical values, the Euclidean distance is used.
 * If both points contain categorical values, the Jaccard distance is used.
 * If the point types don't match, null will be returned.
 */
Point.prototype.distTo = function(otherPoint) {
    if (this.isNumerical && otherPoint.isNumerical) {
        return euclideanDist(this, otherPoint);
    } else if (!this.isNumerical && !otherPoint.isNumerical) {
        return jaccardDist(this, otherPoint);
    } else {
        return null;
    }
}

Point.prototype.normalize = function (std_data) {
	// This will normalize the data, so that the kdtree is not skewed
        // although this will not account for outliers that throw off the
	// mean and standard deviation
	var fin = [];
	var counter = 0;
	
    for (var i=0; i<this.values.length; i++) {
    	// subtract the mean
	var temp = this.values[i] - parseFloat(std_data[i].mean);
	// divide by the standard deviation
	temp = temp/parseFloat(std_data[i].std_dev);
	fin.push(temp);
    }
    this.std_data = std_data;
    this.values = fin
}

Point.prototype.denormalize = function (x) {
    var fin = [];
    var std_data = this.std_data;
    for (var i=0; i<this.values.length; i++) {
	// multipy by the standard deviation
	var temp = this.values[i] * parseFloat(std_data[i].std_dev);
	// add the mean
	temp = parseFloat(temp)+parseFloat(std_data[i].mean);
	fin.push(Number((temp).toFixed(4)));
    }

    this.values = fin;
}	


/* Warning: assumes both points have the same number of dimensions.
 * Ignores any dimensions that are actually not numerical.
 */
function euclideanDist(point1, point2) {
    var sum = 0;
    for (var i = 1; i < point1.d; i++) {
        if (typeof point1.getDim(i) == "number" && typeof point2.getDim(i) == "number") {
            sum += Math.pow(point1.getDim(i) - point2.getDim(i), 2);
        }
    }
    return Math.sqrt(sum);
}

/* Warning: assumes both points have the same number of dimensions. */
function jaccardDist(point1, point2) {
    var unionCount = 0;
    var intersectionCount = 0;
    for (var i = 0; i < point1.d; i++) {
        var val1 = point1.getDim(i);
        var val2 = point2.getDim(i);
        if (val1 === val2) {
            intersectionCount++;
            unionCount++;
        } else {
            unionCount += 2;
        }
    }
    return (unionCount - intersectionCount) / unionCount;
}
