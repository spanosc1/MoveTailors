import React from "react";
import Slider from "react-slick";
import { Redirect } from 'react-router-dom';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import * as _ from 'underscore';

import { LazyLoadComponent } from 'react-lazy-load-image-component';

import MyMetaTags from './../components/MyMetaTags';
import Modal from './../components/Modal';
import Step from './../components/Step';

import "./../css/Home.css";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import plan from "./../images/calendar.png";
import pack from "./../images/box.png";
import ship from "./../images/boat.png";
import unpack from "./../images/unpack.png";
import caret from "./../images/expand.png";
import ph from "./../images/about1.jpg";

var classNames = require("classnames");

const settings = {
  arrows: false,
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

const settingsT = {
  arrows: false,
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
}

var steps = [
  {
    name: "",
    desc: "",
    body: "",
    img1: ph,
    img2: ph
  },
  {
    name: "",
    desc: "",
    body: "",
    img1: ph,
    img2: ph
  },
  {
    name: "",
    desc: "",
    body: "",
    img1: ph,
    img2: ph
  },
  {
    name: "",
    desc: "",
    body: "",
    img1: ph,
    img2: ph
  },
];

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = _.throttle(this.handleScroll.bind(this), 200);

    this.title = React.createRef();
    this.main = React.createRef();
    this.processTitle = React.createRef();
    this.process = React.createRef();
    this.about = React.createRef();

    this.testimonials = React.createRef();

    this.state = {
      home: {},
      testimonials: [],

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

      //Animate-in controls
      title: false,
      main: false,
      processTitle: false,
      process: false,
      about: false,

      step: 0
    }
  }

  componentDidMount() {
    window.scrollTo(0,0);

    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
    
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

    fetch('/gethome', {
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
        console.log("There was an error fetching homepage content");
      }
      else
      {
        console.log(body.home);
        this.setState({home: body.home, testimonials: body.home.testimonials});
        steps = [
          {
            name: body.home.FirstStepTitle,
            desc: body.home.FirstStepDescription,
            body: body.home.FirstStepBody,
            img1: body.home.FirstStepImg1 ? body.home.FirstStepImg1.formats.small.url : ph,
            img2: body.home.FirstStepImg2 ? body.home.FirstStepImg2.formats.small.url : ph
          },
          {
            name: body.home.SecondStepTitle,
            desc: body.home.SecondStepDescription,
            body: body.home.SecondStepBody,
            img1: body.home.SecondStepImg1 ? body.home.SecondStepImg1.formats.small.url : ph,
            img2: body.home.SecondStepImg2 ? body.home.SecondStepImg2.formats.small.url : ph
          },
          {
            name: body.home.ThirdStepTitle,
            desc: body.home.ThirdStepDescription,
            body: body.home.ThirdStepBody,
            img1: body.home.ThirdStepImg1 ? body.home.ThirdStepImg1.formats.small.url: ph,
            img2: body.home.ThirdStepImg2 ? body.home.ThirdStepImg2.formats.small.url: ph
          },
          {
            name: body.home.FourthStepTitle,
            desc: body.home.FourthStepDescription,
            body: body.home.FourthStepBody,
            img1: body.home.FourthStepImg1 ? body.home.FourthStepImg1.formats.small.url: ph,
            img2: body.home.FourthStepImg2 ? body.home.FourthStepImg2.formats.small.url: ph
          }
        ]
      }
		});
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    //offsets
    const titleOffset = this.title.current.offsetTop;
    const mainOffset = this.main.current.offsetTop;
    const processTitleOffset = this.processTitle.current.offsetTop;
    const processOffset = this.process.current.offsetTop;
    const aboutOffset = this.about.current.offsetTop;

    //heights
    const titleHeight = this.title.current.offsetHeight;
    const mainHeight = this.main.current.offsetHeight;
    const processTitleHeight = this.processTitle.current.offsetHeight;
    const processHeight = this.process.current.offsetHeight;
    const aboutHeight = this.about.current.offsetHeight;

    if(!this.state.title && this.isInViewport(titleOffset, titleHeight, 0))
    {
      this.setState({title: true});
    }
    if(!this.state.main && this.isInViewport(mainOffset, mainHeight, 0))
    {
      this.setState({main: true});
    }
    if(!this.state.processTitle && this.isInViewport(processTitleOffset, processTitleHeight, 0))
    {
      this.setState({processTitle: true});
    }
    if(!this.state.process && this.isInViewport(processOffset, processHeight, 300))
    {
      this.setState({process: true});
    }
    if(!this.state.about && this.isInViewport(aboutOffset, aboutHeight, 100))
    {
      this.setState({about: true});
    }
  }

  /**
   * Parameters
   * offset: position of top of container
   * height: used to calculate bottom of container
   * buffer: how far into the container you must scroll, in either direction, before it returns that the container is far enough into the viewport
   * 
   * Returns
   * bool: whether container is in viewport, accounting for maximum offset of the buffer in each direction
   */
  isInViewport(offset, height, buffer)
  {
    const y = window.scrollY;
    const h = window.innerHeight;
    let upperMid;
    let lowerMid;

    //If the height of the container is less than 500, the center point is used for both bounds
    //If the height of the container is greater than 500, the upper bound is set to the top plus 250 and the bottom is set to the bottom minus 250
    if(height < buffer*2)
    {
      upperMid = offset + height/2;
      lowerMid = offset + height/2;
    }
    else
    {
      upperMid = offset + buffer;
      lowerMid = offset + height - buffer;
    }

    //Check if either the upper bound or the lower bound is within the viewport (defined as being between the pages scroll position and the scroll position plus the height of the window)
    if((upperMid > y && upperMid < y+h) || (lowerMid > y && lowerMid < y+h))
    {
      return true;
    }
    return false;
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
        fetch('/query', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: this.state.inputFrom,
            to: this.state.inputTo
          })
        })
        .then((response) => response.json())
        .then((body) => {
          sessionStorage.setItem("queryId", body.query._id);
        });
      }
    }
  }

  setActive(s) {
    this.setState({process: false}, () => {
      setTimeout(() => {
        this.setState({process: true, step: s});
      }, 300);
    });
    // this.setState({step: s});
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

    const homeTitleView = classNames({
      "homeTitleView": true,
      "homeTitleViewOut": !this.state.title
    });

    const homeMainLeftGradient = classNames({
      "homeMainLeftGradient": true,
      "homeMainLeftGradientOut": !this.state.main
    });

    const homeMainRightImg = classNames({
      "homeMainRightImg": true,
      "homeMainRightImgOut": !this.state.main
    });

    const homeProcessTitle = classNames({
      "homeProcessTitle": true,
      "sofiaLight": true,
      "homeProcessTitleOut": !this.state.processTitle
    });

    const homeProcessStepName = classNames({
      "homeProcessStepName": true,
      "sofiaBold": true,
      "homeProcessStepNameOut": !this.state.process
    });

    const homeProcessDesc = classNames({
      "homeProcessDesc": true,
      "sofia": true,
      "homeProcessDescOut": !this.state.process
    });

    const homeProcessText = classNames({
      "homeProcessText": true,
      "sofiaLight": true,
      "homeProcessTextOut": !this.state.process
    });

    const homeProcessImg = classNames({
      "homeProcessImg": true,
      "homeProcessImgOut": !this.state.process
    });

    const homeAboutView = classNames({
      "homeAboutView": true,
      "homeAboutViewOut": !this.state.about
    });

    return(
      <div className="homeContainer">
        <MyMetaTags page="home"/>
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
        <div className={homeTitleView} ref={this.title}>
          <h1 className="homeTitle sofia">{this.state.home.MainTitle}</h1>
          <h3 className="homeTitleSub sofia">{this.state.home.SubTitle}</h3>
        </div>
        <div className="homeMainView" ref={this.main}>
          <div className={homeMainLeftGradient}>
            <Slider {...settings}>
              <div className="homeMainSlide">
                <LazyLoadComponent>
                  <div className="homeMainImg" id="homeMainImg1">
                  </div>
                </LazyLoadComponent>
              </div>
              <div className="homeMainSlide">
                <LazyLoadComponent>
                  <div className="homeMainImg" id="homeMainImg2">
                  </div>
                </LazyLoadComponent>
              </div>
              <div className="homeMainSlide">
                <LazyLoadComponent>
                  <div className="homeMainImg" id="homeMainImg3">
                  </div>
                </LazyLoadComponent>
              </div>
              <div className="homeMainSlide">
                <LazyLoadComponent>
                  <div className="homeMainImg" id="homeMainImg4">
                  </div>
                </LazyLoadComponent>
              </div>
              <div className="homeMainSlide">
                <LazyLoadComponent>
                  <div className="homeMainImg" id="homeMainImg5">
                  </div>
                </LazyLoadComponent>
              </div>
            </Slider>
            <div className="homeMainForm">
              <form
                className="homeMainFormView"
                onSubmit={this.handleSubmitCheck}
              >
                <h2 className="homeMainFormTitle sofiaBold">
                  {this.state.home.GetQuoteHeader}
                </h2>
                <PlacesAutocomplete
                  value={this.state.inputFrom}
                  onChange={this.handleChangeFrom}
                  onSelect={this.handleSelectFrom}
                  searchOptions={searchOptions}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="homeMainFormInputRow">
                      <label className="homeMainFormLabel tahoma" for="from">From: </label>
                      <input
                        {...getInputProps({
                          placeholder: '',
                          className: 'homeMainFormInput tahoma location-search-input',
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
                    <div className="homeMainFormInputRow">
                      <label className="homeMainFormLabel tahoma" for="from">To: </label>
                      <input
                        {...getInputProps({
                          placeholder: '',
                          className: 'homeMainFormInput tahoma location-search-input',
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
                <div className="homeMainFormBottomRow">
                  <p className="homeMainFormDesc sofiaLight">
                    {this.state.home.GetQuoteSubText}
                  </p>
                  <button
                    className="homeMainFormSubmit view-price-home sofiaBold"
                    type="submit"
                    style={{backgroundColor: this.state.waiting ? "#e66f6d" : "#ee3b37"}}
                  >
                    {this.state.home.GetQuoteButtonText}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="homeMainRight">
            <div className={homeMainRightImg}>
              <div className="homeMainRightTextView">
                <h3 className="homeMainTitle sofiaBold">
                  {this.state.home.MainHeader}
                </h3>
                <p className="homeMainText sofiaLight">
                  {this.state.home.MainBody}
                </p>
                <p className="homeMainTextBold sofiaBold">
                  {this.state.home.MainInBorders}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="homeProcessTitleView">
          <div className={homeProcessTitle} ref={this.processTitle}>
            <h2 className="homeProcessTitleText">
              {this.state.home.ProcessHeader}
            </h2>
            <img className="homeProcessCaret" src={caret} alt=""/>
          </div>
        </div>
        <div className="homeProcessContainer" ref={this.process}>
          <div className="homeProcessSteps">
            <Step
              title={this.state.home.FirstStepTitle}
              img={plan}
              active={this.state.step}
              stepNum={0}
              setActive={(s) => this.setActive(s)}
            />
            <div className="homeProcessDivider"></div>
            <Step
              title={this.state.home.SecondStepTitle}
              img={pack}
              active={this.state.step}
              stepNum={1}
              setActive={(s) => this.setActive(s)}
            />
            <div className="homeProcessDivider"></div>
            <Step
              title={this.state.home.ThirdStepTitle}
              img={ship}
              active={this.state.step}
              stepNum={2}
              setActive={(s) => this.setActive(s)}
            />
            <div className="homeProcessDivider"></div>
            <Step
              title={this.state.home.FourthStepTitle}
              img={unpack}
              active={this.state.step}
              stepNum={3}
              setActive={(s) => this.setActive(s)}
            />
          </div>
          <div className="homeProcessView">
            <h1 className={homeProcessStepName}>
              {this.state.step + 1}. {steps[this.state.step].name}
            </h1>
            <div className="homeProcessBodyView">
              <div className="homeProcessBodyText">
                <h2 className={homeProcessDesc}>
                  {steps[this.state.step].desc}
                </h2>
                <p className={homeProcessText}>
                  {steps[this.state.step].body}
                </p>
              </div>
              <div className="homeProcessImgView">
                <div className={homeProcessImg} id="processImg1" style={{backgroundImage: `url(${steps[this.state.step].img1})`}}></div>
                <div className={homeProcessImg} id="processImg2" style={{backgroundImage: `url(${steps[this.state.step].img2})`}}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="homeAboutContainer" ref={this.about}>
          <div className="homePromise">
            <div className={homeAboutView}>
              <h3 className="homeAboutTitle sofia">
                {this.state.home.PromiseHeader}
              </h3>
              <p className="homeAboutText sofiaLight">
                {this.state.home.PromiseText}
              </p>
            </div>
          </div>
          <div className="homeOffer">
            <div className={homeAboutView}>
              <h3 className="homeAboutTitle sofia">
                {this.state.home.OfferHeader}
              </h3>
              <p className="homeAboutText sofiaLight">
                {this.state.home.OfferText}
              </p>
            </div>
          </div>
        </div>
        <div className="homeTestimonialContainer">
          <div className="homeTestimonials">
            <div className="slider-arrow">
              <button
                className="arrow-btn prev"
                onClick={() => this.slider.slickPrev()}
              >
                <img className="homeTestimonialsArrow" src={caret} alt="Prev"/>
              </button>
              <button
                className="arrow-btn next"
                onClick={() => this.slider.slickNext()}
              >
                <img className="homeTestimonialsArrow" src={caret} alt="Next"/>
              </button>
            </div>
            <Slider {...settingsT} ref={c => (this.slider = c)}>
              {this.state.testimonials.map((item, index) =>
                <div className="homeTestimonialItem">
                  <div className="homeTestimonialInner">
                    <p className="homeTestimonialText tahoma">{item.body}<br/>- {item.name}</p>
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