import { Component }from 'react';
import * as React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Fade from '@mui/material/Fade';
import 'simplebar-react/dist/simplebar.min.css';
import {motion} from 'framer-motion'

const data = require('../../restaurantData2.json');
const otherData = require('../../otherData.json');

const fadeLen = 4000;
const submitFadeLen = 2500;

let totAreas = otherData["AreasADMINONLY"]
const totAreasReset = structuredClone(totAreas)
delete data.AreasADMINONLY

//initialize all values

let categoryList = [];
let areaList = [];

let categoryListValues = [];

function resetLists(){

  categoryList = [];
  areaList = [];

  categoryListValues = [];

  totAreas = structuredClone(totAreasReset)
}

function pushAreaList(areaData){
  for (let areaNum in areaData["Areas"]){
    areaList.push(<MenuItem value={areaData["Areas"][areaNum]}>{areaData["Areas"][areaNum]}</MenuItem>)
  }
}

function pushCatList(catData){
  console.log(catData)
  for (let catNum in catData["Cats"]){
    categoryList.push(<MenuItem value={catData["Cats"][catNum]}>{catData["Cats"][catNum]}</MenuItem>)
    categoryListValues.push(catData["Cats"][catNum])
  }
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
 

  if (this.state.refreshMap){

    resetLists();
    
    let selectedData = {};
    //category area gle price

    if (this.state.area === ""){
      if(this.state.category === ""){//none selected
        selectedData = data;
        pushAreaList(selectedData);
        pushCatList(selectedData);
      }
      else{//just category selected
        selectedData = data[this.state.category]
        pushAreaList(selectedData);
        pushCatList(data);
      }
    }
    else{ 
      if(this.state.category === ""){//just area selected
        selectedData = data[this.state.area]
        pushAreaList(data);
        pushCatList(selectedData);
      }
      else{//area and category selected
        selectedData = data[this.state.category][this.state.area]
        pushAreaList(data[this.state.category]);
        pushCatList(data[this.state.area]);
      }
    }
  }

  return (
    <motion.div className="bigNoScrollContainer"
      key={"HomeKey"}
      initial={{opacity: 1}}
      exit={{opacity: 0}}
      animate={{opacity: 1, transition: {duration: .1}}}>
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