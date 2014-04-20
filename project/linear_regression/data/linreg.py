#/usr/bin/python
import numpy as np
import get_data as gd
import random as r 
"""
Here, you should put your linear regression analysis, i.e., the functions you
need to go through the data and find interesting linearly related variables
(pairs that have small residuals).  You should feel free to use the numpy
linear regression function to do the calculation for you.  For information on
the numpy linear regression function see:
http://docs.scipy.org/doc/numpy/reference/generated/numpy.linalg.lstsq.html
"""

list_of_dicts =  gd.get_data_list_of_dicts()

headers =  gd.get_headers()

column_name1 = headers[2]
column1 = gd.get_data_slice(column_name1, list_of_dicts)
col1 = []

column_name2 = headers[3]
column2 = gd.get_data_slice(column_name2, list_of_dicts)
col2 = []

print column_name1
print column_name2

print type(column2[1])

for entry in range(len(column2)):
	try:
		float(column2[entry])
		if type(float(column2[entry])) == type(1.0):
			col2.append(float(column2[entry]))
	except:
		x = ""

for entry in range(len(column1)):
	try:
		float(column1[entry])
		if type(float(column1[entry])) == type(1.0):
			col1.append(column1[entry])
	except:
		x = ""
column1 = col1
column2 = col2

filename = "test.csv"

# I am naming them column1 and column2 so that in my javascript I don't
# have to worry about finding which different datatypes I am comparing and
# just refer to them by their column
new_headers = ["column1","column2"]

rows_list_of_lists = []
for i in range(len(column1)):
	rows_list_of_lists.append([column1[i], column2[i]])

rows1 = rows_list_of_lists[0:20]
rows2 = rows_list_of_lists[36:82]
rows_final = rows1
for i in rows2:
	rows_final.append(i)

gd.write_data(filename, new_headers, rows1)

# this section selects a random variety of point to display

def find_lin_reg():
	col1a = column1[3:20]
	col1b = column1[38:82]
	for i in col1b:
		col1a.append(i)
	col2a = column2[3:20]
	col2b = column2[38:82]
	for j in col2b:
		col2a.append(j)

	x = np.array(col1a)
	y = np.array(col2a)

	A = np.vstack([x, np.ones(len(x))]).T
	m, c = np.linalg.lstsq(A,y)[0]
	print m, c

	# Now I need to actually find the start and end points of the best fit line
	# newM and newC are calculated based on how the data points are
	# stretched in the javascript

	newM = m*(float(1)/float(20000))
	newC = c + 300

	y1 = float(600)
	y2 = float(0) # the width of my current svg
	
	x1 = (y1-newC)/newM
	x2 = (float(-1)*newC)/newM

	line_file = "line.csv"
	line_header = ["x1", "y1", "x2", "y2", "col1", "col2", "r"]
	rows_list_of_lists = [[x1, y1, x2, y2, column_name1, column_name2, "-0.73"]]
	# write a new csv file that contains the information about the best
	# fit line for the data
	gd.write_data(line_file, line_header, rows_list_of_lists)


find_lin_reg()
