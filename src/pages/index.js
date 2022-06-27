import { Link } from 'react-router-dom'

import { Navbar as BSNavbar, Nav } from 'react-bootstrap'
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
                <Nav>
                    <div className='navbar-title-text'><p className='navbar-title-text'>Beta 1.0.0</p></div>
                    
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
