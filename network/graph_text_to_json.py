#!/usr/bin/python

import sys
import json

def remove_quotes(s):
    if s[0] == '"' or s[0] == ' ':
        s = s[1:]
    if s[0] == '"':
        s = s[1:]
    if s[-1] == '"' or s[-1] == ' ':
        s = s[:-1]
    if s[-1] == '"' or s[-1] == ' ':
        s = s[:-1]
    return s
  
def get_vertices(e):
    """
    >>> get_vertices('"Name One" <-> "Name Two"')
    ('Name One', 'Name Two')
    
    """
    names = e.split("<->")
    v1 = remove_quotes(names[0])
    v2 = remove_quotes(names[1])
    return v1, v2


try:
    input_file = sys.argv[1]
    out_file = sys.argv[2]
except IndexError:
    print "Usage: <plain text mathematica graph file> <adjacency list json output file>"
    exit(1)

inf = open(input_file, 'r')
outf = open(out_file, 'w')

graph_dict = {}
for line in inf:  # there should only be one line
    parts = line.split('}, {')
    vertices = parts[0][7:].split(',')
    for vertex in vertices:
        # Do this here instead of later with the edges so that vertices without
        # edges are still included in the graph.
        graph_dict[remove_quotes(vertex)] = []
    
    edges = parts[1].split(',')
    for edge in edges:
        v1, v2 = get_vertices(edge)
        graph_dict[v1].append(v2)
        graph_dict[v2].append(v1) 
json.dump(graph_dict, outf)
inf.close()
outf.close()

# make doctest work:
def _test():
    import doctest
    result = doctest.testmod()
    if result[0] == 0:
        print "Wahoo! Passed all", result[1], __file__.split('/')[-1], "tests!"
    else:
       print "Rats!"

if __name__ == "__main__": _test()	
