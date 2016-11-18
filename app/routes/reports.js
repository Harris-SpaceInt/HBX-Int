/**
 * Handles all routes that end in /api/reports
 */

var express    = require('express');

var Project    = require('../models/project');
var Report     = require('../models/report');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// on routes that end in /reports
// ----------------------------------------------------
router.route('/')

    // get all reports (accessed at GET http://localhost:8080/api/reports)
    .get(function(req, res) {
        Report.find(function(err, reports) {
            if (err)
                res.send(err);

            res.json(reports);
        });
    })

    // create a report (accessed at POST http://localhost:8080/api/reports)
    .post(function(req, res) {
        var report = new Report();
        report.day = req.body.day;
        report.month = req.body.month;
        report.year = req.body.year;
        report.savings = req.body.savings;
        report.hours = req.body.hours;

        req.body.project.forEach(function(element, index, array) {
            report.project.push(element._id);
        });

        // save the report and check for errors
        report.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Report created' });
        });
    });

// on routes that end in /reports/:report_id
// ----------------------------------------------------
router.route('/:report_id')

    // get the report with that id (accessed at GET http://localhost:8080/api/project/:project_id)
    .get(function(req, res) {
        Report.findById(req.params.report_id)
            .populate('project')
            .exec(function(err, report) {
                if (err)
                    res.send(err);

                Project.populate(report.project, {
                    path: 'manager'
                }, function(err, project) {
                    if (err)
                        res.send(err);

                    report.project = project;
                    res.json(report);
                });
            });
    });

// export our routes
// ----------------------------------------------------
module.exports = router;