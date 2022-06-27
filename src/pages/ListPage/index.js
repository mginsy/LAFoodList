import { Component }from 'react';
import { Row, Col } from "react-bootstrap";
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Restaurant from '../../Restaurant';
import styled from 'styled-components';
import {Link, useLocation, useParams} from 'react-router-dom';
import 'simplebar-react/dist/simplebar.min.css';
import {motion} from 'framer-motion';
import { Scrollbars } from 'react-custom-scrollbars-2';

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

let categoryList = [];
let areaList = [];
let listList = [];
let gleList = [];
let priceList = [];
let categoryListValues = [];

let selectedData = {};
let priceData = {};

function resetLists(){
  categoryList = [];
  areaList = [];
  listList = [];
  gleList = [];
  priceList = [];
  categoryListValues = [];

  totAreas = structuredClone(totAreasReset)
}

function resetPrices(){
  gleList = [];
  priceList = [];
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
  let itemsPushed = 0;
  if (byArea){ 
    let currentArea = currentState.area
    listList.push(
      <div className = "listAreaText">
        <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
      </div>
    )
    let listingNum = 0
    while (listingNum < selectedData["restaurants"].length){
      if (listingNum+2 < selectedData["restaurants"].length){
        let listing1 = new Restaurant(selectedData["restaurants"][listingNum], currentArea)
        let listing2 = new Restaurant(selectedData["restaurants"][listingNum+1], currentArea)
        let listing3 = new Restaurant(selectedData["restaurants"][listingNum+2], currentArea)
        listList.push(
          <div className="listPics row">
            <div className="col listPicCol">
              {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
            </div>
            <div className="col listPicCol">
              {listing2.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
            </div>
            <div className="col listPicCol">
              {listing3.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
            </div>
          </div>
        )
      }
      else if (listingNum+1<selectedData["restaurants"].length){
        let listing1 = new Restaurant(selectedData["restaurants"][listingNum], currentArea)
        let listing2 = new Restaurant(selectedData["restaurants"][listingNum+1], currentArea)
        listList.push(
          <div className="listPics row">
            <div className="col listPicCol">
              {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
            </div>
            <div className="col listPicCol">
              {listing2.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
            </div>
            <div className="col listPicCol">

            </div>
          </div>
        )
      }
      else{
        let listing1 = new Restaurant(selectedData["restaurants"][listingNum], currentArea)
        listList.push(
          <div className="listPics row">
            <div className="col listPicCol">
              {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
            </div>
            <div className="col listPicCol">
            
            </div>
            <div className="col listPicCol">
  
            </div>
          </div>
        )
      }
      listingNum+=3;
    }
  }
  else{
    for (let areaNum in selectedData["Areas"]){
      let currentArea = selectedData["Areas"][areaNum]
      if (itemsPushed === 0){
        listList.push(
          <div className = "listAreaText">
            <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
          </div>
        )
        itemsPushed++;
      }
      else{
        listList.push(
          <div className = "listAreaText mapAreaTitle">
            <Link className='recommend-text-big' value={currentArea} onClick={handleAreaChangeClick(currentArea)}  to="#">{currentArea}</Link>
          </div>
        )
        itemsPushed++;
      }
      let listingNum = 0
      while (listingNum < selectedData[currentArea]["restaurants"].length){
        if (listingNum+2 < selectedData[currentArea]["restaurants"].length){
          let listing1 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum], currentArea)
          let listing2 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum+1], currentArea)
          let listing3 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum+2], currentArea)
          listList.push(
            <div className="listPics row">
              <div className="col listPicCol">
                {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
              </div>
              <div className="col listPicCol">
                {listing2.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
              </div>
              <div className="col listPicCol">
                {listing3.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
              </div>
            </div>
          )
        }
        else if (listingNum+1<selectedData[currentArea]["restaurants"].length){
          let listing1 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum], currentArea)
          let listing2 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum+1], currentArea)
          listList.push(
            <div className="listPics row">
              <div className="col listPicCol">
                {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
              </div>
              <div className="col listPicCol">
                {listing2.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
              </div>
              <div className="col listPicCol">
  
              </div>
            </div>
          )
        }
        else{
          let listing1 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum], currentArea)
          listList.push(
            <div className="listPics row">
              <div className="col listPicCol">
                {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
              </div>
              <div className="col listPicCol">
              
              </div>
              <div className="col listPicCol">
    
              </div>
            </div>
          )
        }
        listingNum+=3;
      }
    }
  }
}

class ListPage extends Component {

  state = {
    category: (typeof(this.props.locState.Category) != "undefined" ? this.props.locState.Category : ""),
    area: (typeof(this.props.locState.Area) != "undefined" ? this.props.locState.Area : ""),
    gle: (typeof(this.props.locState.gle) != "undefined" ? this.props.locState.gle : ""),
    price: (typeof(this.props.locState.Price) != "undefined" ? this.props.locState.Price : ""),
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
                     gle: "",
                     price: "" });}

  handleAreaChange = (event) =>
    {
      this.setState({ area: event.target.value, 
                     gle: "",
                     price: "" });}

  handleAreaChangeClick = param => e => {
    this.setState({ area: param });
  };

  handleCategoryChangeClick = param => e => {
    this.setState({ category: param
    });
  };

  handlePriceChange = (event) =>
    {
      this.setState({ price: event.target.value});}
                
  handleGLEChange = (event) =>
    {
      this.setState({ gle: event.target.value,});}

  recommendCategory = (event) =>
  {
    let randomCategoryPick =  Math.floor(Math.random() * categoryList.length);
    this.setState({
      category: categoryListValues[randomCategoryPick], 
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
      gle: "",
      price: ""
    })
  }

render(){

  resetLists();

  //category area gle price
  if (this.state.area === ""){
    if(this.state.category === ""){
      if(this.state.gle === "" || this.state.price === ""){//none selected
        console.log("hi3")
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
    console.log(selectedData)
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

  if (this.state.refreshPrices){
    resetPrices();
    pushPriceLists(priceData, this.state);
  }


  return (
    <div className="bigNoScrollContainer">
      <motion.div 
        key={"ListKey"}
        exit={{opacity: 0}}
        initial={{opacity: 0, y: -30}}
        animate={{opacity: 1, y: 0, transition: {duration: 1}}}>
        <Row className="listStartRow">
          <Col className="firstListForm">
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
          <Col className="midListForm">
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
          </Col>
          <Col className="lastListForm">
            <Row className="listFormLastCol">
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
                <Link className='recommend-text-big' onClick={this.resetCategories} to="#" >Reset</Link>
              </Col>
            </Row>   
          </Col> 
        </Row>
      </motion.div>
      <motion.div
      key={"ListKey"}
      exit={{opacity: 0}}
      initial={{opacity: 0, }}
      animate={{opacity: 1, transition: {duration: 2}}}>
        <Row className='listPaddingRow'></Row>
        <Row className='listList'>
          <Scrollbars className="Scrollbar" style={{ height: this.state.screenHeight-215, width:this.state.screenWidth }}
                          autoHide
                          autoHideTimeout={1000}
                          autoHideDuration={200}>
              {listList}
          </Scrollbars>
        </Row>
      </motion.div>
    </div>
  );
}
}

export default withRouter(ListPage)