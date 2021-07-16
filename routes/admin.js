const Router = require('express-promise-router');
const fs = require('fs')
var multer = require('multer');
const request = require('request');
const xlsxFile = require('read-excel-file/node');

var Ports = require('./../models/ports.js');
var Rates = require('./../models/rates.js');

const router = new Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + 'update.xlsx' )
  }
});

var upload = multer({ storage: storage }).single('file');

router.post('/updatefile', (req, res, next) => {
  upload(req, res, function (err) {
    console.log(err);
    if (err instanceof multer.MulterError) {
      return res.status(500).json({err, message: "There was an error uploading the file."});
    } else if (err) {
      return res.status(500).json({err, message: "There was an error uploading the file."});
    }
    xlsxFile(`./${req.file.path}`, { sheet: 'Ports' }).then((ports) => {
      updatePorts(ports);
    });

    xlsxFile(`./${req.file.path}`, { sheet: 'Shipping time min' }).then((min) => {
      xlsxFile(`./${req.file.path}`, { sheet: 'Shipping time max' }).then((max) => {
        xlsxFile(`./${req.file.path}`, { sheet: 'Sea route cost 20' }).then((r20) => {
          xlsxFile(`./${req.file.path}`, { sheet: 'Sea route cost 40Ft' }).then((r40) => {
            xlsxFile(`./${req.file.path}`, { sheet: 'Sea route cost 40 HC' }).then((rHC) => {
              xlsxFile(`./${req.file.path}`, { sheet: 'Gross Margin 20Ft' }).then((p20) => {
                xlsxFile(`./${req.file.path}`, { sheet: 'Gross Margin 40Ft' }).then((p40) => {
                  xlsxFile(`./${req.file.path}`, { sheet: 'Gross Margin 40HC' }).then((pHC) => {
                    updateRates(min, max, r20, r40, rHC, p20, p40, pHC);
                    fs.unlink(`${req.file.path}`, (err) => {
                      console.log(err);
                      return res.status(200).send({message: "Success"});
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  })
});

module.exports = router;

//HELPERS
function updatePorts(ports) {
  ports.forEach((item, index) => {
    if(index !== 0 && item[0]) {
      Ports.findOneAndUpdate({portName: item[0], servingCountryCode: item[3]}, {
        googlePlaceID: item[5],
        truckingRate: item[6]
      }, { new: true }, (err, newPort) => {
        if(!err)
        {
          if(!newPort)
          {
            request(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${item[5]}&key=${process.env.GOOGLE_API_KEY}`, {json: true}, (err, res, body) => {
              if(err)
              {
                console.log(err);
              }
              else
              {
                const loc = {
                  type: "Point",
                  coordinates: [body.result.geometry.location.lng, body.result.geometry.location.lat]
                }
                Ports.create(
                  {
                    portName: item[0],
                    countryCode: item[1],
                    country: item[2],
                    servingCountryCode: item[3],
                    servingCountry: item[4],
                    googlePlaceID: item[5],
                    truckingRate: item[6],
                    location: loc
                  }, function (err, port) {
                    if (err) console.log(err);
                    console.log("New: ", item[0]);
                  }
                );
              }
            });
          }
        }
      });
    }
  });
}

function updateRates(min, max, r20, r40, rHC, p20, p40, pHC) {
  var arrayOfNames = [];
  var arrayOfCodes = [];

  var insertObjs = [];

  for(var j = 2; j < min[0].length; j++)
  {
    arrayOfNames.push(min[0][j]);
    arrayOfCodes.push(min[1][j]);
  }

  min.forEach((i, index1) => {
    if(index1 >= 2)
    {
      min[index1].forEach((j, index2) => {
        if(index2 >= 2)
        {
          var entry = {
            from: arrayOfNames[index1 - 2],
            to: arrayOfNames[index2 - 2],
            fromCountryCode: arrayOfCodes[index1 - 2],
            toCountryCode: arrayOfCodes[index2 - 2],
            shippingTimeMin: min[index1][index2],
            shippingTimeMax: max[index1][index2],
            rate20: r20[index1][index2],
            rate40: r40[index1][index2],
            rate40HC: rHC[index1][index2],
            grossProfit20: p20[index1][index2],
            grossProfit40: p40[index1][index2],
            grossProfit40HC: pHC[index1][index2]
          };
          insertObjs.push(entry);
        }
      })
    }
  });

  Rates.deleteMany({}, (err, deleted) => {
    console.log("DELETING: ", err, deleted);
    Rates.insertMany(insertObjs, (err, result) => {
      console.log("INSERT NEW: ", err, result);
    });
  });
}