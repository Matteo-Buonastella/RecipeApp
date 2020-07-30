import React, { Component } from 'react'

class VerificationCode extends Component {
    constructor(props){
        super(props);
        this.state = {
            errMsg: "",
            loading: false,
            verificationCode: "",
            disableInput: false,
            maxAttempts: 0,
        }
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCodeChange(event){
        event.preventDefault();
        this.setState({verificationCode: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();
        if(this.state.verificationCode == this.props.verificationCode){
            this.props.hideVerificationForm();
            this.props.showNewPassword();
        } else {
            this.setState({errMsg: "Verification Code doesn't match", maxAttempts: this.state.maxAttempts + 1})
            this.checkMaxAttempts();
        }
    }

    checkMaxAttempts(){
        if (this.state.maxAttempts >= 2){
            this.setState({errMsg: "Maximum attemps reached. Go back and try again", disableInput: true})
        }
    }

    render() {
        return (
            <div>
                <h6>A Verification code has been sent to your email</h6>
                <br />
                <h6 style={{textAlign: "center", color:"red"}}>{this.state.errMsg}</h6>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                    <label>Enter Code</label>  <label style={{float:"right"}}>Attempt {this.state.maxAttempts}/3</label> 
                        <input type="number" className="form-control" disabled={this.state.disableInput} max="9999999999" min="1" onChange={this.handleCodeChange} required/>
                    </div>
                    <div className="registerButtonDiv">
                        <input type="submit" id="resetPasswordBtn" disabled={this.state.disableInput}  className="btn btn-success" value="Enter"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default VerificationCode;
