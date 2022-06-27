import React from 'react'
import {BrowserRouter as Router, Route, useLocation, Routes} from 'react-router-dom'
import _ from 'lodash'

import Home from './Home'
import { About} from './About'
import List from './ListPage'
import MapPage from './MapPage'
import {Contact} from './Contact'

import {AnimatePresence} from 'framer-motion'

import classes from './RestaurantPages/index'

function AnimatedRoutes(){
    const location = useLocation();

    let routes = []

    for (let restaurantName in classes){
        let pathName = "/" + restaurantName.replaceAll(" ","-");

        let RestaurantClass = classes[restaurantName];

        routes.push(
            <Route path={pathName} element={<RestaurantClass/>}/>
        )
    }

    return(
        <AnimatePresence exitBeforeEnter>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />}/>
                <Route path="/map" element={<MapPage />}/>
                <Route path="/list" element={<List />}/>
                <Route path="/about" element={<About />}/>
                <Route path="/contact" element={<Contact />}/>
                {routes}
            </Routes>
        </AnimatePresence>
    )
}

export default AnimatedRoutes