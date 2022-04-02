var map = L.map('map').setView([48.72, 21.25], 13);
var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});
Stamen_Toner.addTo(map)

var marker = Array();
var buses_data = Array();
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
                
                var LamMarker = new L.Marker([buses_data[i]["Lat"], buses_data[i]["Lng"]],{icon: svgIcon}).on('click', function(e) {
                        alert(`Delayed by ${buses_data[i]["Delay"]} seconds`);
                    });
                marker.push(LamMarker);
                
                
                map.addLayer(marker[i]);
        }
}
var interval = setInterval(displayData,5000)