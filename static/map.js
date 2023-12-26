var map = L.map('map').setView([48.72, 21.25], 13);
var OSM_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
OSM_Mapnik.addTo(map)

var marker = Array();
var buses_data = Array();
var route_showed = null;
var route_object = null;
var current_route = "";


function createBusIcon(feature, layer) {
    if (feature.properties.highway == "bus_stop") {
        layer.bindPopup(feature.properties.name);
	    busIcon = L.divIcon({
            html: '<i class="fa-solid fa-bus-simple"></i>',
            iconSize: [20, 20],
            className: 'myBusIcon'
        });
        layer.setIcon(busIcon);
    };
}

function busFilter(feature){
    ans = 1;
    if (feature.properties.highway == "traffic_signals" || feature.properties.highway == "crossing" || feature.properties.highway == "stop" || feature.properties.highway == "motorway_junction" || feature.properties.highway == "give_way" || feature.properties.railway == "tram_level_crossing" || feature.properties.public_transport == "stop_position" || feature.properties.junction == "yes" || feature.properties.traffic_calming == "rumble_strip") {
        ans = 0;
    };
    return ans;
}

function displayData(){
        $.ajax({
                url: '/static/data.json',
                async: false,
                dataType: 'json',
                success: function (json) {
                        buses_data = json;
                }
        });
        for(i=0;i<marker.length;i++) {
                map.removeLayer(marker[i]);
        }
        marker = [];
        for (let i = 0; i < buses_data.length; i++) {
                var color = "#ffffff"
                if (Math.abs(buses_data[i]["Delay"])>30) {
                        color = "#ff0000"
                }
                else {
                        color = "#ffffff"
                }
                var svgIcon = L.divIcon({
                        html: `<svg height="30" width="30"><circle cx="50%" cy="50%" r="14" fill=${color} stroke="#000" stroke-width="2"/><text x="50%" y="50%" text-anchor="middle" stroke="#000" dy=".3em">${buses_data[i]["Line"]}</text></svg>`,
                        className: "",
                        iconSize: [30,30],
                        iconAnchor: [15,15],
                });
                var LamMarker = new L.Marker([buses_data[i]["Lat"], buses_data[i]["Lng"]],{icon: svgIcon})
                LamMarker.bindPopup(`Delayed by ${buses_data[i]["Delay"]} seconds ${buses_data[i]["Dir"]}`).openPopup()
                LamMarker.on("click", function(e) {
                        //console.log(route_showed, route_object, current_route)
                        current_route = null;
                        if (route_showed != null) {
                                map.removeLayer(route_object)
                                route_object = null;      
                        }
                        if (route_showed == buses_data[i]['Line']+buses_data[i]['Dir']){
                                route_showed = null;
                                return
                        }
                        $.ajax({
                                url: `/static/${buses_data[i]['Line']}${buses_data[i]['Dir']}.geojson`,
                                async: false,
                                dataType: 'json',
                                success: function (json) {
                                        current_route = L.geoJson(json, {filter: busFilter, onEachFeature: createBusIcon})
                                        }
                                });
                        if (current_route == null){
                                route_showed = null
                                return
                        }
                        route_showed = buses_data[i]['Line']+buses_data[i]['Dir'];
                        route_object = current_route.addTo(map);
                });
                marker.push(LamMarker);
                map.addLayer(marker[i]);
        }
}
var interval = setInterval(displayData,5000)
