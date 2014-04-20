function Label(valuesArr, dimensionName) {
    this.valuesArr = valuesArr;
    this.dimensionName = dimensionName;
    this.numBins = 10;
    this.isNumerical = true;  // THIS WAS CHANGED!
    this.categoryNamesArr = [];
    if (this.valuesArr.length > 0 && (typeof this.valuesArr[0] == "number")) {
        this.isNumerical = true;
    }
    if (this.isNumerical) {
        this.minmax = getMinMax(valuesArr);
        if (this.minmax[0] == this.minmax[1]) {
            this.minmax[1] = this.minmax[1] + 1;
            this.numBins = 1;
        }
        this.binSize = +((this.minmax[1] - this.minmax[0]) / this.numBins);
        this.binContainmentArr = [];
        for (var i = 0; i < this.numBins; i++) {
            this.binContainmentArr[i] = 0;
        }
    }
    this.putInBins()
    this.createLabel()
}

Label.prototype.getBinIndex = function(value) {
    if (value == this.minmax[1]) {
        var binIndex = this.numBins - 1; // put the max value in the last bin
        return binIndex;
    }
    var offset = value - this.minmax[0];
    var i = offset / this.binSize;
    return i;
}

Label.prototype.getIndexValueRange = function(binIndex) {
    var leftValue = +(binIndex * this.binSize + this.minmax[0]);
    var rightValue = leftValue + this.binSize;
    return [leftValue, rightValue];
}

Label.prototype.putInBins = function() {
    categoricalDict = {};
    for (var i = 0; i < this.valuesArr.length; i++) {
        var value = this.valuesArr[i];
        if (this.isNumerical) {
            var binIndex = this.getBinIndex(value);
            this.binContainmentArr[binIndex] = this.binContainmentArr[binIndex] + 1;
        } else {
            if (categoricalDict[value]) {
                categoricalDict[value] = categoricalDict[value] + 1;
            } else {
                categoricalDict[value] = 1;
            }
        }
    }
    if (!this.isNumerical) {
        for (var key in categoricalDict) {
            var value = categoricalDict[key];
            this.categoryNames.push(key);
            this.binContainmentArr.push(value);
        }
        this.numBins = len(this.categoryNames); 
    } 
}

Label.prototype.getScore = function() {
    return this.score;
}

Label.prototype.getLabel = function() {
    return this.label;
}

Label.prototype.getDimName = function() {
    return this.dimensionName;
}

Label.prototype.createLabel = function() {
    var numVotes = this.valuesArr.length;
    var winnerScoreArr = vote(this.binContainmentArr, numVotes);
    if (this.isNumerical) {
        leftRightArr = this.getIndexValueRange(winnerScoreArr[0]);
        if (this.binSize == 1) {
            this.label = this.dimensionName + ": " + leftRightArr[0].toFixed(2);
        } else {
            this.label = this.dimensionName + ": " + leftRightArr[0].toFixed(2) + " to " + leftRightArr[1].toFixed(2);
        }
    } else {
        this.label = this.dimensionName + ": " + this.categoryName[winnerScoreArr[0]];
    }
    this.score = winnerScoreArr[1];
}

function getMinMax(valuesArr) {
    var min = valuesArr[0];
    var max = valuesArr[1];
    for (var i = 0; i < valuesArr.length; i++) {
        var value = valuesArr[i];
        if (value < min) {
            min = value;
        }
        if (value > max) {
            max = value;
        }
    }
    return [min, max];
}

function vote(votesArr, total) {
    maxVote = votesArr[0];
    maxIndex = 0;
    for (var i = 0; i < votesArr.length; i++) {
        currVote = votesArr[i];
        if (currVote > maxVote) {
            maxVote = currVote;
            maxIndex = i;
        }
    }
    return [maxIndex, maxVote / total]; 
}

/* Assumes there are at least two labels given! */
function pickLabel(labelsArr) {
    maxScoreIndex = [labelsArr[0].getScore(), 0];
    secondScoreIndex = [labelsArr[1].getScore(), 1];
    for (var i = 2; i < labelsArr.length; i++) {
        var score = labelsArr[i].getScore();
        if (score > secondScoreIndex[0]) {
            if (score > maxScoreIndex[0]) {
                secondScoreIndex[0] = maxScoreIndex[0];
                secondScoreIndex[1] = maxScoreIndex[1];
                maxScoreIndex[0] = score;
                maxScoreIndex[1] = i;
            } else {
                secondScoreIndex[0] = score;
                secondScoreIndex[1] = i;
            }
        }
    }
    var label = labelsArr[maxScoreIndex[1]].getLabel();
    if (maxScoreIndex[1] != secondScoreIndex[1]) {
        label = label + " and\n" + labelsArr[secondScoreIndex[1]].getLabel();
    }
    return label;
}

/* makeClusterLabel is the main point of entry for all functions in this file.
 * It takes a cluster and returns the label for the cluster.  The inputs are:
 * pointsArr: this is an array of points, where each point is itself an array.
 *     So this is an array of arrays.
 * dimensionNamesArr: An array with one dimension description for each dimension.
 * return: a single string label value.
 */
function makeClusterLabel(pointsArr, dimensionNamesArr) {
    var numDimensions = dimensionNamesArr.length;
    var possibleLabelsArr = [];
    for (var i = 0; i < numDimensions; i++) {
        var dimValuesArr = [];
        for (var p = 0; p < pointsArr.length; p++) {
            var point = pointsArr[p];
            dimValuesArr.push(point[i]);
        }
        possibleLabelsArr.push(new Label(dimValuesArr, dimensionNamesArr[i]));
    }
    var label = pickLabel(possibleLabelsArr);
    return label;
}

function makeClusterLabelPoints(pointsArr, dimensionNamesArr) {
    var numDimensions = dimensionNamesArr.length;
    var possibleLabelsArr = [];
    for (var i = 1; i < numDimensions; i++) {
        var dimValuesArr = [];
        for (var p = 0; p < pointsArr.length; p++) {
            var point = pointsArr[p];
            dimValuesArr.push(point.getDim(i));
        }
        possibleLabelsArr.push(new Label(dimValuesArr, dimensionNamesArr[i]));
    }
    var label = pickLabel(possibleLabelsArr);
    return label;
}

