import '../css/style.css';
import * as mapApi from './api.js';
import './api.js';

import { Places } from './places.js';
import $ from "jquery";
import { Rating } from './rating';

// le JSON est loadé, mais il faut pouvoir stocker la liste des restaurant dans une list en mémoire. On crée donc une liste de places qu'on garde toujours en mémoire dans notre projet : 
let placesList = new Array;

mapApi.loader.loadCallback((e => {
    mapApi.loadMap();

    $.getJSON("places.json", function (data) {
        $.each(data, function (index, val) {
            let place = new Places(val.lat, val.long, val.restaurantName);
            place.address = val.address;
            val.ratings.forEach(element => {
                let rating = new Rating(element.stars, element.comment);
                place.ratings.push(rating);
            });
            placesList.push(place);
            console.log(place)
            place.getAverage();
            place.add();
            place.updateHTML();
        });
    });

    mapApi.loadPlaces();
    

}));



$(document).ready(function () {
    

});