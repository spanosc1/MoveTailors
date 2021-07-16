import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import '../css/Login.css';

class ResetPassword extends Component {

    state = {
        credentials: {
            pw: '',
            confirmationpw: '',
        },
        resetMsg: ''
    };


    handleChange = (e) => {
        const { credentials } = { ...this.state };
        const currentState = credentials;
        const { name, value } = e.target;
        currentState[name] = value;
        this.setState({ credentials: currentState });

    }

    handleSubmit = (e) => {
        e.preventDefault();
        let token = this.props.match.params.token
        let password = this.state.credentials.pw
        userService.resetNewPassword(password, token)
            .then((res) => {
                this.setState({ resetMsg: res.message })
            })
    }

    isFormInvalid() {
        return !(this.state.credentials.pw && this.state.credentials.confirmationpw && this.state.credentials.pw === this.state.credentials.confirmationpw);
    }


    render() {
        return (
            <>
                <div id='login-view'>
                    <div id='login-form'>
                        <div id='inner-form'>
                            <div className='flex-container login-text'>
                                <h3 className="header-footer">RESET PASSWORD</h3>
                            </div>
                            <div className="flex-container">
                                <form onSubmit={this.handleSubmit} >
                                    <div className="form-group">
                                        <div className="form-div">
                                            <input type="password" className="form-control-inp" placeholder="Password" value={this.state.credentials.pw} name="pw" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-div">
                                            <input type="password" className="form-control-inp" placeholder="Confirm Password" value={this.state.credentials.confirmationpw} name="confirmationpw" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-div">
                                            <button disabled={this.isFormInvalid()} className="login-btn">Reset Password</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {this.state.resetMsg &&
                            <>
                                <p id='reset-msg'>{this.state.resetMsg}</p>
                                <p id='reset-msg'><Link to='/login'>Login Here</Link></p>
                            </>
                        }
                    </div>
                </div>
            </>
        )
    };
}

export default ResetPassword;
