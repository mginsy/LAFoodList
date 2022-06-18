import { Component }from 'react';
import * as React from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { Container } from "react-bootstrap";
import {useLocation} from 'react-router-dom';
import Restaurant from '../../Restaurant';
import {Link} from 'react-router-dom';


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
      
        /*const mapStyles = {
          width: '50%',
          height: '50%',
          position:'relative !important'
        };*/

        let location = locations[locationNum]
        let locArrayStrings = location.split(",")
        let locArrayFloats = []
        for (let locNum in locArrayStrings){
          locArrayFloats.push(parseFloat(locArrayStrings[locNum]))
        }
      
        return (
    
          <div>
            <div className="row mapRow">
              <div className="column mapCol bigListCol">
                <Link className='recommend-text-big'>Back</Link>
                <h4 className="test-text">{currentRestaurant.Name}</h4>
                <div className="row locRestpage">
                  <p className="col test-text">{currentRestaurant.Addresses[locationNum]}</p>
                  <p className="col test-text">{currentRestaurant.Areas[locationNum]}</p>
                </div>
                  <p className="test-text">{currentRestaurant.Description}</p>
                  {currentRestaurant.Picture}
              </div>
              <div className ="column mapCol">
                <p className="test-text priceRestPage">{currentRestaurant.Price}</p>
                <div className="googleMapRestaurant">
                  <Map
                    google={this.props.google}
                    zoom={10}
                    
                    //style={mapStyles}
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
          </div>
        );
      }
      }
      classes[currentRestaurant.Name + locationNum.toString()] = (GoogleApiWrapper({
        apiKey: 'AIzaSyD7PF3dtTMKX_0e045Ez3nvc_X5-c8so9I'
      })(RestaurantPage))
  }
}

  

export default classes;

