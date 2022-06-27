import { Marker } from 'google-maps-react';
import {Link} from 'react-router-dom';

export default class Restaurant{
    constructor(restObj, currentArea){
        this.Addresses = restObj.Addresses
        this.Areas = restObj.Areas
        this.Categories = restObj.Categories
        this.Locations = restObj.Locations
        this.Name = restObj.Name
        this.Price = restObj.Price
        this.Description = restObj.Description
        this.locationNum = restObj.Areas.indexOf(currentArea)
        this.Picture = <img 
                        src={require(`./photos/${restObj.Name.replaceAll("!","").replaceAll(" ","-")}.jpg`)}
                        className='img-fluid listPic'
                        alt="cooking..."
                        />
    }

    createPath(){
        if(!this.Name) return
        return "/" + this.Name.replaceAll(" ","-") + this.locationNum
    }

    createMarker(onMarkerClick){
        let locArrayStrings = this.Locations[this.locationNum].split(",")
        let locArrayFloats = []
        for (let locNum in locArrayStrings){
          locArrayFloats.push(parseFloat(locArrayStrings[locNum]))
        }
        return( <Marker
            name={this.Name}
            locationNumber = {this.locationNum.toString()}
            position={
              {
              lat: locArrayFloats[0],
              lng: locArrayFloats[1]
              }
            }
            onClick={onMarkerClick}
            />)
    }

    createMapListText(handleCategoryChangeClick, category, area, gle, price){
        let catArr = []
        for (let catNum in this.Categories){
          let cat = this.Categories[catNum]
          let catName = (catNum != this.Categories.length-1 ? cat + ", " : cat)
          catArr.push(
            <Link value={cat} onClick={handleCategoryChangeClick(cat)} to="#"><p className='categories-text-small'>{catName}</p></Link>
          )
        }
        return(
          <div className="fullMapRestaurantText">
            <div className = "inMapRowText">
              <div className = "restLinkMoney">
                  <Link className='restaurant-text-big' to={{
                      pathname: this.createPath()
                      }}
                      state={{Category: category, Area:area, Gle:gle, Price:price, Page:"/Map"}} >{this.Name}
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
    
    createListListText(handleCategoryChangeClick, category, area, gle, price){
      let catArr = []
      for (let catNum in this.Categories){
        let cat = this.Categories[catNum]
        let catName = (catNum != this.Categories.length-1 ? cat + ", " : cat)
        catArr.push(
          <Link value={cat} onClick={handleCategoryChangeClick(cat)}  to="#"><p className='categories-text-small'>{catName}</p></Link>
        )
      }
      return(
        <div className="fullListRestaurantText">
          <div className = "inMapRowText">
            <div className = "restLinkMoney">
                <Link className='restaurant-text-big' to={{
                      pathname: this.createPath()
                      }} 
                      state={{Category: category, Area:area, Gle:gle, Price:price, Page:"/List"}}>{this.Name}
                </Link>
                <p className='dollar-text-med'>{this.Price}</p>
            </div>
            <div className = "categoryContainer">
              {catArr}
            </div>
          </div>
          <Link className="listPic" to={{
              pathname: this.createPath()
              }} 
              state={{Category: category, Area:area, Gle:gle, Price:price, Page:"/List"}}>{this.Picture}
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