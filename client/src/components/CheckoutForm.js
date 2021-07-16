import React, { useState, useEffect, useMemo } from "react";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

import Select from 'react-select'
import countryList from 'react-select-country-list'

import userService from "../services/userService";

import termsFile from "./../docs/termsandconditions.pdf";

export default function CheckoutForm(props) {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [email, setEmail] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [terms, setTerms] = useState(false);
  const [countryLabel, setCountryLabel] = useState('');
  const [country, setCountry] = useState('');
  const options = useMemo(() => countryList().getData(), [])

  const stripe = useStripe();
  const elements = useElements();
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    window
      .fetch("/api/payments/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: []
        })
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setClientSecret(data.clientSecret);
        const u = userService.getUser();
        if(u)
        {
          setEmail(u.email);
        }
        if(u.phoneNumber)
        {
          setPhone(u.phoneNumber);
        }
      });
  }, []);
  const cardStyle = {
    style: {
      base: {
        color: "#000000",
        fontFamily: 'Roboto, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#000000"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };
  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const changeCountry = value => {
    setCountryLabel(value);
    setCountry(value.value);
  }

  const handleSubmit = async ev => {
    ev.preventDefault();
    if(!terms)
    {
      props.modal("Please accept the Terms and Conditions.", false);
    }
    else
    {
      setProcessing(true);
      const payload = await stripe.confirmCardPayment(clientSecret, {
        receipt_email: email,
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: name,
            email: email,
            phone: phone,
            address: {
              city: city,
              line1: addr1,
              line2: addr2,
              state: state,
              country: country
            }
          }
        }
      });
      if (payload.error) {
        setError(`Payment failed ${payload.error.message}`);
        setProcessing(false);
      } else {
        setError(null);
        setProcessing(false);
        setSucceeded(true);
        //Update PAID flag in DB
        const u = userService.getUser();
        fetch(`/book`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: props.id,
            email: u.email,
            phone: u.phoneNumber,
            name: u.firstName + " " + u.lastName
          })
        })
        .then((response) => response.json())
        .then((body) => {
          if(body.message === "Success")
          {
            props.modal("Thank you for your payment.  A moving assistant will contact you within 24 hours.", true);
          }
          else
          {
            props.modal("There was an error reserving your move, please try again later or contact MoveTailors directly.", false);
          }
        });
      }
    }
  };
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
      />
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone (incl. country code)"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name on card"
      />
      <input
        type="text"
        value={addr1}
        onChange={(e) => setAddr1(e.target.value)}
        placeholder="Address Line 1"
      />
      <input
        type="text"
        value={addr2}
        onChange={(e) => setAddr2(e.target.value)}
        placeholder="Address Line 2"
      />
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
      />
      <input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="State (US Only)"
      />
      <Select placeholder="Country" options={options} value={countryLabel} onChange={changeCountry} />
      <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
      <p className="termsText tahoma"><input type="checkbox" checked={terms} onClick={() => setTerms(!terms)}/>I accept the <a className="tahomaBold termsLink" id="billingTermsLink" href={termsFile} target="_blank" rel="noopener noreferrer">Terms and Conditions</a></p>
      <button
        disabled={processing || disabled || succeeded}
        id="submit"
      >
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Pay"
          )}
        </span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* Show a success message upon completion */}
      <p className={succeeded ? "result-message" : "result-message hidden"}>
        Your payment was successful.  Thank you for choosing Move Tailors!
      </p>
    </form>
  );
}