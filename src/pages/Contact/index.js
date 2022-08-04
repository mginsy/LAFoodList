import React, { useState} from 'react'
import {Col, Row} from 'react-bootstrap'
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField'
import ToggleButton  from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {isMobile} from 'react-device-detect';
//import 'react-calendar/dist/Calendar.css';

const formColor = '#F3F0D7'
const StyledText = styled(TextField)({
  '& .MuiInputBase-formControl': {
    backgroundColor: formColor,
    fontFamily: ['Butler_Regular'].join(',')
  },
  '& .MuiInputLabel-formControl': {
    fontFamily: ['Butler_Regular'].join(',')
  },
});


function Contact() {

    const [nameVal, setNameValue] = useState("");
    const [emailVal, setEmailValue] = useState("");
    const [commentsVal, setCommentsValue] = useState("");
    const [alignment, setAlignment] = React.useState('Restaurant Rec');
    const [isFilled, setFilled] = useState(false);

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment !== null) {
          setAlignment(newAlignment);
        }
    };
    const onNameChange = (e) => {
        setNameValue(e.target.value);
        if (e.target.value.length > 0 && 
            emailVal.length > 0 && 
            emailVal.includes("@") && 
            emailVal.includes(".") && 
            commentsVal.length > 0){
            setFilled(true);
        }
        else{
            setFilled(false);
        }
    }
    const onEmailChange = (e) => {
        setEmailValue(e.target.value);
        if (nameVal.length > 0 && 
            e.target.value.length > 0 && 
            emailVal.includes("@") && 
            emailVal.includes(".") && 
            commentsVal.length > 0){
            setFilled(true);
        }
        else{
            setFilled(false);
        }
    }
    const onCommentsChange = (e) => {
        setCommentsValue(e.target.value);
        if (nameVal.length > 0 && 
            emailVal.length > 0 && 
            emailVal.includes("@") && 
            emailVal.includes(".") && 
            e.target.value.length > 0){
            setFilled(true);
        }
        else{
            setFilled(false);
        }
    }

    const sendEmail = (e) => {

        const emailJSON = {"subject":alignment,"name":nameVal,"email":emailVal,"message":commentsVal}

        console.log(emailJSON)

        if (!(emailVal.includes("@") && emailVal.includes("."))){ //email wrong
        }
        else if (nameVal.length === 0 || commentsVal.length === 0){ //other thing wrong
        }
        else{ //everything right
            axios.post(`https://lafoodemailserver.herokuapp.com/sendEmail`, emailJSON)
            .then(res => {
                console.log(res);
            })
        }
      };

      const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
        color: "#5E454B !important",
        backgroundColor: "#e3bd8c",
        textTransform: 'none',
        '&.MuiToggleButtonGroup':{
            color:'#111111'
        }
      });

      const StyledToggleButton = styled(ToggleButton)({
        color: "#5E454B !important",
        backgroundColor: "#EDE8BF",
        textTransform: 'none',
        '&:hover': {
            backgroundColor: "#E7E0AD"
        },

      });

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

    if (isMobile){
        return (
            <motion.div className="bigNoScrollContainer"
            exit={{opacity: 0}}
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 1}}}>
                <Row className="topRowContact">
                    <StyledToggleButtonGroup variant="contained" aria-label="text alignment"
                        value={alignment}
                        exclusive
                        onChange={handleAlignment}>
                        <StyledToggleButton variant="contained" value="Restaurant Rec" size="small" className="contactButton">
                            <p className="buttonTextMobile">Restaurant Rec</p>
                        </StyledToggleButton >
                        <StyledToggleButton  variant="contained" value="I am a Restaurant" size="small" className="contactButton">
                            <p className="buttonTextMobile">I am a Restaurant</p>
                        </StyledToggleButton >
                        <StyledToggleButton  variant="contained" value="Other / General" size="small" className="contactButton">
                            <p className="buttonTextMobile">General / Suggestion / Other</p>
                        </StyledToggleButton >
                    </StyledToggleButtonGroup>
                </Row>
                <Row className="contactRow">
                    <Col className="contactCol">
                        <StyledText error={nameVal.length === 0} id="outlined-basic" label="Name" variant="outlined" name="from_name" onChange={onNameChange} />
                    </Col>
                    <Col className="contactCol">
                        <StyledText error={emailVal.length === 0 || !emailVal.includes("@") || !emailVal.includes(".")}  id="outlined-basic" label="Email" variant="outlined" name="from_email" onChange={onEmailChange} />
                    </Col>
                </Row>  
                <Row className="contactRow">
                    <StyledText
                        label="Comments"
                        fullWidth
                        multiline
                        rows={5}
                        style={{textAlign: 'left'}}
                        name="message"
                        size="small"
                        onChange={onCommentsChange}
                        error={commentsVal.length === 0}
                    />
                </Row>
                <Row className="contactRow">
                    <Fade in={isFilled}
                        timeout={1000}
                    >
                        <StyledButton
                            component={Link}
                            onClick={sendEmail}
                            size="large"
                            to={{pathname: "/"}}
                            loadingIndicator="Loading…"
                            variant="outlined"
                            style={{
                                    fontStyle: 'bold', fontSize: 16}}>
                            <Typography
                            component="span"
                            className="buttonTitleBold">
                            Submit
                            </Typography>
                        </StyledButton>
                    </Fade>
                </Row>
            </motion.div>
        )
    }
    else{
        return (
            <motion.div className="bigNoScrollContainer"
            exit={{opacity: 0}}
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 1}}}>
                <Row className="topRowContact">
                    <StyledToggleButtonGroup variant="contained" aria-label="text alignment"
                        value={alignment}
                        exclusive
                        onChange={handleAlignment}>
                        <StyledToggleButton variant="contained" value="Restaurant Rec" size="large" className="contactButton">
                            <p className="buttonText">Restaurant Rec</p>
                        </StyledToggleButton >
                        <StyledToggleButton  variant="contained" value="I am a Restaurant" size="large" className="contactButton">
                            <p className="buttonText">I am a Restaurant</p>
                        </StyledToggleButton >
                        <StyledToggleButton  variant="contained" value="Bug Fix" size="large" className="contactButton">
                            <p className="buttonText">Bug Fix</p>
                        </StyledToggleButton >
                        <StyledToggleButton  variant="contained" value="Grammar / Spelling Fix" size="large" className="contactButton">
                            <p className="buttonText">Grammar / Spelling Fix</p>
                        </StyledToggleButton >
                        <StyledToggleButton  variant="contained" value="Other / General" size="large" className="contactButton">
                            <p className="buttonText">General / Suggestion / Other</p>
                        </StyledToggleButton >
                    </StyledToggleButtonGroup>
                </Row>
                <Row className="contactRow">
                    <Col className="contactCol">
                        <StyledText error={nameVal.length === 0} id="outlined-basic" label="Name" variant="outlined" name="from_name" onChange={onNameChange} />
                    </Col>
                    <Col className="contactCol">
                        <StyledText error={emailVal.length === 0 || !emailVal.includes("@") || !emailVal.includes(".")}  id="outlined-basic" label="Email" variant="outlined" name="from_email" onChange={onEmailChange} />
                    </Col>
                </Row>  
                <Row className="contactRow">
                    <StyledText
                        label="Comments"
                        fullWidth
                        multiline
                        rows={5}
                        style={{textAlign: 'left'}}
                        name="message"
                        size="small"
                        onChange={onCommentsChange}
                        error={commentsVal.length === 0}
                    />
                </Row>
                <Row className="contactRow">
                    <Fade in={isFilled}
                        timeout={1000}
                    >
                        <StyledButton
                            component={Link}
                            onClick={sendEmail}
                            size="large"
                            to={{pathname: "/"}}
                            loadingIndicator="Loading…"
                            variant="outlined"
                            style={{
                                    fontStyle: 'bold', fontSize: 16}}>
                            <Typography
                            component="span"
                            className="buttonTitleBold">
                            Submit
                            </Typography>
                        </StyledButton>
                    </Fade>
                </Row>
            </motion.div>
        )
    }

    
}

export { Contact}
