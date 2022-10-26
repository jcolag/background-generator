window.onload = function() {
  var citiesJson = "[{&#34;name&#34;:&#34;Alexandria&#34;,&#34;adminCode&#34;:&#34;06&#34;,&#34;country&#34;:&#34;EG&#34;,&#34;latitude&#34;:31.20176,&#34;longitude&#34;:29.91582,&#34;distance&#34;:&#34;48.332km&#34;},{&#34;name&#34;:&#34;Kafr ad Dawwār&#34;,&#34;adminCode&#34;:&#34;03&#34;,&#34;country&#34;:&#34;EG&#34;,&#34;latitude&#34;:31.13379,&#34;longitude&#34;:30.12969,&#34;distance&#34;:&#34;63.698km&#34;},{&#34;name&#34;:&#34;Idkū&#34;,&#34;adminCode&#34;:&#34;03&#34;,&#34;country&#34;:&#34;EG&#34;,&#34;latitude&#34;:31.3073,&#34;longitude&#34;:30.2981,&#34;distance&#34;:&#34;64.625km&#34;},{&#34;name&#34;:&#34;Rosetta&#34;,&#34;adminCode&#34;:&#34;03&#34;,&#34;country&#34;:&#34;EG&#34;,&#34;latitude&#34;:31.39951,&#34;longitude&#34;:30.41718,&#34;distance&#34;:&#34;71.964km&#34;},{&#34;name&#34;:&#34;Abū al Maţāmīr&#34;,&#34;adminCode&#34;:&#34;03&#34;,&#34;country&#34;:&#34;EG&#34;,&#34;latitude&#34;:30.91018,&#34;longitude&#34;:30.17438,&#34;distance&#34;:&#34;84.831km&#34;}]"
    .replace(/&#34;/g, '"');
  var cities = JSON.parse(citiesJson);
  var map = L
    .map('map')
    .setView([32,30], 13);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiamNvbGFnIiwiYSI6ImNrN2NlMzFpdDAwMXEzcXBpbTZ4NWVvOHAifQ.G16Z_PxmvCPdomh7cXUcUA'
  }).addTo(map);
  var marker = L.marker([32,30])
    .addTo(map)
    .bindPopup('32N 30E')
    .openPopup();
  var markers = [marker];
  for (var i=0; i<cities.length; i++) {
    var city = cities[i];
    var circle = L.circle([city.latitude, city.longitude], {
      color: '#b780a0',
      fillColor: '#95557a',
      fillOpacity: 0.5,
      radius: 100 * Number(city.distance.replace('km', '')),
    }).addTo(map);
    var clat = Math.abs(city.latitude).toString() + (
      city.latitude < 0 ? 'S' : 'N'
    );
    var clon = Math.abs(city.longitude).toString() + (
      city.longitude < 0 ? 'W' : 'E'
    );
    circle.bindPopup(`${city.name}<br>${clat} ${clon}`);
    markers.push(circle);
  }
  var group = L.featureGroup(markers);
  map.fitBounds(group.getBounds());
}

