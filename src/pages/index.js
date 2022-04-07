import { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom'
import _ from 'lodash'

import { useDispatch, useSelector } from 'react-redux'

import Home from './home'
import { Map, List, About} from './auth'
import Dash from './dash'
import Setup from './setup'

import { Navbar as BSNavbar, Nav } from 'react-bootstrap'

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
            <Link to="/" className="navbar-brand">
                The List
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
                            <NavbarLink to="/setup">Setup Device</NavbarLink>
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
                        <Map />
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
                </Switch>
            ) : (
                <>
                    <Navbar className="primary" />
                    <Switch>
                        <Route exact path="/">
                            <Dash />
                        </Route>
                        <Route exact path="/map">
                            <Map />
                        </Route>
                        <Route exact path="/list">
                            <Navbar />
                            <List />
                        </Route>
                        <Route exact path="/about">
                            <Navbar />
                            <About />
                        </Route>
                    </Switch>
                </>
            )}
        </Router>
    )
}

export default App
