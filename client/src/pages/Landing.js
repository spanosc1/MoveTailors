import React from "react";
import { Redirect, NavLink } from 'react-router-dom';
import Slider from "react-slick";
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';

import Modal from './../components/Modal';

import "./../css/Landing.css";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import navLogo from './../images/logocolor.png';
import box from './../images/pack.png';
import boat from './../images/boat.png';
import unpack from './../images/unpack.png';
import calendar from './../images/calendar.png';
import graphic from './../images/landing.png';

var settings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 1000,
  autoplay: true,
  autoplaySpeed: 7000,
  slidesToShow: 1,
  slidesToScroll: 1,
  outline: 'none',
  fade: true,
  pauseOnHover: false,
  draggable: false
};

class Landing extends React.Component {
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
      modalSubmit: false,

      landing: {},
      carousel: []
    }
  }

  componentDidMount() {
    if(this.props.match.params.url)
    {
      fetch(`/getlanding/${this.props.match.params.url}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((body) => {
        if(body.message !== 'Success')
        {
          console.log(body.message);
        }
        else
        {
          this.setState({landing: body.landing, carousel: body.landing.Carousel});
        }
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

    return (
      <div className="landingPageContainer">
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
        <div className="landingPageNav">
          <NavLink class="landingPageNavHome" to="/">
            <img className="landingPageBrand" src={navLogo} alt="Move Tailors"/>
          </NavLink>
          <div className="landingPageNavButtons">
            <NavLink className="landingPageNavButton tahoma landingPageButtonBlue" to="/about">
              Learn More
            </NavLink>
            <NavLink className="landingPageNavButton tahoma landingPageButtonRed" to="/contact">
              Request Info
            </NavLink>
          </div>
        </div>
        <div className="landingPageContent">
          <div className="landingPageForm">
            <h2 className="landingPageFormTitle tahomaBold">
              {this.state.landing.Header}
            </h2>
            <p className="landingPageFormSub tahoma">
              {this.state.landing.Description}
            </p>
            <form
              className="landingPageFormFields"
              onSubmit={this.handleSubmitCheck}
            >
              <PlacesAutocomplete
                value={this.state.inputFrom}
                onChange={this.handleChangeFrom}
                onSelect={this.handleSelectFrom}
                searchOptions={searchOptions}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div className="landingPageInputRowUnderline">
                    <label className="landingPageLabel tahoma" for="from">From: </label>
                    <input
                      {...getInputProps({
                        placeholder: '',
                        className: 'landingPageInputUnderline tahoma location-search-input',
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
                  <div className="landingPageInputRowUnderline">
                    <label className="landingPageLabel tahoma" for="from">To: </label>
                    <input
                      {...getInputProps({
                        placeholder: '',
                        className: 'landingPageInputUnderline tahoma location-search-input',
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
                className="landingPageSubmit view-price-home tahoma"
                type="submit"
                style={{backgroundColor: this.state.waiting ? "#e66f6d" : "#ee3b37"}}
              >
                Get price NOW
              </button>
            </form>
            <p className="poweredBy tahoma">Algorithmic pricing powered by Google Maps API</p>
          </div>
          <div className="landingPageSlick">
            <Slider {...settings}>
              {this.state.carousel.map((e, i) =>
                <div className="landingPageSlide">
                  <div className="landingPageImg" style={{backgroundImage: `url(${e.url})`}}>
                  </div>
                </div>
              )}
              {/* <div className="landingPageSlide">
                <div className="landingPageImg" id="landingPageImg1">
                </div>
              </div>
              <div className="landingPageSlide">
                <div className="landingPageImg" id="landingPageImg2">
                </div>
              </div>
              <div className="landingPageSlide">
                <div className="landingPageImg" id="landingPageImg3">
                </div>
              </div>
              <div className="landingPageSlide">
                <div className="landingPageImg" id="landingPageImg4">
                </div>
              </div>
              <div className="landingPageSlide">
                <div className="landingPageImg" id="landingPageImg5">
                </div>
              </div> */}
            </Slider>
          </div>
        </div>
        <div className="landingPageProcess">
          <div className="landingPageProcessInner">
            <div className="landingPageProcessGraphic">
              {[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].map((e, i) => 
                <div className="landingBlock"></div>
              )}
            </div>
            <div className="landingPageProcessItem">
              <h2 className="landingPageProcessTitle tahomaBold">
                Reserve Online
              </h2>
              <div className="landingPageProcessImgView">
                <img className="landingPageProcessImg" src={calendar} alt="Reserve Online"/>
              </div>
              <p className="landingPageProcessText tahoma">
                We help you in planning and preparing needed documents.
              </p>
            </div>
            <div className="landingPageProcessItem">
              <h2 className="landingPageProcessTitle tahomaBold">
                Fill Container
              </h2>
              <div className="landingPageProcessImgView">
                <img className="landingPageProcessImg" src={box} alt="Fill Container"/>
              </div>
              <p className="landingPageProcessText tahoma">
                You load household goods into the shipping container and seal it.
              </p>
            </div>
            <div className="landingPageProcessItem">
              <h2 className="landingPageProcessTitle tahomaBold">
                We Transport
              </h2>
              <div className="landingPageProcessImgView">
                <img className="landingPageProcessImg" src={boat} alt="We Transport"/>
              </div>
              <p className="landingPageProcessText tahoma">
                We move the container from your old home to your new home.
              </p>
            </div>
            <div className="landingPageProcessItem">
              <h2 className="landingPageProcessTitle tahomaBold">
                You Unpack
              </h2>
              <div className="landingPageProcessImgView">
                <img className="landingPageProcessImg" src={unpack} alt="You Unpack" />
              </div>
              <p className="landingPageProcessText tahoma">
                You receive the sealed container at the new address and unpack.
              </p>
            </div>
          </div>
        </div>
        <img className="landingPageGraphic" src={graphic} alt=""/>
      </div>
    )
  }
}

export default Landing;