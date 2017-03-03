var express = require('express');

var housing = express();

// base path for housing APIs.
housing.get('/', function(req, res) {
  res.sendFile(__dirname + '/housing.html');
});

// the APIs

var locations = [
  { long : '1.39870', lat : "51.02655", building: "Bank A", street: "Hursley Park Road", area: "Hursley", town: "Winchester", county: "Hampshire", postcode: "SO21 2JN"},
  { long : '-2.326083', lat : "53.423593", building: "Bank B", street: "Sibson Road", area: "Sale", town: "Manchester", county: "Cheshire", postcode: "M33 7RR"},
  { long : '-0.112620', lat : "51.507462", building: "Bank C", street: "76/78 Upper Ground", area: "South Bank", town: "London", county: "London", postcode: "SE1 9PZ"},
  { long : '-0.112620', lat : "51.507462", building: "Seaton Court", street: "2 William Prance Road", area: "Crownhill", town: "Plymouth", county: "Devon", postcode: "PL6 5WS "},
  { long : '-1.156350', lat : "52.954911", building: "Bank D", street: "City Gate West", area: "Tollhouse Hill", town: "Nottingham", county: "Nottinghamshire", postcode: "NG1 5FN"},
];

// Locate ATM
housing.get('/postcodelookup', function(req, res) {

  res.setHeader("Content-Type", "application/json");


  // print out header drbheader
  var drbh = req.header('drbheader');
  console.log("drbheader: " + drbh);

  // check headers //
  var CTHeader = req.header('Content-Type');
  console.log("Content-Type: " + CTHeader);
  var AcceptHeader = req.header('Accept');
  //console.log("Accept: " + AcceptHeader);
  // use Accept header to determine return type
  if (AcceptHeader == "application/json") {
    //console.log("should return json, based on Accept Header");
  } else if (AcceptHeader == "application/xml") {
    //console.log("should return xml, base on Accept header");
  } else {
    // Else, lets return what we were told we are being given - use Content-Type to determine return type.
	if(CTHeader == "application/json") {
      //console.log("should return json, base on Content-Type header");
    } else if (CTHeader == "application/xml") {
      //console.log("should return xml, base on Content-Type header");
    } else {
      //console.log("lets return whatever you sent us if we can work it out, or else lets assume json");
    } // end check Content-Type header if
  } // end check Accept header if

  // check we have the required query parameter postcode
  var userloc = req.query.postcode;
  if(userloc != null) {
      // Return Successful API invoke
      if (userloc.match(/^so|SO/)){
	    res.json(locations[0]);
	  } else if (userloc.match(/^m|M/)){
	    res.json(locations[1]);
	  } else if (userloc.match(/^se|SE/)){
	    res.json(locations[2]);
    } else if (userloc.match(/^pl|PL/)){
	    res.json(locations[3]);
	  } else {
	    res.json(locations[4]);
//	  } else {
//	    res.status(400).json( {error: 'postcode starts with invalid character.'});
	  }
      //res.json({housing: ' req.query.postcode = ' + req.query.postcode});
  } else {
	res.status(400).json( {error: 'You must provide a query parameter postcode, set to a postcode or town'});
  } // end check query param postcode

  //res.sendFile(__dirname + '/housing.html');
});

housing.listen(80, function() {
  console.log('Housing app listening on port 80.')
})

module.exports = housing;
