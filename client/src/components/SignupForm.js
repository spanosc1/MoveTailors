import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import '../css/Signup.css';

class SignupForm extends Component {

    state = {
        firstName: '',
        lastName: '',
        email: '',
        // phoneNumber: '',
        password: '',
        passwordConf: ''
    };


    handleChange = (e) => {
        this.props.updateMessage('');
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.signup(this.state);
            this.props.handleSignup();
            // Successfully signed up
            if(sessionStorage.getItem('myMove'))
            {
                this.props.history.push('/bookyourmove');
            }
            else
            {
                this.props.history.push('/');
            }
        } catch (err) {
            this.props.updateMessage(err.message);
        }
    }

    isFormInvalid() {
        return !(this.state.firstName && this.state.lastName && this.state.email && this.state.password === this.state.passwordConf);
    }

    render() {
        return (
            <div id='signup-form'>
                <div className='flex-container'>
                    <form id='signup-form' onSubmit={this.handleSubmit} >
                        <div className='flex-container'>
                            <h3 id='signup-text'>Sign Up</h3>
                        </div>
                        <div className="signup-form-group">
                            <div className="form-div">
                                <input type="text" className="form-control" placeholder="First Name" value={this.state.firstName} name="firstName" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="signup-form-group">
                            <div className="form-div">
                                <input type="text" className="form-control" placeholder="Last Name" value={this.state.lastName} name="lastName" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="signup-form-group">
                            <div className="form-div">
                                <input type="email" className="form-control" placeholder="Email" value={this.state.email} name="email" onChange={this.handleChange} />
                            </div>
                        </div>
                        {/* <div className="signup-form-group">
                            <div className="form-div">
                                <input type="text" className="form-control" placeholder="Phone (incl. country code)" value={this.state.phoneNumber} name="phoneNumber" onChange={this.handleChange} />
                            </div>
                        </div> */}
                        <div className="signup-form-group">
                            <div className="form-div">
                                <input type="password" className="form-control" placeholder="Password" value={this.state.password} name="password" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="signup-form-group">
                            <div className="form-div">
                                <input type="password" className="form-control" placeholder="Confirm Password" value={this.state.passwordConf} name="passwordConf" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="signup-form-group">
                            <div className='flex-container'>
                                <button className="signup-btn" disabled={this.isFormInvalid()}>Sign Up</button>
                                <p>Already Signed Up?&nbsp;&nbsp;<Link to='/login'>LOGIN</Link></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default SignupForm;