import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import MyMetaTags from './../components/MyMetaTags';

import userService from '../services/userService';
import '../css/Login.css';

class LoginPage extends Component {

    state = {
        credentials: {
            email: '',
            pw: '',
        },
        user: {},
        resetPage: false,
        resetEmail: false,
        pwReset: this.props.history.location.pwReset,
        resetMsg: ''
    };

    handleLogin = () => {
        this.setState({ user: userService.getUser() });
    }

    handleChange = (e) => {
        const { credentials } = { ...this.state };
        const currentState = credentials;
        const { name, value } = e.target;
        currentState[name] = value;
        this.setState({ credentials: currentState });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.login(this.state.credentials);
            this.handleLogin();
            if(sessionStorage.getItem('myMove'))
            {
                this.props.history.push('/bookyourmove');
            }
            else
            {
                this.props.history.push('/');
            }
        } catch (err) {
            alert('Invalid Credentials!');
        }
    }

    handleResetEmailChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleResetLink = (resetEmail) => {
        userService.sendResetLink(resetEmail)
            .then((res) => {
                this.setState({ pwReset: false})
                this.setState({ resetMsg: res.message }
                )
            })
        this.setState({ resetPage: false });
    };

    isFormInvalid() {
        return !(this.state.credentials.email && this.state.credentials.pw);
    }

    isResetFormInvalid() {
        return !(this.state.resetEmail);
    }

    render() {
        return (
            <>
                <MyMetaTags page="login"/>
                <div id='login-view'>
                    <div id='login-form'>
                        {this.state.resetPage ?
                            <div id='reset-div'>
                                <div className='login-text'>
                                    <h5 className="header-footer">Reset Password</h5>
                                </div>
                                <p>Submit your email to send a reset passwork link: </p>
                                <form>
                                    <input className='form-control-inp' type='text' placeholder="Email" name="resetEmail" onChange={this.handleResetEmailChange}></input>
                                    <div className='flex-container'>
                                        <button id='reset-send-btn' onClick={() => this.handleResetLink(this.state.resetEmail)} disabled={this.isResetFormInvalid()}>Send</button>
                                        <button id='reset-cancel-btn' onClick={() => this.setState({ resetPage: false })}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                            :
                            <div id='inner-form'>
                                <div className='flex-container login-text'>
                                    <h3 className="header-footer">LOG IN</h3>
                                </div>
                                <div className="flex-container">
                                    <form onSubmit={this.handleSubmit} >
                                        <div className="form-group">
                                            <div className="form-div">
                                                <input type="email" className="form-control-inp" placeholder="Email" value={this.state.credentials.email} name="email" onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-div">
                                                <input type="password" className="form-control-inp" placeholder="Password" value={this.state.credentials.pw} name="pw" onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-div">
                                                <button disabled={this.isFormInvalid()} className="login-btn">Log In</button>
                                                <p>Forgot Password? <span id='reset-span-btn' onClick={() => this.setState({ resetPage: true })}>Click Here</span></p>
                                                <p>Dont have an account? <NavLink to="/signup">Sign up</NavLink></p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                {this.state.pwReset &&
                                    <p id='reset-msg'>Your password has been reset!</p>
                                }
                                {this.state.resetMsg &&
                                    <p id='reset-msg'>{this.state.resetMsg}</p>
                                }
                            </div>
                        }
                    </div>
                </div>
            </>
        )
    };
}

export default LoginPage;
