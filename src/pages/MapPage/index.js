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

//initialize all values

let markerList=[];

let categoryList = [];
let areaList = [];
let listList = [];

let categoryListValues = [];
let areaListValues = [];

function resetLists(){
  markerList=[];

  categoryList = [];
  areaList = [];
  listList = [];

  categoryListValues = [];
  areaListValues = [];

  totAreas = structuredClone(totAreasReset)
}

function createPath(selectedPlace){
  console.log(selectedPlace);
  let restName = selectedPlace.name
  if(!restName) return
  let locationNumber = selectedPlace.locationNumber
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
                     refreshMap: true, });}

  handleAreaChange = (event) =>
    {this.setState({ area: event.target.value, 
                     showingInfoWindow: false, 
                     activeMarker: null,
                     refreshMap: true, });}

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
              let mapListText = currentRestaurant.createMapListText();
              totAreas[currentArea+"Names"].splice(d3.bisectLeft(totAreas[currentArea+"Names"],currentRestaurant.Name.toLowerCase()),0,currentRestaurant.Name.toLowerCase());
              totAreas[currentArea].splice(d3.bisectLeft(totAreas[currentArea+"Names"],currentRestaurant.Name.toLowerCase()),0,mapListText);

              markerList = currentRestaurant.createMarker(locationNum, location, markerList, this.onMarkerClick);
            }
          }
          else{ // if area is selected
            let location = currentRestaurant.Locations[currentRestaurant.Areas.indexOf(this.state.area)];

            let mapListText = currentRestaurant.createMapListText();
            totAreas[this.state.area+"Names"].splice(d3.bisectLeft(totAreas[this.state.area+"Names"],currentRestaurant.Name.toLowerCase()),0,currentRestaurant.Name.toLowerCase());
            totAreas[this.state.area].splice(d3.bisectLeft(totAreas[this.state.area+"Names"],currentRestaurant.Name.toLowerCase()),0,mapListText);

            markerList = currentRestaurant.createMarker(location, markerList, this.onMarkerClick);
          }
        }
      }
    }
    for (let areaNum in areaListValues){
      let currentArea = areaListValues[areaNum]
      if (totAreas[currentArea].length !== 0){
        listList.push(
          <div className = "row inMapRow">
            <p className='recommend-text-big'>{currentArea}</p>
          </div>
        )
        listList.push(
          totAreas[currentArea]
        )
      }
    }
  }

  const mapStyles = {
    width: '50%',
    height: '50%',
  };

  return (
    <div>
      <div className="row mapRow">
        <div className="column mapCol">
          <div className = "row inMapRow topMapPage">
            <div className = "col">
            <BrowserRouter>
            <Link className="MapTagText" to={{
                      pathname: '/restaurantPage',
                      state: {restaurantName: "hi"}
                    }} >dflkfdkljfds
            </Link>
                  </BrowserRouter>
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
              <p className='recommend-text-small'>Recommend Me!</p>
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
          </div>
          <FullPage>
            {listList}
          </FullPage>
        </div>
        <div className ="column mapCol">
          <p className='recommend-text-big topMapPage'>Recommend Me!</p>
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
                      pathname: createPath(this.state.selectedPlace),
                    }} >{this.state.selectedPlace.name}
                    </Link>
                  </BrowserRouter>
                  {/* 
                    <Link className="MapTagText" to={{
                        pathname: '/restaurantPage',
                        state: {restaurantName: "bye"}
                      }} >dflkfdkljfds
                    </Link>
                  </BrowserRouter> */}
                  
            </InfoWindow>
            
          </Map>
        </div>
      </div>
    </div>
  );
}
}

export default GoogleApiWrapper({
  apiKey: "GOOGLEMAPSAPIKEY"
})(MapPage)

//export default MapPage