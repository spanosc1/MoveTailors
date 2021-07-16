import React from 'react';
import { NavLink } from "react-router-dom";
import DatePicker from "react-datepicker";
import Moment from "moment";
import { openPopupWidget } from 'react-calendly';

import Modal from './../components/Modal';

import "react-datepicker/dist/react-datepicker.css";

import "./../css/Customize.css";

import container20 from './../images/container20.jpg';
import container40 from './../images/container40.jpg';
import container40HC from './../images/container40HC.jpg';

const containers = [
  {
    name: "20 ft Container",
    desc: "This is the most common container size and countless movers use it daily for moving small to medium sized loads, such as the contents of a 2-3 room apartment.",
    img: container20
  },
  {
    name: "40 ft Container",
    desc: "This is double the size of the 20' container. Many movers use it daily for moving medium to large sized loads, such as the contents of a 4-7 room house.",
    img: container40
  },
  {
    name: "40 ft High Cube Container",
    desc: "This is the biggest container size we offer and countless movers use it daily for moving medium to large sized loads, such as the contents of a 4-7 room house.",
    img: container40HC
  }
];

class Customize extends React.Component {
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

      selected: 0,
      selectedName: containers[0].name,
      selectedDesc: containers[0].desc,
      selectedImg: containers[0].img,
      selectedPrice: "0",
      displayDate: Moment(Date.now()).add(10, 'days').unix() * 1000,
      startDate: Moment(Date.now()).add(10, 'days').unix() * 1000,
      endDate: Moment(Date.now()).add(24, 'days').unix() * 1000,

      modal: false,
      message: "Enter your email address.",
      email: "",

      consultClicked: false
    }
  }

  componentDidMount() {
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
      
      displayDate: data.startDate || this.state.displayDate,
      startDate: data.startDate || this.state.startDate,
      endDate: data.endDate || this.state.endDate,
      selectedName: data.selected ? containers[data.selected].name : this.state.selectedName,
      selectedDesc: data.selected ? containers[data.selected].desc : this.state.selectedDesc,
      selectedImg: data.selected ? containers[data.selected].img : this.state.selectedImg,
      selected: data.selected || 0,
      selectedPrice: data.selectedPrice || this.numberWithCommas(data.route.max_20)
    });
    if(!sessionStorage.getItem('email'))
    {
      // this.setState({modal: true}); //Add this back to use email popup form
    }
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  updateContainer(i) {
    var price = "";
    switch(i) {
      case 0:
        price = this.numberWithCommas(this.state.route.max_20);
        break;
      case 1:
        price = this.numberWithCommas(this.state.route.max_40);
        break;
      case 2:
        price = this.numberWithCommas(this.state.route.max_40HC);
        break;
      default:
        break;
    }

    this.setState({
      selected: i,
      selectedName: containers[i].name,
      selectedDesc: containers[i].desc,
      selectedImg: containers[i].img,
      selectedPrice: price
    });
  }

  setStartDate(date) {
    this.setState({
      displayDate: Moment(date).unix()*1000,
      startDate: Moment(date).unix()*1000,
      endDate: Moment(date).add(14, 'days').unix()*1000
    });
  }

  handleSubmit() {
    sessionStorage.setItem('email', this.state.email);
    const id = sessionStorage.getItem('queryId');
    if(id)
    {
      fetch(`/query/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.state.email
        })
      })
      .then((response) => response.json())
      .then((body) => {
        // console.log(body);
      });
    }
    this.setState({modal: false});
  }

  calendlyClick() {
    // e.stopPropagation();
    this.setState({consultClicked: true});
    openPopupWidget({url: 'https://calendly.com/movetailors'});
  }

  render() {
    return (
      <div className="customizeBackground">
        <Modal
          visible={this.state.modal}
        >
          <p className="modalMessage">
            {this.state.message || "Test message"}
          </p>
          <input
            className="modalInput"
            value={this.state.email}
            onChange={(email) => this.setState({email: email.target.value})}
            placeholder="email"
          />
          <button className="modalButton modalConfirm" onClick={() => this.handleSubmit()}>
            Submit
          </button>
          <button className="modalButton modalCancel" onClick={() => this.setState({modal: false})}>
            Cancel
          </button>
        </Modal>
        <div className="customizeContainer">
          <div className="customizeInnerTop">
            <div className="customizeSelectedContainer">
              <h2 className="customizeTypeSelected tahoma">
                {this.state.selectedName}
              </h2>
              <img className="customizeImgSelected" src={this.state.selectedImg} alt="Container"/>
              <p className="customizeDescSelected tahoma">
                {this.state.selectedDesc}
              </p>
            </div>
            <div className="optionsContainer">
              <h2 className="optionsTitle tahoma">
                Select Your Container
              </h2>
              <div className="options">
                <button
                  className="optionButton tahomaBold"
                  style={{backgroundColor: this.state.selected === 0 ? "var(--red)" : "transparent"}}
                  onClick={() => this.updateContainer(0)}
                >
                  <span className="buttonText">
                    20' Container
                  </span>
                  <span className="buttonPrice">
                    INCL.
                  </span>
                </button>
                <button
                  className="optionButton tahomaBold"
                  style={{backgroundColor: this.state.selected === 1 ? "var(--red)" : "transparent"}}
                  onClick={() => this.updateContainer(1)}
                >
                  <span className="buttonText">
                    40' Container
                  </span>
                  <span className="buttonPrice">
                    + $
                    {this.state.route.max_20 &&
                      parseInt(this.state.route.max_40) - parseInt(this.state.route.max_20)
                    }
                  </span>
                </button>
                <button
                  className="optionButton tahomaBold"
                  style={{backgroundColor: this.state.selected === 2 ? "var(--red)" : "transparent"}}
                  onClick={() => this.updateContainer(2)}
                >
                  <span className="buttonText">
                    40'HC Container
                  </span>
                  <span className="buttonPrice">
                    + $
                    {this.state.route.max_20 &&
                      parseInt(this.state.route.max_40HC) - parseInt(this.state.route.max_20)
                    }
                  </span>
                </button>
              </div>
              <p className="datePickerTitle tahoma">
                Select your approximate move date
              </p>
              <DatePicker
                className="datePicker tahoma"
                placeholderText="Click here to set a date"
                dateFormat="d MMM, yyyy"
                minDate={new Date(Moment(Date.now()).add(10, 'days'))}
                selected={this.state.displayDate}
                onChange={(date) => this.setStartDate(date)}
              />
              <p className="optionsExplainer tahoma">
                The container is placed on a truck trailer, approx. 1.4m (4'6") above the ground during loading and unloading.
                <br/><br/>
                Move Tailors will choose a container of ordered size from the most suitable container shipping line, e.g. Maersk,
                Evergreen, etc. depending on geography, schedule, route, and other factors.
              </p>
            </div>
          </div>
          <div className="customizeInnerBottom">
            <div className="customizeBottomPriceView">
              <p className="customizeBottomPrice tahoma">
                Price excl. tax: 
                <span className="priceVal">
                  {this.state.selectedPrice} USD
                </span>
              </p>
            </div>
            <div className="customizeBottomButtons">
              <NavLink
                className="changeDestButton tahoma"
                to="/"
              >
                Change Destination
              </NavLink>
              <button className="changeDestButton summaryButton tahoma" style={{backgroundColor: this.state.consultClicked ? '#363636' : '#ee3b37'}} onClick={() => this.calendlyClick()}>
                Book a Consultation
              </button>
              <NavLink
                className="summaryButton container-select-continue tahoma"
                style={{backgroundColor: this.state.consultClicked ? '#ee3b37' : '#363636'}}
                to={{
                  pathname: '/bookyourmove',
                  state: this.state
                }}
              >
                Summary of your Move
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Customize;