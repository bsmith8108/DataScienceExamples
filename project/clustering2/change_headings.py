import get_data as gd

"""
This is a simple python script to remove all of the spaces in the headings of my csv
so that I can easily use them with the given functions.
"""

def cleaned_headers():
    headers = gd.get_headers()
    new_headers = []

    for entry in headers:
	final = ""
	for i in entry:
	    if (i == " " or i == "(" or i == ")" or i == "/" or i == "^"):
		final = final
	    else:
		final = final + i
	print "entry: " + final
	new_headers.append(final)

    return new_headers

def change_to_list_of_lists(list_of_dicts):
    headers = gd.get_headers()
    final = []

    for x in range(len(list_of_dicts)):
	final.append([])
    
    for entry in headers:
	col = gd.get_data_slice(entry, list_of_dicts)
	for y in range(len(list_of_dicts)):
	    final[y].append(col[y])

    return final

filename = "cleaned_headers.csv"
list_of_dicts = gd.get_data_list_of_dicts()
new_headers = cleaned_headers()
rows_list_of_lists = change_to_list_of_lists(list_of_dicts)

gd.write_data(filename, new_headers, rows_list_of_lists)


