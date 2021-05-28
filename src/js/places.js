import $ from "jquery";
import { addMarker } from "./api.js";
import { Rating } from './rating.js';
// import { Popup } from './popup.js';
export class Places {
  constructor(latitude, longitude, placeName) {
      this.placeName = placeName;
      this.address = null;
      this.ratings = new Array();
      this.location = { lat: latitude, lng: longitude };
      this.slug = this.slugify(this.placeName);
      // ajouter une image liée via Street View Static
    };

    getAverage() {
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let ratingsStarValue = new Array();
      
      for (let i = 0; i < this.ratings.length; i++){
        console.log(this.ratings[i].stars)
        let starValue = this.ratings[i].stars;
        ratingsStarValue.push(starValue);       
      }
      let sum = ratingsStarValue.reduce(reducer);
      let average = sum / ratingsStarValue.length;
      console.log(average)
      return average;
    }

    add() {
      let marker = addMarker(this);
      // marker.click(function(){
      //   marker.addClass("marker");
      // })
    }

    getStreetViewURL(){
      let url = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+this.location.lat+","+this.location.lng+"&heading=151.78&pitch=-0.76&key=AIzaSyBE5oclKCY3pLzMgRnCRlwbR1v8cCK6vlg";
      return url;
    }

    slugify(str){
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();
        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
    
        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes
    
        return str;
    }

    updateHTML(){
      let listItem = $("<div></div>").addClass("listItem");
      let itemId = this.slugify(this.placeName);
      listItem.attr('id', itemId);
      //gestion de l'image
      let streetViewContainer = $("<div></div>").addClass("streetViewContainer");
      let url = this.getStreetViewURL();
      let streetView = $("<img/>").attr('src',url);
      streetViewContainer.append(streetView);
      
      //gestion des infos principales
      let itemName = $("<h3>" + this.placeName + "</h3>");
      let starsNumber = this.getAverage();

      //gestion du rating
      let starContainer = $("<div></div>").addClass("star-container");
      let starList ="";
      let star = $("<span></span>").addClass("star").css('width', starsNumber+'rem');
      starContainer.append(star)

      starContainer.append(starList);
      let itemAdress = $("<span>" + this.address + "</span>");
      listItem.append(itemName);
      listItem.append(itemAdress);
      listItem.append(starContainer);
      listItem.append(streetViewContainer);

      $(".pop-ratings").append(starContainer);
      $("#col-list").append(listItem);
      $("#content").append(starContainer);
      //gestion des détails
     
      let ratingDetails = $("<div></div>").addClass("ratingDetails");
      let ratingItem = $("<div></div>").addClass("ratingItems");
      for (let i = 0; i < this.ratings.length; i++){
        let starsItems = $("<span>"+this.ratings[i].stars+"</span>");
        let commentItems = $("<span>"+this.ratings[i].comment+"</span>");
        ratingItem.append(starsItems);
        ratingItem.append(commentItems);
      }
      ratingDetails.append(ratingItem);
      listItem.append(ratingDetails);  
    }

    showDetails(){
      console.log(this.slug);
      let id = '#'+ this.slug;
      let details = $('.ratingDetails');
      $(id).find(details).slideDown(100);
    }
  
}
