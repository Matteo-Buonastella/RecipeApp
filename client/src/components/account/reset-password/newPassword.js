import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {updatePasswordByEmail} from '../../utils/functions'

class NewPassword extends Component {
    constructor(props){
        super(props);
        this.state = {
            errMsg: "",
            password: "",
            confirmPassword: ""
        }
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handlePasswordChange(event){
        event.preventDefault();
        this.setState({password: event.target.value});
    }

    handleConfirmPasswordChange(event){
        event.preventDefault();
        this.setState({confirmPassword: event.target.value})
    }

    handleSubmit(event){
        event.preventDefault();
        if(this.state.password === this.state.confirmPassword){
            updatePasswordByEmail(this.props.email, this.state.password).then((response)=>{
                this.props.history.push({pathname: "/", state:{notification: true, message: "Success, your password has been updated!", color: "green"}}) 
            }).catch((exception)=>{
                this.setState({errMsg: "Server error. Unable to update password"})
            })
            this.setState({errMsg: ""})

        } else {
            this.setState({errMsg: "Error, password don't match"})
        }
    }

    render() {
        return (
            <div>
                <h6>Create your new password</h6>
                <br />
                <h6 style={{textAlign: "center", color:"red"}}>{this.state.errMsg}</h6>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" className="form-control" minLength="8" maxLength="20" onChange={this.handlePasswordChange} required/>
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" minLength="8" maxLength="20" onChange={this.handleConfirmPasswordChange} required/>
                    </div>
                    <div className="registerButtonDiv">
                        <input type="submit" id="resetPasswordBtn"  className="btn btn-success" value="Submit"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(NewPassword);