/**
 * Handles all routes that end in /api/managers
 */

var express    = require('express');

var Manager    = require('../models/manager');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// on routes that end in /managers
// ----------------------------------------------------
router.route('/')

    // get all managers (accessed at GET http://localhost:8080/api/managers)
    .get(function(req, res) {
        Manager.find(function(err, managers) {
            if (err)
                res.send(err);

            res.json(managers);
        });
    });

// on routes that end in /managers/id/:manager_id
// ----------------------------------------------------
router.route('/id/:manager_id')

    // update the manager with this id (accessed at PUT http://localhost:8080/api/managers/:manager_id)
    .put(function(req, res) {

        // use our manager model to find the manager we want
        Manager.findById(req.params.manager_id, function(err, manager) {

            if (err)
                res.send(err);

            manager.name = req.body.name;  // update the manager info
            manager.unit = req.body.unit;
            manager.function = req.body.function;
            manager.department = req.body.department;
            manager.phone = req.body.phone;
            manager.email = req.body.email;

            // save the manager
            manager.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Manager updated' });
            });

        });
    });

// on routes that end in /managers/email/:manager_id
// ----------------------------------------------------
router.route('/email/:manager_email')

    // update the manager with this id (accessed at PUT http://localhost:8080/api/managers/:manager_id)
    .get(function(req, res) {

        // use our manager model to find the manager we want
        Manager.findOne({email: req.params.manager_email}, function(err, manager) {
            if (err)
                res.send(err);

            res.json(manager);
        });
    });


// export our routes
// ----------------------------------------------------
module.exports = router;