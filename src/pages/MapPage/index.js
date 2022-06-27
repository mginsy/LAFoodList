import { Component }from 'react';
import * as React from 'react';
import { Map, GoogleApiWrapper, InfoWindow,  } from 'google-maps-react';
import { Row, Col } from "react-bootstrap";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Restaurant from '../../Restaurant';
import styled from 'styled-components';
import {Link, BrowserRouter, useLocation, useParams} from 'react-router-dom';
import 'simplebar-react/dist/simplebar.min.css';
import {motion} from 'framer-motion'
import { Scrollbars } from 'react-custom-scrollbars-2';
import googleMapStyles from "../mapStyles";

const data = require('../../restaurantData2.json');
const otherData = require('../../otherData.json');


let totAreas = otherData["AreasADMINONLY"]
const totAreasReset = structuredClone(totAreas)
delete data.AreasADMINONLY

const priceMenuOptions = ["$","$$","$$$","$$$$"]
const gleOptions = ["≤","≥","="]
 
const formColor = '#F3F0D7'
const StyledForm = styled(FormControl)({
  '& .MuiInputBase-input': {
    backgroundColor: formColor
  },
});

//initialize all values

let markerList=[];

let categoryList = [];
let areaList = [];
let listList = [];
let gleList = [];
let priceList = [];
let restaurantList = [];

let categoryListValues = [];

let selectedData = {};
let priceData = {};

function resetLists(){
  markerList=[];

  categoryList = [];
  areaList = [];
  listList = [];
  restaurantList = [];
  gleList = [];
  priceList = [];

  categoryListValues = [];

  totAreas = structuredClone(totAreasReset)
}

function resetPrices(){
  gleList = [];
  priceList = [];
}

function createPath(restName, locationNumber){
  if(!restName) return
  return "/" + restName.replaceAll(" ","-") + locationNumber
}

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


function pushAreaList(areaData){
  for (let areaNum in areaData["Areas"]){
    areaList.push(<MenuItem value={areaData["Areas"][areaNum]}>{areaData["Areas"][areaNum]}</MenuItem>)
  }
}

function pushCatList(catData){
  for (let catNum in catData["Cats"]){
    categoryList.push(<MenuItem value={catData["Cats"][catNum]}>{catData["Cats"][catNum]}</MenuItem>)
    categoryListValues.push(catData["Cats"][catNum])
  }
}

function pushPriceLists(priceData, currentState){
  
  if (currentState.gle !== ""){
    let gleOpt = "";
    let priceOpt = "";
    for (let itemNum in priceData["Prices"]){
      [gleOpt, priceOpt] = priceData["Prices"][itemNum].split(" ");
      if (gleOpt === currentState.gle){
        priceList.push(<MenuItem value={priceOpt}>{priceOpt}</MenuItem>)
      }
    }
  }
  else{
    for (let priceNum in priceMenuOptions){
      priceList.push(<MenuItem value={priceMenuOptions[priceNum]}>{priceMenuOptions[priceNum]}</MenuItem>)
    }
  }
  
  if (currentState.price !== ""){
    let gleOpt = "";
    let priceOpt = "";
    for (let itemNum in priceData["Prices"]){
      [gleOpt, priceOpt] = priceData["Prices"][itemNum].split(" ");
      if (priceOpt === currentState.price){
        gleList.push(<MenuItem value={gleOpt}>{gleOpt}</MenuItem>)
      }
    }
  }
  else{
    for (let gleNum in gleOptions){
      gleList.push(<MenuItem value={gleOptions[gleNum]}>{gleOptions[gleNum]}</MenuItem>)
    }
  }
}


function listsPush(selectedData, byArea, currentState, handleAreaChangeClick, handleCategoryChangeClick, onMarkerClick){
  const speedOfAnim = 1;
  const delayConst = .15;
  let itemsPushed = 0;
  const itemsPushedDiv = 7;
  const distance = -75;
  
  if (currentState.firstLoadFlag){
    if (byArea){
      let currentArea = currentState.area
      listList.push(
        <motion.div className = "fullMapRestaurantText"
        initial={{opacity: 0}}
        animate={{opacity: 1, transition: {duration: delayConst + (itemsPushed+Math.min(selectedData["restaurants"].length,12))/itemsPushedDiv + speedOfAnim}}}
        >
          <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
        </motion.div>
      )
      itemsPushed++;
      for (let restNum in selectedData["restaurants"]){
        let currentRestaurant = new Restaurant(selectedData["restaurants"][restNum], currentArea)
        if (itemsPushed < 12){
          let mapListText = currentRestaurant.createMapListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price);
          listList.push(
            <motion.div
            initial={{opacity: 1, x: distance}}
            animate={{opacity: 1, x: 0, transition: {delay: delayConst + itemsPushed/itemsPushedDiv, duration: speedOfAnim}}}
            >
              {mapListText}
            </motion.div>
          )
          markerList.push(currentRestaurant.createMarker(onMarkerClick));
          restaurantList.push(currentRestaurant)
          itemsPushed++;
        }
        else{
          let mapListText = currentRestaurant.createMapListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price);
          listList.push(
            <div>
              {mapListText}
            </div>
          )
          markerList.push(currentRestaurant.createMarker(onMarkerClick));
          restaurantList.push(currentRestaurant)
          itemsPushed++;
        }
      }
    }
    else{
      for (let areaNum in selectedData["Areas"]){
        let currentArea = selectedData["Areas"][areaNum]
        if (itemsPushed === 0){
          listList.push(
            <motion.div className = "fullMapRestaurantText"
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: delayConst + (itemsPushed+Math.min(selectedData[currentArea]["restaurants"].length,12))/itemsPushedDiv + speedOfAnim}}}
            >
              <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
            </motion.div>
          )
          itemsPushed++;
        }
        else if (itemsPushed < 12){
          listList.push(
            <motion.div className = "fullMapRestaurantText mapAreaTitle"
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: delayConst + (itemsPushed+Math.min(selectedData[currentArea]["restaurants"].length,12))/itemsPushedDiv + speedOfAnim}}}
            >
              <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
            </motion.div>
          )
          itemsPushed++;
        }
        else{
          listList.push(
            <div className = "fullMapRestaurantText mapAreaTitle">
              <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
            </div>
          )
          itemsPushed++;
        }
        for (let restNum in selectedData[currentArea]["restaurants"]){
          if (itemsPushed < 12){
            let currentRestaurant = new Restaurant(selectedData[currentArea]["restaurants"][restNum], currentArea)
              let mapListText = currentRestaurant.createMapListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price);
              listList.push(
                <motion.div className = "Anim"
                initial={{opacity: 1, x: distance}}
                animate={{opacity: 1, x: 0, transition: {delay: delayConst + itemsPushed/itemsPushedDiv, duration: speedOfAnim}}}
                >
                  {mapListText}
                </motion.div>
              )
              markerList.push(currentRestaurant.createMarker(onMarkerClick));
              restaurantList.push(currentRestaurant)
              itemsPushed++;
          }
          else{
            let currentRestaurant = new Restaurant(selectedData[currentArea]["restaurants"][restNum], currentArea)
              let mapListText = currentRestaurant.createMapListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price);
              listList.push(
                <div className="noAnim">
                  {mapListText}
                </div>
              )
              markerList.push(currentRestaurant.createMarker(onMarkerClick));
              restaurantList.push(currentRestaurant)
              itemsPushed++;
          }
          
        }
        
      }
    }
  }
  else{ // after first load
    if (byArea){
      let currentArea = currentState.area
      listList.push(
        <div className = "fullMapRestaurantText">
          <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
        </div>
      )
      itemsPushed++;
      for (let restNum in selectedData["restaurants"]){
        let currentRestaurant = new Restaurant(selectedData["restaurants"][restNum], currentArea)
        let mapListText = currentRestaurant.createMapListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price);
        listList.push(
          <div>
            {mapListText}
          </div>
        )
        markerList.push(currentRestaurant.createMarker(onMarkerClick));
        restaurantList.push(currentRestaurant)
        itemsPushed++;
      }
    }
    else{
      for (let areaNum in selectedData["Areas"]){
        let currentArea = selectedData["Areas"][areaNum]
        if (itemsPushed === 0){
          listList.push(
            <div className = "fullMapRestaurantText">
              <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
            </div>
          )
          itemsPushed++;
        }
        else{
          listList.push(
            <div className = "fullMapRestaurantText mapAreaTitle">
              <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
            </div>
          )
          itemsPushed++;
        }
        for (let restNum in selectedData[currentArea]["restaurants"]){
          let currentRestaurant = new Restaurant(selectedData[currentArea]["restaurants"][restNum], currentArea)
          let mapListText = currentRestaurant.createMapListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price);
          listList.push(
            <div className="noAnim">
              {mapListText}
            </div>
          )
          markerList.push(currentRestaurant.createMarker(onMarkerClick));
          restaurantList.push(currentRestaurant)
          itemsPushed++;
        }
      }
    }
  }
}

class MapPage extends Component {

  state = {
    showingInfoWindow: false,  // Hides or shows the InfoWindow
    activeMarker: {},          // Shows the active marker upon click
    selectedPlace: {},          // Shows the InfoWindow to the selected place upon a marker
    refreshMap: true,
    refreshPrices: false,
    category: (typeof(this.props.locState.Category) != "undefined" ? this.props.locState.Category : ""),
    area: (typeof(this.props.locState.Area) != "undefined" ? this.props.locState.Area : ""),
    gle: (typeof(this.props.locState.Gle) != "undefined" ? this.props.locState.Gle : ""),
    price: (typeof(this.props.locState.Price) != "undefined" ? this.props.locState.Price : ""),
    firstLoadFlag: true,
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

  componentWillUnmount() {
      window.removeEventListener("resize", this.resize.bind(this));
  }

  handleCategoryChange = (event) =>
    {
      this.setState({ category: event.target.value, 
                     showingInfoWindow: false, 
                     activeMarker: null,
                     refreshMap: true,
                     firstLoadFlag: false,
                     refreshPrices: false, 
                     gle: "",
                     price: "" });}

  handleAreaChange = (event) =>
    {
      this.setState({ area: event.target.value, 
                     showingInfoWindow: false, 
                     activeMarker: null,
                     refreshMap: true,
                     refreshPrices: false, 
                     firstLoadFlag: false,
                     gle: "",
                     price: "" });}

  handleAreaChangeClick = param => e => {
    this.setState({ area: param, 
      showingInfoWindow: false, 
      activeMarker: null,
      refreshMap: true,
      firstLoadFlag: false,
      refreshPrices: false });
  };

  handleCategoryChangeClick = param => e => {
    this.setState({ category: param, 
      showingInfoWindow: false, 
      activeMarker: null,
      firstLoadFlag: false,
      refreshMap: true,
      refreshPrices: false, 
    });
  };

  handlePriceChange = (event) =>
    {
      let refMap = this.state.gle !== ""
      this.setState({ price: event.target.value, 
                     showingInfoWindow: false, 
                     activeMarker: null,
                     refreshMap: refMap,
                     firstLoadFlag: false,
                     refreshPrices: true  });}
                
  handleGLEChange = (event) =>
    {
      let refMap = this.state.price !== ""
      this.setState({ gle: event.target.value, 
                     showingInfoWindow: false, 
                     activeMarker: null,
                     refreshMap: refMap,
                     firstLoadFlag: false,
                     refreshPrices: true,  });}

  recommendCategory = (event) =>
  {
    let randomCategoryPick =  Math.floor(Math.random() * categoryListValues.length);
    this.setState({
      category: categoryListValues[randomCategoryPick], 
      showingInfoWindow: false, 
      activeMarker: null,
      refreshMap: true,
      firstLoadFlag: false,
      refreshPrices: false, 
      gle: "",
      price: ""
    })
  }

  resetCategories = (event) =>
  {
    this.setState({
      category: "",
      area: "", 
      showingInfoWindow: false, 
      activeMarker: null,
      refreshMap: true,
      firstLoadFlag: false,
      refreshPrices: false, 
      gle: "",
      price: ""
    })
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      refreshMap: false,
      firstLoadFlag: false,
      refreshPrices: false, 
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

render() {

  

  if (this.state.refreshMap){

    resetLists();

    //category area gle price

    if (this.state.area === ""){
      if(this.state.category === ""){
        if(this.state.gle === "" || this.state.price === ""){//none selected
          selectedData = data;
          pushAreaList(selectedData);
          pushCatList(selectedData);
          priceData = selectedData;
          pushPriceLists(priceData, this.state);
        }
        else{//just price selected
          selectedData = data[this.state.gle + " " + this.state.price]
          pushAreaList(selectedData);
          pushCatList(selectedData);
          priceData = data;
          pushPriceLists(priceData, this.state);
        }
      }
      else{
        if(this.state.gle === "" || this.state.price === ""){//just category selected
          selectedData = data[this.state.category]
          pushAreaList(selectedData);
          pushCatList(data);
          priceData = selectedData;
          pushPriceLists(priceData, this.state);
        }
        else{//category and price selected
          selectedData = data[this.state.category][this.state.gle + " " + this.state.price]
          pushAreaList(selectedData);
          pushCatList(data[this.state.gle + " " + this.state.price]);
          priceData = data[this.state.category];
          pushPriceLists(priceData, this.state);
        }
      }
      listsPush(selectedData, false, this.state, this.handleAreaChangeClick, this.handleCategoryChangeClick, this.onMarkerClick);
    }
    else{ 
      if(this.state.category === ""){
        if(this.state.gle === "" || this.state.price === ""){ //just area selected
          selectedData = data[this.state.area]
          pushAreaList(data);
          pushCatList(selectedData);
          priceData = selectedData;
          pushPriceLists(priceData, this.state);
        }
        else{//area and price selected
          selectedData = data[this.state.gle + " " + this.state.price][this.state.area]
          pushAreaList(data[this.state.gle + " " + this.state.price]);
          pushCatList(selectedData);
          priceData = data[this.state.area];
          pushPriceLists(data[this.state.area], this.state);
        }
      }
      else{
        if(this.state.gle === "" || this.state.price === ""){//area and category selected
          selectedData = data[this.state.category][this.state.area]
          pushAreaList(data[this.state.category]);
          pushCatList(data[this.state.area]);
          priceData = selectedData;
          pushPriceLists(selectedData, this.state);
        }
        else{//all selected
          selectedData = data[this.state.category][this.state.gle + " " + this.state.price][this.state.area]
          pushAreaList(data[this.state.category][this.state.gle + " " + this.state.price]);
          pushCatList(data[this.state.gle + " " + this.state.price][this.state.area]);
          priceData = data[this.state.category][this.state.area];
          pushPriceLists(priceData, this.state);
        }
      }
      listsPush(selectedData, true, this.state, this.handleAreaChangeClick, this.handleCategoryChangeClick, this.onMarkerClick);
    }
  }
  else if (this.state.refreshPrices){
    resetPrices();
    pushPriceLists(priceData, this.state);
  }
  
  let randomRestaurantPick = Math.floor(Math.random() * restaurantList.length);

  return (
    <motion.div className="bigNoScrollContainer"
      key={"MapKey"}
      exit={{opacity: 0}}
      initial={{opacity: 0, y: -30}}
      animate={{opacity: 1, y: 0, transition: {duration: 1}}}
      >
      <Row className="mapStartRow">
        <Col className="mapFormColOne">
          <Row className="mapFormRow">
            <StyledForm sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small">Category</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={this.state.category}
                label="Category"
                onChange={this.handleCategoryChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categoryList}
              </Select>
            </StyledForm>
          </Row>
          <Row className="mapFormRow">
            <Link className='recommend-text-small' onClick={this.recommendCategory}  to="#">Recommend Me!</Link>
          </Row>
        </Col>
        <Col className="mapFormCol">
          <h4 className='in-between-text'>in</h4>
        </Col>
        <Col className="mapFormCol">
          <StyledForm sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small">Area</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={this.state.area}
              label="Area"
              onChange={this.handleAreaChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {areaList}
            </Select>
          </StyledForm>
        </Col>
        <Col className="mapFormCol">
          <StyledForm sx={{ m: 1, minWidth: 80 }} size="small">
            <InputLabel id="demo-select-small">≤, ≥, =</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={this.state.gle}
              label="Area"
              onChange={this.handleGLEChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {gleList}
            </Select>
          </StyledForm>
        </Col>
        <Col className="mapFormCol">
          <StyledForm sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small">Price</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={this.state.price}
              label="Price"
              onChange={this.handlePriceChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {priceList}
            </Select>
          </StyledForm>
        </Col>
        <Col className="mapFormCol">
          <Link className='recommend-text-big' onClick={this.resetCategories}  to="#">Reset</Link>
        </Col>
        <Col xs={7}>
        </Col>
      </Row>
      <Row className="mapPaddingRow">
      </Row>
      <Row>
        <Col xs={5}>
          <Scrollbars className="Scrollbar" style={{ height: this.state.screenHeight*.80-86 }}
                      autoHide
                      autoHideTimeout={1000}
                      autoHideDuration={200}>
            {listList}
          </Scrollbars>
        </Col>
        <Col>
          <Row className='mapPaddingRow2'></Row>
          <Row className="mapRowMapPage">
            <Col md={11}>
              <Map
                  google={this.props.google}
                  zoom={11}
                  styles={this.props.mapStyle}
                  initialCenter={
                      {
                      lat: 34.0744189,
                      lng: -118.2621198
                      }
                  }
                  onClick={this.onMapClicked}
                >
                  {markerList}
                  
                <InfoWindow
                  marker={this.state.activeMarker}
                  visible={this.state.showingInfoWindow}
                  onClose={this.onClose}
                >
                      <BrowserRouter>
                        <Link  to={{
                          pathname: createPath(this.state.selectedPlace.name, this.state.selectedPlace.locationNumber),
                        }} 
                        state={{Category: this.state.category, Area:this.state.area, Gle:this.state.gle, Price:this.state.price, Page:"/Map"}}>{this.state.selectedPlace.name}
                        </Link>
                      </BrowserRouter>
                </InfoWindow>
              </Map>
            </Col>
            <Col>
            </Col>
          </Row>
          <Row className="rightMapRow">
            <Col md={12} className="recCol">
              <Link className='recommend-text-big' to={{
                              pathname: restaurantList[randomRestaurantPick].createPath(),
                              }}
                              state={{Category: this.state.category, Area:this.state.area, Gle:this.state.gle, Price:this.state.price, Page:"/Map"}} >
                    Recommend Me!
              </Link>
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

MapPage.defaultProps = googleMapStyles;

export default GoogleApiWrapper({
  apiKey: "GMAPSAPI"
})(withRouter(MapPage))

//export default MapPage