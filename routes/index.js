const Router = require('express-promise-router');
const sgMail = require('@sendgrid/mail');
const Moment = require('moment');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const algo = require('./../utils/algorithm');
const FAQ = require('./../utils/faq');
const Blog = require('./../utils/blog');
const Home = require('./../utils/home');
const Landing = require('./../utils/landing');

const Moves = require('./../models/moves');
const Queries = require('./../models/queries');

const router = new Router();

const errorMsg = "We do not have an instant price for your move, please get in touch over phone or e-mail for a quote.";

//Calculate the costs for 9 routes (3 starting ports and 3 ending ports)
router.post('/calculate-move', (req, res, next) => {
  const start = Date.now();

  let fromPlaceIDs = [];
  let toPlaceIDs = [];

  //Get 3 nearest ports to origin
  algo.getPorts(req.body.fromLatLng, (error, froms) => {
    if(error)
    {
      console.log(error);
      return res.status(200).json({message: errorMsg, error});
    }
    //Get 3 nearest ports to destination
    algo.getPorts(req.body.toLatLng, (error, tos) => {
      if(error)
      {
        console.log(error);
        return res.status(200).json({message: errorMsg, error});
      }

      //Isolate google place ids
      froms.forEach((from, i) => {
        fromPlaceIDs.push(from.googlePlaceID);
      });
      tos.forEach((to, i) => {
        toPlaceIDs.push(to.googlePlaceID);
      });

      //Use Google Places Distance Matrix API to calculate distance to 3 closest ports to origin
      algo.getDistances(fromPlaceIDs, req.body.fromPlaceID, (error, fromDist) => {
        if(error) {
          console.log(error);
          return res.status(200).json({message: errorMsg, error});
        }

        if(fromDist.rows[0].elements[0].status === 'ZERO_RESULTS')
        {
          return res.status(200).json({message: errorMsg, error: null});
        }

        //Use Google Places Distance Matrix API to calculate distance to 3 closest ports to destination
        algo.getDistances(toPlaceIDs, req.body.toPlaceID, (error, toDist) => {
          if(error) {
            console.log(error);
            return res.status(200).json({message: errorMsg, error});
          }

          if(toDist.rows[0].elements[0].status === 'ZERO_RESULTS')
          {
            console.log("TO: ", toDist.destination_addresses);
            console.log("FROM: ", toDist.origin_addresses);
            console.log("RES: ", toDist.rows[0].elements);
            return res.status(200).json({message: errorMsg, error: null});
          }

          //Use Google Places Distance Matrix API to calculate distance from origin town to destination town directly
          algo.getDistances([req.body.fromPlaceID], req.body.toPlaceID, (error, directDist) => {
            if(error) {
              console.log(error);
              return res.status(200).json({message: errorMsg, error});
            }

            //Construct return object, add query info first
            var result = {
              // fromName: req.body.inputFrom,
              // fromPlaceID: req.body.fromPlaceID,
              // fromCountryCode: req.body.fromCountryCode,
              // fromLatLng: req.body.fromLatLng,

              // toName: req.body.inputTo,
              // toPlaceID: req.body.toPlaceID,
              // toCountryCode: req.body.toCountryCode,
              // toLatLng: req.body.toLatLng,

              ...req.body,

              routes: []
            };

            var routes = [];

            //Fetch all shipping rates for all 9 routes
            algo.getShippingRates(froms, tos, (error, rates) => {
              if(error) {
                console.log(error);
                return res.status(200).json({message: errorMsg, error});
              }

              var r = 0;
              var min = 999999;
              var minIndex = 0;
              //Construct array of routes
              fromDist.rows[0].elements.forEach((fromDistElem, i) => {
                toDist.rows[0].elements.forEach((toDistElem, j) => {
                  var route = {
                    originPort: froms[i],
                    destPort: tos[j],

                    distToOriginPort: fromDistElem.distance.value,
                    distToOriginPortText: fromDistElem.distance.text,
                    distFromDestPort: toDistElem.distance.value,
                    distFromDestPortText: toDistElem.distance.text,

                    durationToOriginPort: fromDistElem.duration.value,
                    durationToOriginPortText: fromDistElem.duration.text,
                    durationFromDestPort: toDistElem.duration.value,
                    durationFromDestPortText: toDistElem.duration.text,

                    //Calculate sea route price for each container size
                    max_20: algo.getSeaRoutePrice(fromDistElem.distance.value, froms[i].truckingRate, rates[r].rate20, toDistElem.distance.value, tos[j].truckingRate, rates[r].grossProfit20).toFixed(0),
                    max_40: algo.getSeaRoutePrice(fromDistElem.distance.value, froms[i].truckingRate, rates[r].rate40, toDistElem.distance.value, tos[j].truckingRate, rates[r].grossProfit40).toFixed(0),
                    max_40HC: algo.getSeaRoutePrice(fromDistElem.distance.value, froms[i].truckingRate, rates[r].rate40HC, toDistElem.distance.value, tos[j].truckingRate, rates[r].grossProfit40HC).toFixed(0),
                    
                    //Calculate min and max shipping time
                    minDays: algo.getTime(rates[r].shippingTimeMin, fromDistElem.distance.value, toDistElem.distance.value),
                    maxDays: algo.getTime(rates[r].shippingTimeMax, fromDistElem.distance.value, toDistElem.distance.value)
                  };

                  //Get cost of each sea route to determine the minimum cost/price
                  var routeCost = route.max_20;

                  if(min > parseInt(routeCost)) {
                    min = routeCost;
                    minIndex = r;
                  }

                  r++;
                  routes.push(route);
                });
              });

              var directRoute = {};

              //If direct route is possible, create a direct route and add it to the end of the results array after the other sea routes are calculated
              if(directDist.rows[0].elements[0].status === "OK")
              {
                directRoute = {
                  distToDestPort: directDist.rows[0].elements[0].distance.value,
                  distToDestPortText: directDist.rows[0].elements[0].distance.text,

                  durationToOriginPort: directDist.rows[0].elements[0].duration.value,
                  durationToOriginPortText: directDist.rows[0].elements[0].duration.text,

                  //Calculate sea route price for each container size
                  max_20: algo.getLandRouteCost(
                    directDist.rows[0].elements[0].distance.value,
                    [tos[0].truckingRate, tos[1].truckingRate, tos[2].truckingRate],
                    [rates[0].grossProfit20, rates[1].grossProfit20, rates[2].grossProfit20, rates[3].grossProfit20, rates[4].grossProfit20, rates[5].grossProfit20, rates[6].grossProfit20, rates[7].grossProfit20, rates[8].grossProfit20],
                    600).toFixed(0),
                  max_40: algo.getLandRouteCost(
                    directDist.rows[0].elements[0].distance.value,
                    [tos[0].truckingRate, tos[1].truckingRate, tos[2].truckingRate],
                    [rates[0].grossProfit20, rates[1].grossProfit20, rates[2].grossProfit20, rates[3].grossProfit20, rates[4].grossProfit20, rates[5].grossProfit20, rates[6].grossProfit20, rates[7].grossProfit20, rates[8].grossProfit20],
                    900).toFixed(0),
                  max_40HC: algo.getLandRouteCost(
                    directDist.rows[0].elements[0].distance.value,
                    [tos[0].truckingRate, tos[1].truckingRate, tos[2].truckingRate],
                    [rates[0].grossProfit20, rates[1].grossProfit20, rates[2].grossProfit20, rates[3].grossProfit20, rates[4].grossProfit20, rates[5].grossProfit20, rates[6].grossProfit20, rates[7].grossProfit20, rates[8].grossProfit20],
                    1000).toFixed(0),
                  
                  //Calculate min and max shipping time
                  minDays: algo.getMinLandTime(directDist.rows[0].elements[0].distance.value),
                  maxDays: algo.getMaxLandTime(directDist.rows[0].elements[0].distance.value)
                }
              }

              //If a direct route was created (if a land based route exists)
              if(directRoute.max_20)
              {
                routes.push(directRoute);

                //If the direct route costs less than any sea route, make it the new minimum, its index being at the end of the array
                if(Number(directRoute.max_20) < Number(min))
                {
                  min = directRoute.max_20,
                  minIndex = 9;
                }
              }

              //Add the sea routes (and one land) to the results array
              result.routes = routes;
              //Log the time of the route and return the results
              console.log(Date.now() - start);
              res.status(200).json({ message: "Success", result, min, minIndex });
            });
          });
        });
      });
    });
  });
});

router.get('/gethome', (req, res, next) => {
  Home.getHome((err, home) => {
    if(err)
    {
      return res.status(200).json({message: 'Could not get home page content.'});
    }
    res.status(200).json({message: 'Success', home});
  })
});

router.get('/getlanding/:url', (req, res, next) => {
  Landing.getLanding(req.params.url, (err, landing) => {
    if(err)
    {
      return res.status(200).json({message: 'Could not get landing page content.'});
    }
    res.status(200).json({message: 'Success', landing});
  })
});

router.get('/getfaq', (req, res, next) => {
  FAQ.getFAQs((err, faqs) => {
    if(err)
    {
      return res.status(200).json({message: 'Could not get FAQ questions.'});
    }
    res.status(200).json({message: 'Success', faqs});
  });
});

router.get('/getblogs', (req, res, next) => {
  Blog.getBlogs((err, blogs) => {
    if(err)
    {
      console.log(err);
      return res.status(200).json({message: 'Could not get articles.'});
    }
    res.status(200).json({message: 'Success', blogs});
  });
});

router.get('/getarticle/:id', (req, res, next) => {
  Blog.getArticle(req.params.id, (err, article) => {
    if(err)
    {
      console.log(err);
      return res.status(200).json({message: 'Could not get article.'});
    }
    res.status(200).json({message: 'Success', article});
  });
});

//Save the users move
router.post('/save', (req, res, next) => {
  // console.log(req.body);
  Moves.create(req.body, (err, move) => {
    if(err)
    {
      console.log(err);
      return res.status(200).json({message: 'Unable to save your move, please try again later or contact Move Tailors directly.'});
    }
    res.status(200).json({message: 'Success', move});
  });
});

//Get a users move by their user ID
router.get('/getmovebyuserid/:id', (req, res, next) => {
  Moves.findOne({platformUser: req.params.id}, {}, { sort: { 'createdAt' : -1 } }, (err, move) => {
    if(err)
    {
      console.log(err);
      return res.status(200).json({message: 'Could not find any moves'});
    }
    res.status(200).json({message: "Success", move});
  });
});

router.post('/book', (req, res, next) => {
  Moves.findOneAndUpdate({_id: req.body.id}, {booked: true, paid: true}, {new: true}, (err, move) => {
    if(err)
    {
      console.log(err);
      return res.status(200).json({message: "Could not reserve move, please try again later or contact Move Tailors directly"});
    }
    console.log(req.body);
    const data = {
      to: req.body.email,
      from: process.env.FROM_EMAIL,
      subject: `Your move reservation from ${move.from} to ${move.to}`,
      text: `text`,
      html: `<div>Dear ${req.body.name},</div><br/>\n
      <div>Thank you for choosing Move Tailors Co. to be your partner in relocating your belongings from ${move.from} to ${move.to}.</div><br/>\n
      <div>Some resources, such as space on a container ship, are hard to reserve at the current time. Therefore, we will
      immediately start arranging your move. In order to make your move possible, the precise loading date
      needs to be fixed within next 2-3 days.</div><br/>\n
      <div>We have charged the down payment to your credit card, and will provide you details for paying the
      remaining part of the price before loading.</div><br/>\n
      <div>We will get in touch with you over the telephone and/or e-mail very soon in order to plan the
      details of your move with you. If you want to contact us at any time convenient for you, you can either call us at
      +1 888 887 9912, or email us moves@movetailors.com.</div><br/><br/>\n\n
      <div>Best regards,</div><br/>\n
      <div>Otso Massala</div>
      <div>Move Tailors Co.</div>
      <div>moves@movetailors.com</div>
      <div>+1 888 887 9912</div><br/><br/>\n\n
      <div>Your customer details are:</div><br/>\n
      <div>Name: ${req.body.name}</div>
      <div>Email: ${req.body.email}</div>
      <div>Number: ${req.body.phone}</div>
      <div>Move number: ${move._id}</div>
      <div>Origin: ${move.from}</div>
      <div>Destination: ${move.to}</div>
      <div>Move date: ${Moment(move.startDate).format("MMM D")} - ${Moment(move.endDate).format("MMM D")}</div>
      <div>Base price: $${move.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>`
    };
  
    sgMail.send(data, (error, result) => {
      if (error) console.log(error);
    });

    const data2 = {
      to: process.env.FROM_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `A new reservation has been placed`,
      text: `text`,
      html: `<div>A new reservation has been placed, the details of the move are below:</div><br/>\n
      <div>Name: ${req.body.name}</div>
      <div>Email: ${req.body.email}</div>
      <div>Phone: ${req.body.phone}</div>
      <div>Move number: ${move._id}</div>
      <div>Origin: ${move.from}</div>
      <div>Destination: ${move.to}</div>
      <div>Move date: ${Moment(move.startDate).format("MMM D")} - ${Moment(move.endDate).format("MMM D")}</div>
      <div>Base price: $${move.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div><br/>\n
      <a href="https://movetailorcms.herokuapp.com/admin">See more details on the CMS.</a>`
    };

    sgMail.send(data2, (error, result) => {
      if (error) console.log(error);
    });

    res.status(200).json({message: "Success"});
  });
});

router.post('/sendmessage', (req, res, next) => {
  const data = {
    to: process.env.FROM_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: 'Move Tailors - Website Contact Form',
    text: `text`,
    html: `<div>From: ${req.body.name}</div> 
    <div>Email: ${req.body.email}</div>
    <div>Phone: ${req.body.phone}</div><br/>\n
    <div>${req.body.message}</div>`
  };

  sgMail.send(data, (error, result) => {
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ message: 'Thanks for getting in touch! We\'get back to you shortly.' });
  });
});

router.post('/query', (req, res, next) => {
  Queries.create(req.body, (err, query) => {
    if(err)
    {
      console.log(err);
      return res.status(200).json({message: 'Failed'});
    }
    res.status(200).json({message: 'Success', query});
  });
});

router.put('/query/:id', (req, res, next) => {
  Queries.updateOne({_id: req.params.id}, {email: req.body.email}, (err, query) => {
    if(err)
    {
      console.log(err);
      return res.status(200).json({message: 'Failed'});
    }
    res.status(200).json({message: 'Success', query});
  });
});

module.exports = router;