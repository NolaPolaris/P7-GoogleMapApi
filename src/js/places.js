import $ from "jquery";
import { addMarker } from "./api.js";
import { Rating } from './rating.js';
export class Places {
  constructor(latitude, longitude, placeName) {
      this.placeName = placeName;
      this.address = null;
      this.ratings = new Array();
      this.location = { lat: latitude, lng: longitude }
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
        addMarker(this);
    }

    updateHTML(){
      let listItem = $("<div></div>").addClass("listItem");
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
      $("#col-list").append(listItem);
    }
  
}
