import $ from "jquery";
import { addMarker } from "./api.js";

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
      // let itemRatings = $("span>" + this.ratings.stars + "</span>");
      let itemAdress = $("<span>" + this.address + "</span>");
      listItem.append(itemName);
      // listItem.append(itemRatings);
      listItem.append(itemAdress);
      $("#col-list").append(listItem);
    }
  
}