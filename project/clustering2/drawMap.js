/**
 * When you use this for your project, you'll need to change many of the attribute names
 * (e.g., d.latitude) to refer correctly to the attribute names in your csv.
 * You'll also need to change the csv file names themselves.  In other words, transferring
 * this to work with your project data will NOT be a simple copy of this file.
 * Note that while most of the things you'll need to change have been separated to the
 * top of this file, there may still be other assumptions throughout about the data.
 * For example, there's assumed to be an attribute named "id" in your data.
 */

/** Section including fields that will definitely have to change for different data. */
// TODO: you'll need to clean the data and put it here.
var MAIN_CSV_FILE = "cleaned_headers.csv";

// The data displayed when you mouse over the main data points.  The second field is
// the name of the attribute to display.
/*var printDetails = [
		{'var': 'county', 'print': 'County'},
		{'var': 'prefmag', 'print': 'Magnitude'},
		{'var': 'depth', 'print': 'Depth (km)'},
		{'var': 'year', 'print': 'Year'}];
*/
// Cross filter info.
var getFilter1Field = function(d) { return d.SeebeckuVK; };
var getFilter2Field = function(d) { return d.PfWK2m; };
var domainFilter1 = [-800,400];
var domainFilter2 = [0, .001];
var rangeFilter1 = [-1, 20*23];
var rangeFilter2 = [0,8 * 50];

/** The more general parts of the map (and cluster) drawing code. */
var K = 4; // TODO: The number of clusters to create.  You'll need to replace this with something smarter.
var width = 500, height = 300;

/*
var proj = d3.geo.mercator()
		.center([0, 0])
		.scale(150)
		.rotate([-10,0]);

var path = d3.geo.path()
		.projection(proj);

// To center and zoom in on Oklahoma.
proj.translate([5724.788953193977, 2066.73187751146]).scale(2876.0102383709836);
*/

var currentPoints = [];
var dimensionNames = [];
var clustering;

// Will house the csv info for the wells.
// var overlayCsv;

/*var svg = d3.select("#map").append("svg")
		.attr("width", width)
		.attr("height", height);
var borders = svg.append("g");
var maplabel = d3.select("#maplabel");
/* maplabel.append("label").text(OVERLAY_CHECKBOX_TEXT);
maplabel.append("input")
    .attr("type", "checkbox")
    .attr("name", OVERLAY_CHECKBOX_ID)
    .attr("value", "show")
    .attr("id", OVERLAY_CHECKBOX_ID)
    .on("change", function() {
        drawOverlay();
    });

var mainDataSvg = svg.append("g");
var overlay = svg.append("g");
*/

// Will be the magnitudes.
var mainDataScale = d3.scale.pow().exponent(2).domain([0, 2, 3, 4, 5]);

// Will be the clusters.
var colorScale = d3.scale.category20();

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("align", "left")
    .style("opacity", 1e-6)
    .style("background", "rgba(250,250,250,.7)");

queue()
	//.defer(d3.json, MAP_TOPOLOGY_FILE)
	.defer(d3.csv, MAIN_CSV_FILE)
	.defer(d3.csv, "std_mean_data.csv")
	//.defer(d3.csv, OVERLAY_CSV_FILE)
	.await(ready);

var mainData;
function ready(error, csv, csv2){
        /* Note, this needs to be changed if the map changes.
	borders.selectAll("path")
		.data(topojson.object(topology, topology.objects.subunits_ok)
				.geometries)
	.enter()
		.append("path")
		.attr("d", path)
		.attr("class", "border")

        overlayCsv = csv2;
	*/
	mainData = [];
        var i = 0;
	csv.forEach(function(d){
		mainData.push(d);
		if (dimensionNames.length == 0) {
			dimensionNames = Object.keys(d);
		}
		var point = [];
		dimensionNames.forEach(function(key) {
		/*	point.push(d[key]);
		});*/
		    if (!isNaN(d[key])){                                                          
                            point.push(+d[key]);                                                      
                    } else {                                                                      
			point.push(d[key]);                                                       
                    }                                                                             
                });
	    
		d['index'] = i;
                var pointObject = new Point(point);
                pointObject.setId(d.id);
		pointObject.normalize(csv2);
		currentPoints.push(pointObject);
                i++;
	});
	
        var myK = kmeans_withK(currentPoints);
	clustering = drawClustering(currentPoints, myK);
        displayLabels();

	mainDataScale
		.range([1, 2, 3, 4, 5]);

	console.log(mainData)
	 
	mainDataCF = crossfilter(mainData),
		all = mainDataCF.groupAll(),
		filter1 = mainDataCF.dimension(function(d){return getFilter1Field(d); }),
		filter1All = filter1.group(function(d){return d;}),
		filter2 = mainDataCF.dimension(function(d){return getFilter2Field(d)}),
		filter2All = filter2.group(function(d){ return Math.round(d*10) / 10;});

		cartoDbId = mainDataCF.dimension(function(d){return d.id;});
		cartoDbIds = cartoDbId.group()

	var charts = [
		barChart()
				.dimension(filter1)
				.group(filter1All)
			.x(d3.scale.linear()
				.domain(domainFilter1)
				.rangeRound(rangeFilter1)),

		barChart()
				.dimension(filter2)
				.group(filter2All)
			.x(d3.scale.linear()
				.domain(domainFilter2)
				.rangeRound(rangeFilter2))
	];

	var chart = d3.selectAll(".chart")
			.data(charts)
			.each(function(chart){chart.on("brush", renderAll).on("brushend", renderAll)});

	d3.selectAll("#total")
			.text(mainDataCF.size());


	function render(method){
		d3.select(this).call(method);
	}


	lastFilterArray = [];
	mainData.forEach(function(d, i){
		lastFilterArray[i] = 1;
	});

	function renderAll(){
		chart.each(render);

		var filterArray = cartoDbIds.all();
		filterArray.forEach(function(d, i){
			if (d.value != lastFilterArray[i]){
				lastFilterArray[i] = d.value;
				d3.select("#id" + d.key).transition().duration(500)
						.attr("r", d.value == 1 ? 2*mainDataScale(getFilter2Field(mainData[i])) : 0)
					.transition().delay(550).duration(500)
						.attr("r", d.value == 1 ? mainDataScale(getFilter2Field(mainData[i])) : 0);

				d3.select("#nodeid" + d.key).transition().duration(500)
				  .attr("r", d.value == 1 ? 4*mainDataScale(getFilter2Field(mainData[i])) : 0)
				  .transition().delay(550).duration(500)
			       	  .attr("r", d.value == 1 ? 3*mainDataScale(getFilter2Field(mainData[i])) : 0);
			}
		})

		d3.select("#active").text(all.value());
	}

	window.reset = function(i){
		charts[i].filter(null);
		renderAll();
	}

	renderAll();
}

function updateDetails(mainData){
	tooltip.selectAll("div").remove();
	tooltip.selectAll("div").data(printDetails).enter()
		.append("div")
			.append('span')
				.text(function(d){return d.print + ": ";})				
				.attr("class", "boldDetail")
			.insert('span')
				.text(function(d){return mainData[d.var];})
				.attr("class", "normalDetail");
}

function drawOverlay() {
    if (overlayCsv) {
        if (document.getElementById(OVERLAY_CHECKBOX_ID).checked) {
            overlay.selectAll("circle")
                               .data(overlayCsv).enter()
                                    .append("circle")
            			.attr("cx", function(d){return proj(getOverlayXY(d))[0];})
            			.attr("cy", function(d){return proj(getOverlayXY(d))[1];})
            			.attr("r", 	function(d){return overlayR;})
            			.style("fill", function(d){ return "#000000";	})
            	.on("mouseover", function(d){
            		d3.select(this)
            			.attr("stroke", "black")
            			.attr("stroke-width", 1)
            			.attr("fill-opacity", 1);
    
            		tooltip
            		    .style("left", (d3.event.pageX + 5) + "px")
            		    .style("top", (d3.event.pageY - 5) + "px")
            		    .transition().duration(300)
            		    .style("opacity", 1)
            		    .style("display", "block")
    
            		updateDetails(d);
            		})
            	.on("mouseout", function(d){
            		d3.select(this)
            			.attr("stroke", "")
            			.attr("fill-opacity", function(d){return 1;})
    
            		tooltip.transition().duration(700).style("opacity", 0);
            	});
        } else {
            overlay.selectAll("circle").remove();
        }
    }
}

// This isn't pretty at all.  Feel free to make it prettier.
function displayLabels() {
    if (clustering) {
        var clusters = clustering.getClusters();
        var clusteringlabel = d3.select("#clusteringlabel");
        for (var i = 0; i < clusters.length; i++) {
            var label = clusters[i].getLabel();
            var color = colorScale(i); 
            var clusterdiv = clusteringlabel.append("div");
            var style = "background-color:" + color;
            clusterdiv.attr("style", style)
                      .attr("label", label)
                      .text(label);
        }
    }
}

function displayMainData() {
    var clusters = clustering.getClusters();
    if (clustering) {
	circles = mainDataSvg.selectAll("circle")
		.data(mainData).enter()
			.append("circle")
				.attr("cx", function(d){return proj(getMainDataXY(d))[0];})
				.attr("cy", function(d){return proj(getMainDataXY(d))[1];})
				.attr("r", 	function(d){
                                    var point = currentPoints[d['index']];
                                    return mainDataScale(getFilter2Field(d));
                                })
				.attr("id", function(d){return "id" + d.id;})
                                .attr("class", function(d) {
                                    var point = currentPoints[d['index']];
                                    return "group" + point.group;	})
				.style("fill", function(d){ 
                                    var point = currentPoints[d['index']];
                                    return colorScale(point.group);	})
		.on("mouseover", function(d){
			d3.select(this)
				.attr("stroke", "black")
				.attr("stroke-width", 1)
				.attr("fill-opacity", 1);
 
			tooltip
			    .style("left", (d3.event.pageX + 5) + "px")
			    .style("top", (d3.event.pageY - 5) + "px")
			    .transition().duration(300)
			    .style("opacity", 1)
			    .style("display", "block")
			updateDetails(d);
			})
		.on("mouseout", function(d){
			d3.select(this)
				.attr("stroke", "")
				.attr("fill-opacity", function(d){return 1;})
			tooltip.transition().duration(700).style("opacity", 0);
		});
    }
}
