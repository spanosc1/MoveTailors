import React from 'react';
import Moment from "moment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./../components/CheckoutForm";
import Modal from './../components/Modal';

import privacy from "./../docs/privacy.pdf";

import "./../css/Billing.css";

import visa from "./../images/visa_logo.png";
import mast from "./../images/mastercard_logo.png";
import amex from "./../images/americanexpress_logo.png";
import disc from "./../images/discover_logo.jpg";
import stripe from "./../images/stripe_logo.png";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with your real test publishable API key.
const promise = loadStripe("pk_live_51HvvOjGseB6JcKOv6fzfCcsl8bgEzAWPMYqGpPVaQzIzjc4jH9ZoBGg397RqOmBqcXQy5RO9HJxcH9JHSOuOUqty009gvfEWOp");
// const promise = loadStripe("pk_test_51HvvOjGseB6JcKOvGAUDEeyKo0BVDAaHD2rYUF1suQxFEQp0AjQCxlftehUZQQOeyWCj86zpCyKFJ4u8XA2emGYb00rPo3bDrb");

class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    var data = this.props.location.state;
    this.setState({
      id: data.id,
      from: data.inputFrom,
      to: data.inputTo,
      startDate: data.startDate,
      endDate: data.endDate,
      container: data.selectedName,
      price: data.selectedPrice,

      modal: false,
      message: "",

      redirectAfterModal: false
    });
  }

  showModal(message, redirectAfterModal) {
    this.setState({message, modal: true, redirectAfterModal});
  }

  dismissModal() {
    this.setState({message: "", modal: false});
    if(this.state.redirectAfterModal)
    {
      sessionStorage.removeItem("myMove");
      sessionStorage.removeItem("inputFrom");
      sessionStorage.removeItem("inputTo");
      this.props.history.push('/yourmove');
    }
  }

  render() {
    return (
      <div className="billingBackground">
        <Modal
          visible={this.state.modal}
        >
          <p className="modalMessage">
            {this.state.message || "Test message"}
          </p>
          <button className="modalButton modalConfirm" onClick={() =>  this.dismissModal()}>
            OK
          </button>
        </Modal>
        <div className="billingContainer">
          <div className="billingForm">
            <div className="methodContainer">
              <div className="methodTitle tahomaBold">
                Payment secured by <img className="stripeIcon" src={stripe} alt="Stripe"/>
              </div>
              <div className="methodIcons">
                <img className="methodIcon" src={visa} alt="Visa"/>
                <img className="methodIcon" src={mast} alt="Mastercard"/>
                <img className="methodIcon" src={amex} alt="American Express"/>
                <img className="methodIcon" src={disc} alt="Discover"/>
              </div>
              <p className="billingAmountDue tahomaBold">Total: 250 USD</p>
            </div>
            <Elements stripe={promise}>
              <CheckoutForm id={this.state.id} modal={(message, redirectAfterModal) => this.showModal(message, redirectAfterModal)}/>
            </Elements>
          </div>
          <div className="billingInfo">
            <h2 className="billingTitle tahomaBold">
              Down Payment for Reserving Move
            </h2>
            <div className="billingRow">
              <p className="billRowTitle tahomaBold">Origin:</p>
              <p className="billRowVal tahoma">{this.state.from}</p>
            </div>
            <div className="billingRow rowSpace">
              <p className="billRowTitle tahomaBold">Destination:</p>
              <p className="billRowVal tahoma">{this.state.to}</p>
            </div>
            <div className="billingRow rowSpace">
              <p className="billRowTitle tahomaBold">Move day:</p>
              <p className="billRowVal tahoma">{Moment(this.state.startDate).format('DD MMM')} - {Moment(this.state.endDate).format('DD MMM YYYY')}</p>
            </div>
            <div className="billingRow rowSpace">
              <p className="billRowTitle tahomaBold">Container:</p>
              <p className="billRowVal tahoma">{this.state.container}</p>
            </div>
            <div className="billingRow rowSpace">
              <p className="billRowDesc tahoma">Down payment is fully refundable if reservation is cancelled within 24 hours of payment.</p>
            </div>
            <div className="billingRow rowSpace">
              <p className="billRowPrice tahoma">Your move total: {this.state.price} USD</p>
            </div>
            <div className="billingRow">
              <p className="billRowDesc tahoma">Amount due now:</p>
            </div>
            <div className="billingRow rowWhite">
              <p className="billRowPrice tahomaBold">Amount: 250 USD</p>
            </div>
            <div className="billingRow rowSpace">
              <p className="billRowDesc tahoma">
                We will contact you within 24 hours from receiving your reservation.  If your needs change later, we will
                do our best to adjust your reservation accordingly.
              </p>
            </div>
            <div className="billingRow rowSpace">
              <p className="billRowDesc tahoma">
                Have questions?
                <br/>
                +1 888 887 9912
                <br/>
                tailors@movetailors.com
              </p>
            </div>
            <div className="billingRow rowSpace">
              <p className="billRowDesc tahoma">
                Our{' '}
                <a className="footerBody tahoma footerLink" href={privacy} target="_black" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Billing;