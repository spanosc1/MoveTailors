import React from "react";
import Slider from "react-slick";

import MyMetaTags from './../components/MyMetaTags';

import { LazyLoadComponent } from 'react-lazy-load-image-component';

import "./../css/About.css";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import otso from './../images/otso.jpg';

var settings = {
  arrows: false,
  dots: false,
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

class About extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  
  render() {
    return (
      <div className="aboutContainer">
        <MyMetaTags page="about"/>
        {/* LANDING */}
        <div className="aboutLanding">
          <Slider {...settings}>
            <div className="landingSlide">
              <LazyLoadComponent>
                <div className="landingImg" id="landingImg1">
                </div>
              </LazyLoadComponent>
            </div>
            <div className="landingSlide">
              <LazyLoadComponent>
                <div className="landingImg" id="landingImg2">
                </div>
              </LazyLoadComponent>
            </div>
            <div className="landingSlide">
              <LazyLoadComponent>
                <div className="landingImg" id="landingImg3">
                </div>
              </LazyLoadComponent>
            </div>
            <div className="landingSlide">
              <LazyLoadComponent>
                <div className="landingImg" id="landingImg4">
                </div>
              </LazyLoadComponent>
            </div>
            <div className="landingSlide">
              <LazyLoadComponent>
                <div className="landingImg" id="landingImg5">
                </div>
              </LazyLoadComponent>
            </div>
          </Slider>
        </div>

        {/* MISSION */}
        <div className="missionContainer">
          <div className="missionContent">
            <h2 className="missionTitle tahomaBold">OUR MISSION:</h2>
            <h2 className="missionSubTitle tahomaBold">To enable everyone to cross borders less wastefully</h2>
            <div className="missionList">
              <h2 className="missionListTitle tahoma">Our way of moving:</h2>
              <div className="missionListItem">
                <p className="missionNum tahomaBold">
                  1
                </p>
                <p className="missionText tahoma">
                  allows people to keep their stuff when moving across borders.
                </p>
              </div>
              <div className="missionListItem">
                <p className="missionNum tahomaBold">
                  2
                </p>
                <p className="missionText tahoma">
                  tailors the service so you pay only what you need.
                </p>
              </div>
              <div className="missionListItem">
                <p className="missionNum tahomaBold">
                  3
                </p>
                <p className="missionText tahoma">
                  promotes sustainability.
                </p>
              </div>
              <div className="missionListItem">
                <p className="missionNum tahomaBold">
                  4
                </p>
                <p className="missionText tahoma">
                  provides you with control over the moving process.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WHO WE ARE */}
        <div className="whoContainer">
          <div className="whoContent">
            <h2 className="whoTitle tahomaBold">
              WHO ARE WE
            </h2>
            <div className="whoBody">
              <div className="whoTextView">
                <p className="whoText tahoma">
                  Move Tailors Co. is a result of completely rethinking international moving
                  services. We made it our goal to make moving customizable, agile, quick to
                  arrange with the click of a button, and more environmentally sustainable. When
                  studying available moving services, we found many of them quite outdated.
                  They were very standardized, slow to engage, overly complicated, and provided
                  customers little control of the moving process. The old practice created a
                  lot of waste, and even discouraged movers to move their belongings at all.
                  We challenge all that. To our delight, bypassing old industry practices
                  makes it possible to provide movers an opportunity to tailor the scope easily
                  and instantaneously, so the mover gets their needed moving services
                  swiftly, on demand, and without paying for things they don't need!
                </p>
                <p className="whoText tahoma">
                  We promote sustainability and preserving nature. It is more sustainable to
                  transport belongings with you than to discard them at home and purchase
                  replacements at the destination. Therefore, we developed our concept in such a way
                  that the mover never needs to weigh financial gain against ecological harm.
                  We move goods with the lowest polluting practical methods (no, we do not use
                  wind driven transport as it is not practical yet). In many cases CO2
                  emissions per ton-km for air transport is more than 50 times the emission of
                  sea transport and therefore we do not provide air transport options. It's also
                  worth mentioning the obvious: minimizing waste also minimizes the
                  cost of moving.
                </p>
                <p className="whoText tahoma">
                  We are a mid-sized team of international people. Many of us have experienced
                  moving across borders ourselves. The team is led by Dr. Otso Massala, who is
                  also a professor teaching global logistics in Shippensburg University. He
                  has moved internationally between 8 countries. As soon as you book our
                  moving service, we will assign one of our team members as your move
                  assistant. Your move assistant will introduce him or herself and start
                  coordinating the move with you. We are in charge of moving very
                  important goods every day. It is a matter of honor for us to carry out your move in
                  the most fluent and careful manner. Obviously, no moving company owns trucks
                  in every country, nor can they operate ports or container ships. Therefore we
                  are very particular about the partners we deal with. Our team
                  has expertise in all aspects of moving, and your move assistants will be making
                  sure your needs are met with full and prompt attention from these experts.
                </p>
                <p className="whoText tahoma">
                  Our business has been vetted and licensed by the Federal Maritime Commission,
                  the US government agency making sure that ocean transport services are
                  provided only by professional and reputable operators as well as protecting
                  the public from unfair or deceptive practices. We also hold sizeable
                  monetary bonds so we need to do our utmost to carry out your move without the
                  slightest hiccup. For further peace of mind, Move Tailors Co. is also
                  accredited by the Better Business Bureau.
                </p>
              </div>
              <div className="whoImgView">
                <img className="whoImg" src={otso} alt="Otso"/>
              </div>
            </div>
          </div>
        </div>
      </div>  
    )
  }
}

export default About;