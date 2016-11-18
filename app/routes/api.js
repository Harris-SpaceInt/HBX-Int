/**
 * Handles all routes that end in /api
 * Used to test if the api is working
 */

var express    = require('express');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'REST API is working.' });
});

// export our routes
// ----------------------------------------------------
module.exports = router;