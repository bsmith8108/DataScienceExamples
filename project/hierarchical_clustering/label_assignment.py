#!/usr/bin/python

class Label:
    """
    A class to hold and create the label for a single dimension of a cluster
    when given a list of the values of the component points as well as a
    name for the dimension.  This uses a simple voting scheme to choose the best
    two labels for a list of values.  If the values are numerical, they're put
    into bins and the two bins with the most votes (i.e., values that fall within
    those ranges) are chosen as the labels.  If the values are categorical, again,
    the two categories that appear the most often will be chosen as labels.

    Note that since these labels are being chosen for a single cluster based
    on its component points and not based on the context of the other clusters
    in that level, this may result in multiple clusters on a single level
    having the same label.  Ideally, this would be resolved by choosing the
    labels that are most distinguishing, and not the ones that are most
    popular.  Feel free to improve on this algorithm, or use it as is for
    the purposes of this lab.  If you would prefer to hand curate your labels,
    that's also fine, but likely to be incredibly tedious.

    Warning: the categorical part of this may be buggy.

    >>> label = Label([0.1, 0.12, 0.5, 1.0, 0.0, 0.13, 0.14, 0.3, 0.13, 0.7], 'dimension')
    >>> label.bin_size
    0.1
    >>> label.bin_containment
    [1, 5, 0, 1, 0, 1, 0, 1, 0, 1]
    >>> label.get_score()
    0.5
    >>> label.get_bin_index(0.3)
    3
    >>> label.is_numerical
    True
    >>> label.get_dim_name()
    'dimension'
    >>> label.get_label()
    'dimension: 0.10 to 0.20'
    """
    def __init__(self, list_of_values, dim_name):
        self.list_of_values = list_of_values
        self.dim_name = dim_name
        self.num_bins = 10
        if len(list_of_values) > 0 and type(list_of_values[0]) == float:
            self.is_numerical = True
        else:
            self.is_numerical = False
        if self.is_numerical:
            self.minvalue, self.maxvalue = get_min_max(list_of_values)
            if self.minvalue == self.maxvalue:
                self.maxvalue = self.maxvalue + 1
                self.num_bins = 1
            self.bin_size = (self.maxvalue - self.minvalue) / float(self.num_bins)
            self.bin_containment = [0 for i in range(self.num_bins)]

        self.put_in_bins()
        self.create_label()

    def get_bin_index(self, value):
        if (value == self.maxvalue):
            bin_index = self.num_bins - 1  # put the max value in the last bin
            return bin_index
        offset = value - self.minvalue
        i = offset / self.bin_size
        return int(i)

    def get_index_value_range(self, bin_index):
        left_value = bin_index * self.bin_size + self.minvalue
        right_value = left_value + self.bin_size
        return left_value, right_value  

    def put_in_bins(self):
        categorical_dict = {}
        for value in self.list_of_values:
            if self.is_numerical:
                bin_index = self.get_bin_index(value)
                self.bin_containment[bin_index] = self.bin_containment[bin_index] + 1
            else:
                if categorical_dict[value]:
                    categorical_dict[value] = categorical_dict[value] + 1
                else:
                    categorical_dict[value] = 1
        if not self.is_numerical:
            self.category_names = []
            for key, value in categorical_dict:
                self.category_names.append(key)
                self.bin_containment.append(value)
            self.num_bins = len(self.category_names)

    def get_score(self):
        return self.score

    def get_label(self):
        return self.label

    def get_dim_name(self):
        return self.dim_name

    def create_label(self):
        num_votes = len(self.list_of_values)
        winner_index, score = vote(self.bin_containment, num_votes)
        if self.is_numerical:
            left_value, right_value = self.get_index_value_range(winner_index)
            if self.bin_size == 1:
                self.label = self.dim_name + ": " + \
                    str("%.2f" % left_value)
            else: 
                self.label = self.dim_name + ": " + \
                    str("%.2f" % left_value) + " to " + str("%.2f" % right_value)
        else:
            self.label = self.dim_name + ": " + self.category_names[winner_index]
        self.score = score

# Assumes that there's at least one value. 
def get_min_max(list_of_values):
    """
    >>> get_min_max([3.0, 4.0, 1.4, 0.2, 0.0, 0.7])
    (0.0, 4.0)
    """
    min_value = list_of_values[0]
    max_value = list_of_values[0]
    for value in list_of_values:
        if value < min_value:
            min_value = value
        if value > max_value:
            max_value = value
    return min_value, max_value

# Assumes the list of votes is a list of positive integers.  Returns the index
# of the winner and its score.
def vote(list_of_votes, total_votes):
    """
    >>> vote([0,1,0,1,0,3,4,2], 10)
    (6, 0.4)
    """
    max_vote = 0
    max_index = None
    for i in range(0, len(list_of_votes)): 
        vote = list_of_votes[i]
        if vote > max_vote:
            max_vote = vote 
            max_index = i
    return max_index, float(max_vote) / float(total_votes)

def pick_label(list_of_labels):
    """
    >>> label1 = Label([0.1, 0.0, 0.3, 0.35, 0.8], 'dim1')
    >>> label2 = Label([0.11, 0.01, 0.1, 0.15, 0.82], 'dim2')
    >>> string_label1 = label1.get_label()
    >>> string_label2 = label2.get_label()
    >>> picked = pick_label([label1, label2])
    """
    sorted_labels = sorted(list_of_labels, key=lambda x: x.get_score())
    best_label = sorted_labels[0]
    label = best_label.get_label()
    if (len(sorted_labels) > 1):
        second_best_label = sorted_labels[1]
        label = label + " and\n" + second_best_label.get_label()
    return label

# Assumes all points have the same dimension and there is at least one point.
def create_label(list_of_points, dimension_names):
    dim = list_of_points[0].get_dimension()
    possible_labels = []
    for i in range(0, dim):
        dim_list_of_values = []
        for point in list_of_points:
            dim_list_of_values.append(point.get_item(i))
        possible_labels.append(Label(dim_list_of_values, dimension_names[i]))
    return pick_label(possible_labels) 

def _test():
    import doctest
    result = doctest.testmod()
    if result[0] == 0:
        print "Wahoo! Passed all", result[1], __file__.split('/')[-1], "tests!"
    else:
       print "Rats!"

if __name__ == "__main__": _test() # for doctest
