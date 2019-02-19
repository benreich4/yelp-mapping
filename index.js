$(document).ready(function() {
	var mymap = L.map('mapid').setView([31.9686,-99.9018], 5);
	L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	    maxZoom: 18
	}).addTo(mymap);

	var processData = function(data) {
		var arr = $.csv.toArrays(data);
		$.each(arr, function(i) { addToMap(arr[i]); });
	};

	var onEachFeature =  function(feature, layer) {
		layer.bindPopup(feature.properties.popupContent)
	}

	var processTexas = function(data) {
		L.geoJSON(JSON.parse(data), {
			style: { "color": "black", "weight": 1, "fillOpacity": 0 }
		}).addTo(mymap);
	};

	var color = d3.scaleLinear()
	    .domain([1, 15])
	    .range(["gold", "red"]);


	var addToMap = function(arr) {
		var json = arr[1];
		var toAdd = { "type": "Feature", "geometry": JSON.parse(json), "properties": { "popupContent": "<div> " + arr[0] + ": " + arr[2] + "</div>" } };
		var lowOpacity = 0.2
		var maxOpacityAt = 10

		if (arr[2] != 0) {
			L.geoJSON(toAdd, {
				style: { "color": color(arr[2]), "weight": 0, "fillOpacity": 1 },
				onEachFeature: onEachFeature
			}).addTo(mymap);
		}
	};

	$.ajax({
		type: "GET",
		url: "zips.csv",
		dataType: "text",
		success: function(data) { processData(data); }
	});

	$.ajax({
		type: "GET",
		url: "texas.geojson",
		dataType: "text",
		success: function(data) { processTexas(data); }
	})


});