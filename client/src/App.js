import React, { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import ReactGA from 'react-ga';

import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import InstantPrice from './pages/InstantPrice';
import Customize from './pages/Customize';
import YourMove from './pages/YourMove';
import YourMoveInfo from './pages/YourMoveInfo';
import Billing from './pages/Billing';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Admin from './pages/Admin';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';

import "./css/Global.css";

ReactGA.initialize("UA-187496334-1");

function Tracker() {
  const location = useLocation();

  useEffect(() => {
    var loc = window.location.pathname;
    loc = null;
    switch(loc) {
      case "/":
        ReactGA.pageview('Home');
        break;
      case "/about":
        ReactGA.pageview('About');
        break;
      case "/faq":
        ReactGA.pageview('Faq');
        break;
      case "/contact":
        ReactGA.pageview('Contact');
        break;
      case "/instantprice":
        ReactGA.pageview('Instant Price');
        break;
      case "/customize":
        ReactGA.pageview('Customize Your Move');
        break;
      case "/bookyourmove":
        ReactGA.pageview('Summary of Your Move');
        break;
      case "/yourmove":
        ReactGA.pageview('Your Move');
        break;
      case "/billing":
        ReactGA.pageview('Billing');
        break;
      case "/signup":
        ReactGA.pageview('Signup');
        break;
      case "/login":
        ReactGA.pageview('Login');
        break;
      case "/blog":
        ReactGA.pageview('Blog');
        break;
      default:
        break;
    }
  }, [location])

  return null
}

// ga4react.initialize().then((ga4) => {
//   GA4 = ga4;
//   const loc = window.location.pathname;
//   ga4.pageview(loc, 'Home', 'Home');
// },(err) => {
//   console.error(err)
// });

function App() {
  const [partials, setPartials] = useState(false);

  useEffect(() => {
    var loc = window.location.pathname;
    if(loc.includes("/landing")) {
      setPartials(false);
    }
    else
    {
      setPartials(true);
    }
  }, []);

  Tracker();
  
  return (
    <>
      {partials &&
        <Header />
      }
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/about" component={About} exact />
        <Route path="/faq" component={FAQ} exact />
        <Route path="/contact" component={Contact} exact />
        <Route path="/instantprice" component={InstantPrice} exact />
        <Route path="/customize" component={Customize} exact />
        <Route path="/bookyourmove" component={YourMove} exact />
        <Route path="/yourmove" component={YourMoveInfo} exact />
        <Route path="/billing" component={Billing} exact />
        <Route path="/blog" component={Blog} exact />
        <Route path="/article/:id" component={Article} exact />
        <Route path="/admin" component={Admin} exact />
        <Route path="/landing/:url" component={Landing} exact />
        <Route exact path='/signup' render={({ history }) =>
          <Signup history={history} />} />
        <Route exact path='/login' render={({ history }) =>
          <Login history={history} />} />
        <Route exact path='/login/reset-link/:token' render={({ history, match }) =>
          <ResetPassword history={history} match={match}/>} />
      </Switch>
      {partials &&
        <Footer />
      }
    </>
  );
}

export default App;
