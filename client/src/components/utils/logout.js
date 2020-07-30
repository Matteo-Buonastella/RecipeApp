import React, { Component } from 'react'
import Authenticated from './authentication'
import {Link} from 'react-router-dom'
import { Nav, Navbar} from 'react-bootstrap';
import {connect} from 'react-redux'
import {resetRecipes} from '../../actions/recipeActions';
import {resetUser} from '../../actions/userActions'



//import '../../styles/navbar/navbar.css'

class Logout extends Component {
    render() {
        return (
            <Nav.Item>
                    <Link to="/" className="logout hoverOpacity" style={{color:"black", textDecoration: 'none'}} onClick = {() => {
                        this.props.resetRecipes();
                        this.props.resetUser();
                        Authenticated.logout(() => {})
                    }}> 
                        Logout 
                    </Link>
            </Nav.Item>
        )
    }
}

//map state to props to get state from redux and use in this component
const mapStateToProps = state => ({
    user: state.user.user,
    recipe: state.recipe.recipes
})


export default connect(mapStateToProps, {resetRecipes, resetUser})(Logout);
