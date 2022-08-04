import { Marker } from 'google-maps-react';
import {Link} from 'react-router-dom';

const showCatsSet = new Set(["American","Asian","Asian Fusion","BBQ","Bakery","Bars","Boba","Burgers","Chinese","Coffee","Cookies","Deli","Dessert","Dumplings","Filipino","French","Fried Chicken","Ice Cream","Indian","Italian","Japanese","Jewish","KBBQ","Kebab","Korean","Latino","Classic LA", "Innovative","Life Changing","Loud","Matcha","Mediterranean","Mexican","Middle Eastern","Noodles","Peruvian","Pizza","Ramen","Sandwiches","Seafood","Soup","Spicy","Steakhouse","Sushi","Tacos","Thai","Warm Dessert"]);
const vSet = new Set(["Vegan Options","Vegetarian Options"])
const descs = require('./restaurantDescs.json');

export default class Restaurant{
    constructor(restObj, currentArea){
        this.Addresses = restObj.Addresses
        this.Areas = restObj.Areas
        this.Categories = restObj.Categories
        this.Locations = restObj.Locations
        this.Name = restObj.Name
        this.Price = restObj.Price
        this.Description = descs[restObj.Name]
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
        let lastCatName = []
        for (let catNum in this.Categories){
          let cat = this.Categories[catNum]
          if (showCatsSet.has(cat)){
            catArr.push(
              <Link value={cat} onClick={handleCategoryChangeClick(cat)} to="#"><p className='categories-text-small'>{cat + ", "}</p></Link>
            )
            lastCatName = [cat,cat]
          }
          if (vSet.has(cat)){
            let showCat = ""
            if (cat === "Vegan Options"){
              showCat = "VE"
            }
            else{
              showCat = "V"
            }
            catArr.push(
              <Link value={cat} onClick={handleCategoryChangeClick(cat)} to="#"><p className='categories-text-small'>{showCat + ", "}</p></Link>
            )
            lastCatName = [cat,showCat]
          }
        }
        let newVal = lastCatName[0]
        let newShow = lastCatName[1]
        catArr.splice(catArr.length-1,1,<Link value={newVal} onClick={handleCategoryChangeClick(newVal)} to="#"><p className='categories-text-small'>{newShow}</p></Link>)
        
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
      let lastCatName = []
      for (let catNum in this.Categories){
        let cat = this.Categories[catNum]
        if (showCatsSet.has(cat)){
          catArr.push(
            <Link value={cat} onClick={handleCategoryChangeClick(cat)} to="#"><p className='categories-text-small'>{cat + ", "}</p></Link>
          )
          lastCatName = [cat,cat]
        }
        if (vSet.has(cat)){
          let showCat = ""
          if (cat === "Vegan Options"){
            showCat = "VE"
          }
          else{
            showCat = "V"
          }
          catArr.push(
            <Link value={cat} onClick={handleCategoryChangeClick(cat)} to="#"><p className='categories-text-small'>{showCat + ", "}</p></Link>
          )
          lastCatName = [cat,showCat]
        }
      }
      let newVal = lastCatName[0]
      let newShow = lastCatName[1]
      catArr.splice(catArr.length-1,1,<Link value={newVal} onClick={handleCategoryChangeClick(newVal)} to="#"><p className='categories-text-small'>{newShow}</p></Link>)
      
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