import * as React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import {  Col, Row } from "react-bootstrap";
import {useLocation, useParams} from 'react-router-dom';
import Restaurant from '../../Restaurant';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import googleMapStyles from "../mapStyles";



const data = require('../../restaurantData2.json');
const otherData = require('../../otherData.json');

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

for (let areaNum in otherData["totAreas"]){
  let currentArea = otherData["totAreas"][areaNum]
  for (let restNum in data[currentArea]["restaurants"]){

  let currentRestaurant = new Restaurant(data[currentArea]["restaurants"][restNum], currentArea)
  console.log(currentRestaurant.Name)

  
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

        let location = currentRestaurant.Locations[currentRestaurant.locationNum]
        let locArrayStrings = location.split(",")
        let locArrayFloats = []
        for (let locNum in locArrayStrings){
          locArrayFloats.push(parseFloat(locArrayStrings[locNum]))
        }
      
        return (
          <motion.div className="bigNoScrollContainer"
            key={`${currentRestaurant.Name + currentRestaurant.locationNum.toString()}Key`}
            initial={{opacity: 0}}
            exit={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 1}}}>
            <Row style={{height:this.state.screenHeight-86}}>
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
                      <p className="col restLocText">{currentRestaurant.Addresses[currentRestaurant.locationNum]}</p>
                      <p className="col test-text">{currentRestaurant.Areas[currentRestaurant.locationNum]}</p>
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
                        zoom={13}
                        styles={this.props.mapStyle}
                        initialCenter={
                            {
                            lat: locArrayFloats[0],
                            lng: locArrayFloats[1]
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

      RestaurantPage.defaultProps = googleMapStyles;

      classes[currentRestaurant.Name + currentRestaurant.locationNum.toString()] = (GoogleApiWrapper({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      })(withRouter(RestaurantPage)))
      //classes[currentRestaurant.Name + locationNum.toString()] = RestaurantPage;
  }
}

  

export default classes;

