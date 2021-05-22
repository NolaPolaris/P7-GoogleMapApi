import $ from "jquery";
import { addMarker } from "./api.js";


export class Rating {
  constructor(stars, comment){
    this.stars = stars;
    this.comment = comment;
  }

  getAverage() {
    
    //recuperer toutes les valeurs associees a la key stars dans l'array ratings
    //faire la somme puis la division par la lenght du array
  }

}

