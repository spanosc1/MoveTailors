import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import * as _ from "underscore";
import userService from "../services/userService";

import "./../css/Header.css";

import navLogo from './../images/logocolor.png';

var classNames = require("classnames");

const opacThreshold = 50;

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = _.throttle(this.handleScroll.bind(this), 200);

    this.state = {
      navOpac: false,
      menuOpen: false,
      forceBlueText: true,
      forceOpacMenu: true,
      user: userService.getUser(),
      loc: "/"
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    let loc = this.props.location.pathname;

    this.setState({loc});

    if (false
      // loc === '/' ||
      // loc === '/about'
    ) {
      this.setState({ forceBlueText: false, forceOpacMenu: false });
    }

    window.addEventListener("scroll", this.handleScroll);

    this.handleScroll();
  }

  componentDidUpdate(prevProps) {
    let loc = this.props.location.pathname;
    
    if (prevProps.location.pathname !== loc) {
      this.setState({loc});
      if (false
        // loc === '/' ||
        // loc === '/about'
      ) {
        this.setState({ forceBlueText: false, forceOpacMenu: false });
      }
      else {
        this.setState({ forceBlueText: true, forceOpacMenu: true });
      }
    }
  }


  handleScroll(event) {
    if (!this.state.navOpac && window.scrollY > opacThreshold) {
      this.setState({ navOpac: true });
    }
    else if (this.state.navOpac && window.scrollY <= opacThreshold) {
      this.setState({ navOpac: false })
    }
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  handleTailor() {
    this.setState({ menuOpen: false });
    const u = userService.getUser();
    const m = sessionStorage.getItem('myMove');
    if(m)
    {
      this.props.history.push('/bookyourmove');
    }
    else if(u)
    {
      fetch(`/getmovebyuserid/${u._id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((body) => {
        if(body.message === "Success" && body.move)
        {
          this.props.history.push('/yourmove');
        }
        else
        {
          this.props.history.push('/');
        }
      });
    }
    else
    {
      this.props.history.push('/');
    }
  }

  clearSession() {
    sessionStorage.clear();
  }

  render() {
    var headerContainer = classNames({
      "headerContainer": true,
      "headerContainerOpac": this.state.navOpac || this.state.forceOpacMenu
    });

    var navText = classNames({
      "navText": true,
      "sofiaBold": true,
      "navTextOpac": this.state.navOpac || this.state.forceBlueText
    });

    var navUnderline = classNames({
      "navUnderline": true,
      "navUnderlineOpac": this.state.navOpac || this.state.forceBlueText
    });

    var mobileMenu = classNames({
      "mobileMenu": true,
      "mobileMenuOpen": this.state.menuOpen
    });

    return (
      <div className={headerContainer}>
        <div className="headerInner">
          <NavLink className="navLogoLink" to="/">
            <img className="navLogo" src={navLogo} alt="Move Tailors" />
          </NavLink>
          <div className="headerLinks">
            <button className="navLink navButton" style={{backgroundColor: this.state.loc === "/" ? "#eeeeee" : "transparent"}} onClick={() => this.handleTailor()}>
              <p className={navText}>Tailor Your Move</p>
              <div className={navUnderline}></div>
            </button>
            <NavLink className="navLink" style={{backgroundColor: this.state.loc === "/about" ? "#eeeeee" : "transparent"}} to="/about">
              <p className={navText}>About Us</p>
              <div className={navUnderline}></div>
            </NavLink>
            <NavLink className="navLink" style={{backgroundColor: this.state.loc === "/faq" ? "#eeeeee" : "transparent"}} to="/faq">
              <p className={navText}>FAQ</p>
              <div className={navUnderline}></div>
            </NavLink>
            <NavLink className="navLink" style={{backgroundColor: this.state.loc === "/blog" ? "#eeeeee" : "transparent"}} to="/blog">
              <p className={navText}>Blog</p>
              <div className={navUnderline}></div>
            </NavLink>
            <NavLink className="navLink" style={{backgroundColor: this.state.loc === "/contact" ? "#eeeeee" : "transparent"}} to="/contact">
              <p className={navText}>Contact</p>
              <div className={navUnderline}></div>
            </NavLink>
            { userService.getUser() ?
              <NavLink className="navLink" to="/">
                <p className={navText} onClick={() => {userService.logout(); this.clearSession()}}>Logout</p>
                <div className={navUnderline}></div>
              </NavLink>
              :
              <NavLink className="navLink" style={{backgroundColor: this.state.loc === "/login" ? "#eeeeee" : "transparent"}} to="/login">
                <p className={navText}>Login</p>
                <div className={navUnderline}></div>
              </NavLink>
            }
            { userService.getUser() === null &&
              <NavLink className="navLink" id="navSignupButton" to="/signup">
                <p className={navText}>Sign Up</p>
              </NavLink>
            }
          </div>
          <div className="hamburger" onClick={() => this.toggleMenu()}>
            <div className="hamburgerLine"></div>
            <div className="hamburgerLine"></div>
            <div className="hamburgerLine"></div>
          </div>
        </div>
        <div className={mobileMenu}>
          <NavLink className="navLink" to="/" onClick={() => this.handleTailor()}>
            <p className="navText tahomaBold">Tailor Your Move</p>
            <div className="navUnderline"></div>
          </NavLink>
          <NavLink className="navLink" to="/about" onClick={() => this.toggleMenu()}>
            <p className="navText tahomaBold">About Us</p>
            <div className="navUnderline"></div>
          </NavLink>
          <NavLink className="navLink" to="/faq" onClick={() => this.toggleMenu()}>
            <p className="navText tahomaBold">FAQ</p>
            <div className="navUnderline"></div>
          </NavLink>
          <NavLink className="navLink" to="/blog" onClick={() => this.toggleMenu()}>
            <p className="navText tahomaBold">Blog</p>
            <div className="navUnderline"></div>
          </NavLink>
          <NavLink className="navLink" to="/contact" onClick={() => this.toggleMenu()}>
            <p className="navText tahomaBold">Contact</p>
            <div className="navUnderline"></div>
          </NavLink>
          { userService.getUser() ?
            <NavLink className="navLink" to="/" onClick={() => {this.toggleMenu(); userService.logout(); this.clearSession()}}>
              <p className="navText tahomaBold">Logout</p>
              <div className="navUnderline"></div>
            </NavLink>
            :
            <NavLink className="navLink" to="/login" onClick={() => this.toggleMenu()}>
              <p className="navText tahomaBold">Login</p>
              <div className="navUnderline"></div>
            </NavLink>
          }
        </div>
      </div>
    )
  }
}

export default withRouter(Header);