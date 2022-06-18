import { Component }from 'react';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Restaurant from '../../Restaurant';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

const d3 = require('d3-array'); 
const data = require('../../restaurantData.json');
const otherData = require('../../otherData.json');

let totAreas = otherData["AreasADMINONLY"]
const totAreasReset = structuredClone(totAreas)
delete data.AreasADMINONLY

const priceOptions = ["","$","$$","$$$","$$$$"]

//initialize all values

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



class ListPage extends Component {

  state = {
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
      let refMap = this.state.gle !== ""
      this.setState({ price: event.target.value});}
                
  handleGLEChange = (event) =>
    {
      let refMap = this.state.price !== ""
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

render() {

  const FullPage = styled.div`
      overflow-y: scroll;
      max-height: ${this.state.screenHeight-200}px
  `;  

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
              let listListText = currentRestaurant.createListListText(locationNum, this.handleCategoryChangeClick);
              totAreas[currentArea+"Names"].splice(d3.bisectLeft(totAreas[currentArea+"Names"],currentRestaurant.Name.toLowerCase()),0,currentRestaurant.Name.toLowerCase());
              totAreas[currentArea].splice(d3.bisectLeft(totAreas[currentArea+"Names"],currentRestaurant.Name.toLowerCase()),0,listListText);
              
              restaurantList.push({restaurant: currentRestaurant,
                                  locationNum: locationNum});
            }
          }
          else{ // if area is selected
            let locationNum = currentRestaurant.Areas.indexOf(this.state.area)
            let location = currentRestaurant.Locations[locationNum];

            let listListText = currentRestaurant.createListListText(locationNum, this.handleCategoryChangeClick);
            totAreas[this.state.area+"Names"].splice(d3.bisectLeft(totAreas[this.state.area+"Names"],currentRestaurant.Name.toLowerCase()),0,currentRestaurant.Name.toLowerCase());
            totAreas[this.state.area].splice(d3.bisectLeft(totAreas[this.state.area+"Names"],currentRestaurant.Name.toLowerCase()),0,listListText);

            restaurantList.push({restaurant: currentRestaurant,
                                locationNum: locationNum});
          }
        }
      }
    }
  }
  for (let areaNum in areaListValues){
    let currentArea = areaListValues[areaNum]
    if (totAreas[currentArea].length !== 0){
      listList.push(
        <div className = "listAreaText">
          <Link className='recommend-text-big' value={currentArea} onClick={this.handleAreaChangeClick(currentArea)} >{currentArea}</Link>
        </div>
      )
      let listingNum = 0
      while (listingNum < totAreas[currentArea].length){
        if (listingNum+2<totAreas[currentArea].length){
          let listing1 = totAreas[currentArea][listingNum]
          let listing2 = totAreas[currentArea][listingNum+1]
          let listing3 = totAreas[currentArea][listingNum+2]
          listList.push(
            <div className="listPics row">
              <div className="col listPicCol">
                {listing1}
              </div>
              <div className="col listPicCol">
                {listing2}
              </div>
              <div className="col listPicCol">
                {listing3}
              </div>
            </div>
          )
        }
        else if (listingNum+1<totAreas[currentArea].length){
          let listing1 = totAreas[currentArea][listingNum]
          let listing2 = totAreas[currentArea][listingNum+1]
          listList.push(
            <div className="listPics row">
              <div className="col listPicCol">
                {listing1}
              </div>
              <div className="col listPicCol">
                {listing2}
              </div>
              <div className="col listPicCol">

              </div>
            </div>
          )
        }
        else{
          let listing1 = totAreas[currentArea][listingNum]
          listList.push(
            <div className="listPics row">
              <div className="col listPicCol">
                {listing1}
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

  const mapStyles = {
    width: '50%',
    height: '50%',
  };

  return (
    <div>
      <div className="row topListPage">
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
      <div className='listList'>
        <FullPage>
          {listList}
        </FullPage>
      </div>
    </div>
  );
}
}

export default ListPage