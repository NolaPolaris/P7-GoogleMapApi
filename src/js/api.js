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
    center: { lat: 48.866667, lng: 2.333333 },
    zoom: 12,
  });
}

// export function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//       center: { lat: 48.866667, lng: 2.333333 },
//       zoom: 12,
//   });

//   map.addListener('load', (event) => {
//     console.log('map is fully loaded');
// });
// }

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

  marker.addListener("click", toggleBounce);
  return marker;
}

export function loadPlaces() {
  // var centre = new google.maps.LatLng(48.866667,2.333333);
  var request = {
    query: 'restaurants',
    fields: ['name', 'geometry.location.lat', 'geometry.location.lng', 'place_id', 'rating'],
  };

  var service = new google.maps.places.PlacesService(map);

  service.textSearch(request, function (results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log(results);

      for (var i = 0; i < results.length; i++) {
        let lat = results[i].geometry.location.lat();
        let lng = results[i].geometry.location.lng();
        let placeName = results[i].name;
        let rating = results[i].rating;
        console.log(rating);
        // let placeId = results[i].place_id;
        // results[i].ratings.forEach(element => {
        //   let rating = new Rating(element.stars, element.comment);
        //   place.ratings.push(rating);
        // });
        let place = new Places(lat, lng, placeName);
        place.ratings.push(rating);
        console.log(place.ratings);
        place.add();
        place.updateHTML();


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

  // var request = {
  //   placeId: results[i].place_id,
  //   fields: ['name', 'rating', 'geometry.location.lat','geometry.location.lng']
  // };

  // service.getDetails(request, callback);
  // function callback(place, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //     console.log("getDetails success")
  //     let lat = place.geometry.location.lat();
  //     let lng = place.geometry.location.lng();
  //     console.log(lat);

  //   }
  // }

  // var request = {
  //   placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  //   fields: ['name', 'rating', 'formatted_phone_number', 'geometry']
  // };

  // service = new google.maps.places.PlacesService(map);
  // service.getDetails(request, callback);

  // function callback(place, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //     addMarker(place);
  //   }
  // }
}

