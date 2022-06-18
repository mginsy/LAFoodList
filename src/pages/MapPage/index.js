import { Component }from 'react';
import * as React from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker,InfoBox  } from 'google-maps-react';
import { Container } from "react-bootstrap";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Restaurant from '../../Restaurant';
import styled from 'styled-components';
import {Link, Router, BrowserRouter, MemoryRouter} from 'react-router-dom';

const d3 = require('d3-array'); 
const data = require('../../restaurantData.json');
const otherData = require('../../otherData.json');

let totAreas = otherData["AreasADMINONLY"]
const totAreasReset = structuredClone(totAreas)
delete data.AreasADMINONLY

const priceOptions = ["","$","$$","$$$","$$$$"]

//initialize all values

let markerList=[];

let categoryList = [];
let areaList = [];
let listList = [];
let gleList = [];
let priceList = [];
let restaurantList = [];

let categoryListValues = [];
let areaListValues = [];
let gleListValues = [];
let priceListValues = [];

let gleFlag = false;
let priceFlag = false;

function resetLists(){
  markerList=[];

  categoryList = [];
  areaList = [];
  listList = [];
  restaurantList = [];

  categoryListValues = [];
  areaListValues = [];

  totAreas = structuredClone(totAreasReset)
}

function resetPrices(){
  gleList = [];
  priceList = [];
  
  gleListValues = [];
  priceListValues = [];

  gleFlag = false;
  priceFlag = false;
}

function createPath(restName, locationNumber){
  if(!restName) return
  return "/" + restName.replaceAll(" ","-") + locationNumber
}

class MapPage extends Component {

  state = {
    showingInfoWindow: false,  // Hides or shows the InfoWindow
    activeMarker: {},          // Shows the active marker upon click
    selectedPlace: {},          // Shows the InfoWindow to the selected place upon a marker
    refreshMap: true,
    category: "",
    area: "",
    gle: "",
    price: "",
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
    {this.setState({ category: event.target.value, 
                     showingInfoWindow: false, 
                     activeMarker: null,
                     refreshMap: true,
                     gle: "",
                     price: "" });}

  handleAreaChange = (event) =>
    {
      this.setState({ area: event.target.value, 
                     showingInfoWindow: false, 
                     activeMarker: null,
                     refreshMap: true,
                     gle: "",
                     price: "" });}

  handleAreaChangeClick = param => e => {
    this.setState({ area: param, 
      showingInfoWindow: false, 
      activeMarker: null,
      refreshMap: true });
  };

  handleCategoryChangeClick = param => e => {
    this.setState({ category: param, 
      showingInfoWindow: false, 
      activeMarker: null,
      refreshMap: true,
    });
  };

  handlePriceChange = (event) =>
    {
      let refMap = this.state.gle !== ""
      this.setState({ price: event.target.value, 
                     showingInfoWindow: false, 
                     activeMarker: null,
                     refreshMap: refMap, });}
                
  handleGLEChange = (event) =>
    {
      let refMap = this.state.price !== ""
      this.setState({ gle: event.target.value, 
                     showingInfoWindow: false, 
                     activeMarker: null,
                     refreshMap: refMap });}

  recommendCategory = (event) =>
  {
    let randomCategoryPick =  Math.floor(Math.random() * categoryList.length);
    this.setState({
      category: categoryListValues[randomCategoryPick], 
      showingInfoWindow: false, 
      activeMarker: null,
      refreshMap: true,
      gle: "",
      price: ""
    })
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      refreshMap: false
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

  const FullPage = styled.div`
      overflow-y: scroll;
      max-height: ${this.state.screenHeight-200}px
  `;  

  if (this.state.refreshMap){
    resetLists();

    for (let key in data){ // creates markers and filters categories
      let currentRestaurant = new Restaurant(key, data)

      if(currentRestaurant.fitsPrice(this.state.gle, this.state.price))
      {
        if ((this.state.area === "" || currentRestaurant.Areas.includes(this.state.area))){
          for (let categoryNum in currentRestaurant.Categories){ // creates categories
            let category = currentRestaurant.Categories[categoryNum];
            if (!categoryListValues.includes(category)){
              categoryListValues.splice(d3.bisectLeft(categoryListValues,category),0,category)
              categoryList.splice(d3.bisectLeft(categoryListValues,category),0,<MenuItem value={category}>{category}</MenuItem>)
            }
          }
        }
    
        if ((this.state.category === "" || currentRestaurant.Categories.includes(this.state.category))){ // markers + areas
          for (let areaNum in currentRestaurant.Areas){ // creates areas
            let area = currentRestaurant.Areas[areaNum];
            if (!areaListValues.includes(area)){
              areaListValues.splice(d3.bisectLeft(areaListValues,area),0,area)
              areaList.splice(d3.bisectLeft(areaListValues,area),0,<MenuItem value={area}>{area}</MenuItem>)
            }
          }
          if (this.state.area === "" || currentRestaurant.Areas.includes(this.state.area)){ //markers + map list text
            if (this.state.area === ""){ // if no area is selected
              for (let locationNum in currentRestaurant.Locations){
                let location = currentRestaurant.Locations[locationNum];

                let currentArea = currentRestaurant.Areas[locationNum];
                let mapListText = currentRestaurant.createMapListText(locationNum, this.handleCategoryChangeClick);
                totAreas[currentArea+"Names"].splice(d3.bisectLeft(totAreas[currentArea+"Names"],currentRestaurant.Name.toLowerCase()),0,currentRestaurant.Name.toLowerCase());
                totAreas[currentArea].splice(d3.bisectLeft(totAreas[currentArea+"Names"],currentRestaurant.Name.toLowerCase()),0,mapListText);
                
                restaurantList.push({restaurant: currentRestaurant,
                                    locationNum: locationNum});
                markerList = currentRestaurant.createMarker(locationNum, location, markerList, this.onMarkerClick);
              }
            }
            else{ // if area is selected
              let locationNum = currentRestaurant.Areas.indexOf(this.state.area)
              let location = currentRestaurant.Locations[locationNum];

              let mapListText = currentRestaurant.createMapListText(locationNum, this.handleCategoryChangeClick);
              totAreas[this.state.area+"Names"].splice(d3.bisectLeft(totAreas[this.state.area+"Names"],currentRestaurant.Name.toLowerCase()),0,currentRestaurant.Name.toLowerCase());
              totAreas[this.state.area].splice(d3.bisectLeft(totAreas[this.state.area+"Names"],currentRestaurant.Name.toLowerCase()),0,mapListText);

              restaurantList.push({restaurant: currentRestaurant,
                                  locationNum: locationNum});
              markerList = currentRestaurant.createMarker(locationNum, location, markerList, this.onMarkerClick);
            }
          }
        }
      }
    }
    for (let areaNum in areaListValues){
      let currentArea = areaListValues[areaNum]
      if (totAreas[currentArea].length !== 0){
        listList.push(
          <div className = "fullMapRestaurantText">
            <Link className='recommend-text-big' value={currentArea} onClick={this.handleAreaChangeClick(currentArea)} >{currentArea}</Link>
          </div>
        )
        listList.push(
          totAreas[currentArea]
        )
      }
    }
  }

  resetPrices()
  for (let restNum in restaurantList){
    let currentRestaurant = restaurantList[restNum].restaurant;
    if (this.state.gle !== "" && priceListValues.length !== 4){ //creates price list
      let originalLength = priceListValues.length;
      console.log(currentRestaurant.Name)
      if(this.state.gle==="≤"){
        for (let currPrice = currentRestaurant.Price.length; currPrice <= 4-originalLength; currPrice++){
          priceListValues.splice(d3.bisectLeft(priceListValues,priceOptions[currPrice]),0,priceOptions[currPrice])
          priceList.splice(d3.bisectLeft(priceListValues,priceOptions[currPrice]),0,
            <MenuItem value={priceOptions[currPrice]}>
            {priceOptions[currPrice]}
            </MenuItem>)
        }
      }
      else if (this.state.gle==="≥"){
        for (let currPrice = currentRestaurant.Price.length; currPrice >= originalLength; currPrice--){
          priceListValues.splice(d3.bisectLeft(priceListValues,priceOptions[currPrice]),0,priceOptions[currPrice])
          priceList.splice(d3.bisectLeft(priceListValues,priceOptions[currPrice]),0,
            <MenuItem value={priceOptions[currPrice]}>
              {priceOptions[currPrice]}
            </MenuItem>)
        }
      }
      else{
        if (!priceListValues.includes(currentRestaurant.Price)){
          priceListValues.splice(d3.bisectLeft(priceListValues,currentRestaurant.Price),0,currentRestaurant.Price)
          priceList.splice(d3.bisectLeft(priceListValues,currentRestaurant.Price),0,
            <MenuItem value={currentRestaurant.Price}>
              {currentRestaurant.Price}
            </MenuItem>)
        }
      }
      if (priceListValues.length === 4){
        priceFlag = true;
      }
    }
    else if (!priceFlag){
      for (let i = 1; i <= 4; i++){
        priceListValues.splice(d3.bisectLeft(priceListValues,priceOptions[i]),0,priceOptions[i])
        priceList.splice(d3.bisectLeft(priceListValues,priceOptions[i]),0,
          <MenuItem value={priceOptions[i]}>
            {priceOptions[i]}
          </MenuItem>)
      }
      priceFlag = true;
    }
    
    if (this.state.price !== "" && gleListValues.length !== 3){ //creates GLE list
      if (this.state.price.length === currentRestaurant.Price.length && !gleListValues.includes("=")){
        gleListValues.splice(d3.bisectLeft(gleListValues,"="),0,"=")
        gleList.splice(d3.bisectLeft(gleListValues,"="),0,
        <MenuItem value="=">
          =
        </MenuItem>
        )
      }
      else if (this.state.price.length >= currentRestaurant.Price.length && !gleListValues.includes("≤")){
        gleListValues.splice(d3.bisectLeft(gleListValues,"≤"),0,"≤")
        gleList.splice(d3.bisectLeft(gleListValues,"≤"),0,
        <MenuItem value="≤">
          ≤
        </MenuItem>
        )
      }
      else if (this.state.price.length <= currentRestaurant.Price.length && !gleListValues.includes("≥")){
        gleListValues.splice(d3.bisectLeft(gleListValues,"≥"),0,"≥")
        gleList.splice(d3.bisectLeft(gleListValues,"≥"),0,
        <MenuItem value="≥">
          ≥
        </MenuItem>
        )
      }
      if (gleListValues.length === 3){
        gleFlag = true;
      }
    }
    else if (!gleFlag){
      gleListValues.splice(d3.bisectLeft(gleListValues,"="),0,"=")
      gleList.splice(d3.bisectLeft(gleListValues,"="),0,
      <MenuItem value="=">
        =
      </MenuItem>
      )
      gleListValues.splice(d3.bisectLeft(gleListValues,"≤"),0,"≤")
      gleList.splice(d3.bisectLeft(gleListValues,"≤"),0,
      <MenuItem value="≤">
        ≤
      </MenuItem>
      )
      gleListValues.splice(d3.bisectLeft(gleListValues,"≥"),0,"≥")
      gleList.splice(d3.bisectLeft(gleListValues,"≥"),0,
      <MenuItem value="≥">
        ≥
      </MenuItem>
      )
      gleFlag = true;
    }
  }
  
  let randomRestaurantPick = Math.floor(Math.random() * restaurantList.length);

  const mapStyles = {
    width: '50%',
    height: '50%',
  };

  return (
    <div>
      <div className="row mapRow">
        <div className="column mapCol">
          <div className = "row topMapPage">
            <div className = "col">
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
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
              </FormControl>
              <Link className='recommend-text-small' onClick={this.recommendCategory} >Recommend Me!</Link>
            </div>
            <div className = "col">
              <h4 className='in-between-text'>in</h4>
            </div>
            <div className = "col">
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
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
              </FormControl>
            </div>
            <div className = "col">
              <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
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
              </FormControl>
            </div>
            <div className = "col">
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
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
              </FormControl>
            </div>
          </div>
          <FullPage>
            {listList}
          </FullPage>
        </div>
        <div className ="column mapCol">
        <Link className='recommend-text-big' to={{
                      pathname: restaurantList[randomRestaurantPick].restaurant.createPath(restaurantList[randomRestaurantPick].locationNum),
                      }} >
            Recommend Me!
          </Link>
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
            {markerList}
            
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
              onClose={this.onClose}
            >
                  <BrowserRouter>
                    <Link  to={{
                      pathname: createPath(this.state.selectedPlace.name, this.state.selectedPlace.locationNumber),
                    }} >{this.state.selectedPlace.name}
                    </Link>
                  </BrowserRouter>
            </InfoWindow>
            
          </Map>
        </div>
      </div>
    </div>
  );
}
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD7PF3dtTMKX_0e045Ez3nvc_X5-c8so9I"
})(MapPage)

//export default MapPage