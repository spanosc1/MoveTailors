import React from "react";
import Slider from "react-slick";
import { Redirect } from 'react-router-dom';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

import Modal from './../components/Modal';

import "./../css/Home_OLD.css";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import tailor from "./../images/tailor.png";
import load from "./../images/load.png";
import transport from "./../images/transport.png";
import move from "./../images/move.png";

var classNames = require("classnames");

const steps = [
  {
    icon: tailor,
    num: 1,
    title: "TAILOR",
    body: "RESERVE on-line"
  },
  {
    icon: load,
    num: 2,
    title: "COORDINATE",
    body: "LOAD the container at your old home"
  },
  {
    icon: transport,
    num: 3,
    title: "MOVE",
    body: "We TRANSPORT & do CUSTOMS CLEARANCE"
  },
  {
    icon: move,
    num: 4,
    title: "MOVE",
    body: "UNLOAD the container at your new home"
  }
];

const testimonials = [
  {
    body: "\"The entire process was easy. Everything arrived safely and I had always the complete knowledge where the container was moving. The loading of my boxes into 20' container by two of us took about 90 minutes and emptying in destination was even faster. For full container it would of course take longer. I recommend this way of moving your belongings.\"",
    attr: "Dr. J. Korpela"
  }
]

var settings = {
  arrows: false,
  dots: false,
  infinite: true,
  speed: 600,
  autoplay: true,
  autoplaySpeed: 10000,
  slidesToShow: 1,
  slidesToScroll: 1,
  outline: 'none',
  fade: true
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFrom: "",
      fromPlaceID: "",
      fromCountryCode: "",
      fromLatLng: {},
      
      inputTo: "",
      toPlaceID: "",
      toCountryCode: "",
      toLatLng: {},

      navigate: false,
      response: {},

      message: "",
      modal: false,
      waiting: false,
      modalSubmit: false
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    var inputFrom = JSON.parse(sessionStorage.getItem('inputFrom'));
    var inputTo = JSON.parse(sessionStorage.getItem('inputTo'));
    if(inputFrom)
    {
      this.setState({
        inputFrom: inputFrom.inputFrom,
        fromPlaceID: inputFrom.fromPlaceID,
        fromCountryCode: inputFrom.fromCountryCode,
        fromLatLng: inputFrom.fromLatLng
      });
    }
    if(inputTo)
    {
      this.setState({
        inputTo: inputTo.inputTo,
        toPlaceID: inputTo.toPlaceID,
        toCountryCode: inputTo.toCountryCode,
        toLatLng: inputTo.toLatLng
      });
    }
  }

  handleChangeFrom = inputFrom => {
    this.setState({ inputFrom });
  };
 
  handleSelectFrom = address => {
    var inputFrom = {
      inputFrom: address,
      fromPlaceID: "",
      fromCountryCode: "",
      fromLatLng: {}
    };
    this.setState({ inputFrom: address });
    geocodeByAddress(address)
    .then(results => {
      inputFrom.fromPlaceID = results[0].place_id;
      inputFrom.fromCountryCode = results[0].address_components[results[0].address_components.length - 1].short_name;
      this.setState({
        fromPlaceID: results[0].place_id,
        fromCountryCode: results[0].address_components[results[0].address_components.length - 1].short_name,
      });
      getLatLng(results[0])
      .then((latlng) => {
        inputFrom.fromLatLng = latlng;
        this.setState({
          fromLatLng: latlng
        }, () => {
          sessionStorage.setItem('inputFrom', JSON.stringify(inputFrom));
        });
      })
      .catch(error => console.log('Error', error));
    })
    .catch(error => console.error('Error', error));
  };

  handleChangeTo = inputTo => {
    this.setState({ inputTo });
  };
 
  handleSelectTo = address => {
    var inputTo = {
      inputTo: address,
      toPlaceID: "",
      toCountryCode: "",
      toLatLng: {}
    };
    this.setState({ inputTo: address });
    geocodeByAddress(address)
    .then(results => {
      inputTo.toPlaceID = results[0].place_id;
      inputTo.toCountryCode = results[0].address_components[results[0].address_components.length - 1].short_name;
      this.setState({
        toPlaceID: results[0].place_id,
        toCountryCode: results[0].address_components[results[0].address_components.length - 1].short_name,
      });
      getLatLng(results[0])
      .then((latlng) => {
        inputTo.toLatLng = latlng;
        this.setState({
          toLatLng: latlng
        }, () => {
          sessionStorage.setItem('inputTo', JSON.stringify(inputTo));
        })
      })
      .catch(error => console.log('Error', error));
    })
    .catch(error => console.error('Error', error));
  };

  handleSubmitCheck = (e) => {
    e.preventDefault();
    console.log(this.state.fromCountryCode, this.state.toCountryCode);
    if(this.state.inputFrom === "" || this.state.inputTo === "")
    {
      this.setState({message: "Please enter a value for From and To.", modal: true});
    }
    else if(this.state.fromCountryCode === this.state.toCountryCode)
    {
      this.setState({modal: true, message: "We specialize in cross-country moves. There are likely more efficient solutions for your move.  We recommend finding a local moving company.", modalSubmit: true});
    }
    else
    {
      this.handleSubmit();
    }
  }

  handleSubmit() {
    if(this.state.inputFrom === "" || this.state.inputTo === "")
    {
      this.setState({message: "Please enter a value for From and To.", modal: true});
    }
    else
    {
      if(!this.state.waiting) {
        this.setState({waiting: true, modalSubmit: false, modal: false, message: ""});
        fetch(`/calculate-move`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputFrom: this.state.inputFrom,
            fromPlaceID: this.state.fromPlaceID,
            fromCountryCode: this.state.fromCountryCode,
            fromLatLng: this.state.fromLatLng,
            
            inputTo: this.state.inputTo,
            toPlaceID: this.state.toPlaceID,
            toCountryCode: this.state.toCountryCode,
            toLatLng: this.state.toLatLng
          })
        })
        .then((response) => response.json())
        .then((body) => {
          if(body.message === "Success")
          {
            this.setState({
              response: {
                result: body.result,
                minIndex: body.minIndex
              },
              waiting: false,
              navigate: true
            })
          }
          else
          {
            this.setState({message: body.message, modal: true, waiting: false});
          }
        });
      }
    }
  }

  render() {
    const searchOptions = {
      types: ['(cities)']
    };

    if(this.state.navigate) {
      return (
        <Redirect
          push
          to={{
            pathname: '/instantprice',
            state: this.state.response
          }}
        />
      )
    }

    var landingSubmitClass = classNames({
      "landingSubmit": true,
      "landingSubmitWait": this.state.waiting,
      "tahoma": true
    });

    return (
      <div className="homeContainer">
        <Modal
          visible={this.state.modal}
        >
          <p className="modalMessage">
            {this.state.message || "Test message"}
          </p>
          {this.state.modalSubmit ?
            <button className="modalButton modalConfirm" onClick={() => this.handleSubmit()}>
              OK
            </button>
            :
            <button className="modalButton modalConfirm" onClick={() => this.setState({modal: false})}>
              OK
            </button>
          }
        </Modal>
        {/* LANDING */}
        <div className="landing">
          <div className="landingContentContainer">
            <div className="landingContent">
              <div className="landingTitleContainer">
                <h1 className="landingTitle tahomaBold">
                  INTERNATIONAL MOVING
                </h1>
                <h2 className="landingSubTitle tahoma">
                  Get your price with one click.<br/>No registration required.
                </h2>
              </div>
              <form
                className="landingFormContainer"
                onSubmit={this.handleSubmitCheck}
              >
                <PlacesAutocomplete
                  value={this.state.inputFrom}
                  onChange={this.handleChangeFrom}
                  onSelect={this.handleSelectFrom}
                  searchOptions={searchOptions}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="landingInputRow">
                      <label className="landingLabel tahoma" for="from">From: </label>
                      <input
                        {...getInputProps({
                          placeholder: '',
                          className: 'landingInput tahoma location-search-input',
                        })}
                        id="from"
                        // value={this.state.inputForm}
                        // onChange={(inputFrom) => this.setState({inputFrom})}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                          const className = suggestion.active ? 'suggestion-item--active tahoma' : 'suggestion-item tahoma';                          
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
                <PlacesAutocomplete
                  value={this.state.inputTo}
                  onChange={this.handleChangeTo}
                  onSelect={this.handleSelectTo}
                  searchOptions={searchOptions}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="landingInputRow">
                      <label className="landingLabel tahoma" for="from">To: </label>
                      <input
                        {...getInputProps({
                          placeholder: '',
                          className: 'landingInput tahoma location-search-input',
                        })}
                        id="to"
                        // value={this.state.inputForm}
                        // onChange={(inputFrom) => this.setState({inputFrom})}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                          const className = suggestion.active ? 'suggestion-item--active tahoma' : 'suggestion-item tahoma';                          
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
                <button
                  className="landingSubmit view-price-home tahoma"
                  type="submit"
                  style={{backgroundColor: this.state.waiting ? "#e66f6d" : "#ee3b37"}}
                >
                  View Price NOW
                </button>
                <p className="landingFormDesc tahomaBold">
                  New, modern, and easy way to move abroad.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <div className="usContainer">
          <div className="usContent">
            <div className="usItem">
              <h3 className="usTitle tahomaBold">Our promise:</h3>
              <p className="usBody tahoma">We are a real team of moving professionals, not a sales lead generator website.</p>
            </div>
            <div className="usItem">
              <h3 className="usTitle tahomaBold">We offer:</h3>
              <p className="usBody tahoma">With Move Tailors you are in control of the whole moving process with just a few clicks.</p>
            </div>
          </div>
        </div>

        {/* PROCESS */}
        <div className="processContainer">
          <div className="processContent">
            <h2 className="processTitle tahomaBold">
              How can you move easy, pay only for services you need, and arrange everything quickly?
            </h2>
            <div className="processSteps">
              {steps.map((item, index) => 
                <div className="processStep" key={`s${index}`}>
                  <img className="processIcon" style={{height: index === 0 || index === 3 ? '70px' : '55px'}} src={item.icon}/>
                  <div className="processDesc">
                    <p className="processNum tahomaBold">
                      {item.num}
                    </p>
                    <div className="processBody">
                      {/* <h3 className="processBodyLarge tahomaBold">
                        {item.title}
                      </h3> */}
                      <p className="processBodySmall tahoma">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="testimonialsContainer">
          <div className="carouselContainer">
            <Slider {...settings}>
              {testimonials.map((item, index) =>
                <div className="testimonialItem">
                  <div className="testimonialInner">
                    <p className="testimonialText tahoma">{item.body}<br/>- {item.attr}</p>
                  </div>
                </div>
              )}
            </Slider>
          </div>
        </div>
      </div>  
    )
  }
}

export default Home;