import $ from "jquery";
import { addMarker } from "./api.js";
import { Rating } from './rating.js';

export class Places {
  constructor(latitude, longitude, placeName) {
      this.placeName = placeName;
      this.address = null;
      this.ratings = [];
      this.location = { lat: latitude, lng: longitude };
      this.slug = this.slugify(this.placeName);
    };

    getAverage() { 
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let ratingsStarValue = new Array();
      if (this.ratings.length > 0){
        for (let i = 0; i < this.ratings.length; i++){
          // console.log(this.ratings[i].stars)
          let starValue = this.ratings[i].stars;
          ratingsStarValue.push(starValue);       
        }
        let sum = ratingsStarValue.reduce(reducer);
        let average = sum / ratingsStarValue.length;
        // console.log(average)
        return average;
      }
      else{
        return;
      }
     
    }

    add() {
      let marker = addMarker(this);
    }

    getStreetViewURL(){
      let url = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+this.location.lat+","+this.location.lng+"&heading=151.78&pitch=-0.76&key=AIzaSyBE5oclKCY3pLzMgRnCRlwbR1v8cCK6vlg";
      return url;
    }

    slugify(str){
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();
        // remove accents, swap ñ for n, etc
        let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        let to   = "aaaaeeeeiiiioooouuuunc------";
        for (let i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
    
        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes
    
        return str;
    }

    updateHTML(){
      let listItem = $("<div></div>").addClass("listItem");
      let close = $("<span></span>").addClass("close");
      let flexContainer = $("<div></div>").addClass("flexContainer");
      let itemId = this.slugify(this.placeName);
      listItem.attr('id', itemId);
      listItem.append(close);

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
      let reviewLenght = $("<span>"+this.ratings.length+" avis"+"</span>").addClass('reviewLength');
      let addReview = $("<span>"+"Ajouter un avis"+"</span>").addClass('btnAddReview');
      let star = $("<span></span>").addClass("star").css('width', starsNumber+'rem');
      starContainer.append(star, reviewLenght, addReview )


      let itemAdress = $("<span>" + this.address + "</span>");
      let itemInfo = $('<div></div>').addClass('itemInfo');
      itemInfo.append(itemName, itemAdress, starContainer );


      flexContainer.append(itemInfo, streetViewContainer);
      listItem.append(flexContainer);
      $("#col-list").append(listItem);
      $("#content").append(starContainer);
      
      //gestion des détails 
    
      let ratingDetails = $("<div></div>").addClass("ratingDetails");
     
      for (let i = 0; i < this.ratings.length; i++){
        let starsItems = $("<p>"+this.ratings[i].stars+"/5"+"</p>");
        let commentItems = $("<p>"+this.ratings[i].comment+"</p>");
        let ratingItem = $("<div></div>").addClass("ratingItems");
        ratingItem.append(starsItems, commentItems);
        ratingDetails.append(ratingItem);
      }
     
      listItem.append(ratingDetails);

      listItem.find('.reviewLength').on('click', function(e){
        if(ratingDetails.hasClass('active')){
          ratingDetails.removeClass('active').slideUp(100);
        } else
          listItem.find(ratingDetails).addClass('active').slideDown(100);
      })

       //add review : affichage form + submit

      let formReview = $('<form></form>').addClass('formReview');
      let textArea = $('<textarea></textarea>');
      let submit = $('<input/>').attr('type', 'submit', 'value', 'envoyer');
      listItem.append(formReview);
      formReview.append(textArea, submit);
      formReview.on( "submit", function(event) {
        event.preventDefault();
        addReview();
      });

      // gestion affichage alterné :
      listItem.find('.btnAddReview').on('click', function(e){
        if(ratingDetails.hasClass('active')){
          ratingDetails.slideUp(100).removeClass('active');
        }
        else if (formReview.hasClass('active')) {
          formReview.slideUp(100).removeClass('active');
         
        }
        else{      
          formReview.addClass('active').slideDown(100);
        }
 
      });   
    }

    //affichage du restaurant en haut de la liste 
    showDetails(){
      let id = '#'+ this.slug;
      let details = $('.ratingDetails');   
      if ($('.listItem').hasClass('selected')){
        $('.listItem').removeClass('selected');
        $(id).addClass('selected');
      }
      else{
        $(id).addClass('selected');
      }

      $('#col_list').append('.selected');
    }
  
  
}
