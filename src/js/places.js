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
      // ajouter une image liée via Street View Static
    };

    getAverage() {
      console.log("getAverage is call");
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

      //recuperer toutes les valeurs associees a la key stars dans l'array ratings
      //faire la somme puis la division par la lenght du array
    }

    add() {
      let marker = addMarker(this);
      let contentPopUp = $("<div>caca</div>");
      let contentString ='<div id="content">' +
      '<h1 id="firstHeading" class="firstHeading">' + this.placeName + '</h1>' +
      '<span class="pop-ratings"></span>'+
      "</div>";
      import('./popup.js')
      .then((module) => {
        let popup = new module.Popup(
          new google.maps.LatLng(this.lat, this.lng),
          contentPopUp[ 0 ]
        );
        popup.setMap(map);
      });

      marker.addListener("click", () => {
        popup.open(map, marker);
      });
    }

    getStreetViewURL(){
      let url = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+this.lat+","+this.lng+"&heading=151.78&pitch=-0.76&key=AIzaSyBE5oclKCY3pLzMgRnCRlwbR1v8cCK6vlg";
      return url;
    }

    updateHTML(){
      let listItem = $("<div></div>").addClass("listItem");
      let popUp = $("<div></div>").addClass("popUp");
      let streetViewContainer = $("<div></div>").addClass("streetViewContainer");
      let url = this.getStreetViewURL();
      let streetView = $("<img/>").attr('src',url);
      streetViewContainer.append(streetView);
      let itemName = $("<h3>" + this.placeName + "</h3>");
      let starsNumber = this.getAverage();
      let starContainer = $("<div></div>").addClass("star-container");
      let starList ="";
      let star = $("<span></span>").addClass("star").css('width', starsNumber+'rem');
      starContainer.append(star)
      // for (let i=0; i < starsNumber; i++){
      //   let star = $("<span></span>").addClass("star").css('width', starsNumber+'rem');
      //   starContainer.append(star)
      // }
      starContainer.append(starList);
      // console.log(starsNumber);
      let itemAdress = $("<span>" + this.address + "</span>");
      listItem.append(itemName);
      // listItem.append(itemRatings);
      listItem.append(itemAdress);
      listItem.append(starContainer);
      $(".pop-ratings").append(starContainer);
      $("#col-list").append(listItem);
      $("#content").append(starContainer);
    }
  
}
