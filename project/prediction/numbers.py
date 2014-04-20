import get_data as gd

filename = "my_numbers.csv"
headers = gd.get_headers()
rows_list_of_lists = [["T (K)","Z*10^-4 reported","Resist. (Ohm.cm)","Seebeck (uV/K)","kappaZT","Resist. (400K)","Seebeck (400K)","Pf (W/K^2/m)","ZT","kappa (W/mK)","x","Formula","series","T Max","family"]]

gd.write_data(filename, headers, rows_list_of_lists)
