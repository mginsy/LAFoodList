import { Component }from 'react';
import * as React from 'react';
import { Map, GoogleApiWrapper, InfoWindow,  } from 'google-maps-react';
import { Row, Col } from "react-bootstrap";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Restaurant from '../../Restaurant';
import { styled } from '@mui/material/styles';
import {Link, BrowserRouter, useLocation, useParams} from 'react-router-dom';
import 'simplebar-react/dist/simplebar.min.css';
import {motion} from 'framer-motion'
import { Scrollbars } from 'react-custom-scrollbars-2';
import googleMapStyles from "../mapStyles";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {isMobile} from 'react-device-detect';

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
    backgroundColor: formColor,
    fontSize: 23
  },
});
const StyledFormMobile = styled(FormControl)({
  '& .MuiInputBase-input': {
    backgroundColor: formColor,
    fontSize: '18px'
  },
});

const exitVariants = {
  regular: {opacity: 0, transition: {duration: .5}},
  slideLeft: {opacity: 0, x: -100, transition: {duration: .5}}
}

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


function pushAreaList(areaData, areaState){
  for (let areaNum in areaData["Areas"]){
    areaList.push(<MenuItem value={areaData["Areas"][areaNum]}><Typography component="p" className={areaState === areaData["Areas"][areaNum] ? isMobile ? "menuOptionSelectedMobile" : "menuOptionSelected": isMobile ? "menuOptionListMobile" : "menuOptionList"}>{areaData["Areas"][areaNum]}</Typography></MenuItem>)
  }
}

function pushCatList(catData, catState){
  for (let catNum in catData["Cats"]){
    categoryList.push(<MenuItem value={catData["Cats"][catNum]}><Typography component="p" className={catState === catData["Cats"][catNum] ? isMobile ? "menuOptionSelectedMobile" :"menuOptionSelected": isMobile ? "menuOptionListMobile" : "menuOptionList"}>{catData["Cats"][catNum]}</Typography></MenuItem>)
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
        priceList.push(<MenuItem value={priceOpt}><Typography component="em" className={currentState.price === priceOpt ? isMobile ? "menuOptionSelectedMobile" : "menuOptionSelected": isMobile ? "menuOptionListMobile" :"menuOptionList"}>{priceOpt}</Typography></MenuItem>)
      }
    }
  }
  else{
    for (let priceNum in priceMenuOptions){
      priceList.push(<MenuItem value={priceMenuOptions[priceNum]}><Typography component="em" className={currentState.price === priceMenuOptions[priceNum] ? isMobile ? "menuOptionSelectedMobile" : "menuOptionSelected": isMobile ? "menuOptionListMobile" : "menuOptionList"}>{priceMenuOptions[priceNum]}</Typography></MenuItem>)
    }
  }
  
  if (currentState.price !== ""){
    let gleOpt = "";
    let priceOpt = "";
    for (let itemNum in priceData["Prices"]){
      [gleOpt, priceOpt] = priceData["Prices"][itemNum].split(" ");
      if (priceOpt === currentState.price){
        gleList.push(<MenuItem value={gleOpt}><Typography component="p" className={currentState.gle === gleOpt ? isMobile ? "menuOptionSelectedMobile" : "menuOptionSelected": isMobile ? "menuOptionListMobile" : "menuOptionList"}>{gleOpt}</Typography></MenuItem>)
      }
    }
  }
  else{
    for (let gleNum in gleOptions){
      gleList.push(<MenuItem value={gleOptions[gleNum]}><Typography component="p" className={currentState.gle === gleOptions[gleNum] ? isMobile ? "menuOptionSelectedMobile" : "menuOptionSelected":isMobile ? "menuOptionListMobile" : "menuOptionList"}>{gleOptions[gleNum]}</Typography></MenuItem>)
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
        animate={{opacity: 1, transition: {duration: delayConst + itemsPushed/itemsPushedDiv + speedOfAnim}}}
        >
          <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
          <div
          style={{
            backgroundColor: '#000000',
            height: '2px',
                
          }}
          />
          <div
          style={{
            height: '4px',
          }}
          />
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
            animate={{opacity: 1, transition: {duration: delayConst + itemsPushed/itemsPushedDiv + speedOfAnim}}}
            >
              <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
              <div
                style={{
                    backgroundColor: '#000000',
                    height: '2px',
                
                  }}
              />
              <div
              style={{
                height: '4px',
              }}
              />
            </motion.div>
          )
          itemsPushed++;
        }
        else if (itemsPushed < 12){
          listList.push(
            <motion.div className = "fullMapRestaurantText mapAreaTitle"
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: delayConst + itemsPushed/itemsPushedDiv + speedOfAnim}}}
            >
              <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
              <div
              style={{
                backgroundColor: '#000000',
                height: '2px',
                
              }}
              />
              <div
                style={{
                  height: '4px',
                }}
              />
            </motion.div>
          )
          itemsPushed++;
        }
        else{
          listList.push(
            <div className = "fullMapRestaurantText mapAreaTitle">
              <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
              <div
                style={{
                  backgroundColor: '#000000',
                  height: '2px',
                
                }}
              />
              <div
                style={{
                  height: '4px',
                }}
              />
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
          <div
            style={{
              backgroundColor: '#000000',
              height: '2px',
                
            }}
          />
          <div
                style={{
                  height: '4px',
                }}
              />
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
              <div
              style={{
                backgroundColor: '#000000',
                height: '2px',
                
              }}
              />
              <div
                style={{
                  height: '4px',
                }}
              />
            </div>
          )
          itemsPushed++;
        }
        else{
          listList.push(
            <div className = "fullMapRestaurantText mapAreaTitle">
              <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
              <div
              style={{
                backgroundColor: '#000000',
                height: '2px',
                
              }}
              />
              <div
                style={{
                  height: '4px',
                }}
              />
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
    fromMapList: (typeof(this.props.locState.fromMapList) != "undefined" ? this.props.locState.fromMapList : false),
    firstLoadFlag: true,
    screenWidth: 0,
    screenHeight: 0,
    toMapList: false
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
                     refreshPrices: false });}

  handleAreaChange = (event) =>
    {
      this.setState({ area: event.target.value, 
                     showingInfoWindow: false, 
                     activeMarker: null,
                     refreshMap: true,
                     refreshPrices: false, 
                     firstLoadFlag: false, });}

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
      leavingToList: false
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

  setToMapList = (event) => {
    this.setState({
      toMapList: true
    })
  };

render() {

  if (isMobile){
    if (this.state.refreshMap){

      resetLists();

      //category area gle price

      if (this.state.area === ""){
        if(this.state.category === ""){
          if(this.state.gle === "" || this.state.price === ""){//none selected
            selectedData = data;
            pushAreaList(selectedData, this.state.area);
            pushCatList(selectedData, this.state.category);
            priceData = selectedData;
            pushPriceLists(priceData, this.state);
          }
          else{//just price selected
            selectedData = data[this.state.gle + " " + this.state.price]
            pushAreaList(selectedData, this.state.area);
            pushCatList(selectedData, this.state.category);
            priceData = data;
            pushPriceLists(priceData, this.state);
          }
        }
        else{
          if(this.state.gle === "" || this.state.price === ""){//just category selected
            selectedData = data[this.state.category]
            pushAreaList(selectedData, this.state.area);
            pushCatList(data, this.state.category);
            priceData = selectedData;
            pushPriceLists(priceData, this.state);
          }
          else{//category and price selected
            selectedData = data[this.state.category][this.state.gle + " " + this.state.price]
            pushAreaList(selectedData, this.state.area);
            pushCatList(data[this.state.gle + " " + this.state.price], this.state.category);
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
            pushAreaList(data, this.state.area);
            pushCatList(selectedData, this.state.category);
            priceData = selectedData;
            pushPriceLists(priceData, this.state);
          }
          else{//area and price selected
            selectedData = data[this.state.gle + " " + this.state.price][this.state.area]
            pushAreaList(data[this.state.gle + " " + this.state.price], this.state.area);
            pushCatList(selectedData, this.state.category);
            priceData = data[this.state.area];
            pushPriceLists(data[this.state.area], this.state);
          }
        }
        else{
          if(this.state.gle === "" || this.state.price === ""){//area and category selected
            selectedData = data[this.state.category][this.state.area]
            pushAreaList(data[this.state.category], this.state.area);
            pushCatList(data[this.state.area], this.state.category);
            priceData = selectedData;
            pushPriceLists(selectedData, this.state);
          }
          else{//all selected
            selectedData = data[this.state.category][this.state.gle + " " + this.state.price][this.state.area]
            pushAreaList(data[this.state.category][this.state.gle + " " + this.state.price], this.state.area);
            pushCatList(data[this.state.gle + " " + this.state.price][this.state.area], this.state.category);
            priceData = data[this.state.category][this.state.area];
            pushPriceLists(priceData, this.state);
          }
        }
        listsPush(selectedData, true, this.state, this.handleAreaChangeClick, this.handleCategoryChangeClick, this.onMarkerClick);
      }
      resetPrices();
      pushPriceLists(priceData, this.state);
    }
    else if (this.state.refreshPrices){
      resetPrices();
      pushPriceLists(priceData, this.state);
    }

    return (
      <motion.div className="bigNoScrollContainer"
        key={"MapKey"}
        exit={this.state.toMapList ? "slideLeft" : "regular"}
        initial={(this.state.fromMapList) ? {opacity: 0, x: -100, transition: {duration: 1}} : {opacity: 0, y: -30, transition: {duration: 1}}}
        animate={{opacity: 1, y: 0, x: 0, transition: {duration: 1}}}
        variants={exitVariants}
        >
        <Row className="mapStartRow">
          <Col className="mapFormCol">
            <Row className="mapFormRow">
            <StyledFormMobile sx={{ m: 1, minWidth: 170}} size="small" margin="none">
              <InputLabel margin="none">
                <Typography
                  component="span"
                  className={this.state.category !== "" ? "menuTitleSmall" : "menuTitleMobile"}>
                  Category
                </Typography>
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={this.state.category}
                label="Category"
                onChange={this.handleCategoryChange}
              >
                <MenuItem value="">
                  <Typography
                    component="em"
                    className="menuOptionListMobile">
                    Any
                  </Typography>
                </MenuItem>
                {categoryList}
              </Select>
            </StyledFormMobile>
            </Row>
          </Col>
          <Col className="mapFormCol">
            <StyledFormMobile sx={{ m: 1, minWidth: 134 }} size="small">
              <InputLabel id="demo-select-small">
                <Typography
                  component="span"
                  className={this.state.area !== "" ? "menuTitleSmall" : "menuTitleMobile"}>
                  Area
                </Typography>
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={this.state.area}
                label="Area"
                onChange={this.handleAreaChange}
              >
                <MenuItem value="">
                  <Typography component="em"  className="menuOptionListMobile" style={{fontFamily:"Butler_Regular"}}>Any</Typography>
                </MenuItem>
                {areaList}
              </Select>
            </StyledFormMobile>
          </Col>
          <Col className="mapFormCol">
            <StyledFormMobile sx={{ m: 1, minWidth: 80 }} size="small">
              <InputLabel id="demo-select-small">
                <Typography
                  component="span"
                  className={this.state.gle !== "" ? "menuTitleSmall" : "menuTitleMobile"}>
                  ≤, ≥, =
                </Typography>
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={this.state.gle}
                label="Area"
                onChange={this.handleGLEChange}
              >
                <MenuItem value="">
                  <Typography component="em" style={{fontFamily:"Butler_Regular"}}>None</Typography>
                </MenuItem>
                {gleList}
              </Select>
            </StyledFormMobile>
          </Col>
          <Col className="mapFormCol">
            <StyledFormMobile sx={{ m: 1, minWidth: 80 }} size="small">
              <InputLabel id="demo-select-small">
                <Typography
                  component="span"
                  className={this.state.price !== "" ? "menuTitleSmall" : "menuTitleMobile"}>
                  Price
                </Typography>
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={this.state.price}
                label="Price"
                onChange={this.handlePriceChange}
              >
                <MenuItem value="">
                  <Typography component="em" className="menuOptionListMobile" style={{fontFamily:"Butler_Regular"}}>None</Typography>
                </MenuItem>
                {priceList}
              </Select>
            </StyledFormMobile>
          </Col>
          <Col className="mapFormCol" style={{paddingTop:this.state.screenHeight*.02}}>
            <StyledButton
              size="medium"
              onClick={this.resetCategories}
              loadingIndicator="Loading…"
              variant="outlined"
              style={{
                      fontStyle: 'bold', fontSize: 16, maxHeight: 36
                      }}>
              <Typography
                component="span"
                className="buttonTitleBold">
                Reset
              </Typography>
            </StyledButton>
          </Col>
        </Row>
        <Row className="mapPaddingRowMobile">
        </Row>
        <Row>
          <Col>
            <Row style={{minHeight:this.state.screenHeight}}>
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
          </Col>
        </Row>

      </motion.div>
    );
  }



  else{
    if (this.state.refreshMap){

      resetLists();

      //category area gle price

      if (this.state.area === ""){
        if(this.state.category === ""){
          if(this.state.gle === "" || this.state.price === ""){//none selected
            selectedData = data;
            pushAreaList(selectedData, this.state.area);
            pushCatList(selectedData, this.state.category);
            priceData = selectedData;
            pushPriceLists(priceData, this.state);
          }
          else{//just price selected
            selectedData = data[this.state.gle + " " + this.state.price]
            pushAreaList(selectedData, this.state.area);
            pushCatList(selectedData, this.state.category);
            priceData = data;
            pushPriceLists(priceData, this.state);
          }
        }
        else{
          if(this.state.gle === "" || this.state.price === ""){//just category selected
            selectedData = data[this.state.category]
            pushAreaList(selectedData, this.state.area);
            pushCatList(data, this.state.category);
            priceData = selectedData;
            pushPriceLists(priceData, this.state);
          }
          else{//category and price selected
            selectedData = data[this.state.category][this.state.gle + " " + this.state.price]
            pushAreaList(selectedData, this.state.area);
            pushCatList(data[this.state.gle + " " + this.state.price], this.state.category);
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
            pushAreaList(data, this.state.area);
            pushCatList(selectedData, this.state.category);
            priceData = selectedData;
            pushPriceLists(priceData, this.state);
          }
          else{//area and price selected
            selectedData = data[this.state.gle + " " + this.state.price][this.state.area]
            pushAreaList(data[this.state.gle + " " + this.state.price], this.state.area);
            pushCatList(selectedData, this.state.category);
            priceData = data[this.state.area];
            pushPriceLists(data[this.state.area], this.state);
          }
        }
        else{
          if(this.state.gle === "" || this.state.price === ""){//area and category selected
            selectedData = data[this.state.category][this.state.area]
            pushAreaList(data[this.state.category], this.state.area);
            pushCatList(data[this.state.area], this.state.category);
            priceData = selectedData;
            pushPriceLists(selectedData, this.state);
          }
          else{//all selected
            selectedData = data[this.state.category][this.state.gle + " " + this.state.price][this.state.area]
            pushAreaList(data[this.state.category][this.state.gle + " " + this.state.price], this.state.area);
            pushCatList(data[this.state.gle + " " + this.state.price][this.state.area], this.state.category);
            priceData = data[this.state.category][this.state.area];
            pushPriceLists(priceData, this.state);
          }
        }
        listsPush(selectedData, true, this.state, this.handleAreaChangeClick, this.handleCategoryChangeClick, this.onMarkerClick);
      }
      resetPrices();
      pushPriceLists(priceData, this.state);
    }
    else if (this.state.refreshPrices){
      resetPrices();
      pushPriceLists(priceData, this.state);
    }
    
    let randomRestaurantPick = Math.floor(Math.random() * restaurantList.length);

    return (
      <motion.div className="bigNoScrollContainer"
        key={"MapKey"}
        exit={this.state.toMapList ? "slideLeft" : "regular"}
        initial={(this.state.fromMapList) ? {opacity: 0, x: -100, transition: {duration: 1}} : {opacity: 0, y: -30, transition: {duration: 1}}}
        animate={{opacity: 1, y: 0, x: 0, transition: {duration: 1}}}
        variants={exitVariants}
        >
        <Row className="mapStartRow">
          <Col className="mapFormColOne">
            <Row className="mapFormRow">
            <StyledForm sx={{ m: 1, minWidth: 210}} size="small" margin="none">
              <InputLabel margin="none">
                <Typography
                  component="span"
                  className={this.state.category !== "" ? "menuTitleSmall" : "menuTitle"}>
                  Category
                </Typography>
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={this.state.category}
                label="Category"
                onChange={this.handleCategoryChange}
              >
                <MenuItem value="">
                  <Typography
                    component="em"
                    className="menuOptionList">
                    Any
                  </Typography>
                </MenuItem>
                {categoryList}
              </Select>
            </StyledForm>
            </Row>
            <Row className="mapFormRow">
              <StyledButton
                size="small"
                onClick={this.recommendCategory}
                loadingIndicator="Loading…"
                variant="outlined">
                <Typography
                  component="p"
                  className="buttonTitleBold"
                  style={{fontSize:15}}>
                  Category Inspo
                </Typography>
              </StyledButton>
            </Row>
          </Col>
          <Col className="mapFormCol">
            <motion.div
            initial={{x: '.3vw'}}>
              <div>
                <div style={{paddingTop:20}}></div>
                <h4 style={{paddingLeft:3,backgroundColor:'rgba(185, 211, 196, .6)',borderRadius: '10px'}} className='in-between-text-map'>in</h4>
              </div>
            </motion.div>
          </Col>
          <Col className="mapFormCol">
            <StyledForm sx={{ m: 1, minWidth: 167 }} size="small">
              <InputLabel id="demo-select-small">
                <Typography
                  component="span"
                  className={this.state.area !== "" ? "menuTitleSmall" : "menuTitle"}>
                  Area
                </Typography>
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={this.state.area}
                label="Area"
                onChange={this.handleAreaChange}
              >
                <MenuItem value="">
                  <Typography component="em" style={{fontFamily:"Butler_Regular"}}>Any</Typography>
                </MenuItem>
                {areaList}
              </Select>
            </StyledForm>
          </Col>
          <Col className="mapFormCol">
            <StyledForm sx={{ m: 1, minWidth: 100 }} size="small">
              <InputLabel id="demo-select-small">
                <Typography
                  component="span"
                  className={this.state.gle !== "" ? "menuTitleSmall" : "menuTitle"}>
                  ≤, ≥, =
                </Typography>
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={this.state.gle}
                label="Area"
                onChange={this.handleGLEChange}
              >
                <MenuItem value="">
                  <Typography component="em" style={{fontFamily:"Butler_Regular"}}>None</Typography>
                </MenuItem>
                {gleList}
              </Select>
            </StyledForm>
          </Col>
          <Col className="mapFormCol">
            <StyledForm sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small">
                <Typography
                  component="span"
                  className={this.state.price !== "" ? "menuTitleSmall" : "menuTitle"}>
                  Price
                </Typography>
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={this.state.price}
                label="Price"
                onChange={this.handlePriceChange}
              >
                <MenuItem value="">
                  <Typography component="em" style={{fontFamily:"Butler_Regular"}}>None</Typography>
                </MenuItem>
                {priceList}
              </Select>
            </StyledForm>
          </Col>
          <Col className="mapFormCol" style={{paddingRight: this.state.screenWidth-1100, paddingTop: this.state.screenHeight*.018+8}}>
            <StyledButton
              size="medium"
              onClick={this.resetCategories}
              loadingIndicator="Loading…"
              variant="outlined"
              style={{
                      fontStyle: 'bold', fontSize: 16, maxHeight: 36
                      }}>
              <Typography
                component="span"
                className="buttonTitleBold">
                Reset
              </Typography>
            </StyledButton>
          </Col>
          <Col className="mapFormCol" style={{minWidth: 170, paddingRight: 30, paddingTop: this.state.screenHeight*.018+8}}>
            <StyledButton
              component={Link}
              onClick={this.setToMapList}
              size="large"
              to={{pathname: "/list"}}
              state={{ 
                Category: this.state.category, 
                Area: this.state.area, 
                Gle: this.state.gle, 
                Price: this.state.price,
                fromMapList: true}}
              loadingIndicator="Loading…"
              variant="outlined"
              style={{
                      fontStyle: 'italic', maxHeight: 36, fontSize: 16}}>
              <Typography
                component="span"
                className="buttonTitleBold">
                {"To List →"}
              </Typography>
            </StyledButton>
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
            <Row style={{height:this.state.screenHeight*.7-86}}>
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
                <StyledButton
                  component={Link}
                  size="large"
                  to={{
                    pathname: restaurantList[randomRestaurantPick].createPath(),
                    }}
                    state={{Category: this.state.category, Area:this.state.area, Gle:this.state.gle, Price:this.state.price, Page:"/Map"}}
                  loadingIndicator="Loading…"
                  variant="outlined">
                  <Typography
                    component="span"
                    className="buttonTitleBold mapRec">
                    Recommend Me!
                  </Typography>
                </StyledButton>
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
}

MapPage.defaultProps = googleMapStyles;

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
})(withRouter(MapPage))

//export default MapPage