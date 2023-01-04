import { Link} from 'react-router-dom'
import { Navbar as BSNavbar, Nav } from 'react-bootstrap'
import AnimatedRoutes from './AnimatedRoutes'
import background from '../background.jpg'
import {isMobile} from 'react-device-detect';

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
            <Link to="/" className={isMobile ?  "navbar-brand-mobile" : "navbar-brand"} >
                <span className={isMobile ?  "font-link-mobile" : "font-link"}>
                    LA Food List
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
                    <div className='navbar-title-text'><p className='navbar-title-text'>1.2.4</p></div>
                    
                </Nav>
            </BSNavbar.Collapse>
        </BSNavbar>
    )
}

const myStyle={
    backgroundImage: `url(${background})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh'
};

function App() {

    return (
        <div className ="App" style={myStyle}> 
            <Navbar className="primary" />
            <AnimatedRoutes/>
        </div>
    )
}

export default App;
