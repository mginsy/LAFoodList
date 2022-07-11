import { Component }from 'react';
import * as React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Link} from 'react-router-dom';
import Fade from '@mui/material/Fade';
import 'simplebar-react/dist/simplebar.min.css';
import {motion} from 'framer-motion';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';


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
  for (let catNum in catData["Cats"]){
    categoryList.push(<MenuItem value={catData["Cats"][catNum]}>{catData["Cats"][catNum]}</MenuItem>)
    categoryListValues.push(catData["Cats"][catNum])
  }
}

const formColor = '#F3F0D7'
const StyledForm = styled(FormControl)({
  '& .MuiInputBase-input': {
    backgroundColor: formColor,
    fontSize: 18
  },
});

const StyledButton = styled(LoadingButton)({
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

const StyledViewButton = styled(LoadingButton)({
  textTransform: 'none',
  color: '#5E454B',
  backgroundColor: '#F3F0D7',
  borderColor: '#F3F0D7'
});

class HomePage extends Component {

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
      if (this.state.area !== "" || event.target.value !== ""){
        fadeSubmit = true;
      }
      this.setState({ category: event.target.value, 
                     refreshMap: true,
                     isFilled: fadeSubmit,
                     isStart: false});
    }

  handleAreaChange = (event) =>
    {
      let fadeSubmit = false;
      if (this.state.category !== "" || event.target.value !== ""){
        fadeSubmit = true;
      }
      this.setState({ area: event.target.value, 
                     refreshMap: true,
                     isFilled: fadeSubmit,
                     isStart: false});
    }
  recommendCategory = (event) =>
  {
    let randomCategoryPick =  Math.floor(Math.random() * categoryList.length);
    let fadeSubmit = true;
    this.setState({
      category: categoryListValues[randomCategoryPick], 
      refreshMap: true,
      isFilled: fadeSubmit,
      isStart: false
    })
  }

render() {
 
  let midHomeVariants = {
    center : {x: this.state.screenWidth*.5-270, transition: {duration: this.state.isStart ? .01 : .5}},
    side: {opacity: 1, x: this.state.screenWidth*.20-150, transition: {duration: .5}}
  }
  
  let picsHomeVariants = {
    unfilled : {opacity: 0, x: 0, transition: {duration: .5}},
    filled: {opacity: 1, x: 0, transition: {duration: 1}}
  }


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
    <div className="bigNoScrollContainer">
      <motion.div
      key={"HomeKey"}
      initial={{opacity: 0}}
      exit={{opacity: 0}}
      animate={{opacity: 1, transition: {duration: 1.4, delay: .1}}}>
        <Row style={{minHeight: this.state.screenHeight*.98-86}}>
          <Col style={{minWidth:540, maxWidth: 540, zIndex: '2'}}>
            <motion.div
            animate={this.state.isFilled ? "side" : "center"}
            variants={midHomeVariants}
            style={{paddingTop: this.state.screenHeight*.35}}>
              <Row className = "homeFormRow">
                <p className="topStarterText">What Are You Looking For Today?</p>
              </Row>
              <Row>
                <Col className="homeCatCol">
                  <Row className = "homeDropdown">
                    <StyledForm sx={{ m: 1, minWidth: 200}} size="small">
                      <InputLabel id="demo-select-small">Category</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={this.state.category}
                        label="Category"
                        onChange={this.handleCategoryChange}
                      >
                        <MenuItem value="">
                          <em>Any</em>
                        </MenuItem>
                        {categoryList}
                      </Select>
                    </StyledForm>
                  </Row>
                  <Row className = "homeDropdown">
                    <StyledButton
                      size="medium"
                      onClick={this.recommendCategory}
                      loadingIndicator="Loading…"
                      variant="outlined">
                      Recommend Me!
                    </StyledButton>
                  </Row>
                </Col>
                <Col className='homeInCol'>
                  <h4 className='in-between-text-home'>in</h4>
                </Col>
                <Col className = "homeDropdown">
                  <StyledForm sx={{ m: 1, minWidth: 170 }} size="small">
                    <InputLabel id="demo-select-small">Area</InputLabel>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      value={this.state.area}
                      label="Area"
                      onChange={this.handleAreaChange}
                    >
                      <MenuItem value="">
                        <em>Any</em>
                      </MenuItem>
                      {areaList}
                    </Select>
                  </StyledForm>
                </Col>
              </Row>
            </motion.div>
            <motion.div
              animate={{x: this.state.screenWidth*.5-270, transition: {duration: .01}}}>
              <Row className = "homeRow" style={{paddingTop: this.state.screenHeight*.57-148-86}}>
                <p className="starterText">Created Deliciously by Max Ginsberg</p>
              </Row>
            </motion.div>
          </Col>
          <Fade in={this.state.isFilled}
                      timeout={.1}>
            <Col style={{paddingLeft: this.state.screenWidth*.08, zIndex: '1'}}>
                <motion.div
                initial={{opacity:0}}
                animate={this.state.isFilled ? "filled" : "unfilled"}
                variants={picsHomeVariants}
                className="homePicCol">
                  <Col className = "homePicCol">
                    <Row className = "homePicRow">
                      <StyledViewButton
                        size="large"
                        component={Link}
                        to={{pathname: `/Map`}}
                        state={{Category: this.state.category, Area:this.state.area, Page:""}}
                        loadingIndicator="Loading…"
                        variant="outlined">
                        Map View
                      </StyledViewButton>
                      <Link to={{pathname: `/Map`}}
                            state={{Category: this.state.category, Area:this.state.area, Page:""}}>
                            <img 
                            src={require(`./mapViewBlur.jpg`)}
                            style={{maxHeight:this.state.screenHeight*.3}}
                            className='img-fluid'
                            alt="cooking..."
                            />
                      </Link>
                    </Row>
                    <Row className = "homePicRow">
                      <StyledViewButton
                        size="large"
                        component={Link}
                        to={{pathname: `/List`}}
                        state={{Category: this.state.category, Area:this.state.area, Page:""}}
                        loadingIndicator="Loading…"
                        variant="outlined">
                        List View
                      </StyledViewButton>
                      <Link to={{pathname: `/List`}}
                            state={{Category: this.state.category, Area:this.state.area, Page:""}}>
                            <img 
                            src={require(`./listViewBlur.jpg`)}
                            style={{maxHeight:this.state.screenHeight*.3}}
                            className='img-fluid'
                            alt="cooking..."
                            />
                      </Link>
                    </Row>
                  </Col>
                </motion.div>
            </Col>
          </Fade>
        </Row>
      </motion.div>
    </div>
  );
}
}

export default HomePage