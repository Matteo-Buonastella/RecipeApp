import React, { Component } from 'react'
import {doesEmailExist} from '../../utils/functions'
import BeatLoader from "react-spinners/BeatLoader";
import axios from 'axios';

export default class EmailVerification extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            errMsg: "",
            loading: false,
            disableInput: false
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event){
        event.preventDefault();
        this.setState({email: event.target.value})
    }

    handleSubmit(event){
        event.preventDefault();
        this.setState({loading: true, disableInput: true})
        var verificationCode = Math.floor(100000 + Math.random() * 900000) //Create random code
        
        doesEmailExist(this.state.email).then((response)=>{
            var data = {
                email: this.state.email
            }
            //Delete any existing Verification Code for user
            axios.post('/deleteEmailVerificationCodeByEmail', data).then((response)=>{
                var data = {
                    email: this.state.email,
                    verificationCode: verificationCode
                }
                //Create a verification code 
                axios.post('/createEmailVerificationCode', data).then((response)=>{
                    var data = {
                        email: this.state.email,
                        verificationCode: verificationCode
                    }
                    //Email it to user
                    axios.post('/sendEmailVerificationCode', data).then((response)=>{
                        this.setState({loading: false, errMsg: ""})
                        this.props.setEmailAndVerification(this.state.email, verificationCode)
                        this.props.hideEmailForm();
                        this.props.showVerificationForm();
                    })
                })
            })
        }).catch((exception)=>{
            this.setState({errMsg: "Error, this email is not assigned to any account", loading: false, disableInput: false})
        })
    }

    render() {
        return (
            <div>
                <h6 style={{textAlign: "center", color:"red"}}>{this.state.errMsg}</h6>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Enter your Email Address</label>
                        <input type="email" className="form-control registerForm" id="emailInput" onChange={this.handleEmailChange} required maxLength="30" />
                    </div>
                    <div className="registerButtonDiv">
                        <input type="submit" id="resetPasswordBtn" className="btn btn-warning" disabled={this.state.disableInput} value="Reset Password"/>
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

        )
    }
}
