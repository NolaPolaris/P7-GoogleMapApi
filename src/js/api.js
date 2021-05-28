import $ from "jquery";
import { Loader } from "@googlemaps/js-api-loader";
import { Places } from "./places";
// google.maps.InfoWindow
let map;
export const loader = new Loader({
    apiKey: "AIzaSyBE5oclKCY3pLzMgRnCRlwbR1v8cCK6vlg",
    version: "weekly",
    libraries: ["places"]
});

loader.load();

export function loadMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 48.866667, lng: 2.333333 },
        zoom: 12,
    });
}

export function addMarker(place) {
    const svgMarker = {
        path:
          "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "blue",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30),
      };

    let marker = new google.maps.Marker({
        position: place.location,
        icon: svgMarker,
        map: map,
    });

    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
    // let placeId = place.slugify(place.placeName);
    const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading">'+place.placeName+'</h1>' +
    '<div id="bodyContent">' +
    "<span>"+ place.getAverage() + "/5</span>"+"<br/>"
    // +'<a href=#'+placeId+">"
    + "</div>"
    + "</div>";

  const infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  
  marker.addListener("mouseover", () => {
    infowindow.open(map, marker);
  });
  
  marker.addListener("click", () => {
    place.showDetails();
  });

  marker.addListener("click", toggleBounce);
  return marker;
}



export function loadPlaces() {
    var request = {
        query: 'restaurant',
        fields: ['name', 'geometry'],
      };
    
      var service = new google.maps.places.PlacesService(map);
    
      service.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
          }
        }
      });
}

// //   TODO
// // Récupérer position utilisateurs

// // Récupérer données JSON et les mettre dans une class Restaurant/ Place
// // --> fonction getJSON 
// // --> fonction parse if data not JSON
// // --> create new Place from data
// // --> show in HTML
