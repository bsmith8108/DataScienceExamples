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

column_name1 = headers[1]
column1 = gd.get_data_slice(column_name1, list_of_dicts)
col1 = []

column_name2 = headers[4]
column2 = gd.get_data_slice(column_name2, list_of_dicts)
col2 = []

datetime_name = headers[0]
datetime = gd.get_data_slice(datetime_name, list_of_dicts)

for entry in range(len(column2)):
	if not ("?" in column1[entry] or "?" in column2[entry]):
		#if datetime[entry] == date_convert("20/10/2010 6:00:00"): 
		col1.append(float(column1[entry]))
		col2.append(float(column2[entry]))
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

gd.write_data(filename, new_headers, rows_list_of_lists)

viz_file = "visual_points.csv"

# this section selects a random variety of point to display

random_points_to_plot = []
for i  in range(len(column1)):
	x = r.randrange(1, 99)
	if x == 42:
		random_points_to_plot.append([column1[i],column2[i]])

gd.write_data(viz_file, new_headers, random_points_to_plot)

def find_lin_reg():
	x = np.array(column1)
	y = np.array(column2)

	A = np.vstack([x, np.ones(len(x))]).T
	soln = np.linalg.lstsq(A,y)
	m, c = soln[0]
	residual= soln[1]
	print type(residual)
	r = 1 - residual/(y.size * y.var())
	print r
	print m, c

	# Now I need to actually find the start and end points of the best fit line
	# newM and newC are calculated based on how the data points are
	# stretched in the javascript

	newM = m*(float(10)/float(100))
	newC = (c)*float(10)

	y1 = float(600)
	y2 = float(0) # the width of my current svg
	
	x1 = (y1-newC)/newM
	x2 = (float(-1)*newC)/newM

	line_file = "line.csv"
	line_header = ["x1", "y1", "x2", "y2", "col1", "col2", "r"]
	rows_list_of_lists = [[x1, y1, x2, y2, column_name1, column_name2, r]]
	# write a new csv file that contains the information about the best
	# fit line for the data
	gd.write_data(line_file, line_header, rows_list_of_lists)


find_lin_reg()
