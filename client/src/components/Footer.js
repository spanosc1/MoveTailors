import React from "react";

import "./../css/Footer.css";

import privacy from "./../docs/privacy.pdf";

import bbb from "./../images/bbb.webp";

class Footer extends React.Component {
  render() {
    return (
      <div className="footerContainer">
        <div className="footerContent">
          <div className="footerSection footerSectionSmall">
            <img className="footerBBB" src={bbb} alt="Better Business Bureau"/>
          </div>
          <div className="footerSection">
            <p className="footerTitle tahomaBold">
              Licensed and Bonded
            </p>
            <p className="footerBody tahoma">
              Federal Maritime Commission
              <br/>
              License No. 028503NF
            </p>
          </div>
          <div className="footerSection">
            <p className="footerTitle tahomaBold">
              Move Tailors Co.
            </p>
            <p className="footerBody tahoma">
              Operating world-wide
              <br/>
              Headquarters in Maryland, USA
            </p>
          </div>
          <div className="footerSection">
            <p className="footerTitle tahomaBold">
              Call any time:
            </p>
            <p className="footerBody tahoma">
              +1 888 887 9912
            </p>
            <p className="footerTitle tahomaBold">
              Email:
            </p>
            <p className="footerBody tahoma">
              tailors@movetailors.com
            </p>
          </div>
          <div className="footerSection">
            <p className="footerTitle tahomaBold">
              We take your privacy seriously:
            </p>
            <a className="footerBody tahoma footerLink" href={privacy} target="_black" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </div>
          <div className="attrContainer tahoma">
            Move Tailors &#169; 2021 | Developed by&nbsp;
            <a className="footerLink attrLink" href="https://www.fortitudedev.com" target="_blank" rel="noopener noreferrer">
              Fortitude
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default Footer;