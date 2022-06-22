import { Component }from 'react';
import * as React from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { Container, Col, Row } from "react-bootstrap";
import {useLocation, useParams} from 'react-router-dom';
import Restaurant from '../../Restaurant';
import {Link} from 'react-router-dom';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import {RemoveScrollBar} from 'react-remove-scroll-bar';
import {motion} from 'framer-motion'



const data = require('../../restaurantData.json');

/*function reactHookHOC(Component) {
  return function WrappedComponent(props) {
    const location = useLocation();
    return <Component {...props} location={location} />;
  }
}*/

const withRouter = WrappedComponent => props => {
  const params = useParams();
  const location = useLocation();
  // etc... other react-router-dom v6 hooks

  return (
    <WrappedComponent
      {...props}
      params={params}
      locState={(typeof(location.state) != "undefined" && location.state != null ? location.state : "")}

      // etc...
    />
  );
};

let classes = {};

for (let key in data){ // creates markers and filters categories
  let currentRestaurant = new Restaurant(key, data);

  let locations = currentRestaurant.Locations;

  for (let locationNum in locations){
    class RestaurantPage extends React.Component {

      state = {
        screenWidth: 0,
        screenHeight: 0,
      };

      componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
      }
    
      resize() {
          this.setState({screenWidth: window.innerWidth,
                        screenHeight: window.innerHeight});
      }

      render() {

        let location = locations[locationNum]
        let locArrayStrings = location.split(",")
        let locArrayFloats = []
        for (let locNum in locArrayStrings){
          locArrayFloats.push(parseFloat(locArrayStrings[locNum]))
        }
      
        return (
          <motion.div className="bigNoScrollContainer"
            key={`${currentRestaurant.Name + locationNum.toString()}Key`}
            initial={{opacity: 0}}
            exit={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 1}}}>
            <Row style={{height:this.state.screenHeight}}>
              <Col className="mapCol">
                <Row>
                  <Col>
                    <Link className='recommend-text-big back-text' to={{pathname: (typeof(this.props.locState.Page) != "undefined" ? this.props.locState.Page : "/")}}
                      state={{ 
                        Category: (typeof(this.props.locState.Category) != "undefined" ? this.props.locState.Category : ""), 
                        Area:(typeof(this.props.locState.Area) != "undefined" ? this.props.locState.Area : ""), 
                        Gle:(typeof(this.props.locState.Gle) != "undefined" ? this.props.locState.Gle : ""), 
                        Price:(typeof(this.props.locState.Price) != "undefined" ? this.props.locState.Price : "")}}>Back</Link>
                  </Col>   
                  <Col xs={10}>
                    
                  </Col>   
                </Row>
                <Row>
                  <Col></Col>
                  <Col xs={10} className="restInfo">
                    <h4 className="restTitleText">{currentRestaurant.Name}</h4>
                    <div className="row locRestpage">
                      <p className="col restLocText">{currentRestaurant.Addresses[locationNum]}</p>
                      <p className="col test-text">{currentRestaurant.Areas[locationNum]}</p>
                    </div>
                    <p className="test-text">{currentRestaurant.Description}</p>
                    <Row>
                      <Col></Col>
                      <Col xs={10}>{currentRestaurant.Picture}</Col>
                      <Col></Col>
                    </Row> 
                  </Col>
                  <Col></Col>
                </Row>
              </Col>
              <Col className="mapCol">
                <Row>
                  <Col xs={10}>

                  </Col>   
                  <Col>
                    <p className="price-text">{currentRestaurant.Price}</p>
                  </Col>   
                </Row>
                <Row className = "paddingRow">

                </Row>
                <Row className="mapRow">
                  <Col xs={11}>
                    <Map
                        google={this.props.google}
                        zoom={10}
                        initialCenter={
                            {
                            lat: 34.0344189,
                            lng: -118.2321198
                            }
                        }
                        onClick={this.onMapClicked}
                        className={"map"}
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
                    </Col>
                    <Col>
        
                    </Col>   
                  </Row>
                </Col>
              </Row>
            </motion.div>
          );
        }
      }
      classes[currentRestaurant.Name + locationNum.toString()] = (GoogleApiWrapper({
        apiKey: 'GMAPSKEY'
      })(withRouter(RestaurantPage)))
      //classes[currentRestaurant.Name + locationNum.toString()] = RestaurantPage;
  }
}

  

export default classes;

