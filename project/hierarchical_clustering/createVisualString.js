var arrayData = [];
var rep_String = '';
function ConvertData(inputData, arrayData, includeEmpty) {
    var headers = d3.keys(inputData[0]);
            
	        // Convert the data to an array of arrays.
    for (var i = 0; i < headers.length; i++) {
	arrayData.push([]);
    }
		// console.log(arrayData.length)

    for (var key in inputData) {
	var row = inputData[key];
        for (var i = 0; i < headers.length; i++) {
	    var possibleCategory = row[headers[i]];
            if (possibleCategory || includeEmpty) {
		arrayData[i].push(row[headers[i]]);
            }
        }
    }
               
    return arrayData;
}

d3.csv("cleaned.csv", function(error, data) { 
    var my_data = ConvertData(data, arrayData, false);
    var set_of_rows = [];
    for (var i=0; i<my_data[0].length; i++) {
	var row = []
	for (var k=0; k<my_data.length; k++) {
	    row.push(my_data[k][i]);
	}
	set_of_rows.push(row);
    }
    
    console.log(set_of_rows)
    var points = []
    for (var i=0; i<set_of_rows.length; i++) {
	var temp = new Point(set_of_rows[i]);
	points.push(temp);
    }
    
    var clusters = [];
    for (var j=0; j<points.length; j++) {
	var temp = new ClusterNode([], points[j], points[j].print());
	clusters.push(temp);
    }
    
    var fin = makeClustering(clusters, clusters.length);
    var test = fin[0];
    rep_String = test.makeDictionary();

   //  console.log(rep_String);
    var finObject = eval("(" + rep_String + ")");
    drawHierarchy(finObject);
});
