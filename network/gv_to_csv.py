import sys
import json

gv = open("mine.gv","r")
gv_data = []

nextLine = "drop me"
while not nextLine == "":
    gv_data.append(nextLine)
    nextLine = gv.readline()

gv.close()

#to get rid of the empty line at the top

gv_data = gv_data[4:]

for entry in range(len(gv_data)):
    gv_data[entry] = gv_data[entry].replace("\n", "")
    gv_data[entry] = gv_data[entry].replace("\t", "")
    gv_data[entry] = gv_data[entry].replace("\"", "")
    gv_data[entry] = gv_data[entry].replace("[label=Name]", "")
    gv_data[entry] = gv_data[entry].replace(" ;", "")
    gv_data[entry] = gv_data[entry].replace(";", "")
    gv_data[entry] = gv_data[entry].replace("}", "")
    gv_data[entry] = gv_data[entry].replace("{", "")

id_name_dict = {}
nodes = []
i = 0

while not "--" in gv_data[i]:
    nodes.append({"id":i, "name":gv_data[i], "count":5})
    id_name_dict[gv_data[i]] = i
    i=i+1

#print len(nodes)
#print len(id_name_dict)

links = []
In_Nodes = []
for x in range(len(nodes)):
    In_Nodes.append([])

j = len(gv_data)-1
for entry in range(len(gv_data[i:j])):
    temp = gv_data[i+entry].split(" -- ")
    src = id_name_dict[temp[0]]
    trgt = id_name_dict[temp[1]]
    links.append({"source":src, "target":trgt})
    In_Nodes[src].append(trgt)
    In_Nodes[trgt].append(src)


pageRanks = []
newPageRanks = []
N = len(nodes)
starter = 1.0/N
oldPageRanks = []
d = .85
constant = (1.0-d)/N

# initialize the page ranks list to the same initial values
for x in range(len(nodes)):
    pageRanks.append(starter)
    oldPageRanks.append(0.0)
    
while not (oldPageRanks == pageRanks):
    for i in range(len(nodes)):
	"""
	Page Rank:
	PageRank(point) = (1-d)/N + d*Sum(PR(v)/Out(v))
	for all v coming into the point
	"""
	final = constant
	summation = 0.0
	InPoints = In_Nodes[i]
	for j in range(len(InPoints)):
	    PR_v = pageRanks[InPoints[j]]
	    Out_v = len(In_Nodes[InPoints[j]])
	    summation = summation + (PR_v/Out_v)
	summation = summation*d
	final = final + summation
	# This just makes sure it doesn't take forever to converge
	final = float('%.5f'%(final))
	newPageRanks.append(final)
    
    
    oldPageRanks = pageRanks
    pageRanks = newPageRanks
    newPageRanks = []

for x in range(len(pageRanks)):
    nodes[x]["count"] = pageRanks[x]

py_json = {"nodes": nodes , "links": links }

json_file = json.dumps(py_json)

print json_file
