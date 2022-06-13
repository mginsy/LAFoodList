import { Component }from 'react';
import * as React from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { Container } from "react-bootstrap";
import {useLocation} from 'react-router-dom';
import Restaurant from '../../Restaurant';


const data = require('../../restaurantData.json');

/*function reactHookHOC(Component) {
  return function WrappedComponent(props) {
    const location = useLocation();
    return <Component {...props} location={location} />;
  }
}*/

let classes = {};

for (let key in data){ // creates markers and filters categories
  let currentRestaurant = new Restaurant(key, data);

  let locations = currentRestaurant.Locations;

  for (let locationNum in locations){
    class RestaurantPage extends React.Component {

      render() {
      
        const mapStyles = {
          width: '50%',
          height: '50%',
        };

        let location = locations[locationNum]
        let locArrayStrings = location.split(",")
        let locArrayFloats = []
        for (let locNum in locArrayStrings){
          locArrayFloats.push(parseFloat(locArrayStrings[locNum]))
        }
      
        return (
    
          <div>
            <div className="row mapRow">
              <div className="column mapCol">
                <h4 className="test-text topMapPage">{currentRestaurant.Name}</h4>
                <div className="row">
                  <p className="test-text topMapPage">{currentRestaurant.Addresses[locationNum]}</p>
                  <p className="test-text topMapPage">{currentRestaurant.Areas[locationNum]}</p>
                  <p className="test-text topMapPage">{currentRestaurant.Price}</p>
                </div>
                <p className="test-text">Amazing curries, kabobs, and other Indian/Bangladeshi faire at a great price. It’s also great for a late night run!!</p>
                  <img 
                  src={require("../../photos/Biriyani-Kabob-House.jpg")}
                  className='img-fluid'
                  alt="loading..."
                  />
              </div>
              <div className ="column mapCol">
                <Map
                  google={this.props.google}
                  zoom={10}
                  style={mapStyles}
                  initialCenter={
                      {
                      lat: 34.0344189,
                      lng: -118.2321198
                      }
                  }
                  onClick={this.onMapClicked}
                >
                    <Marker
                      name={currentRestaurant.Name}
                      position={
                        {
                        lat: locArrayFloats[0],
                        lng: locArrayFloats[1]
                        }
                      }
                    />
                </Map>
              </div>
            </div>
          </div>
        );
      }
      }
      classes[currentRestaurant.Name + locationNum.toString()] = (GoogleApiWrapper({
        apiKey: 'GMAPSKEY'
      })(RestaurantPage))
  }
}

  

export default classes;

