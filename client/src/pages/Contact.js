import React from 'react';

import Modal from './../components/Modal';
import MyMetaTags from './../components/MyMetaTags';

import "./../css/Contact.css";

var classNames = require("classnames");

// eslint-disable-next-line
const emailPattern = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      message: "",

      nameVis: true,
      emailVis: true,
      phoneVis: true,
      messageVis: true,

      modal: false,
      response: "",
      sent: false
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
  }

  focus(name, vis) {
    this.setState({[vis]: false});
  }

  blur(input, vis) {
    if(this.state[input] === "") {
      this.setState({[vis]: true});
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if(!this.state.sent)
    {
      if(this.state.name === "" || this.state.email === "" || this.state.message === "") {
        this.setState({response: "Name, email, and a message are required.", modal: true});
      }
      else if(!emailPattern.test(this.state.email))
      {
        this.setState({response: "Please enter a valid email address.", modal: true});
      }
      else
      {
        fetch(`/sendmessage`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.state.name,
            email: this.state.email,
            phone: this.state.phone,
            message: this.state.message
          })
        })
        .then((response) => response.json())
        .then((body) => {
          this.setState({
            response: body.message,
            modal: true,
            sent: true
          });
        });
      }
    }
  }

  render() {
    var nameLabel = classNames({
      "inputLabel": true,
      "inputLabelFocus": !this.state.nameVis
    });

    var emailLabel = classNames({
      "inputLabel": true,
      "inputLabelFocus": !this.state.emailVis
    });

    var phoneLabel = classNames({
      "inputLabel": true,
      "inputLabelFocus": !this.state.phoneVis
    });

    var messageLabel = classNames({
      "inputLabel": true,
      "inputLabelFocus": !this.state.messageVis
    });

    var contactSubmit = classNames({
      "contactSubmit": true,
      "contact-submit": true,
      "tahomaBold": true,
      "disabled": this.state.sent
    })

    return (
      <div className="contactContainer">
        <MyMetaTags page="contact"/>
        <Modal
          visible={this.state.modal}
        >
          <p className="modalMessage">
            {this.state.response || "Test message"}
          </p>
          <button className="modalButton modalConfirm" onClick={() =>  this.setState({modal: false})}>
            OK
          </button>
        </Modal>
        <div className="contactFormView">
          <form className="contactForm">
            <h2 className="contactTitle tahomaBold">Contact us</h2>
            <div className="inputItem">
              <label className={nameLabel} for="name">
                Your name
              </label>
              <input
                className="contactInput tahoma"
                id="name"
                onFocus={() => this.focus("name", "nameVis")}
                onBlur={() => this.blur("name", "nameVis")}
                value={this.state.name}
                onChange={(name) => this.setState({name: name.target.value})}
              />
            </div>
            <div className="inputItem">
              <label className={emailLabel} for="email">
                Email
              </label>
              <input
                className="contactInput tahoma"
                id="email"
                onFocus={() => this.focus("email", "emailVis")}
                onBlur={() => this.blur("email", "emailVis")}
                value={this.state.email}
                onChange={(email) => this.setState({email: email.target.value})}
              />
            </div>
            <div className="inputItem">
              <label className={phoneLabel} for="phone">
                Phone (incl. country code)
              </label>
              <input
                className="contactInput tahoma"
                id="phone"
                onFocus={() => this.focus("phone", "phoneVis")}
                onBlur={() => this.blur("phone", "phoneVis")}
                value={this.state.phone}
                onChange={(phone) => this.setState({phone: phone.target.value})}
              />
            </div>
            <div className="inputItem">
              <label className={messageLabel} for="message">
                Message
              </label>
              <textarea
                className="contactInput contactTextArea tahoma"
                id="message"
                rows={6}
                onFocus={() => this.focus("message", "messageVis")}
                onBlur={() => this.blur("message", "messageVis")}
                value={this.state.message}
                onChange={(message) => this.setState({message: message.target.value})}
              >
              </textarea>
            </div>
            <button className={contactSubmit} onClick={this.handleSubmit}>
              {this.state.sent ?
                "Message sent"
                :
                "Submit"
              }
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Contact;