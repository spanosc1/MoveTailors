import React, { Component } from 'react';

import MyMetaTags from './../components/MyMetaTags';

import userService from '../services/userService';
import SignupForm from '../components/SignupForm';
import '../css/Signup.css'

class SignupPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            user: userService.getUser()
        }
    }

    updateMessage = (msg) => {
        this.setState({ message: msg });
    }

    handleSignup = () => {
        this.setState({ user: userService.getUser() });
    }


    render() {
        return (
            <div id='signup-view'>
                <MyMetaTags page="signUp"/>
                <SignupForm {...this.props} updateMessage={this.updateMessage} handleSignup={this.handleSignup} />
                <p>{this.state.message}</p>
            </div>
        );
    }
}

export default SignupPage;