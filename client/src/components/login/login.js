import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router';
import {connect} from 'react-redux'
import {getUser, getUserById} from '../../actions/userActions';
import {getAllUserRecipes, resetRecipes} from '../../actions/recipeActions';


import '../../styles/login/login.css'
import Authenticated from '../utils/authentication'

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            badLogin: false
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(event){
        event.preventDefault();
        this.setState({username: event.target.value})
    }

    handlePasswordChange(event){
        event.preventDefault();
        this.setState({password: event.target.value})
    }

 

    handleSubmit(event){
        event.preventDefault();

        var request = {
            params:{
                username: this.state.username,
                password: this.state.password
            }
        }
        axios.get('/getUserByNameOrEmailAndPassword', request).then((user)=>{  //
            if(user.data.length === 0){
                this.setState({ badLogin: true });
            }
            else{
                this.setState({ badLogin: false });
                var request = {
                    params:{
                        userId: user.data[0].User_Id
                    }
                }
                this.props.getUserById(request)
                this.props.resetRecipes();
                this.props.getAllUserRecipes(user.data[0].User_Id)
                Authenticated.login(()=>{
                    this.props.history.push({pathname: "/Home", state:{userId: user.data[0].User_Id}}) 
                });
            }
        })
    }

    render() {
        var loginError;
        if(this.state.badLogin === true){
            loginError = <p className="loginError">Username or password is incorrect</p>
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Username or Email</label>
                        <input type="text" className="form-control" onChange={this.handleUsernameChange} placeholder="" maxLength="30" required /> 
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" onChange={this.handlePasswordChange} placeholder="" maxLength="20" required/>
                    </div>
                    {loginError}
                    <div className="loginButtonDiv">
                        <input type="submit" id="loginButton" style={{borderStyle:"solid"}}className="btn-lg btn-success" value="Login"/>
                    </div>
                </form> 
            </div>
        )
    }
}

//map state to props to get state from redux and use in this component
const mapStateToProps = state => ({
    user: state.user.user,
})


export default connect(mapStateToProps, {getUser, getUserById, getAllUserRecipes, resetRecipes})(withRouter(Login));
