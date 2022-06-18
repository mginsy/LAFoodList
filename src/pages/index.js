import { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom'
import _ from 'lodash'

import { useDispatch, useSelector } from 'react-redux'

import Home from './home'
import { About} from './auth'
import List from './ListPage'
import MapPage from './MapPage'
import restaurantPages from './RestaurantPages'

import { Navbar as BSNavbar, Nav } from 'react-bootstrap'
import RestaurantPages from './RestaurantPages'
import classes from './RestaurantPages/index'

let routes = []

for (let restaurantName in classes){
    let pathName = "/" + restaurantName.replaceAll(" ","-");

    let RestaurantClass = classes[restaurantName];

    routes.push(
        <Route exact path = {pathName}>
            <Navbar fixed="top" />
            <RestaurantClass/>
        </Route>
    )
}


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
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    return (
        <BSNavbar expand="lg" {...props}>
            <Link to="/" className="navbar-brand" >
                <span className="font-link">
                    The List
                </span>
            </Link>
            <BSNavbar.Toggle aria-controls="navbar-nav" />

            <BSNavbar.Collapse id="navbar-nav">
                {_.isEmpty(user) === true ? (
                    <>
                        <Nav className="mr-auto">
                            <NavbarLink to="/map">Map</NavbarLink>
                            <NavbarLink to="/list">List</NavbarLink>
                            <NavbarLink to="/about">About Me</NavbarLink>
                        </Nav>
                    </>
                ) : (
                    <>
                        <Nav className="mr-auto">
                            <NavbarLink to="/">Dashboard</NavbarLink>
                            <NavbarLink to="/test">Test</NavbarLink>
                            <NavbarLink to="/profile">Profile</NavbarLink>
                        </Nav>
                    </>
                )}
            </BSNavbar.Collapse>
        </BSNavbar>
    )
}

function App() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)

    return (
        <Router>
            {_.isEmpty(user) === true ? (
                <Switch>
                    <Route exact path="/map">
                        <Navbar fixed="top" />
                        <MapPage />
                    </Route>
                    <Route exact path="/list">
                        <Navbar fixed="top" />
                        <List />
                    </Route>
                    <Route exact path="/about">
                        <Navbar />
                        <About />
                    </Route>
                    <Route exact path="/">
                        <Navbar className="primary" />
                        <Home />
                    </Route>
                    {routes}
                </Switch>
            ) : (
                <>
                    <Navbar className="primary" />
                    <Switch>
                        <Route exact path="/map">
                            <MapPage />
                        </Route>
                        <Route exact path="/list">
                            <Navbar />
                            <List />
                        </Route>
                        <Route exact path="/about">
                            <Navbar />
                            <About />
                        </Route>
                        {routes}
                    </Switch>
                </>
            )}
        </Router>
    )
}

export default App
