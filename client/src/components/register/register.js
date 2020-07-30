import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import '../../styles/register/register.css'
import BeatLoader from "react-spinners/BeatLoader";
import {doesEmailAlreadyExist} from '../utils/functions'

class register extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            errorMessage: ""
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event){
        event.preventDefault();
        this.setState({email: event.target.value})
    }

    handleUsernameChange(event){
        event.preventDefault();
        this.setState({username: event.target.value})
    }

    handlePasswordChange(event){
        event.preventDefault();
        this.setState({password: event.target.value})
    }

    handleConfirmPasswordChange(event){
        event.preventDefault();
        this.setState({confirmPassword: event.target.value})
    }

    handleSubmit(event){
        event.preventDefault();
        this.setState({loading: true})
        if(this.passwordMatch(this.state.password, this.state.confirmPassword)){
            doesEmailAlreadyExist(this.state.email).then(()=>{
                this.doesUsernameAlreadyExist(this.state.username).then(()=>{
                    this.setState({errorMessage: ""})
                    var data = {
                        email: this.state.email,
                        username: this.state.username,
                        password: this.state.password
                    }
                    axios.post('/addUser', data).then((response)=>{
                        //Send Email
                        var data = {
                            email: this.state.email
                        }
                        
                        axios.post('/sendWelcomeEmail', data).then((response)=>{
                            //Redirect User to Home Page
                            this.props.history.push({pathname: "/", state:{accountCreated: true}}) 
                        }).catch((exception)=>{
                            //Something wrong with sending email, redirect user anyway
                            this.props.history.push({pathname: "/", state:{accountCreated: true}}) 
                        });
                    });
                }).catch((error)=>{
                    this.setState({errorMessage: error, loading: false})
                })
            }).catch((error)=>{
                this.setState({errorMessage: error, loading: false})
            })
        } else {
            this.setState({errorMessage: "Error, passwords don't match", loading: false})
        }
    }

    passwordMatch(password1, password2){
        if(password1 === password2){
            return true;
        } else{
            return false
        }
    }

    doesUsernameAlreadyExist(username){
        return new Promise(function(resolve,reject){
            var request = {
                params:{
                    username: username
                }
            }
            axios.get('/getUsername', request).then((user)=>{
                if(user.data.length === 0){
                    resolve(false);
                }
                else{
                    reject("Error, username already exists");
                }
            })
        })
    }

    render() {
        return (
            <div>
                <h1 className="registerPageTitle"> Register </h1>
                <div className="centerDiv">
                    <Link to="/" className="btn btn-primary"> Back </Link>
                </div>
                <br />
                <div className="container form-container">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                            <label>Email address*</label>
                                <input type="email" className="form-control registerForm" id="emailInput" onChange={this.handleEmailChange} required maxLength="30" />
                            </div>
                            <div className="form-group">
                            <label>Username*</label>
                                <input type="text" className="form-control registerForm" id="usernameInput" onChange={this.handleUsernameChange} required  maxLength="20" />
                            </div>
                            <div className="form-group">
                            <label>Password*</label>
                                <input type="password" className="form-control registerForm" id="passwordInput" onChange={this.handlePasswordChange} required minLength="8" maxLength="20" />
                            </div>
                            <div className="form-group">
                            <label>Confirm Password*</label>
                                <input type="password" className="form-control registerForm" id="confirmPasswordInput" onChange={this.handleConfirmPasswordChange} required minLength="8" maxLength="20" />
                            </div>
                            <p className="errorMessage">{this.state.errorMessage}</p>
                            <div className="registerButtonDiv">
                                <input type="submit" id="registerButton" className="btn btn-success" value="Sign Up"/>
                            </div>
                            <div className="sweet-loading" style={{textAlign:"center", margin:"0 auto"}}>
                                <BeatLoader
                                size={15}
                                margin={2}
                                color={"#123abc"}
                                loading={this.state.loading}
                                />
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default register;
