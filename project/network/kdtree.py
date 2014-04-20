from normalize import *
import get_data as gd
from operator import itemgetter, attrgetter

# Get an array of the standard deviations and means
std_mean = normalize_data()
std_temp = std_mean[1:]
std_mean = std_temp
class Point:
    def __init__(self, vals):
	self.data = vals[1:]
	self.my_id = vals[0]-1
	self.normalized = []
	self.pagerank = 0
    
    def __str__(self):
	return str(self.my_id)
    
    def __repr__(self):
	return str(self.my_id)

    def normalize(self):
	for x in range(len(std_mean)):
	    temp = self.data[x]
	    temp = temp - float(std_mean[x][1])
	    temp = temp / float(std_mean[x][0])
	    self.normalized.append(temp)
    
    def getInfo(self):
	names = ["T(K)", "Seebeck(uV/K)", "kappaZT", "Resist.(400K)", "Seebeck(400K)", "Pf(W/K^2/m)", "ZT", "kappa(W/mK)", "CellVolume(A^3)", "Formula Units per cell"]
	final = ""
	for x in range(len(self.data)):
	    final = final + names[x] +": " + str(self.data[x]) + "\\n"

	return final

    def axis_value(self, x):
	return self.normalized[x]

    def getId(self):
	return int(self.my_id)

    def distanceTo(self, other):
	final = 0.0
	for x in range(len(self.data)):
	    temp = self.axis_value(x) - other.axis_value(x)
	    temp = temp**2
	    final = final + temp
	final = final**(.5)
	return final

    def compare(self, axis, other):
	if (self.axis_value(axis) > other.axis_value(axis)):
	    return "greater"
	else:
	    return "less than or equal to"

    def setPageRank(self, val):
	self.pagerank = val

class Node:
    def __init__(self, left, value, right, axis):
	self.left = left
	self.val = value
	self.right = right
	self.axis = axis

    def __repr__(self):
	return str(self.val) + "\n left: " + str(self.left) + "\n right: "  + str(self.right)

# This class always contains an ordered list of the shortest to
# farthest distances
class nearestQueue:
    def __init__(self, length):
	self.vals = []
	self.length = length

    def push(self, val):
	same = False
	for entry in self.vals:
	    if entry[1] == val[1]:
		same = True
	if not same:
	    self.vals.append(val)
	    self.vals = sorted(self.vals, key=itemgetter(0))
	    if (len(self.vals) >= self.length):
		self.vals = self.vals[0:self.length]
	
	self.vals = self.vals[0:self.length]

    def getVals(self):
	return self.vals

    def getPoints(self):
	final = []
	for entry in self.vals:
	    final.append(entry[1])
	
	return final

    def combine(self, other):
	o_vals = other.getVals()
	for x in o_vals:
	    self.push(x)

    def __repr__(self):
	return str(self.vals)

class graphPoint:
    def __init__(self, val, edges):
	self.vals = val
	self.edges = edges


def make_points():
    rows_list_of_lists = gd.get_data_list_of_dicts()
    rows_list_of_lists = rows_list_of_lists[1:]
    points = []
    for row in rows_list_of_lists:
        temp = []
	for entry in row.keys():
	    temp.append(0)
	for entry in row.keys():
	    index = get_index(entry)
	    temp[index] = float(row[entry])
	temp_point = Point(temp)
	temp_point.normalize()
	points.append(temp_point)
    return points

def get_index(entry):
    if (entry == "id"):
	return 0
    elif (entry == "T(K)"):
	return 1
    elif (entry == "Seebeck(uV/K)"):
	return 2
    elif (entry == "kappaZT"):
	return 3
    elif (entry == "Resist.(400K)"):
	return 4
    elif (entry == "Seebeck(400K)"):
	return 5
    elif (entry == "Pf(W/K^2/m)"):
	return 6
    elif (entry == "ZT"):
	return 7
    elif (entry == "kappa(W/mK)"):
	return 8
    elif (entry == "CellVolume(A^3)"):
	return 9
    elif (entry == "FormulaUnitsperCell"):
	return 10
    else:
	print "what?"
    
    
    
    
# axis is the current axis that the kdtree is making for
# axis_length is the total axis length, so that it knows whether or
# not to return the axis number back to 0
def make_kdTree(axis, axis_length, points):
    if (len(points) == 1):
	temp = Node(0, points[0], 0, axis)
	return temp
    elif (len(points) == 0):
	return Node(0, 0, 0, axis)
    else:
	sorted_points = sorted(points, key=lambda point : point.data[axis])
	mid_value = len(points)//2
	new_axis = axis+1
	if (axis == axis_length):
	    new_axis = 0
	left_node = make_kdTree(new_axis, axis_length, sorted_points[0:mid_value])
	val = sorted_points[mid_value]
	right_node = make_kdTree(new_axis, axis_length, sorted_points[mid_value+1:])
	final_node = Node(left_node, val, right_node, axis)

	return final_node

# nearestNeighbor returns a list [distance, point]
def findNearest(t, q_point, nearestNeighbor):
    if (t.right == 0 and t.left == 0 and t.val == 0):
	return nearestNeighbor
    elif (t.right == 0 and t.left == 0 and t.val != 0):
	if (q_point.distanceTo(t.val) < nearestNeighbor[0]):
	    return [q_point.distanceTo(t.val), t.val]
	else:
	    return nearestNeighbor
    else:
	d = q_point.distanceTo(t.val)
	comp = q_point.compare(t.axis, t.val)
	
	if (d < nearestNeighbor[0]):
	    nearestNeighbor = [d, t.val]
	
	result_left = findNearest(t.left, q_point, nearestNeighbor)
	result_right = findNearest(t.right, q_point, nearestNeighbor)

	if (result_left[0] > result_right[0]):
	    return result_right
	else:
	    return result_left
	"""
	This is what I would add in if I could get the distance
	to the line working correctly

	if (comp == "greater"):
	    return findNearest(t.right, q_point, nearestNeighbor)
	else:
	    return findNearest(t.left, q_point, nearestNeighbor)
	"""    

def findKNearestNeighbors(t, q_point, NearestQueue):
    if (t.right == 0 and t.left == 0 and t.val == 0):
	return NearestQueue
    elif (t.right == 0 and t.left == 0 and t.val != 0):
	newDist = t.val.distanceTo(q_point)
	NearestQueue.push((newDist, t.val))
	return NearestQueue
    else:
	newDist = t.val.distanceTo(q_point)
	NearestQueue.push((newDist, t.val))
	
	queue_left = findKNearestNeighbors(t.left, q_point, NearestQueue)
	queue_right = findKNearestNeighbors(t.right, q_point, NearestQueue)
	queue_left.combine(queue_right)

	return queue_left

# This will return a big list of the k nearest neighbors for each point
# I will then use this to iterate over and create my json file for the website
def create_lists_of_kNearestNeighbors(points):
    final = []
    for i in range(len(points)):
	test_queue = nearestQueue(5)
	points_without = get_points(points, i)
	node = make_kdTree(0, len(std_mean)-1, points_without)
	temp = findKNearestNeighbors(node, points[i], test_queue)
	final.append(temp)

    return final

def get_points(points, i):
    final = []
    for x in range(len(points)):
	if not x == i:
	    final.append(points[x])
    
    return final

def pageRank(nn_list, points):
    pageRanks = []
    newPageRanks = []
    InNodesList = []
    N = len(points)
    starter = 1.0/N
    oldPageRanks = []
    d = .85
    constant = (1.0-d)/N

    # initialize the page ranks list to the same initial values
    for x in range(len(points)+1):
	pageRanks.append(starter)
	oldPageRanks.append(0.0)
	InNodesList.append([])
    
    # need to find what nodes are pointing to what other nodes
    # once I have this, it will be a constant time lookup to find
    # In(u)
    for entry in range(len(nn_list)):
	for item in nn_list[entry].getPoints():
	    InNodesList[item.getId()].append(points[entry])
	    InNodesList[entry].append(item)

    while not (oldPageRanks == pageRanks):
	for i in range(len(points)):
	    """
	    Page Rank:
		PageRank(point) = (1-d)/N + d*Sum(PR(v)/Out(v))
		for all v coming into the point
	    """
	    final = constant
	    summation = 0.0
	    InPoints = InNodesList[i]
	    for j in range(len(InPoints)):
		PR_v = pageRanks[InPoints[j].getId()]
		Out_v = len(InNodesList[InPoints[j].getId()])
		summation = summation + (PR_v/Out_v)
	    summation = summation*d
	    final = final + summation
	    # This just makes sure it doesn't take forever to converge
	    final = float('%.5f'%(final))
	    newPageRanks.append(final)
	oldPageRanks = pageRanks
	pageRanks = newPageRanks


    return pageRanks
		
def create_json(points, nn_list):
    pageRanks = pageRank(nn_list, points)

    final = "{\n"
    final = final + "\"nodes\" : [\n"
    for entry in range(len(points)):
	i = points[entry].getId()
	final = final + "{\"name\":\"" + str(i) +"\", \"id\":\"" + str(i) + "\", \"count\":" + str(((pageRanks[entry]*100000)-50)*2)+ ", \"label\":\"test\", \"info\":\""+points[entry].getInfo()+ "\"},\n"
    
    final = final + "],\n"
    final = final + "\"links\":[\n"
    for row in range(len(nn_list)):
	for edge in nn_list[row].getVals():
	    final = final + "{\"source\":" + str(points[row].getId()) + ", \"target\":" + str(edge[1].getId()) + ", \"depth\":1, \"linkName\":\"Hi\"},\n"
    
    final = final + "]\n}"

    return final


points = make_points()
"""
node = make_kdTree(0, len(std_mean)-1, points[1:])
print findNearest(node, points[0], [1000, Point([1,2, 0, 0,0,0,0,0,0,0])])
"""

nn_list = create_lists_of_kNearestNeighbors(points)
print create_json(points, nn_list)
