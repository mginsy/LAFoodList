import { Marker } from 'google-maps-react';

export default class Restaurant{
    constructor(key, data){
        this.Addresses = data[key].Addresses
        this.Areas = data[key].Areas
        this.Categories = data[key].Categories
        this.Locations = data[key].Locations
        this.Name = data[key].Name
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

    createMapListText(){
        let catStr = this.Categories.toString().replaceAll(",",", ")
        return(
          <div>
            <div className = "row inMapRow">
              <p className='restaurant-text-big'>{this.Name}</p>
            </div>
            <div className = "row inMapRow">
              <p className='categories-text-small'>{catStr}</p>
            </div>
          </div>
        )
    }
}