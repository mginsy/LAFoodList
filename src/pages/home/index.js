import { Component }from 'react';
import * as React from 'react';
import { Row, Col } from "react-bootstrap";
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
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import {isMobile} from 'react-device-detect';
import mapPic from './mapViewBlur.jpg'
import listPic from './listViewBlur.jpg'


const data = require('../../restaurantData.json');
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
  opacity: .8,
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

  if (isMobile){
    let midHomeVariants = {
      top : {opacity: 1, y: -this.state.screenHeight*.24, transition: {duration: this.state.isStart ? .01 : .5}},
      mid: {opacity: 1 , transition: {duration: .5}}
    }
  
    let topHomeVariants = {
      shown: {opacity: 1, transition: {duration: 1.4, delay: .1}},
      notShown:{opacity: 0, transition: {duration: .5}} 
    }
  
    //1504*.235 = 368.5 - 200 = 168.5
    
    let picsHomeVariants = {
      unfilled : {opacity: 0, x:  this.state.screenWidth*.37, y:-this.state.screenHeight*.18, transition: {duration: .5}},
      filled: {opacity: 1, x: this.state.screenWidth*.37, y:-this.state.screenHeight*.18, transition: {duration: 1}}
    }

    let picsHomeVariants2 = {
      unfilled2 : {opacity: 0, x:  this.state.screenWidth*.87, y:-this.state.screenHeight*.18, transition: {duration: .5}},
      filled2: {opacity: 1, x: this.state.screenWidth*.87, y:-this.state.screenHeight*.18, transition: {duration: 1}}
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
        fontSize:24,
      },
      '&:hover, &.Mui-focusVisible': {
        zIndex: 2,
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
        '& .css-utcns5':{
          opacity: 1
        }
      },
    }));
  
  
    if (this.state.refreshMap){
  
      resetLists();
      
      let selectedData = {};
      //category area gle price
  
      if (this.state.area === ""){
        if(this.state.category === ""){//none selected
          selectedData = data;
          pushAreaList(selectedData, this.state.area);
          pushCatList(selectedData, this.state.category);
        }
        else{//just category selected
          selectedData = data[this.state.category]
          pushAreaList(selectedData, this.state.area);
          pushCatList(data, this.state.category);
        }
      }
      else{ 
        if(this.state.category === ""){//just area selected
          selectedData = data[this.state.area]
          pushAreaList(data, this.state.area);
          pushCatList(selectedData, this.state.category);
        }
        else{//area and category selected
          selectedData = data[this.state.category][this.state.area]
          pushAreaList(data[this.state.category], this.state.area);
          pushCatList(data[this.state.area], this.state.category);
        }
      }
    }
  
    return (
      <div className="bigNoScrollContainer" style={{maxHeight:this.state.screenHeight*.99-86}}>
        <div className="outerHomeBrandDivMobile" style={{zIndex: '1'}}>
          <motion.div
            key={"HomeKey"}
            initial={{opacity: 0}}
            exit={{opacity: 0}}
            animate={this.state.isFilled ? "notShown" : "shown"}
            variants={topHomeVariants}
            className="homeBrandDivMobile"
          >
            <p className="home-brand" style={{fontSize:30}}>LA Food List</p>
          </motion.div>
        </div>
        <motion.div
        key={"HomeKey"}
        initial={{opacity: 0}}
        exit={{opacity: 0}}
        animate={{opacity: 1, transition: {duration: 1.4, delay: .1}}}>
          <Row className = "centerDivMobile">
            <Col className = "centerDivMobile" style={{minWidth:540, maxWidth: 540}}>
              <div style={{paddingTop: this.state.screenHeight*.43}}></div>
              <motion.div
              animate={this.state.isFilled ? "top" : "mid"}
              variants={midHomeVariants}
              style={{backgroundColor:"rgba(185, 211, 196, .5)", paddingBottom:'1vh', borderRadius: '10px', zIndex: '3', position: 'relative'}}>
                <Row className = "homeFormRow">
                  <p className="topStarterTextMobile">What Are You Looking For Today?</p>
                </Row>
                <Row  className = "homeFormRow" >
                  <Col>
                    <StyledFormMobile sx={{ m: 1, minWidth: 140}} size="small" margin="none">
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
                  </Col>
                  <Col >
                    <StyledFormMobile sx={{ m: 1, minWidth: 114 }} size="small">
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
                          <Typography
                            component="em"
                            className="menuOptionListMobile">
                            Any
                          </Typography>
                        </MenuItem>
                        {areaList}
                      </Select>
                    </StyledFormMobile>
                  </Col>
                </Row>
              </motion.div>
            </Col>
          </Row>
            <Fade in={this.state.isFilled}
                        timeout={.1}>
              <Row style={{zIndex: '2'}}>
                <Row>
                  <motion.div
                  initial={{opacity:0}}
                  animate={this.state.isFilled ? "filled" : "unfilled"}
                  variants={picsHomeVariants}>
                    <ImageButton
                      focusRipple
                      key={'Map View'}
                      style={{
                        width: this.state.screenWidth*.35,
                        height: this.state.screenWidth*.35/aspectRatio,
                        borderRadius: '5px'
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
                          style={{fontFamily:"Butler_Bold"}}
                        >
                          Map View
                          <ImageMarked className="MuiImageMarked-root" />
                        </Typography>
                      </Image>
                    </ImageButton>
                  </motion.div>
                </Row>
                <Row>
                  <motion.div
                  initial={{opacity:0}}
                  animate={this.state.isFilled ? "filled2" : "unfilled2"}
                  variants={picsHomeVariants2}>
                    <ImageButton
                        focusRipple
                        key={'List View'}
                        style={{
                          width: this.state.screenWidth*.35,
                          height: this.state.screenWidth*.35/aspectRatio,
                          borderRadius: '5px'
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
                            style={{fontFamily:"Butler_Bold"}}
                          >
                          List View
                          <ImageMarked className="MuiImageMarked-root" />
                        </Typography>
                      </Image>
                    </ImageButton>
                  </motion.div>
                </Row>
              </Row>
            </Fade>
        </motion.div>
      </div>
    );
  }
  else{
    let midHomeVariants = {
      mid : {x: this.state.screenWidth*.5-270, transition: {duration: this.state.isStart ? .01 : .5}},
      top: {opacity: 1, x: 0.2713*this.state.screenWidth - 200, y:0.2684*this.state.screenHeight - 263.68,transition: {duration: .5}}
    }
  
    let topHomeVariants = {
      shown: {opacity: 1, transition: {duration: 1.4, delay: .1}},
      notShown:{opacity: 0, transition: {duration: .5}} 
    }
  
    //1504*.235 = 368.5 - 200 = 168.5
    
    let picsHomeVariants = {
      unfilled : {opacity: 0, x: 0, y:-196, transition: {duration: .5}},
      filled: {opacity: 1, x: 0, y:-196, transition: {duration: 1}}
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
        fontSize:24,
      },
      '&:hover, &.Mui-focusVisible': {
        zIndex: 2,
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
        '& .css-utcns5':{
          opacity: 1
        }
      },
    }));
  
  
    if (this.state.refreshMap){
  
      resetLists();
      
      let selectedData = {};
      //category area gle price
  
      if (this.state.area === ""){
        if(this.state.category === ""){//none selected
          selectedData = data;
          pushAreaList(selectedData, this.state.area);
          pushCatList(selectedData, this.state.category);
        }
        else{//just category selected
          selectedData = data[this.state.category]
          pushAreaList(selectedData, this.state.area);
          pushCatList(data, this.state.category);
        }
      }
      else{ 
        if(this.state.category === ""){//just area selected
          selectedData = data[this.state.area]
          pushAreaList(data, this.state.area);
          pushCatList(selectedData, this.state.category);
        }
        else{//area and category selected
          selectedData = data[this.state.category][this.state.area]
          pushAreaList(data[this.state.category], this.state.area);
          pushCatList(data[this.state.area], this.state.category);
        }
      }
    }
  
    return (
      <div className="bigNoScrollContainer" style={{maxHeight:this.state.screenHeight*.99-86}}>
        <div className="outerHomeBrandDiv" style={{zIndex: '1'}}>
          <motion.div
            key={"HomeKey"}
            initial={{opacity: 0}}
            exit={{opacity: 0}}
            animate={this.state.isFilled ? "notShown" : "shown"}
            variants={topHomeVariants}
            className="homeBrandDiv"
          >
            <p className="home-brand" style={{fontSize:60}}>LA Food List</p>
          </motion.div>
        </div>
        <motion.div
        key={"HomeKey"}
        initial={{opacity: 0}}
        exit={{opacity: 0}}
        animate={{opacity: 1, transition: {duration: 1.4, delay: .1}}}>
          <Row>
            <Col style={{minWidth:540, maxWidth: 540}}>
              <div style={{paddingTop: this.state.screenHeight*.13-30}}></div>
              <motion.div
              animate={this.state.isFilled ? "top" : "mid"}
              variants={midHomeVariants}
              style={{backgroundColor:"rgba(185, 211, 196, .5)", paddingBottom:'1vh', borderRadius: '10px', zIndex: '3', position: 'relative'}}>
                <Row className = "homeFormRow">
                  <p className="topStarterText">What Are You Looking For Today?</p>
                </Row>
                <Row>
                  <Col className="homeCatCol">
                    <Row className = "homeDropdown">
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
                    </Row>
                    <Row className = "homeDropdown">
                      <StyledButton
                        size="medium"
                        onClick={this.recommendCategory}
                        
                        variant="outlined"
                        style={{fontWeight:550, fontSize: 14}}>
                          <Typography
                            component="span"
                            className="buttonTitleBold">
                            Category Inspo
                          </Typography>
                      </StyledButton>
                    </Row>
                  </Col>
                  <Col className='homeInCol'>
                    <h4 className='in-between-text-home'>in</h4>
                  </Col>
                  <Col className = "homeDropdown">
                    <StyledForm sx={{ m: 1, minWidth: 170 }} size="small">
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
                          <Typography
                            component="em"
                            className="menuOptionList">
                            Any
                          </Typography>
                        </MenuItem>
                        {areaList}
                      </Select>
                    </StyledForm>
                  </Col>
                </Row>
              </motion.div>
              <motion.div
                animate={{x: this.state.screenWidth*.5-270, transition: {duration: .01}}}>
                <Row className = "homeRow" style={{paddingTop: this.state.screenHeight*.80-171-86-196}}>
                  <p className="starterText" style={{backgroundColor:"rgba(185, 211, 196, .5)", paddingLeft:'.5vw', paddingRight:'.5vw', borderRadius: '10px'}}>Created Deliciously by Max Ginsberg</p>
                </Row>
              </motion.div>
            </Col>
            <Fade in={this.state.isFilled}
                        timeout={.1}>
              <Col style={{paddingLeft: this.state.screenWidth*.35-300, zIndex: '2'}}>
                  <motion.div
                  initial={{opacity:0}}
                  animate={this.state.isFilled ? "filled" : "unfilled"}
                  variants={picsHomeVariants}
                  className="homePicCol"
                  id="homePicCol">
                    <Col className = "homePicCol" style={{minHeight:this.state.screenHeight*.8}}>
                      <Row className = "homePicRow">
                        <ImageButton
                          focusRipple
                          key={'Map View'}
                          style={{
                            width: this.state.screenWidth*.35,
                            height: this.state.screenWidth*.35/aspectRatio,
                            borderRadius: '10px'
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
                              style={{fontFamily:"Butler_Bold"}}
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
                              height: this.state.screenWidth*.35/aspectRatio,
                              borderRadius: '10px'
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
                                style={{fontFamily:"Butler_Bold"}}
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
}

export default HomePage