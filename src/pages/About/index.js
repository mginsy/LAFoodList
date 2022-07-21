import React, { Fragment, } from 'react'
import {Col, Row} from 'react-bootstrap'
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import useWindowDimensions from '../useWindowDimensions';
import useFitText from "use-fit-text";

function About() {
    const ContactMeLink = <Link to={{ pathname: "/contact" }}><Fragment >Contact Me page</Fragment></Link>
    const JWLink = <a href="https://www.joshuaweissman.com/post/dessert-with-leftover-bread" target="_blank" rel="noreferrer"><Fragment >Joshua Weissman’s bread pudding</Fragment></a>
    const BALink = <a href= "https://www.bonappetit.com/recipe/fusilli-alla-vodka-basil-parmesan" target="_blank" rel="noreferrer"><Fragment >BA John and Vinny’s vodka sauce</Fragment></a>
    const MTLink = <a href= "https://www.reddit.com/r/Cooking/comments/6a41g8/recipe_authentic_sichuan_mapo_tofu_%E9%BA%BB%E5%A9%86%E8%B1%86%E8%85%90/" target="_blank" rel="noreferrer"><Fragment >Chinese Cooking Demystified’s Mapo Tofu</Fragment></a>
    const NYTLink = <a href= "https://cooking.nytimes.com/recipes/1021160-one-pot-smoky-fish-with-tomato-olives-and-couscous"  target="_blank" rel="noreferrer"><Fragment >NYT One-Pot Smokey Fish with Couscous</Fragment></a>
    const ARLink = <a href= "https://cooking.nytimes.com/recipes/1020861-wine-braised-chicken-with-artichoke-hearts" target="_blank" rel="noreferrer"><Fragment >Alison Roman’s Onion Artichoke Chicken</Fragment></a>

    const newAnimConst = .5;
    const newAnimMult = .3;

    const { height, width } = useWindowDimensions();
    const { fontSize, ref } = useFitText();

    return (
        <motion.div className="bigNoScrollContainer"
            key={"AboutKey"}
            exit={{opacity: 0}}
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 1}}}>
            <div>
                <Row>
                    <Col className="aboutCol test-text" ref={ref} style={{height:(height-86)*.97, fontSize}}>
                        <div>
                            <motion.div
                                initial={{x: -50}}
                                animate={{x: 0, transition: {duration: newAnimConst+newAnimMult}}}
                                style ={{backgroundColor:'rgba(185, 211, 196, .6)', borderRadius: '10px', paddingLeft:'.5vw', paddingRight:'.5vw'}}>
                                    <Fragment >{`Hello friends, I'm Max Ginsberg, an engineer and food lover born and raised in Los Angeles, CA. I grew up in West LA and subsequently moved to the downtown area to study engineering at The University of Southern California. This list is a representation of the past 22 years of my Angelino culinary experience, but in reality, I have been compiling these restaurants for the past six years or so. My lived experience is likely reflected in the areas I have explored around LA and come up in this list, so don't be offended if your local spot in Long Beach isn't represented here- I just haven't gotten around to it yet! *and pls suggest it in the `}</Fragment>
                                    {ContactMeLink}
                                    <Fragment >{" :)*"}</Fragment>
                            </motion.div>
                            <br></br>
                            <motion.div
                                initial={{x: -50}}
                                animate={{x: 0, transition: {duration: newAnimConst+newAnimMult*2}}}
                                style ={{backgroundColor:'rgba(185, 211, 196, .6)', borderRadius: '10px', paddingLeft:'.5vw', paddingRight:'.5vw'}}>
                                    <Fragment >{"Outside of patronizing new restaurants and computer science, some of my hobbies include gardening, cooking, and sports. I used to have around 20 plants, but I’ve recently downsized to around 13 or so because I may be moving soon :(. If you need any gardening tips definitely let me know! Some of my favorite recipes to cook include "}</Fragment>
                                    {JWLink}
                                    <Fragment >{", "}</Fragment>
                                    {BALink}
                                    <Fragment >{" (not even on this list lmfao I’ve never been heard it kinda dropped off), "}</Fragment>
                                    {MTLink}
                                    <Fragment >{", "}</Fragment>
                                    {NYTLink}
                                    <Fragment >{", and "}</Fragment>
                                    {ARLink}
                                    <Fragment >{". Definitely try them out if you’re looking to please a crowd (or a single guest :0)."}</Fragment>
                            </motion.div>
                            <br></br>
                            <motion.div
                                initial={{x: -50}}
                                animate={{x: 0, transition: {duration: newAnimConst+newAnimMult*3}}}
                                style ={{backgroundColor:'rgba(185, 211, 196, .6)', borderRadius: '10px', paddingLeft:'.5vw', paddingRight:'.5vw'}}>
                                    <Fragment >{"I would also like to give a special shout out to my lovely girlfriend Jenny who did some of these reviews and also edited a lot of them. There are over 180 reviews here so that was a very daunting task and I could not have gotten through those painful couple weeks without her. Look for her -J sign off to see which ones she did! However, not only did she contribute on the writing side, she also designed all of the background drawings from scratch which provided so much to the feel of the website. Thank you sosososo much <3."}</Fragment>
                            </motion.div>
                            <br></br>
                            <motion.div
                                initial={{x: -50}}
                                animate={{x: 0, transition: {duration: newAnimConst+newAnimMult*4}}}
                                style ={{backgroundColor:'rgba(185, 211, 196, .6)', borderRadius: '10px', paddingLeft:'.5vw', paddingRight:'.5vw'}}>
                                    <Fragment >{"Also a huge thank you to my friend Devin who helped me learn ReactJS and has truly gone above and beyond in helping so many people I know. You efforts are not forgotten!"}</Fragment>             
                            </motion.div>
                            <br></br>
                            <motion.div
                                initial={{x: -50}}
                                animate={{x: 0, transition: {duration: newAnimConst+newAnimMult*5}}}
                                style ={{backgroundColor:'rgba(185, 211, 196, .6)', borderRadius: '10px', paddingLeft:'.5vw', paddingRight:'.5vw'}}>
                                    <Fragment >{"If you are a recruiter and you made it this far, that means that you should definitely hire me! Please hire me. I need a job <3. Thank you."}</Fragment>
                            </motion.div>
                            <br></br>
                            <motion.div
                                initial={{x: -50}}
                                animate={{x: 0, transition: {duration: newAnimConst+newAnimMult*6}}}
                                style ={{backgroundColor:'rgba(185, 211, 196, .7)', borderRadius: '10px', paddingLeft:'.5vw', paddingRight:'.5vw'}}>
                                    <Fragment >{"And if you aren’t a recruiter and you made it this far, thank you so much as well for visiting and I hope this site can provide you with lots of good food and memories. That’s what life’s all about. Love you all <3. -Max"}</Fragment>
                            </motion.div>          
                        </div>              
                    </Col>
                    <Col className="aboutPic">
                        <img 
                            src={require(`./About.jpg`)}
                            className='img-fluid'
                            alt="cooking..."
                            />
                    </Col>
                </Row>
            </div>
        </motion.div>
    )
}

export { About}
