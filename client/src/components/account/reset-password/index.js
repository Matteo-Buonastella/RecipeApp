import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import EmailVerification from './emailVerification'
import VerificationCode from './verificationCode'
import NewPassword from './newPassword'

class ResetPassword extends Component {
    constructor(props){
        super(props)
        this.state = {
            displayEmailForm: true,
            displayVerificationForm: false,
            displayNewPasswordForm: false,
            email: "",
            verificationCode: ""
        }  
        this.hideEmailForm = this.hideEmailForm.bind(this); 
        this.showVerificationForm = this.showVerificationForm.bind(this);
        this.setEmailAndVerification = this.setEmailAndVerification.bind(this);
        this.hideVerificationForm = this.hideVerificationForm.bind(this);
        this.showNewPasswordForm = this.showNewPasswordForm.bind(this);
    }

    hideEmailForm(){
        this.setState({displayEmailForm: false})
    }

    hideVerificationForm(){
        this.setState({displayVerificationForm: false})
    }

    hideNewPasswordForm(){
        this.setState({displayNewPasswordForm: false})
    }

    showVerificationForm(){
        this.setState({displayVerificationForm: true})
    }

    showNewPasswordForm(){
        this.setState({displayNewPasswordForm: true})
    }

    setEmailAndVerification(email, verificationCode){
        this.setState({email: email, verificationCode: verificationCode})
    }

    render() {
        function DisplayEmailVerification(props){
            if(props.display === true){
                return <EmailVerification hideEmailForm={props.hideEmail} showVerificationForm={props.showVerification} setEmailAndVerification={props.setEmailAndVerification} />
            } else {return <span></span>}
        }

        function DisplayVerificationCode(props){
            if(props.display === true){
                return <VerificationCode email={props.email} verificationCode={props.verificationCode} hideVerificationForm={props.hideVerification} showNewPassword={props.showNewPassword}/>
            } else {return <span></span>}
        }

        function DisplayNewPassword(props){
            if(props.display === true){
                return <NewPassword email={props.email}/>
            } else {return <span></span>}
        }
        
        return (
            <div>
                <h1 className="registerPageTitle"> Reset Password </h1>
                <div className="centerDiv">
                    <Link to="/" className="btn btn-primary"> Back </Link>
                </div> <br /> <br />
                <div className="container form-container">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                            <DisplayEmailVerification display={this.state.displayEmailForm} hideEmail={this.hideEmailForm} showVerification={this.showVerificationForm} setEmailAndVerification={this.setEmailAndVerification}/>
                            <DisplayVerificationCode display={this.state.displayVerificationForm} hideVerification={this.hideVerificationForm} showNewPassword={this.showNewPasswordForm} email={this.state.email} verificationCode={this.state.verificationCode}/>
                            <DisplayNewPassword display={this.state.displayNewPasswordForm} email={this.state.email}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ResetPassword
