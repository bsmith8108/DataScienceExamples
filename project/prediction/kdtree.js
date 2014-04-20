/**
 * This is where you'll put your javascript implementation of a kd-tree and any related
 * objects you'll need.  If you've never used javascript to make "classes" before, you
 * may want to take a look at these articles:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
 * http://www.phpied.com/3-ways-to-define-a-javascript-class/
 * I found it useful to make "classes" for Points, Nodes, and of course the KDTree itself,
 * but you may choose to implement this however you'd like (aside from using an
 * existing implementation you found elsewhere).
 */

function Point(arr){
    this.pointArray = arr;
}

Point.prototype.point_size = function() {
    return this.pointArray.length;
}

Point.prototype.axis_value = function(x) {
    return this.pointArray[x];
}

Point.prototype.print = function() {
    var s = "";
    for (var i =0; i<this.pointArray.length; i++) {
	s = s +  this.pointArray[i] + ", \\n";
    }
    return s;
}

Point.prototype.distance_between = function(other) {
    var f = 0;
    for (var i = 0; i<this.point_size(); i++) {
	f = f + Math.pow((this.axis_value(i) - other.axis_value(i)),2);
    }
    f = Math.sqrt(f);
    return f;
} 

Point.prototype.compare = function(axis, other) {
    if (this.axis_value(axis) > other.axis_value(axis)) {
	return "greater";
    }
    else {
	return "less than or equal to";
    }
}

Point.prototype.change_axis_value = function(axis, val) { 
    this.pointArray[axis] = val;
}

Point.prototype.get_points = function() {
    return this.pointArray;
}

Point.prototype.distance_to_line = function(axis, other) {
    var d = Math.abs(this.axis_value(axis) - other.axis_value(axis));
    var tempArray = get_points_from_point(other);
    var temp = new Point(tempArray);
    temp.change_axis_value(axis, d);
    return this.distance_between(temp);
}

function get_points_from_point(p) {
    var fin = [];
    var arr =  p.get_points();
    for (var i = 0; i < arr.length; i++) {
	fin.push(arr[i]);
    }
    return fin;
}

function Node(left, value, right, axis){
    // Set the left and right subtrees and then the nodes value
    this.left = left;
    this.right = right;
    this.val = value;
    this.axis = axis; 
}

Node.prototype.print = function() {
    var s = "left: " + this.left;
    s = s +"\nright: " + this.right;
    s = s +"\nvalue: " + this.val;
    s = s +"\naxis: " + this.axis;
    return s;
}
	
function kdTree(points) {
    this.points = points;
    var temp = this.points[0];
    this.tree = makeTree(0, temp.point_size()-1, this.points);
}

function findNearest(t, q_point, nearestNeighbor, axis_disregard) {
    if (typeof(axis_disregard)==="undefined") axis_disregard =[-1];
    if (t.left == 0 && t.val != undefined) {
    	// console.log(t.val)
	var d = q_point.distance_between(t.val);
	if (d < nearestNeighbor[0]) {
	    nearestNeighbor = [d, t.val];
	}
	return nearestNeighbor;
    }
    else if (t.val == undefined) {
	// console.log("here")
	return nearestNeighbor;
    }
    else {
	var d = q_point.distance_between(t.val);
	var comp = q_point.compare(t.axis,t.val);

	var d_line = q_point.distance_to_line(t.axis, t.val)
        if (d < nearestNeighbor[0]) {
		nearestNeighbor = [d, t.val];
	}
	//console.log("distance to line: " + d_line)
	//console.log("nearest Neighbor: " + nearestNeighbor[0])
	//console.log(t.val.print())
	//console.log(q_point.print())
	if (d_line > nearestNeighbor[0]) {
	    if (comp == "greater") {
		return findNearest(t.right, q_point, nearestNeighbor);
		}
	   else {
		return findNearest(t.left, q_point, nearestNeighbor);
	   }
	}
	else {
	    var result_left = findNearest(t.left, q_point, nearestNeighbor);
	    var result_right = findNearest(t.right, q_point, nearestNeighbor);
	    
	    // console.log("result_left: ")
	    // console.log(result_left[0]) 
	    // console.log("result_right: ")
	    // console.log(result_right[0])   
	    if (result_left[0] > result_right[0]) {
		return result_right;
	    }
	    else {
		return result_left;
	    }
	}
    }
}

function makeTree(axis, axis_length, avail_points) {
    if (avail_points.length <= 1) {
        return new Node(0, avail_points[0], 0, axis);
    }
    else {
	var sorted_points = avail_points.sort(function(a,b) {
	    return a.axis_value(axis) - b.axis_value(axis);
	});
	var mid = Math.ceil(avail_points.length/2)-1;
	var new_axis = axis+1;
	if (axis == axis_length) {
	    new_axis = 0;
	}
	var left_node = makeTree(new_axis, axis_length, sorted_points.slice(0,mid));
	var val = sorted_points[mid];
	//console.log("mid point: " + mid + " value:\n " +sorted_points[mid].print())
	var right_node = makeTree(new_axis, axis_length, sorted_points.slice(mid+1));
	//console.log(sorted_points.slice(mid+1))	
	var final_node = new Node(left_node, val, right_node, axis);
	
	return final_node;
    }
}

var point3 = new Point([1,2]);
var point2 = new Point([5,6]);
var point1 = new Point([9,10]);

var point4 = new Point([6,4]);
var point5 = new Point([7,3]);
var point6 = new Point([19,1]);
var point7 = new Point([11,12]);

var points = [point1, point2, point3, point4, point5, point6, point7]

var test = new kdTree(points);
var n = test.tree;
var qp = new Point([19,3]);
var t = test.tree.val;
var start_d =  qp.distance_between(t);
//var nearN = findNearest(n,qp, [start_d, t]);
//console.log(nearN)
