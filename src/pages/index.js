import { useEffect } from 'react'
import { BrowserRouter, Router, Switch, Link, Route, Routes } from 'react-router-dom'
import _ from 'lodash'

import Home from './Home'
import { About} from './About'
import List from './ListPage'
import MapPage from './MapPage'
import restaurantPages from './RestaurantPages'

import { Navbar as BSNavbar, Nav } from 'react-bootstrap'
import RestaurantPages from './RestaurantPages'
import AnimatedRoutes from './AnimatedRoutes'

function NavbarLink(props) {
    return (
        <li className="nav-item">
            <Link to={props.to} className="nav-link" onClick={props.onClick}>
                {props.children || ''}
            </Link>
        </li>
    )
}

function Navbar(props) {

    return (
        <BSNavbar expand="lg" {...props}>
            <Link to="/" className="navbar-brand" >
                <span className="font-link">
                    The List
                </span>
            </Link>
            <BSNavbar.Toggle aria-controls="navbar-nav" />

            <BSNavbar.Collapse id="navbar-nav">
                <Nav className="mr-auto">
                    <NavbarLink to="/map">Map</NavbarLink>
                    <NavbarLink to="/list">List</NavbarLink>
                    <NavbarLink to="/about">About Me</NavbarLink>
                    <NavbarLink to="/contact">Contact Me</NavbarLink>
                </Nav>
            </BSNavbar.Collapse>
        </BSNavbar>
    )
}


function App() {

    return (
        <div className ="App"> 
            <Navbar className="primary" />
            <AnimatedRoutes/>
        </div>
    )
}

export default App
