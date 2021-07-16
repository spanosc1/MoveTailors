import React from 'react';
import userService from "../services/userService";
import Moment from "moment";
import ReactToPrint from "react-to-print";

import "./../css/YourMove.css";

import navLogo from './../images/logocolor.png';

class YourMoveInfo extends React.Component {
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
      booked: false,

      selected: 0,
      startDate: 0,
      endDate: 0,

      printMode: false
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);
    const uID = userService.getUser()._id;
    fetch(`/getmovebyuserid/${uID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((body) => {
      if(body.message === "Success")
      {
        this.setState({
          id: body.move._id,

          inputFrom: body.move.from,
          inputTo: body.move.to,
          toCountryCode: body.move.toCountryCode,
          toLatLng: body.move.toLatLng,
          toPlaceID: body.move.toPlaceID,
          
          selectedName: body.move.container,
          selected: body.move.containerIndex,
          startDate: body.move.startDate,
          endDate: body.move.endDate,
          selectedPrice: body.move.price,
          booked: body.move.booked
        });
      }
    });
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  book() {
    this.props.history.push({
      pathname: '/billing',
      state: this.state
    });
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
      <div className="yourMoveBackground">
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
              {this.state.booked ?
                "Reserved"
                :
                "Saved"
              }
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
                  <span className="rowValueRight">2h, additional hours $110/h</span>
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
                  <span className="rowValueRight">2h, additional hours $110/h</span>
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
                Price: ${this.state.selectedPrice > 0 ?
                  this.numberWithCommas(this.state.selectedPrice)
                  :
                  0
                }
              </p>
              <p className="yourMoveRowValue yourMovePriceValid tahoma">
                Price valid {Moment(Date.now()).format("DD MMM YYYY")}
              </p>
            </div>
            <div className="yourMoveRow">
              <p className="yourMoveRowTitle tahomaBold">
              </p>
              <p className="yourMoveRowValue tahoma">
                Move Tailors will fix this price and send you an order confirmation, if you accept this
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
                Reserving requires 250 USD down payment, which is fully refundable if you decide to
                cancel within 24 hours from reserving.
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
              {this.state.booked ?
                <button className="bookButton" onClick={() => this.book()}>
                  Cancel
                </button>
                :
                <button className="bookButton move-summary-reserve" onClick={() => this.book()}>
                  Reserve
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default YourMoveInfo;