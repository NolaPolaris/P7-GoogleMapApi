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
      
    add() {
        addMarker(this);
    }

    updateHTML(){
      let listItem = $("<div></div>").addClass("listItem");
      let itemName = $("<h3>" + this.placeName + "</h3>");
      let starsNumber = this.ratings[0].stars;
      let starContainer = $("<div></div>").addClass("star-container");
      let starList ="";
      for (let i=0; i < starsNumber; i++){
        console.log(i);
        let star = $("<span></span>").addClass("star");
        starContainer.append(star)
      }
      starContainer.append(starList);
      console.log(starsNumber);
      let itemAdress = $("<span>" + this.address + "</span>");
      listItem.append(itemName);
      // listItem.append(itemRatings);
      listItem.append(itemAdress);
      listItem.append(starContainer);
      $("#col-list").append(listItem);
    }
  
}
