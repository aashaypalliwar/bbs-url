import React from 'react';
import ls from 'local-storage';
import { useHistory, Link } from 'react-router-dom';
import { navbarImg, navbarBrand, navLink } from './headerStyle'
import { Navbar, Nav } from 'react-bootstrap';

const Header = (props) => {
    let links = null;
    let history = useHistory();
    let logoutHandler = () => {
        ls.clear();
        props.toggle();
        history.replace('/');
    }
    if(!props.authenticated)
        links = (
            <Nav className="ml-auto">
                <Nav.Item><Nav.Link as={Link} style={navLink} to="/login">LOG IN</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link as={Link} style={navLink} to="/signUp">SIGN UP</Nav.Link></Nav.Item>
            </Nav>
        );
    else
        links = (
            <Nav className="ml-auto">
                <Nav.Item><Nav.Link as={Link} style={navLink} to='/changePassword'>CHANGE PASSWORD</Nav.Link></Nav.Item>
                {/*<Nav.Item><Nav.Link style={navLink} href="#settings">SETTINGS</Nav.Link></Nav.Item>*/}
                <Nav.Item><Nav.Link as={Link} style={navLink} ><span onClick={logoutHandler}>LOG OUT</span></Nav.Link></Nav.Item>
            </Nav>
        );


    return (
        <div style={ navbarImg }>
            <Navbar  variant="dark" expand="lg">
                <Navbar.Brand style={navbarBrand} as={Link} to="/">
                     bbs_url
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse >
                    { links }
                </Navbar.Collapse>
            </Navbar>
        </div>


    );
}

export default Header;













