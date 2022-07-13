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
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import mapPic from './mapViewBlur.jpg'
import listPic from './listViewBlur.jpg'


const data = require('../../restaurantData2.json');
const otherData = require('../../otherData.json');

const aspectRatio = 1900/860

let totAreas = otherData["AreasADMINONLY"]
const totAreasReset = structuredClone(totAreas)
delete data.AreasADMINONLY

const imageButtonTextColor = "#5E454B";

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

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: imageButtonTextColor,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

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
    side: {opacity: 1, x: this.state.screenWidth*.363-380, transition: {duration: .5}}
  }

  //1504*.235 = 368.5 - 200 = 168.5
  
  let picsHomeVariants = {
    unfilled : {opacity: 0, x: 0, transition: {duration: .5}},
    filled: {opacity: 1, x: 0, transition: {duration: 1}}
  }

  let Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  }));
  
  let ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: this.state.screenHeight*.31,
    [theme.breakpoints.down('sm')]: {
      width: '100% !important', // Overrides inline-style
    },
    '& .MuiTypography-root': {
      backgroundColor: 'rgba(0, 0, 0, .1)',
      color:imageButtonTextColor,
      fontSize:24
    },
    '&:hover, &.Mui-focusVisible': {
      zIndex: 1,
      '& .MuiImageBackdrop-root': {
        opacity: 0.05,
      },
      '& .MuiImageMarked-root': {
        opacity: 0,
      },
      '& .MuiTypography-root': {
        border: '4px solid currentColor',
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
    },
  }));


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
                      variant="outlined"
                      style={{fontStyle:'bold', fontSize: 14}}>
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
            <Col style={{paddingLeft: this.state.screenWidth*.35-300, zIndex: '1'}}>
                <motion.div
                initial={{opacity:0}}
                animate={this.state.isFilled ? "filled" : "unfilled"}
                variants={picsHomeVariants}
                className="homePicCol">
                  <Col className = "homePicCol" style={{minHeight:this.state.screenHeight*.8}}>
                    <Row className = "homePicRow">
                      <ImageButton
                        focusRipple
                        key={'Map View'}
                        style={{
                          width: this.state.screenWidth*.35,
                          height: this.state.screenWidth*.35/aspectRatio
                        }}
                        component={Link}
                        to={{pathname: `/Map`}}
                        state={{Category: this.state.category, Area:this.state.area, Page:""}}
                      >
                        <ImageSrc style={{ backgroundImage: `url(${mapPic})` }} />
                        <ImageBackdrop className="MuiImageBackdrop-root" />
                        <Image>
                          <Typography
                            component="span"
                            variant="subtitle2"
                            sx={{
                              position: 'relative',
                              p: 4,
                              pt: 2,
                              pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                            }}
                          >
                            Map View
                            <ImageMarked className="MuiImageMarked-root" />
                          </Typography>
                        </Image>
                      </ImageButton>
                    </Row>
                    <Row className = "homePicRow">
                      <ImageButton
                          focusRipple
                          key={'List View'}
                          style={{
                            width: this.state.screenWidth*.35,
                            height: this.state.screenWidth*.35/aspectRatio
                          }}
                          component={Link}
                          to={{pathname: `/List`}}
                          state={{Category: this.state.category, Area:this.state.area, Page:""}}
                        >
                          <ImageSrc style={{ backgroundImage: `url(${listPic})` }} />
                          <ImageBackdrop className="MuiImageBackdrop-root" />
                          <Image>
                            <Typography
                              component="span"
                              variant="subtitle2"
                              sx={{
                                position: 'relative',
                                p: 4,
                                pt: 2,
                                pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                              }}
                            >
                            List View
                            <ImageMarked className="MuiImageMarked-root" />
                          </Typography>
                        </Image>
                      </ImageButton>
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