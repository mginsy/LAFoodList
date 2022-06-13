import { Marker } from 'google-maps-react';
import {Link, Router, BrowserRouter, MemoryRouter} from 'react-router-dom';

export default class Restaurant{
    constructor(key, data){
        this.Addresses = data[key].Addresses
        this.Areas = data[key].Areas
        this.Categories = data[key].Categories
        this.Locations = data[key].Locations
        this.Name = data[key].Name
        this.Price = data[key].Price
    }

    createPath(locationNumber){
        if(!this.Name) return
        return "/" + this.Name.replaceAll(" ","-") + locationNumber
    }

    createMarker(locationNum, location, markerList, onMarkerClick){
        let locArrayStrings = location.split(",")
        let locArrayFloats = []
        for (let locNum in locArrayStrings){
          locArrayFloats.push(parseFloat(locArrayStrings[locNum]))
        }
        markerList.push( 
          <Marker
            name={this.Name}
            locationNumber = {locationNum.toString()}
            position={
              {
              lat: locArrayFloats[0],
              lng: locArrayFloats[1]
              }
            }
            onClick={onMarkerClick}
            />
        )
        return markerList;
    }

    createMapListText(locationNum){
        let catStr = this.Categories.toString().replaceAll(",",", ")
        return(
          <div className="fullMapRestaurantText">
            <div className = "inMapRowText">
              <div className = "restLinkMoney">
                  <Link className='restaurant-text-big' to={{
                      pathname: this.createPath(locationNum),
                      }} >{this.Name}
                  </Link>
                  <p className='dollar-text-med'>{this.Price}</p>
              </div>
              <p className='categories-text-small'>{catStr}</p>
            </div>
          </div>
        )
    }

    fitsPrice(gle,price){
      if(gle==="" || price===""){
        return true;
      }
      if(gle==="≤"){
        return this.Price <= price;
      }
      else if (gle==="≥"){
        return this.Price >= price;
      }
      else{
        return this.Price === price;
      }
    }
}