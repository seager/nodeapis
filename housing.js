var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');

var housing = express();

//housing.use(bodyParser.json());
var jsonParser = bodyParser.json()

// the APIs

//////////////////////////////////////////////////////////////////////////////////
// API: lookup house id

var ids = [ 12345, 2468, 98765, 54321, 11111, 44444, 77777, 99999, 30003, 64201];

housing.get('/houseid', function(req, res) {

	var METHOD = "/houseid GET ";
	console.log(METHOD + "query params: " + JSON.stringify(req.query, null, ""));

    res.setHeader("Content-Type", "application/json");

    var housenumber = req.query.housenumber;
    var postcode = req.query.postcode;

	var resp = null;
	
    if(postcode != null && postcode != ""
        && housenumber != null && housenumber != "") {
        // Return Successful API invoke
        var digit = housenumber.charAt(0);
        if (digit.match(/^[0-9]/)){
			resp = {id: ids[digit]};
     	  } else {
  	      res.status(400);
		  resp = {error: 'house number starts with non-numeric character.'};
  	    }
        //res.json({housing: ' req.query.postcode = ' + req.query.postcode});
    } else {
  	  res.status(400);
	  resp = {error: 'You must provide a query parameter housenumber and postcode'};
    } // end check query param postcode

	console.log(METHOD + "response: " + JSON.stringify(resp, null, ""));
	res.json(resp);
});

//////////////////////////////////////////////////////////////////////////////////
// API: house owner

var owners = [
  { id: '12345', owner : "David Bell", mortgageprovider: "Bank A"},
  { id: '2468', owner : "David Seager", mortgageprovider: "Local Bank"},
  { id: '98765', owner : "Ben March", mortgageprovider: "Best Building Society"},
  { id: '54321', owner : "David Martin", mortgageprovider: "Online Banking Co"},
  { id: '11111', owner : "John Smith", mortgageprovider: "Bank Z"},
  { id: '44444', owner : "Matthew Saveal", mortgageprovider: "Another Bank"},
  { id: '77777', owner : "Christine Creasey", mortgageprovider: "Mortgage Co"},
  { id: '99999', owner : "Jessica Jones", mortgageprovider: "Expensive Mortgages Are Us"},
  { id: '30003', owner : "Eddie Hutson", mortgageprovider: "Bargain Mortgages Company"},
  { id: '64201', owner : "Jane Doe", mortgageprovider: "Global Bank"}
];

function findowner(theid) {
  for (var i = 0; i <owners.length; i++) {
    if (owners[i].id == theid) {
      return owners[i];
    }

  } // end for

  // no match
  return "Error: no house with id: " + theid;
}

function idexists(theid) {
  for (var i = 0; i <owners.length; i++) {
    if (owners[i].id == theid) {
      return i;
    }
  }
  // no match
  return -1;
}


housing.get('/houseowner', function(req, res) {

	var METHOD = "/houseowner GET ";
	console.log(METHOD + "query params: " + JSON.stringify(req.query, null, ""));

    res.setHeader("Content-Type", "application/json");

    var houseid = req.query.houseid;

	var resp = null;
    if(houseid != null && houseid != ""){
        resp = findowner(houseid);
    } else {
      resp = owners;
    }

	console.log(METHOD + "response: " + JSON.stringify(resp, null, ""));
	res.json(resp);
});

housing.put('/houseowner', jsonParser, function(req, res) {
	var METHOD = "/houseowner PUT ";
    res.setHeader("Content-Type", "application/json");

	console.log(METHOD + "query params: " + JSON.stringify(req.query, null, "") + " req body: " + JSON.stringify(req.body, null, ""));

	var resp = null;
	
    var houseid = req.query.houseid;
    if (houseid == null || houseid == "") {
      res.status(400);
	  resp = {error: 'You must provide a query parameter of houseid'};
    } else {
		if(req.body != null && req.body != ""
		  && req.body.owner != null && req.body.owner != ""
		  && req.body.mortgageprovider != null && req.body.mortgageprovider != "") {
		  var newowner = req.body.owner;
		  var newmortgageprovider = req.body.mortgageprovider;
		  
			var arrayindex = idexists(houseid);
			if (arrayindex == -1) {
			  console.log("no id")
			   res.status(400);
			   resp = {error: ' no house with id:'  + houseid};
			} else {
			   owners[arrayindex].owner = newowner;
			   owners[arrayindex].mortgageprovider = newmortgageprovider;
			   res.sendStatus(200);
			}
		  
		} else {
		  res.status(400);
		  resp = {error: 'You must provide a message body containing owner and mortgageprovider fields'};
		}

	}

	if(resp !== null) {
		console.log(METHOD + "response: " + JSON.stringify(resp, null, ""));
		res.json(resp);
	} else {
		console.log(METHOD + "response 200 OK");
	}
});


//////////////////////////////////////////////////////////////////////////////////
// API: postcode lookup

var locations = [
  { long : '1.39870', lat : "51.02655", building: "Bank A", street: "Hursley Park Road", area: "Hursley", town: "Winchester", county: "Hampshire", postcode: "SO21 2JN"},
  { long : '-2.326083', lat : "53.423593", building: "Bank B", street: "Sibson Road", area: "Sale", town: "Manchester", county: "Cheshire", postcode: "M33 7RR"},
  { long : '-0.112620', lat : "51.507462", building: "Bank C", street: "76/78 Upper Ground", area: "South Bank", town: "London", county: "London", postcode: "SE1 9PZ"},
  { long : '-0.112620', lat : "51.507462", building: "Seaton Court", street: "2 William Prance Road", area: "Crownhill", town: "Plymouth", county: "Devon", postcode: "PL6 5WS "},
  { long : '-1.156350', lat : "52.954911", building: "Bank D", street: "City Gate West", area: "Tollhouse Hill", town: "Nottingham", county: "Nottinghamshire", postcode: "NG1 5FN"},
];

housing.get('/postcodelookup', function(req, res) {
	var METHOD = "/postcodelookup GET ";
	console.log(METHOD + "query params: " + JSON.stringify(req.query, null, ""));

  res.setHeader("Content-Type", "application/json");

  var resp = null;
  
  // check headers //
  var CTHeader = req.header('Content-Type');

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
  var postcode = req.query.postcode;
  if(postcode != null && postcode != "") {
      // Return Successful API invoke
      if (postcode.match(/^so|SO/)){
	    resp = locations[0];
	  } else if (postcode.match(/^m|M/)){
	    resp = locations[1];
	  } else if (postcode.match(/^se|SE/)){
	    resp = locations[2];
    } else if (postcode.match(/^pl|PL/)){
	    resp = locations[3];
	  } else {
	    resp = locations[4];
//	  } else {
//	    res.status(400).json( {error: 'postcode starts with invalid character.'});
	  }
      //res.json({housing: ' req.query.postcode = ' + req.query.postcode});
  } else {
    resp = locations;
  	//res.status(400).json( {error: 'You must provide a query parameter postcode, set to a postcode'});
  } // end check query param postcode

  	console.log(METHOD + "response: " + JSON.stringify(resp, null, ""));
	res.json(resp);
});

// root
housing.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, "/index.html"));
});

housing.listen(80, function() {
  console.log('Housing app listening on port 80.')
});

housing.listen(9080, function() {
  console.log('Housing app listening on port 9080.')
});

module.exports = housing;
