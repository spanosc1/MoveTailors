import React from 'react';
import { NavLink } from "react-router-dom";
import ReactToPrint from "react-to-print";

import "./../css/InstantPrice.css";

import terms from "./../docs/termsandconditions.pdf";

import navLogo from './../images/logocolor.png';
import check from './../images/check.png';

class InstantPrice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fromCountryCode: "",
      fromLatLng: {lat: 0, lng: 0},
      fromPlaceID: "",
      inputFrom: "",
      inputTo: "",
      route: {},
      toCountryCode: "",
      toLatLng: {lat: 0, lng: 0},
      toPlaceID: "",
      printMode: false
    }
  }

  componentDidMount() {
    const data = this.props.location.state;
    this.setState({
      fromCountryCode: data.result.fromCountryCode,
      fromLatLng: data.result.fromLatLng,
      fromPlaceID: data.result.fromPlaceID,
      inputFrom: data.result.inputFrom,
      inputTo: data.result.inputTo,
      route: data.result.routes[data.minIndex],
      toCountryCode: data.result.toCountryCode,
      toLatLng: data.result.toLatLng,
      toPlaceID: data.result.toPlaceID
    }, () => {
      sessionStorage.setItem('myMove', JSON.stringify(this.state));
    });
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handlePrint() {
    this.setState({printMode: true}, () => {
      this.printRef.handlePrint();
    });
    setTimeout(() => {
      this.setState({printMode: false});
    }, 1000);
  }

  render() {
    return (
      <div className="instantBackground">
        <div className="instantContainer">
          <div className="instantTitleRow">
            <h2 className="instantTitle tahomaBold">
              INSTANT PRICE
            </h2>
            <ReactToPrint
                ref={el => (this.printRef = el)}
                content={() => this.componentRef}
              />
              <button className="instantPrint instant-price-continue tahoma" onClick={() => {this.handlePrint()}}>
                Print this page
              </button>
            
          </div>
          <div className="instantContent" ref={(el) => (this.componentRef = el)}>
            {this.state.printMode &&
              <div className="printContainer">
                <img className="navLogo" src={navLogo} alt="Move Tailors"/>
                <div className="printInfo">
                  <p className="printLine">Move Tailors</p>
                  <p className="printLine">www.movetailors.com</p>
                  <p className="printLine">+1 888 887 9912</p>
                  <p className="printLine">tailors@movetailors.com</p>
                </div>
              </div>
            }
            <div className="instantInnerTop">
              <div className="priceView">
                <p className="priceTitle tahomaBold">
                  Price excl. tax:
                </p>
                <h2 className="priceVal tahomaBold">
                  {this.state.route.max_20 &&
                    this.numberWithCommas(this.state.route.max_20)
                  } USD
                </h2>
                <p className="priceDesc tahomaBold">
                  This is the price for moving a 20' container from your old door
                  to your new door
                </p>
              </div>
              <div className="fromToContainer">
                <h4 className="fromToView tahoma">
                  From: {this.state.inputFrom}
                </h4>
                <h4 className="fromToView tahoma">
                  To: {this.state.inputTo}
                </h4>
                <div className="timeView">
                  <p className="timeTitle tahoma">
                    Estimated transit time is
                  </p>
                  <h2 className="timeVal tahoma">
                    {this.state.route.minDays &&
                      this.state.route.minDays
                    }- 
                    {this.state.route.maxDays &&
                      this.state.route.maxDays
                    } days
                  </h2>
                  <p className="timeTitle tahoma">
                    We will provide a more accurate schedule later
                  </p>
                </div>
              </div>
            </div>
            <div className="instantInnerBottom">
              <div className="tableView">
                <div className="rowsContainer tahoma">
                  <p>Loading</p>
                  <p>Land Transport</p>
                  <p>Port Handling</p>
                  <p>Sea Transport</p>
                  <p>Customs Paperwork</p>
                  <p>Unloading</p>
                </div>
                <div className="tableContainer tahoma">
                  <table>
                    <tr className="tahomaBold">
                      <th>Included</th>
                      <th>Customer</th>
                    </tr>
                    <tr>
                      <td></td>
                      <td><img className="tableCheck" src={check} alt=""/></td>
                    </tr>
                    <tr>
                      <td><img className="tableCheck" src={check} alt=""/></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td><img className="tableCheck" src={check} alt=""/></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td><img className="tableCheck" src={check} alt=""/></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td><img className="tableCheck" src={check} alt=""/></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><img className="tableCheck" src={check} alt=""/></td>
                    </tr>
                  </table>
                </div>
              </div>
              <div className="instantTailorView">
                <p className="tailorTitle tahoma">
                  Freight prices change frequently.
                  <br/>
                  You can fix this price by reserving your move.
                </p>
                <p className="priceTerms tahomaBold">
                  Read our{' '}
                  <a className="termsLink tahomaBold" href={terms} target="_black" rel="noopener noreferrer">
                    Terms and Conditions
                  </a>
                </p>
                <NavLink
                  className="tailorYourMove tahomaBold"
                  to={{
                    pathname: '/customize',
                    state: this.state
                  }}
                >
                  Click to Tailor Your Move
                </NavLink>
                </div>
              </div>
              {/*<div className="fromToContainer">
                <h4 className="fromToView tahoma">
                  From: {this.state.inputFrom}
                </h4>
                <h4 className="fromToView tahoma">
                  To: {this.state.inputTo}
                </h4>
              </div>
              <div className="instantInfoView">
                <div className="instantCol">
                  <p className="instantExplainer tahoma">
                    Port handling, land and sea transportation, weighing, and security
                    are part of the price.  You must organize loading and
                    unloading yourself.  Standard 2 hour loading and unloading periods are
                    included into the price.
                  </p>
                  <p className="instantExplainer tahoma">
                    The price assumes that details correspond to the customary move as shown
                    on the next page.  We assume that both addresses can be accessed with
                    the container truck.  The content of container is used for duty free household
                    goods.
                  </p>
                </div>
                <div className="instantCol">
                  <p className="instantExplainer tahoma">
                    Usually there are no extra charges.  The price includes the customs clearance
                    procedure, however in case customs decides to examine the container or
                    collect customs duties, you need to either pay the charges directly or,
                    if you prefer, we may pay those costs and collect the money from you
                    against the documents.
                  </p>
                  <p className="instantExplainer tahoma">
                    Freight prices change frequently and this price is valid for today only. You can fix this price by reserving your move today.
                  </p>
                </div>
              </div>
            </div>
            <div className="instantInnerBottom">
              <div className="priceView">
                <p className="priceTitle tahomaBold">
                  Price excl. tax:
                </p>
                <h2 className="priceVal tahomaBold">
                  {this.state.route.max_20 &&
                    this.numberWithCommas(this.state.route.max_20)
                  } USD
                </h2>
                <p className="priceDesc tahomaBold">
                  This is the price for moving a 20' container from your old door
                  to your new door
                </p>
                <p className="priceTerms tahomaBold">
                  Read our{' '}
                  <a className="termsLink tahomaBold" href={terms} target="_black" rel="noopener noreferrer">
                    Terms and Conditions
                  </a>
                </p>
              </div>
              <div className="timeView">
                <p className="timeTitle tahoma">
                  Estimated transit time is
                </p>
                <h2 className="timeVal tahoma">
                  {this.state.route.minDays &&
                    this.state.route.minDays
                  }- 
                  {this.state.route.maxDays &&
                    this.state.route.maxDays
                  } days
                </h2>
                <p className="timeTitle tahoma">
                  We will provide a more accurate schedule later
                </p>
                <NavLink
                  className="tailorYourMove tahomaBold"
                  to={{
                    pathname: '/customize',
                    state: this.state
                  }}
                >
                  Click to Tailor Your Move
                </NavLink>
                </div>*/}
          </div>
        </div>
      </div>
    )
  }
}

export default InstantPrice;