import { Component }from 'react';
import { Row, Col } from "react-bootstrap";
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Restaurant from '../../Restaurant';
import { styled } from '@mui/material/styles';
import {Link, useLocation, useParams} from 'react-router-dom';
import 'simplebar-react/dist/simplebar.min.css';
import {motion} from 'framer-motion';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Button from '@mui/material/Button';
import {isMobile} from 'react-device-detect';
import Typography from '@mui/material/Typography';


const data = require('../../restaurantData.json');
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
    fontSize: '23px'
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
  slideRight: {opacity: 0, x: 100, transition: {duration: .5}}
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
  if (isMobile){
    let itemsPushed = 0;
    if (byArea){ 
      let currentArea = currentState.area
      listList.push(
        <div className = "listAreaText">
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
      let listingNum = 0
      while (listingNum < selectedData["restaurants"].length){
        if (listingNum+1<selectedData["restaurants"].length){
          let listing1 = new Restaurant(selectedData["restaurants"][listingNum], currentArea)
          let listing2 = new Restaurant(selectedData["restaurants"][listingNum+1], currentArea)
          listList.push(
            <div>
            <div className="listPicsMobile row">
                <div className="col listPicCol">
                  {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
                </div>
                <div className="col listPicCol">
                  {listing2.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
                </div>
              </div>
              <div className="listPicsBuffer row"></div>
            </div>
          )
        }
        else{
          let listing1 = new Restaurant(selectedData["restaurants"][listingNum], currentArea)
          listList.push(
            <div>
              <div className="listPicsMobile row">
                <div className="col listPicCol">
                  {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
                </div>
                <div className="col listPicCol">
                
                </div>
              </div>
              <div className="listPicsBuffer row"></div>
            </div>
          )
        }
        listingNum+=2;
      }
    }
    else{
      for (let areaNum in selectedData["Areas"]){
        let currentArea = selectedData["Areas"][areaNum]
        if (itemsPushed === 0){
          listList.push(
            <div className = "listAreaText">
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
            <div className = "listAreaText mapAreaTitle">
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
        let listingNum = 0
        while (listingNum < selectedData[currentArea]["restaurants"].length){
          if (listingNum+1<selectedData[currentArea]["restaurants"].length){
            let listing1 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum], currentArea)
            let listing2 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum+1], currentArea)
            listList.push(
              <div>
                <div className="listPicsMobile row">
                  <div className="col listPicCol">
                    {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
                  </div>
                  <div className="col listPicCol">
                    {listing2.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
                  </div>
                </div>
                <div className="listPicsBuffer row"></div>
              </div>
            )
          }
          else{
            let listing1 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum], currentArea)
            listList.push(
              <div>
                <div className="listPicsMobile row">
                  <div className="col listPicCol">
                    {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
                  </div>
                  <div className="col listPicCol">
                  
                  </div>
                </div>
                <div className="listPicsBuffer row"></div>
              </div>
            )
          }
          listingNum+=2;
        }
      }
    }
  }


  else{
    let itemsPushed = 0;
    if (byArea){ 
      let currentArea = currentState.area
      listList.push(
        <div className = "listAreaText">
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
      let listingNum = 0
      while (listingNum < selectedData["restaurants"].length){
        if (listingNum+2 < selectedData["restaurants"].length){
          let listing1 = new Restaurant(selectedData["restaurants"][listingNum], currentArea)
          let listing2 = new Restaurant(selectedData["restaurants"][listingNum+1], currentArea)
          let listing3 = new Restaurant(selectedData["restaurants"][listingNum+2], currentArea)
          listList.push(
            <div>
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
              <div className="listPicsBuffer row"></div>
            </div>
          )
        }
        else if (listingNum+1<selectedData["restaurants"].length){
          let listing1 = new Restaurant(selectedData["restaurants"][listingNum], currentArea)
          let listing2 = new Restaurant(selectedData["restaurants"][listingNum+1], currentArea)
          listList.push(
            <div>
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
              <div className="listPicsBuffer row"></div>
            </div>
          )
        }
        else{
          let listing1 = new Restaurant(selectedData["restaurants"][listingNum], currentArea)
          listList.push(
            <div>
              <div className="listPics row">
                <div className="col listPicCol">
                  {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
                </div>
                <div className="col listPicCol">
                
                </div>
                <div className="col listPicCol">
      
                </div>
              </div>
              <div className="listPicsBuffer row"></div>
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
            <div className = "listAreaText mapAreaTitle">
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
        let listingNum = 0
        while (listingNum < selectedData[currentArea]["restaurants"].length){
          if (listingNum+2 < selectedData[currentArea]["restaurants"].length){
            let listing1 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum], currentArea)
            let listing2 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum+1], currentArea)
            let listing3 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum+2], currentArea)
            listList.push(
              <div>
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
                <div className="listPicsBuffer row"></div>
              </div>
            )
          }
          else if (listingNum+1<selectedData[currentArea]["restaurants"].length){
            let listing1 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum], currentArea)
            let listing2 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum+1], currentArea)
            listList.push(
              <div>
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
                <div className="listPicsBuffer row"></div>
              </div>
            )
          }
          else{
            let listing1 = new Restaurant(selectedData[currentArea]["restaurants"][listingNum], currentArea)
            listList.push(
              <div>
                <div className="listPics row">
                  <div className="col listPicCol">
                    {listing1.createListListText(handleCategoryChangeClick, currentState.category, currentState.area, currentState.gle, currentState.price)}
                  </div>
                  <div className="col listPicCol">
                  
                  </div>
                  <div className="col listPicCol">
        
                  </div>
                </div>
                <div className="listPicsBuffer row"></div>
              </div>
            )
          }
          listingNum+=3;
        }
      }
    }
  }
}

class ListPage extends Component {

  state = {
    category: (typeof(this.props.locState.Category) != "undefined" ? this.props.locState.Category : ""),
    area: (typeof(this.props.locState.Area) != "undefined" ? this.props.locState.Area : ""),
    gle: (typeof(this.props.locState.Gle) != "undefined" ? this.props.locState.Gle : ""),
    price: (typeof(this.props.locState.Price) != "undefined" ? this.props.locState.Price : ""),
    fromMapList: (typeof(this.props.locState.fromMapList) != "undefined" ? this.props.locState.fromMapList : false),
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

  setToMapList = (event) => {
    this.setState({
      toMapList: true
    })
  };

render(){

  if (isMobile){
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

    if (this.state.refreshPrices){
      resetPrices();
      pushPriceLists(priceData, this.state);
    }

    return (
      <div className="bigNoScrollContainer">
        <motion.div 
          key={"ListKey"}
          exit={this.state.toMapList ? "slideRight" : "regular"}
          initial={(this.state.fromMapList) ? {opacity: 0, x: 100, transition: {duration: 1}} : {opacity: 0, y: -30, transition: {duration: 1}}}
          animate={{opacity: 1, y: 0, x: 0, transition: {duration: 1}}}
          variants={exitVariants}>
          <Row className="mapStartRow">
          <Col className="mapFormCol">
            <Row className="mapFormRow">
            <StyledFormMobile sx={{ m: 1, minWidth: 170}} size="small" margin="none">
              <InputLabel>
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
        </motion.div>
        <motion.div
        key={"ListKey"}
        exit={this.state.toMapList ? "slideRight" : "regular"}
        initial={(this.state.fromMapList) ? {opacity: 0, x: 100 } : {opacity: 0 }}
        animate={{opacity: 1, x: 0, transition: {duration: 1}}}
        variants={exitVariants}>
          <Row className='listPaddingRow'></Row>
          <Row className='listList'>
            <Scrollbars className="Scrollbar" style={{ height: this.state.screenHeight-215, width:this.state.screenWidth }}
                            autoHide
                            autoHideTimeout={1000}
                            autoHideDuration={200}
                            renderTrackHorizontal={props => <div {...props} style={{width:0}} className="track-horizontal"/>}>
                {listList}
            </Scrollbars>
          </Row>
        </motion.div>
      </div>
    );
  }


  else{
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

    if (this.state.refreshPrices){
      resetPrices();
      pushPriceLists(priceData, this.state);
    }

    return (
      <div className="bigNoScrollContainer">
        <motion.div 
          key={"ListKey"}
          exit={this.state.toMapList ? "slideRight" : "regular"}
          initial={(this.state.fromMapList) ? {opacity: 0, x: 100, transition: {duration: 1}} : {opacity: 0, y: -30, transition: {duration: 1}}}
          animate={{opacity: 1, y: 0, x: 0, transition: {duration: 1}}}
          variants={exitVariants}>
          <Row className="listStartRow">
          <Col xs={2} className="firstListForm" style={{minWidth: 180, paddingRight: 30}}>
            <StyledButton
              component={Link}
              onClick={this.setToMapList}
              size="large"
              to={{pathname: "/map"}}
              state={{ 
                Category: this.state.category, 
                Area: this.state.area, 
                Gle: this.state.gle, 
                Price: this.state.price,
                fromMapList: true}}
              
              variant="outlined"
              style={{
                      fontStyle: 'italic', fontSize: 18, maxHeight: 36
                      }}>
              <Typography
                component="span"
                className="buttonTitleBold">
                {"← To Map"}
              </Typography>
            </StyledButton>
          </Col>
            <Col xs={2} className="firstListForm">
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
            <Col className="midListForm">
            <StyledForm sx={{ m: 1, minWidth: 210}} size="small" margin="none">
              <InputLabel>
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
            </Col>
            <Col className="lastListForm" style={{minWidth: 480, paddingLeft:this.state.screenWidth*.20-200}}>
              <Row className="listFormLastCol">
                <Col className="lastListCol">
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
                <Col className="lastListCol">
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
                <Col className="lastListCol">
                  <StyledButton
                    size="medium"
                    onClick={this.resetCategories}
                    
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
            </Col> 
          </Row>
        </motion.div>
        <motion.div
        key={"ListKey"}
        exit={this.state.toMapList ? "slideRight" : "regular"}
        initial={(this.state.fromMapList) ? {opacity: 0, x: 100 } : {opacity: 0 }}
        animate={{opacity: 1, x: 0, transition: {duration: 1}}}
        variants={exitVariants}>
          <Row className='listPaddingRow'></Row>
          <Row className='listList'>
            <Scrollbars className="Scrollbar" style={{ height: this.state.screenHeight-215, width:this.state.screenWidth }}
                            autoHide
                            autoHideTimeout={1000}
                            autoHideDuration={200}
                            renderTrackHorizontal={props => <div {...props} style={{width:0}} className="track-horizontal"/>}>
                {listList}
            </Scrollbars>
          </Row>
        </motion.div>
      </div>
    );
  }

  
}
}

export default withRouter(ListPage)