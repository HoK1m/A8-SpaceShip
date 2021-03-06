// dependency package for fetch Web API call
const fetch = require('node-fetch');
// server-side file to hold API fetched JSON
var data = require("../data.json");
// HTTP header for fetch API call
const myHeaders = {
  "Host": "api.shipengine.com",
  "API-Key": "TEST_3kNoQV1BpQP/ixmlVGwHK0loRALWb3rZvatxpF2nhLI",
  "Content-Type": "application/json",
};
// carrier array (in order) -> USPS, UPS, Fedex
const carrier = ["se-553570", "se-553571", "se-553572"];
// delivery service array
const service = ["usps_first_class_mail", "usps_parcel_select", 
  "usps_priority_mail", "usps_priority_mail_express", 
  "fedex_express_saver","fedex_2day", "fedex_standard_overnight", 
  "ups_ground", "ups_3_day_select", "ups_2nd_day_air", "ups_next_day_air_saver"];
// package types
const package_types = ["package"];

// load page
exports.view = function (req, res) {
  res.render('calculator');
};


// REST API call to fetch shipping rates
exports.calculate = function (req, res) {

  /**
   * Build API Call request
   */
  // break down server post req parameters
  const ship_from = JSON.parse(req.body.ship_from);
  const ship_to = JSON.parse(req.body.ship_to);
  const package = JSON.parse(req.body.package);
  const length = package.length;
  const width = package.width;
  const height = package.height;
  const weight = package.weight;
  const value = package.value;

  // build API call req parameters
  const raw = {
    "rate_options": {
      "carrier_ids": carrier,
      "service_codes": service,
      "package_types": package_types
    },
    "shipment": {
      "validate_address": "validate_and_clean",
      "ship_to": ship_to,
      "ship_from": ship_from,
      "insurance_provider": "carrier",
      "packages": [{
        "weight": {
          "value": weight,
          "unit": "ounce"
        },
        "dimensions": {
          "unit": "inch",
          "length": length,
          "width": width,
          "height": height
        },
        "insured_value": {
          "currency": "usd",
          "amount": value
        }
      }]
    }
  }

  // build JSON for API fetch call parameter
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(raw),
    redirect: 'follow',
  };

  // fetch data via API call to ShipEngine REST API
  fetch("https://api.shipengine.com/v1/rates", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      // console.log(result);
      data.response = JSON.parse(result);
      res.json(result);
    })
    .catch(error => console.log('error', error));
}

exports.rateById = function (req, res) {

  // build API call req parameters
  const raw = {
    "rate_options": {
      "carrier_ids": carrier,
      "service_codes": service,
      "package_types": package_types
    },
    "shipment_id": JSON.parse(req.body.id)
  }

  // build JSON for API fetch call parameter
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(raw),
    redirect: 'follow',
  };

  // fetch data via API call to ShipEngine REST API
  fetch("https://api.shipengine.com/v1/rates", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      // console.log(result);
      data.response = JSON.parse(result);
      res.json(result);
    })
    .catch(error => console.log('error', error));
}