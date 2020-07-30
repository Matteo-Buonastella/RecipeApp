import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import { Nav, Navbar, NavDropdown} from 'react-bootstrap';

import Logout from '../utils/logout'
import '../../styles/navbar/navbar.css'
 
class MainNavbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: ""
        }
    }

    componentDidMount(){
        this.props.user.map((user)=>{
           this.setState({username: user.Username})
        })
    } 

    render() {
        return (
            <Navbar collapseOnSelect expand="lg" bg="light">
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <Navbar.Brand>
                            Welcome {this.state.username} 
                        </Navbar.Brand>
                        <Nav.Item>
                            <Nav.Link className="hoverOpacity" active eventKey="1" as={Link} to="/Home" style={{color:"black"}}>
                                Home
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="hoverOpacity" eventKey="2" as={Link} style={{color:"black"}} to="/CreateRecipe">
                                Create Recipe
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="hoverOpacity" eventKey="3" as={Link} style={{color:"black"}} to="/Discover">
                                Discover
                            </Nav.Link>
                        </Nav.Item>
                        <NavDropdown title="Settings" className="text-primary navbar-default dropdownTitle" id="basic-nav-dropdown">
                            <NavDropdown.Item className="hoverOpacity" href="#action/3.2">
                                <Logout />
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item className="hoverOpacity" eventKey="4" as={Link} to="/ReportBug">
                                Report Bug
                            </NavDropdown.Item>
                            <NavDropdown.Item className="hoverOpacity" eventKey="5" as={Link} to="/FeatureRequest">
                                Request Feature
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

//map state to props to get state from redux and use in this component
const mapStateToProps = state => ({
    user: state.user.user
})


export default connect(mapStateToProps)(MainNavbar);
