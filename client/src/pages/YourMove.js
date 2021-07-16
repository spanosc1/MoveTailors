import React from 'react';
import userService from "../services/userService";
import Moment from "moment";
import { Redirect, NavLink } from "react-router-dom";
import ReactToPrint from "react-to-print";

import Modal from './../components/Modal';

import "./../css/YourMove.css";

import navLogo from './../images/logocolor.png';

class YourMove extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",

      fromCountryCode: "",
      fromLatLng: {lat: 0, lng: 0},
      fromPlaceID: "",
      inputFrom: "",
      inputTo: "",
      route: {},
      toCountryCode: "",
      toLatLng: {lat: 0, lng: 0},
      toPlaceID: "",

      selected: 0,
      startDate: 0,
      endDate: 0,

      navigateHome: false,
      navigateList: false,
      navigateLogin: false,

      message: "",
      modal: false,

      printMode: false
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    var data = this.props.location.state;
    if(!data)
    {
      data = JSON.parse(sessionStorage.getItem('myMove'));
    }
    this.setState({
      fromCountryCode: data.fromCountryCode,
      fromLatLng: data.fromLatLng,
      fromPlaceID: data.fromPlaceID,
      inputFrom: data.inputFrom,
      inputTo: data.inputTo,
      route: data.route,
      toCountryCode: data.toCountryCode,
      toLatLng: data.toLatLng,
      toPlaceID: data.toPlaceID,
      
      selectedName: data.selectedName || "20 ft Container",
      selected: data.selected || 0,
      startDate: data.startDate || Moment(Date.now()).add(10, 'days').unix() * 1000,
      endDate: data.endDate || Moment(Date.now()).add(24, 'days').unix() * 1000,
      selectedPrice: data.selectedPrice || this.numberWithCommas(data.route.max_20)
    }, () => {
      sessionStorage.setItem('myMove', JSON.stringify(this.state));
    });
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  save(booked) {
    const s = this.state;
    const u = userService.getUser();
    if(u)
    {
      fetch(`/save`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: s.inputFrom,
          to: s.inputTo,
          fromPlaceID: s.fromPlaceID,
          toPlaceID: s.toPlaceID,
          fromCountryCode: s.fromCountryCode,
          toCountryCode: s.toCountryCode,
          startDate: s.startDate,
          endDate: s.endDate,
          fromLatLng: s.fromLatLng,
          toLatLng: s.toLatLng,
          price: parseInt(s.selectedPrice.replace(/,/g, "")),
          container: s.selectedName,
          containerIndex: s.selected,
          originPort: s.route.originPort ? s.route.originPort._id : null,
          destPort: s.route.destPort ? s.route.destPort._id : null,
          originPortName: s.route.originPort ? s.route.originPort.portName : null,
          destPortName: s.route.destPort ? s.route.destPort.portName : null,
          minDays: s.route.minDays,
          maxDays: s.route.maxDays,
          max20: parseInt(s.route.max_20),
          max40: parseInt(s.route.max_40),
          max40HC: parseInt(s.route.max_40HC),
          distToOriginPort: s.route.distToOriginPort,
          distFromDestPort: s.route.distFromDestPort,
          booked: false,
          platformUser: u._id,
          userName: u.firstName + " " + u.lastName,
          userEmail: u.email,
          paid: false
        })
      })
      .then((response) => response.json())
      .then((body) => {
        if(body.message === "Success")
        {
          if(booked)
          {
            this.setState({id: body.move._id}, () => {
              this.props.history.push({
                pathname: '/billing',
                state: this.state
              });
            });
          }
          else
          {
            this.props.history.push('/yourmove');
          }
        }
      });
    }
    else
    {
      this.setState({navigateLogin: true});
    }
  }

  newQuote() {
    this.setState({modal: true, message: "Are you sure you want to start a new quote?  Your current one may be lost."});
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
    if(this.state.navigateHome) {
      return (
        <Redirect
          push
          to="/"
        />
      )
    }

    if(this.state.navigateLogin) {
      return (
        <Redirect
          push
          to="/login"
        />
      )
    }

    return (
      <div className="yourMoveBackground">
        <Modal
          visible={this.state.modal}
        >
          <p className="modalMessage">
            {this.state.message || "Test message"}
          </p>
          <button className="modalButton modalConfirm" onClick={() => this.setState({navigateHome: true})}>
            Ok
          </button>
          <button className="modalButton modalCancel" onClick={() => this.setState({modal: false, message: ""})}>
            Cancel
          </button>
        </Modal>
        <div className="yourMoveTitleRow">
          <h2 className="yourMoveTitle tahomaBold">
            Your Move
          </h2>
          <div className="bookingStatusView">
            <p className="bookingStatus tahoma">
              <span className="tahomaBold">
                Booking Status:{' '}
              </span>
              {Moment(Date.now()).format("DD MMM YYYY")}
              <br/>
              Not reserved
            </p>
          </div>
        </div>
        <div className="yourMoveContainer" ref={(el) => (this.componentRef = el)}>
          <div className="yourMoveInner">
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
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
                Customer
              </p>
              <p className="yourMoveRowValue tahoma">
                {userService.getUser() ?
                  userService.getUser().firstName + " " + userService.getUser().lastName
                  :
                  "Guest"
                }
              </p>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
                Date
              </p>
              <p className="yourMoveRowValue tahoma">
                {Moment(this.state.startDate).format('MMM D')} - {Moment(this.state.endDate).format('MMM D')} Exact date will be determined later, excl. weekends and public holidays.
              </p>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
                From
              </p>
              <p className="yourMoveRowValue yourMoveWhite tahoma">
                {this.state.inputFrom}
              </p>
              <div className="yourMoveRowTitleRight tahoma">
                <p className="moveRightRow tahoma">
                  <span className="rowTitleRight tahomaBold">Loading:</span>
                  <span className="rowValueRight">self</span>
                </p>
                <p className="moveRightRow tahoma">
                  <span className="rowTitleRight tahomaBold">Loading time:</span>
                  <span className="rowValueRight">2h, additional $110/h</span>
                </p>
              </div>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
                To
              </p>
              <p className="yourMoveRowValue yourMoveWhite tahoma">
                {this.state.inputTo}
              </p>
              <div className="yourMoveRowTitleRight tahoma">
                <p className="moveRightRow tahoma">
                  <span className="rowTitleRight tahomaBold">Unloading:</span>
                  <span className="rowValueRight">self</span>
                </p>
                <p className="moveRightRow tahoma">
                  <span className="rowTitleRight tahomaBold">Unloading time:</span>
                  <span className="rowValueRight">2h, additional $110/h</span>
                </p>
              </div>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
                Container
              </p>
              <p className="yourMoveWhiteShort tahoma">
                {this.state.selectedName}
              </p>
              <NavLink
                className="changeContainerSize tahoma"
                to="/customize"
              >
                Change Container or Date
              </NavLink>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
                Content
              </p>
              <p className="yourMoveRowValue tahoma">
                Used household goods, allowed by customs as duty free in connection of immigration. No motor vehicles. No goods classified as dangerous goods in tansport regulations.
              </p>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
                Access
              </p>
              <p className="yourMoveRowValue tahoma">
                Customer secures access for container truck in both locations
              </p>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
                Insurance
              </p>
              <p className="yourMoveRowValue tahoma">
                You will be given an opportunity to insure the shipment
              </p>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
              </p>
              <p className="yourMovePrice tahomaBold">
                Price: ${this.state.selectedPrice}
              </p>
              <p className="yourMoveRowValue yourMovePriceValid tahoma">
                Price valid {Moment(Date.now()).format("DD MMM YYYY")}
              </p>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
              </p>
              <p className="yourMoveRowValue tahoma">
                Move Tailors will fix this price and send you an order confirmation if you accept this
                quotation today and pay 250 USD as down payment of the total price.  The remaining part
                of the price can be paid in two equal installments, first 7 days before the move and
                second at the day of loading the container.
              </p>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
              </p>
              <p className="yourMoveRowValue tahoma">
                <span className="tahomaBold">
                  Move Tailors will:
                </span>
                <br/>
                Transport empty container to residence and loaded container from residence to port.
                <br/>
                Handle export declaration
                <br/>
                Pay normal and customary terminal handling charges and port fees
                <br/>
                Arrange ocean freight
                <br/>
                Handle customs clearance
                <br/>
                Organize inland transportation to new residence
                <br/>
                Return empty container to the port
              </p>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
              </p>
              <p className="yourMoveRowValue tahomaBold">
                Reservation requires 250 USD down payment, which is fully refundable if you decide to cancel within 24 hours from paying the reservation.
              </p>
            </div>
            <div className="yourMoveRow yourMoveButtons">
              <ReactToPrint
                ref={el => (this.printRef = el)}
                content={() => this.componentRef}
              />
              <button className="printButton tahoma" onClick={() => {this.handlePrint()}}>
                Print this page
              </button>
              <button className="otherButton tahoma" onClick={() => this.newQuote()}>
                New Quote
              </button>
              <button className="otherButton tahoma" onClick={() => this.save(false)}>
                {userService.getUser() ? 
                  "Save"
                  :
                  "Log in to Save"
                }
              </button>
              {userService.getUser() ?
                <button className="bookButton move-summary-reserve tahoma" onClick={() => this.save(true)}>
                  Reserve
                </button>
                :
                <button className="bookButton move-summary-reserve tahoma" onClick={() => this.save(true)}>
                  Log in to Reserve
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default YourMove;