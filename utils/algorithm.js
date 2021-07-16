var qs = require('qs');
const request = require('request');
var mongoose = require('mongoose');

var Ports = require('./../models/ports');
var Rates = require('./../models/rates');

const GOOGLE_MAP_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';

/**
 * Queries platform DB to find 3 ports nearest to the latitude and longitude supplied
 * using geospacial mongoose query, within 1000km
 * 
 * @param {Object} latLng Latitude and longitude of town
 * 
 * @return {Array} Array of ports closest to town
 */
exports.getPorts = function(latLng, callback) {
  Ports.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [
            latLng.lng,
            latLng.lat
           ]
        },
        $maxDistance: 10000000
      }
    }
  }, (err, data) => {
    if(err) {
      return callback(err, null);
    }
    if(data.length === 0) {
      return callback('Error: No ports within 10,000km of origin or destination town', null);
    }
    if(data.length === 2) {
      data[2] = data[0];
    }
    else if(data.length === 1) {
      data[1] = data[0];
      data[2] = data[0];
    }
    return callback(null, data);
  }).limit(3);
};

/**
 * Uses Google Maps Distance Matrix API to get travel distance and travel time using
 * Google Place IDs of the users input town and those of the 3 nearest ports
 * 
 * @param {Array}   ids     Array of Google Places IDs of the ports
 * @param {String}  fromID  The Google Places ID of the users input town
 * 
 * @return {Object} Object from Google Maps Distance Matrix API containing matrix of distances
 *                  for each of the 3 ports from the users input town
 */
exports.getDistances = function(ids, fromID, callback) {
  let query = `units=metric&origins=place_id:${fromID}&destinations=`;
  ids.forEach((id, i) => {
    if(i == 0)
    {
      query += `place_id:${id}`
    }
    else
    {
      query += `|place_id:${id}`
    }
  });
  query += `&key=${process.env.GOOGLE_API_KEY}`;


  request(`${GOOGLE_MAP_URL}?${query}`, { json: true }, (err, res, body) => {
    if(body) {
      return callback(null, body);
    }
    return callback(err, null);
  });
};

/**
 * Get shipping rates from platform DB for each of the 9 routes between 3 origin and
 * 3 destination ports
 * 
 * @param {Array} froms Array of ports nearby to the users input origin town
 * @param {Array} tos   Array of ports nearby to the users input destination town
 * 
 * @return {Array} Array of shipping rate information from each of the 9 routes
 */
exports.getShippingRates = function(froms, tos, callback) {
  Promise.all([
    Rates.findOne({ from: froms[0].portName, fromCountryCode: froms[0].servingCountryCode, to: tos[0].portName, toCountryCode: tos[0].servingCountryCode }),
    Rates.findOne({ from: froms[0].portName, fromCountryCode: froms[0].servingCountryCode, to: tos[1].portName, toCountryCode: tos[1].servingCountryCode }),
    Rates.findOne({ from: froms[0].portName, fromCountryCode: froms[0].servingCountryCode, to: tos[2].portName, toCountryCode: tos[2].servingCountryCode }),
    Rates.findOne({ from: froms[1].portName, fromCountryCode: froms[1].servingCountryCode, to: tos[0].portName, toCountryCode: tos[0].servingCountryCode }),
    Rates.findOne({ from: froms[1].portName, fromCountryCode: froms[1].servingCountryCode, to: tos[1].portName, toCountryCode: tos[1].servingCountryCode }),
    Rates.findOne({ from: froms[1].portName, fromCountryCode: froms[1].servingCountryCode, to: tos[2].portName, toCountryCode: tos[2].servingCountryCode }),
    Rates.findOne({ from: froms[2].portName, fromCountryCode: froms[2].servingCountryCode, to: tos[0].portName, toCountryCode: tos[0].servingCountryCode }),
    Rates.findOne({ from: froms[2].portName, fromCountryCode: froms[2].servingCountryCode, to: tos[1].portName, toCountryCode: tos[1].servingCountryCode }),
    Rates.findOne({ from: froms[2].portName, fromCountryCode: froms[2].servingCountryCode, to: tos[2].portName, toCountryCode: tos[2].servingCountryCode })
  ]).then(([first, second, third, fourth, fifth, sixth, seventh, eighth, ninth]) => {
    return callback(null, [first, second, third, fourth, fifth, sixth, seventh, eighth, ninth])
  }).catch((err) => {
    return callback(err, null);
  });
};

exports.getSeaRouteCost = function(distOrig, truckOrig, seaRate, distDest, truckDest) {
  return (((distOrig/1000) + 40) * 2 * truckOrig) + seaRate + (((distDest/1000) + 40) * 2 * truckDest);
};

exports.getSeaRoutePrice = function(distOrig, truckOrig, seaRate, distDest, truckDest, grossProf) {
  return (((distOrig/1000) + 40) * 2 * truckOrig) + seaRate + (((distDest/1000) + 40) * 2 * truckDest) + grossProf;
}

exports.getTime = function(time, distOrig, distDest) {
  return (time + Math.ceil(distOrig/1000000) + Math.ceil(distDest/1000000));
}

exports.getMinLandTime = function(dist) {
  return Math.ceil(dist/900000);
}

exports.getMaxLandTime = function(dist) {
  return Math.ceil(dist/500000) + 1;
}

exports.getLandRouteCost = function(distToDest, truckRates, grossProfs, adder) {
  var sumRates = 0;
  var sumProfs = 0;

  truckRates.forEach((r, i) => {
    sumRates += r;
  });
  grossProfs.forEach((p, i) => {
    sumProfs += p;
  });

  const avgTruckRate = sumRates/truckRates.length;
  const avgGrossProf = sumProfs/grossProfs.length;

  return (distToDest/1000 * 2.5 * avgTruckRate) + adder + avgGrossProf;
}