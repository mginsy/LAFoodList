import { width } from '@mui/system';
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
        this.Description = data[key].Description
        this.Picture = <img 
                        src={require(`./photos/${data[key].Name.replaceAll("!","").replaceAll(" ","-")}.jpg`)}
                        className='img-fluid listPic'
                        alt="loading..."
                        />
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

    createMapListText(locationNum, handleCategoryChangeClick){
        let catStr = this.Categories.toString().replaceAll(",",", ")
        let catArr = []
        for (let catNum in this.Categories){
          let cat = this.Categories[catNum]
          let catName = (catNum != this.Categories.length-1 ? cat + ", " : cat)
          catArr.push(
            <Link value={cat} onClick={handleCategoryChangeClick(cat)} ><p className='categories-text-small'>{catName}</p></Link>
          )
        }
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
              <div className = "categoryContainer">
                {catArr}
              </div>
            </div>
          </div>
        )
    }
    
    createListListText(locationNum, handleCategoryChangeClick){
      let catStr = this.Categories.toString().replaceAll(",",", ")
      let catArr = []
      for (let catNum in this.Categories){
        let cat = this.Categories[catNum]
        let catName = (catNum != this.Categories.length-1 ? cat + ", " : cat)
        catArr.push(
          <Link value={cat} onClick={handleCategoryChangeClick(cat)} ><p className='categories-text-small'>{catName}</p></Link>
        )
      }
      return(
        <div className="fullListRestaurantText">
          <div className = "inMapRowText">
            <div className = "restLinkMoney">
                <Link className='restaurant-text-big' to={{
                    pathname: this.createPath(locationNum),
                    }} >{this.Name}
                </Link>
                <p className='dollar-text-med'>{this.Price}</p>
            </div>
            <div className = "categoryContainer">
              {catArr}
            </div>
          </div>
          <Link className="listPic" to={{
              pathname: this.createPath(locationNum),
              }} >{this.Picture}
          </Link>
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