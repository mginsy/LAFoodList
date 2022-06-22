import { Component }from 'react';
import * as React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Restaurant from '../../Restaurant';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Fade from '@mui/material/Fade';
import 'simplebar-react/dist/simplebar.min.css';
import {motion} from 'framer-motion'
import InputBase from '@mui/material/InputBase';

const d3 = require('d3-array'); 
const data = require('../../restaurantData.json');
const otherData = require('../../otherData.json');

const fadeLen = 5000;
const submitFadeLen = 2500;

let totAreas = otherData["AreasADMINONLY"]
const totAreasReset = structuredClone(totAreas)
delete data.AreasADMINONLY

const priceOptions = ["","$","$$","$$$","$$$$"]

//initialize all values

let markerList=[];

let categoryList = [];
let areaList = [];
let listList = [];
let restaurantList = [];

let categoryListValues = [];
let areaListValues = [];

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

const formColor = '#F3F0D7'
const StyledForm = styled(FormControl)({
  '& .MuiInputBase-input': {
    backgroundColor: formColor
  },
});

class MapPage extends Component {

  state = {
    isStart:true,
    isFilled: false,
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
    {
      let fadeSubmit = false;
      if (this.state.area !== "" && event.target.value !== ""){
        fadeSubmit = true;
      }
      this.setState({ category: event.target.value, 
                     refreshMap: true,
                     isFilled: fadeSubmit});
    }

  handleAreaChange = (event) =>
    {
      let fadeSubmit = false;
      if (this.state.category !== "" && event.target.value !== ""){
        fadeSubmit = true;
      }
      this.setState({ area: event.target.value, 
                     refreshMap: true,
                     isFilled: fadeSubmit});
    }
  recommendCategory = (event) =>
  {
    let randomCategoryPick =  Math.floor(Math.random() * categoryList.length);
    let fadeSubmit = false;
    if (this.state.area !== ""){
      fadeSubmit = true;
    }
    this.setState({
      category: categoryListValues[randomCategoryPick], 
      refreshMap: true,
      isFilled: fadeSubmit
    })
  }

  initFadeOver = (event) =>{
    this.setState({
      isStart: false
    })
  }

render() {

  const FullPage = styled.div`
      overflow-y: scroll;
      max-height: ${this.state.screenHeight-250}px
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
      }
    }
  }

  return (
    <motion.div className="bigNoScrollContainer"
      key={"HomeKey"}
      initial={{opacity: 1}}
      exit={{opacity: 0}}
      animate={{opacity: 1, transition: {duration: 3}}}>
      <Fade in={this.state.isStart}
          timeout={fadeLen}
        >
          <Container className="topHome">
            <Row className="homeStartRow homeRow">
              <p className="starterText">What Are You Looking For Today?</p>
            </Row>
            <Row className="homeRow">
              <Col className="homeCol">
                <Row className="inMapRow homeCat">
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
                <Row className="inMapRow">
                  <Link className='recommend-text-small' onClick={this.recommendCategory} to="#" >Recommend Me!</Link>
                </Row>
              </Col>
              <Col className="homeCol">
                <h4 className='in-between-text-home'>in</h4>
              </Col>
              <Col className="homeCol">
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
            </Row>
          </Container>
      </Fade>
      <Fade in={this.state.isFilled}
          timeout={submitFadeLen}
      >
        <Container>
          <Row className="inMapRow homeSubmitRow">
            <Col className="homeSubmitCol">
              <Link className='recommend-text-big' to={{pathname: `/Map`}}
                    state={{Category: this.state.category, Area:this.state.area, Page:""}}>Map View</Link>
            </Col>
            <Col className="homeSubmitCol">
              <Link className='recommend-text-big listBruh' to={{pathname: `/List`}}
                    state={{Category: this.state.category, Area:this.state.area, Page:""}}>List View</Link>
            </Col>
          </Row>
        </Container>
      </Fade>
      <Fade in={this.state.isStart}
          timeout={fadeLen}
      >
        <Row className="inMapRow homeCreatedRow">
          <p className="starterText">Created Deliciously by Max Ginsberg</p>
        </Row>
      </Fade>
    </motion.div>
  );
}
}

export default MapPage