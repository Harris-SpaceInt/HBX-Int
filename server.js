// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors       = require('cors');

// configure app to use bodyParser()
// this will let us get the data from a POST
// limit: '50mb' specifies the max file size for POST and PUT
//   !IMPORTANT! this value also needs to be changed in nginx
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// configure app to use cors
// this will let angular communicate with rest
app.use(cors());

var port = process.env.PORT || 8080;        // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost');    // connect to our database

var router     = require('./app/routes/api');
var projects   = require('./app/routes/projects');
var managers   = require('./app/routes/managers');
var reports    = require('./app/routes/reports');

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
app.use('/api/projects', projects);
app.use('/api/managers', managers);
app.use('/api/reports', reports);

// APPLICATION 
// ============================================================================
app.use(express.static(__dirname + '/public'));
app.get('*', function(req, res) {
    res.redirect('/index.html');
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);