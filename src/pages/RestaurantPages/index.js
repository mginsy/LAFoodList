import * as React from 'react';
import {Fragment} from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import {  Col, Row } from "react-bootstrap";
import {useLocation, useParams} from 'react-router-dom';
import Restaurant from '../../Restaurant';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import googleMapStyles from "../mapStyles";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';



const data = require('../../restaurantData2.json');
const otherData = require('../../otherData.json');

const StyledButton = styled(Button)({
  textTransform: 'none',
  color: '#5E454B',
  backgroundColor: '#D8B384',
  borderColor: '#D8B384',
  '&:hover': {
    textTransform: 'none',
    color: '#5E454B',
    backgroundColor: '#cfa978',
    borderColor: '#cfa978',
  },
});

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
        console.log(this.state.screenHeight)
        return (
          <motion.div className="bigNoScrollContainer"
            key={`${currentRestaurant.Name + currentRestaurant.locationNum.toString()}Key`}
            initial={{opacity: 0}}
            exit={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 1}}}>
            <Row style={{height:this.state.screenHeight-86}}>
              <Col className="mapCol">
                <Row>
                  <Col style={{paddingRight: this.state.screenWidth/2*.85}}>
                    <StyledButton
                        component={Link}
                        size="large"
                        to={{pathname: (typeof(this.props.locState.Page) != "undefined" ? this.props.locState.Page : "/map")}}
                        state={{ 
                          Category: (typeof(this.props.locState.Category) != "undefined" ? this.props.locState.Category : ""), 
                          Area:(typeof(this.props.locState.Area) != "undefined" ? this.props.locState.Area : ""), 
                          Gle:(typeof(this.props.locState.Gle) != "undefined" ? this.props.locState.Gle : ""), 
                          Price:(typeof(this.props.locState.Price) != "undefined" ? this.props.locState.Price : "")}}
                        loadingIndicator="Loading…"
                        variant="outlined"
                        style={{
                                fontStyle: 'bold',
                                fontSize: 16}}>
                        Back
                    </StyledButton>
                  </Col> 
                </Row>
                <Row className="bigRestInfo" style={{minHeight:this.state.screenHeight-120}}>
                  <Col xs={10} className="restInfo">
                    <h4 className="restTitleText" style={{backgroundColor:"rgba(185, 211, 196, .5)", paddingTop:'.5vh', paddingBottom:'.5vh', paddingLeft:'.5vw', paddingRight:'.5vw', borderRadius: '10px', width: 'max-content',display:'inline-block',textAlign: 'center'}}>{currentRestaurant.Name}</h4>
                    <Row className="locRestpage">
                      <Col xs={5}>
                        <p className="test-text" style={{backgroundColor:"rgba(185, 211, 196, .5)", paddingTop:'.2vh', paddingBottom:'.2vh', paddingLeft:'.2vw', paddingRight:'.2vw', borderRadius: '10px', width: 'max-content',display:'inline-block',textAlign: 'center'}}>{currentRestaurant.Areas[currentRestaurant.locationNum]}</p>
                      </Col>
                      <Col xs={5}>
                        <p className="price-text" style={{backgroundColor:"rgba(185, 211, 196, .5)", paddingTop:'.2vh', paddingBottom:'.2vh', paddingLeft:'.2vw', paddingRight:'.2vw', borderRadius: '10px', width: 'max-content',display:'inline-block',textAlign: 'center'}}>{currentRestaurant.Price}</p>
                      </Col>
                    </Row>
                    <p className="test-text" style={{fontSize: this.state.screenHeight < 860 ? this.state.screenHeight < 730 ? 10 : 13 : 16,backgroundColor:"rgba(185, 211, 196, .6)", paddingTop:'.5vh', paddingBottom:'.5vh', paddingLeft:'.5vw', paddingRight:'.5vw', borderRadius: '10px'}}>{currentRestaurant.Description}</p>
                    <Row>
                      <Col></Col>
                      <Col xs={10}>{currentRestaurant.Picture}</Col>
                      <Col></Col>
                    </Row> 
                  </Col>
                </Row>
              </Col>
              <Col className="mapCol">
                <Row className = "addrRow">
                    <p className="restLocText" style={{backgroundColor:"rgba(185, 211, 196, .5)", paddingTop:'.2vh', paddingBottom:'.2vh', paddingLeft:'.2vw', paddingRight:'.2vw', borderRadius: '10px', width: 'max-content',display:'inline-block',textAlign: 'center'}}>{currentRestaurant.Addresses[currentRestaurant.locationNum]}</p>
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

