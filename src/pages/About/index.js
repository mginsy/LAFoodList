import React, { Component, Fragment } from 'react'
import {Col, Row, Container} from 'react-bootstrap'
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
//import 'react-calendar/dist/Calendar.css';

/*
const JWLink = <Link to={{ pathname: "https://www.joshuaweissman.com/post/dessert-with-leftover-bread" }} target="_blank"></Link>
const JWLink = <Link to={{ pathname: "https://www.joshuaweissman.com/post/dessert-with-leftover-bread" }} target="_blank"></Link>
const JWLink = <Link to={{ pathname: "https://www.joshuaweissman.com/post/dessert-with-leftover-bread" }} target="_blank"></Link>
const JWLink = <Link to={{ pathname: "https://www.joshuaweissman.com/post/dessert-with-leftover-bread" }} target="_blank"></Link>
const JWLink = <Link to={{ pathname: "https://www.joshuaweissman.com/post/dessert-with-leftover-bread" }} target="_blank"></Link>
const JWLink = <Link to={{ pathname: "https://www.joshuaweissman.com/post/dessert-with-leftover-bread" }} target="_blank"></Link>
*/

function About() {
    const ContactMeLink = <Link to={{ pathname: "/contact" }}><Fragment className="about-text">Contact Me page</Fragment></Link>
    const JWLink = <a href="https://www.joshuaweissman.com/post/dessert-with-leftover-bread" target="_blank" rel="noreferrer"><Fragment className="about-text">Joshua Weissman’s bread pudding</Fragment></a>
    const BALink = <a href= "https://www.bonappetit.com/recipe/fusilli-alla-vodka-basil-parmesan" target="_blank" rel="noreferrer"><Fragment className="about-text">BA John and Vinny’s vodka sauce</Fragment></a>
    const MTLink = <a href= "https://www.reddit.com/r/Cooking/comments/6a41g8/recipe_authentic_sichuan_mapo_tofu_%E9%BA%BB%E5%A9%86%E8%B1%86%E8%85%90/" target="_blank" rel="noreferrer"><Fragment className="about-text">Chinese Cooking Demystified’s Mapo Tofu</Fragment></a>
    const NYTLink = <a href= "https://cooking.nytimes.com/recipes/1021160-one-pot-smoky-fish-with-tomato-olives-and-couscous"  target="_blank" rel="noreferrer"><Fragment className="about-text">NYT One-Pot Smokey Fish with Couscous</Fragment></a>
    const ARLink = <a href= "https://cooking.nytimes.com/recipes/1020861-wine-braised-chicken-with-artichoke-hearts" target="_blank" rel="noreferrer"><Fragment className="about-text">Alison Roman’s Onion Artichoke Chicken</Fragment></a>

    const newAnimConst = .5;
    const newAnimMult = .2;

    return (
        <motion.div className="bigNoScrollContainer"
            key={"AboutKey"}
            exit={{opacity: 0}}
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 1}}}>
            <div>
                <Row>
                    <Col className="aboutCol about-text">
                    <motion.div
                        initial={{x: -50}}
                        animate={{x: 0, transition: {duration: newAnimConst+newAnimMult}}}>
                            <Fragment className="about-text">{`Hello friends, I'm Max Ginsberg, an engineer and food lover born and raised in Los Angeles, CA. I grew up in West LA and subsequently moved to the downtown area to study engineering at The University of Southern California. This list is a representation of the past 22 years of my Angelino culinary experience, but in reality, I have been compiling these restaurants for the past six years or so. My lived experience is likely reflected in the areas I have explored around LA and come up in this list, so don't be offended if your local spot in Long Beach isn't represented here- I just haven't gotten around to it yet! *and pls suggest it in the `}</Fragment>
                            {ContactMeLink}
                            <Fragment className="about-text">{" :)*"}</Fragment>
                            <br></br>
                            <br></br>
                    </motion.div>
                    <motion.div
                        initial={{x: -50}}
                        animate={{x: 0, transition: {duration: newAnimConst+newAnimMult*2}}}>
                            <Fragment className="about-text">{"Outside of patronizing new restaurants and computer science, some of my hobbies include gardening, cooking, and sports. I used to have around 20 plants, but I’ve recently downsized to around 13 or so because I may be moving soon :(. If you need any gardening tips definitely let me know! Some of my favorite recipes to cook include "}</Fragment>
                            {JWLink}
                            <Fragment className="about-text">{", "}</Fragment>
                            {BALink}
                            <Fragment className="about-text">{" (not even on this list lmfao I’ve never been heard it kinda dropped off), "}</Fragment>
                            {MTLink}
                            <Fragment className="about-text">{", "}</Fragment>
                            {NYTLink}
                            <Fragment className="about-text">{", and "}</Fragment>
                            {ARLink}
                            <Fragment className="about-text">{". Definitely try them out if you’re looking to please a crowd (or a single guest :0)."}</Fragment>
                            <br></br>
                            <br></br>
                    </motion.div>
                    <motion.div
                        initial={{x: -50}}
                        animate={{x: 0, transition: {duration: newAnimConst+newAnimMult*3}}}>
                            <Fragment className="about-text">{"I would also like to give a special shout out to my lovely girlfriend Jenny who did some of these reviews and also edited a lot of them. There are over 180 reviews here so that was a very daunting task and I could not have gotten through those painful couple weeks without her. Look for her -J sign off to see which ones she did!"}</Fragment>
                            <br></br>
                            <br></br>
                    </motion.div>
                    <motion.div
                        initial={{x: -50}}
                        animate={{x: 0, transition: {duration: newAnimConst+newAnimMult*4}}}>
                            <Fragment className="about-text">{"Also a huge thank you to my friend Devin who helped me learn ReactJS and has truly gone above and beyond in helping so many people I know. You efforts are not forgotten!"}</Fragment>
                            <br></br>
                            <br></br>
                    </motion.div>
                    <motion.div
                        initial={{x: -50}}
                        animate={{x: 0, transition: {duration: newAnimConst+newAnimMult*5}}}>
                            <Fragment className="about-text">{"If you are a recruiter and you made it this far, that means that you should definitely hire me! Please hire me. I need a job <3. Thank you."}</Fragment>
                            <br></br>
                            <br></br>
                    </motion.div>
                    <motion.div
                        initial={{x: -50}}
                        animate={{x: 0, transition: {duration: newAnimConst+newAnimMult*6}}}>
                            <Fragment className="about-text">{"And if you aren’t a recruiter and you made it this far, thank you so much as well for visiting and I hope this site can provide you with lots of good food and memories. That’s what life’s all about. Love you all <3. -Max"}</Fragment>
                    </motion.div>
                        
                        
                        
                        
                        
                        
                    </Col>
                    <Col className="aboutPic">
                        <img 
                            src={require(`./About.jpg`)}
                            className='img-fluid'
                            alt="loading..."
                            />
                    </Col>
                </Row>
            </div>
        </motion.div>
    )
}

export { About}
