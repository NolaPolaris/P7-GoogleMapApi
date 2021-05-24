import '../css/style.css';
import * as mapApi from './api.js';
import {Places} from './places.js';
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
                console.log("Ratings Class param");
                console.log(rating.stars, rating.comment);
                place.ratings.push(rating);
                console.log("Voici le contenu de place.ratings")
                console.log(place.ratings)
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
    
    // for (let i = 0; i <= placesList.length; i++) {
    //     console.log(placesList[i]);
    // }

});