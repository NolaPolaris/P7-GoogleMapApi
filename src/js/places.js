import $ from "jquery";
import { addMarker } from "./api.js";
import { Rating } from './rating.js';

export class Places {
  // fetch dans le constructeur (attention au function, privilégier )
  constructor(latitude, longitude, placeName, placeAddress) {
      
    //fetch url 
      // . then => après avoir récupérer les data, puis transformer en JSON, on construit à partir de ces données :
      this.placeName = placeName;
      this.address = placeAddress;
      this.ratings = [];
      this.location = { lat: parseFloat(latitude), lng: parseFloat(longitude)};
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
      let average = this.getAverage();

      //gestion du rating
      let starContainer = $("<div></div>").addClass("star-container");
      let reviewLenght = $("<span>"+this.ratings.length+" avis"+"</span>").addClass('reviewLength');
      let addReview = $("<span>"+"Ajouter un avis"+"</span>").addClass('btnAddReview');

      //affichage de la moyenne
      for (let i=0; i<5; i++){
        let star = $("<span></span>").addClass("fa fa-star");
        starContainer.append(star);
        if(i < average) {
          star.addClass("checked")
        }
      };

      if(average <= 0 || average == undefined){
        starContainer.append('<span>'+'Soyez le premier à donner votre avis !'+'</span>'+'<br/>', reviewLenght, addReview)
        console.log(average)
      }
      else{
        starContainer.append('<span>'+average+'/5'+'</span>', reviewLenght, addReview)
        console.log(average)
      }

      //affichage des différents block :
      let itemAdress = $("<span>" + this.address + "</span>");
      let itemInfo = $('<div></div>').addClass('itemInfo');
      itemInfo.append(itemName, itemAdress, starContainer );
      flexContainer.append(itemInfo, streetViewContainer);
      listItem.append(flexContainer);
      $("#col-list").append(listItem);
      $("#content").append(starContainer);
      
      //gestion des détails : avis + formulaire
    
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
          ratingDetails.removeClass('active').slideUp(300);
        } else if (formReview.hasClass('active')){
          formReview.removeClass('active').fadeOut(300);
        }
        else
          listItem.find(ratingDetails).addClass('active').slideDown(300);
      })

       //add review : affichage form + submit

      let formReview = $('<form></form>').addClass('formReview');
      let starBox = $('<div></div>').addClass('starBox');
      
      for (let i=0; i<5; i++){
        let star = $('<span></span>').addClass('fa fa-star');
        star.attr('data-id', i+1);
        starBox.append(star);
      };

      $('.starBox > .fa').on('click', function(){
          $(this).addClass('checked');
          let activeId = $(this).attr('data-id');
          let siblings = $(this).siblings();
          siblings.each(function(){
            if ($(this).attr('data-id') < activeId){
              $(this).addClass('checked');
            }
            else if( ($(this).attr('data-id') > activeId) && $(this).hasClass('checked')){
              $(this).removeClass('checked');
            }
          })

          if(formReview.hasClass('repeat')){
            formReview.removeClass('repeat')
            formReview.remove('.alert')
          }
      }) 
    
      listItem.append(formReview);

      //formulaire HTML

      let textArea = $('<textarea></textarea>');
      let submit = $('<input/>').attr('type', 'submit', 'value', 'envoyer');
      let userName =  $('<input/>')
        .attr({type: 'text',
              placeholder:'Votre nom',
              id:'userName'}
        );
      let alert = $('<p>' + 'Veuillez donner au moins une note !' +'</p>').addClass('alert'+' '+'overlay'); 
      let thx = $('<p>' + 'Merci pour vos retours !' +'</p>').addClass('thx'+' '+'overlay');
      formReview.append(starBox, userName, textArea, submit);
    
      formReview.on( "submit", function(event) {
        event.preventDefault();
        let stars = $('.starBox >.checked').length;
        // si aucune étoiles n'est cochée, on bloque l'envoi
        if(textArea.val().trim().length < 1 && stars < 1){
          if (formReview.hasClass('alert')){
            formReview.addClass('repeat');
          }else{
            formReview.prepend(alert);
            alert.fadeIn(100);
            formReview.addClass('alert')      
          }
          return; 
          }
       
        else{
          let formData = new Rating (stars, textArea.val())
          
          if(formReview.hasClass('repeat')){
            formReview.removeClass('repeat')
            alert.fadeOut(200)
          } else{
            alert.fadeOut(10)
            formReview
              .removeClass('repeat')
              .removeClass('alert')
              .remove(alert)
              .remove('.alert')
              .addClass('min')
              .prepend(thx)
              thx.fadeIn(100)
          }      
          
          $('.overlay').on( "click", function(){
            $(this).removeClass('active');
            $(this).remove(alert, thx);
            formReview.remove();
          });
        }
      });

      // gestion affichage alterné :
      listItem.find('.btnAddReview').on('click', function(e){
        if(ratingDetails.hasClass('active')){
          ratingDetails.slideUp(500).removeClass('active');
        }
        else if (formReview.hasClass('active')) {
          formReview.slideUp(500).removeClass('active');
        }
        else{      
          formReview.addClass('active').slideDown(500);
        }
 
      });   
    }

    //affichage du restaurant en haut de la liste 
    showDetails(){
      let id = '#'+ this.slug;
      if ($('.listItem').hasClass('selected')){
        $('.listItem').removeClass('selected');
        $(id).addClass('selected');
      }
      else{
        $(id).addClass('selected');
      }
      $('#col_list').append('.selected');
      $('.listItem > .close').on('click', function(){
        if ($('.listItem').hasClass('selected')){
          $('.listItem').removeClass('selected');
        }
      });
    }
  
  
}
