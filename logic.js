// Marker size and Colors
function markerSize(mag){
    return mag * 5;
  }

function markerColor(mag){
    if (mag <=1) {
        return "#7CFC00";
    }
    else if (mag <= 2) {
        return "#bff273";
    }
    else if (mag <= 3){
        return "#ffe06b";
    }
    else if (mag <= 4) {
        return "#ffad1f";
    }
    else if (mag <= 5) {
        return "#e36100";
    }
    else {
        return "#ff0000"
    };
}


// Store API endppoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a Get request to the query URL and create an object
d3.json(queryUrl, function(data) {
    createFeatures(data.features);
    console.log(data.features);
})

// Define a function we want to run once for each feature in the features array
// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
// Give each feature a popup describing the place and time of the earthquake
function createFeatures(earthquakeData){
    var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + 
        "<p> Magnitude: " + feature.properties.mag + "</p>")
      } , 
      pointToLayer: function (feature, latlng){
        return new L.circleMarker(latlng, 
          {radius: markerSize(feature.properties.mag), 
          fillColor: markerColor(feature.properties.mag), 
          fillOpacity: 0.8,
          opacity: 1, 
          stroke: true,
          color: "black",
          weight: 0.8
          })
      }

  });
//   console.log(earthquakes);
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
    }


    function createMap(earthquakes) {

        // Define streetmap and darkmap layers
        var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.streets",
          accessToken: API_KEY
        });
      
        var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.dark",
          accessToken: API_KEY
        });
      
        // Define a baseMaps object to hold our base layers
        var baseMaps = {
          "Street Map": streetmap,
          "Dark Map": darkmap
        };
      
        // Create overlay object to hold our overlay layer
        var overlayMaps = {
          Earthquakes: earthquakes
        };
      
        // Create our map, giving it the streetmap and earthquakes layers to display on load
        var myMap = L.map("map", {
          center: [
            37.09, -95.71
          ],
          zoom: 5,
          layers: [streetmap, earthquakes]
        });
      
        // Create a layer control
        // Pass in our baseMaps and overlayMaps
        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(myMap);

        // create a legend
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function(){
            var div = L.DomUtil.create("div", "info legend");
            magnitude = [0,1,2,3,4,5];  
            div.innerHTML += '<b>Earthquake </b><br><b>Magnitude</b><br><hr>';  
            
            for (var i = 0; i < magnitude.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + markerColor(magnitude[i] + 1) + '"></i> ' +
                  magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
            }
            
          return div;    
        };
        
        // Adding legend to the map
        legend.addTo(myMap);
}
