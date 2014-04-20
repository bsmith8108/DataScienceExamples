import get_data as gd
import numpy as np

"""
This file should take the all of the different columns and return a mean and then a standard deviation
and each row will corespond to each header.
"""
def convert_colFloat(col):
    final = []
    for entry in col:
	final.append(float(entry))
    
    return final

# Returns a list of lists where each item is [std, mean]
def normalize_data():
    list_of_dicts = gd.get_data_list_of_dicts()
    headers = gd.get_headers()
    final = []
    for y in range(len(headers)):
	final.append([])

    for x in range(len(headers)):
	col = gd.get_data_slice(headers[x], list_of_dicts)
	colFloat = convert_colFloat(col)
	final[x].append(np.std(colFloat))
	final[x].append(np.mean(colFloat))

    return final

filename = "std_mean_data.csv"
headers = ["standard deviation", "mean"]
rows_list_of_lists = normalize_data()

gd.write_data(filename, headers, rows_list_of_lists)

