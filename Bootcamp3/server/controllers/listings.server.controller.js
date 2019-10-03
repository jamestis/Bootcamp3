
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js'),
    coordinates = require('./coordinates.server.controller.js');
    
/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions refer back to this tutorial 
  https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/
  or
  https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d
  

  If you are looking for more understanding of exports and export modules - 
  https://www.sitepoint.com/understanding-module-exports-exports-node-js/
  or
  https://adrianmejia.com/getting-started-with-node-js-modules-require-exports-imports-npm-and-beyond/
 */

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    listing.coordinates.latitude = req.results.lat;
    listing.coordinates.longitude = req.results.lng;
  }
 
  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      res.status(400).send(err);
    } else {
      res.json(listing);
    }
  });
};


exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing - note the order in which this function is called by the router*/
exports.update = function(req, res) {
  var listing = req.listing;
  listing.code = req.body.code;
  listing.address = req.body.address;
  listing.name = req.body.name;
  /*save the coordinates (located in req.results if there is an address property) */
  //FIXME?
  /*
    listing.coordinates = {
      latitude: req.body.lat,
      longitude: req.body.lng
    }
    */
  
    if(req.results){
      listing.coordinates = {
        latitude: req.results.lat,
        longitude: req.results.lng
      }
    }

  //save the listing
  listing.save(function(error){
    if(error){
      res.status(400).send(err);
    }
    else{
      res.json(listing);
    }
  })
};

//possible fixme
exports.delete = function(req, res) {
  var listing = req.listing;
  listing.remove(function(err){
    if(err){
      res.status(404).send(err);
    }
    else{
      res.status(200).send('Deleted');
    }
  })
};

//helper function
// source: https://www.devcurry.com/2010/05/sorting-json-array.html
function SortByCode(x,y){
  return ((x.code == y.code) ? 0 : ((x.code > y.code) ? 1 : -1 ))
}
/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  Listing.find(function(err,body){
    if(err){
      res.status(404).send(err);
    }
    else{
      var listing = body.sort(SortByCode);
      res.send(listing);
    }
  })
};


exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};