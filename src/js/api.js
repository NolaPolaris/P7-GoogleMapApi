import "regenerator-runtime/runtime";
import "core-js/stable"; // or more selective import, like "core-js/es/array"
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

async function reverseGeocoding (lat, lng) {
  let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key=AIzaSyBE5oclKCY3pLzMgRnCRlwbR1v8cCK6vlg'
  const response = await fetch(url)
  const json = await response.json();
  let address = json['results'][0]['formatted_address'];
  return address;
}

export function loadMap(coord) {

  map = new google.maps.Map(document.getElementById("map"), {
    center: coord,
    zoom: 15,
  });

  // map.addListener("center_changed", (mapsMouseEvent) => {
  //   let position = mapsMouseEvent.latLng.toJSON();
  //   let newCoord = { lat: position.coords.latitude, lng: position.coords.longitude }
  //   console.log(newCoord)
  //   console.log("center changed")
  // })
 
  // à remplacer par un click simple sur le button dédié dans le headr si possible

  // map.addListener("rightclick", (mapsMouseEvent) => {
  //   let contextMenu = $("#addForm"); 
  //   let position = mapsMouseEvent.latLng.toJSON();
  //   let lat = position["lat"];
  //   let lng = position['lng'];
  //   $("#lat").attr("value", lat);
  //   $("#lng").attr("value", lng);

  //   // find adress by latlng
  //   reverseGeocoding(lat, lng).then(address => $("#adress").val(address));

  //   function addPlace(lat, lng){
  //     let placeName = $('#name').val();
  //     let placeAddress = $('#adress').val();
  //     let place = new Places(lat, lng, placeName, placeAddress);
  //     place.getAverage();
  //     place.add();
  //     place.updateHTML();
  //     console.log(placeName)
  //   }
  
  //   contextMenu.addClass("active");
  //   contextMenu.fadeIn();

  //   let overlay =  $('<div></div>').addClass('overlay');
  //   let thx = $('<p>' + 'Votre restaurant a bien été ajouté !' +'</p>');
  //   let close = $('<div>'+'Fermer'+'</div>').addClass('btn'+' '+'close');
  //   contextMenu.append(overlay);
  //   contextMenu.on( "submit", function(event) {
  //     event.preventDefault();
  //     addPlace();
  //     overlay.fadeIn(300).append(thx, close);
  //     $( ".close" ).on( "click", function(){
  //       overlay.fadeOut(300);
  //       $( "form").removeClass('active');
  //     });
  //   });   

  // });
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

  const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h3 id="firstHeading" class="firstHeading">' + place.placeName + '</h3>' +
    '<div id="bodyContent">' +
    "<span>" + place.getAverage() + "/5</span>" + "<br/>"
    + "</div>"
    + "</div>";

  const infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  marker.addListener("mouseover", () => {
    infowindow.open(map, marker);
  });

  marker.addListener("mouseout", () => {
    infowindow.close(map, marker);
  });

  marker.addListener("click", () => {
    place.showDetails(); 
  });
  

}

export function addUserMarker(coord) {
  let userSvgMarker = {
    path:
      "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "red",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 5,
    anchor: new google.maps.Point(15, 30),
  };

  let userMarker = new google.maps.Marker({
    position: coord,
    icon: userSvgMarker,
    map: map,
  });

  let userContentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h3 id="firstHeading" class="firstHeading">' +"Here you are, fren" + '</h3>'
    + "</div>";

  let userInfoWindow = new google.maps.InfoWindow({
    content: userContentString
  });

  userMarker.addListener("mouseover", () => {
    userInfoWindow.open(map, userMarker);
  });

  userMarker.addListener("mouseout", () => {
    userInfoWindow.close(map, userMarker);
  });
  

}

export function loadPlaces(coord) {
  var centre = new google.maps.LatLng(coord.lat, coord.lng);
  let request = {
    query: 'restaurants',
    location: centre,
    radius: '500',
    fields: ['place_id'],
  };

let service = new google.maps.places.PlacesService(map);

  service.textSearch(request, function (results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var request = {
          placeId: results[i].place_id,
          fields: ['name', 'geometry.location.lat', 'geometry.location.lng', 'reviews', 'formatted_address']
        };

        service.getDetails(request, callback);
        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            let lat = results.geometry.location.lat();
            let lng = results.geometry.location.lng();
            let name = results.name;
            let address = results.formatted_address;
            let place = new Places(lat, lng, name, address);
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



      }
    }
});


}

