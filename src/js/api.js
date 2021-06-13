import $ from "jquery";
import { Loader } from "@googlemaps/js-api-loader";
import { Places } from "./places.js";
import { Rating } from './rating';
let map;

export const loader = new Loader({
  apiKey: "AIzaSyBE5oclKCY3pLzMgRnCRlwbR1v8cCK6vlg",
  version: "weekly",
  libraries: ["places"]
});

loader.load();

export function loadMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 48.582267066445866, lng: 7.743552772565216 },  
    zoom: 12,
  });

  map.addListener("rightclick", (mapsMouseEvent) => {
    let contextMenu = $("#addForm");
    let position = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
    console.log(position);
    contextMenu.toggleClass("active");
    // afficher lat lng
    // afficher formulaire pour ajouter une nouvelle place (pas de vérification, on créée juste une place par rapport aux données données dans le formulaire)
    // améliorer via Geocoding : à l'aide des lat lng, on cherche l'adresse correspondante. On ajoute ensuite la Place en elle-même. 

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



  
  // let placeId = place.slugify(place.placeName);
  const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading">' + place.placeName + '</h1>' +
    '<div id="bodyContent">' +
    "<span>" + place.getAverage() + "/5</span>" + "<br/>"
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

  // marker.addListener("click", toggleBounce);
  // return marker;
}

export function loadPlaces() {
  // var centre = new google.maps.LatLng(48.866667,2.333333);
  var request = {
    query: 'restaurants',
    fields: ['place_id'],
  };

var service = new google.maps.places.PlacesService(map);

  service.textSearch(request, function (results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var request = {
          placeId: results[i].place_id,
          fields: ['name', 'geometry.location.lat', 'geometry.location.lng', 'reviews']
        };

        service.getDetails(request, callback);
        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            let lat = results.geometry.location.lat();
            let lng = results.geometry.location.lng();
            let name = results.name;
            let place = new Places(lat, lng, name);
            for (var i = 0; i < results.reviews.length; i++){
              // console.log(results.reviews[i].text);
              let review = new Rating(results.reviews[i].rating, results.reviews[i].text);
              review.stars = results.reviews[i].rating;
              review.comment = results.reviews[i].text;
              place.ratings.push(review);
            }
            place.getAverage();
            place.add();
            place.updateHTML();
           
          }
        }



        // var request = {
        //   placeId: placeId,
        //   fields: ['name', 'rating']
        // };

        // service = new google.maps.places.PlacesService(map);
        // service.getDetails(request, callback);

        // function callback(place, status) {
        //   if (status == google.maps.places.PlacesServiceStatus.OK) {
        //     console.log("details");
        //     console.log(request.fields);
        //     let place = new Places(lat, lng, placeName);
        //     console.log(place);
        //     place.getAverage();
        //     place.add();
        //     place.updateHTML();
        //   }
        // }


      }
    }
});

}

