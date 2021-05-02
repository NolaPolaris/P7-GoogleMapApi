import '../css/style.css';
import * as mapApi from './api.js';
import {Places} from './places.js';
import $ from "jquery";


mapApi.loader.loadCallback((e => {
    mapApi.loadMap();

    $.getJSON("places.json", function (data) {
        $.each(data, function (key, val) {
            console.log(val)
            let place = new Places(val.lat, val.long);
            place.placeName = val.restaurantName;
            place.address = val.address;
            // placesList.push(val);
            console.log(place)
            place.add();
            place.updateHTML();
        });
    });
}));

// let placesList = new Array;
$(document).ready(function () {
    
    // for (let i = 0; i <= placesList.length; i++) {
    //     console.log(placesList[i]);
    // }

});