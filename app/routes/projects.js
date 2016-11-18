/**
 * Handles all routes that end in /api/projects
 */

var express    = require('express');

var Project    = require('../models/project');
var Manager    = require('../models/manager');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// on routes that end in /projects
// ----------------------------------------------------
router.route('/')

    // create a project (accessed at POST http://localhost:8080/api/projects)
    .post(function(req, res) {

        // define function to save the project with a manager
        var saveProject = function(project, manager) {
            project.manager = manager._id;

            // save the project and check for errors
            project.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Project created' });
            });
        };


        var project = new Project();      // create a new instance of the Project model
        project.title = req.body.title;   // set the projects fields (comes from the request)
        project.discipline = req.body.discipline;
        project.summary = req.body.summary;
        project.savings = req.body.savings;
        project.hours = req.body.hours;
        project.day = req.body.day;
        project.month = req.body.month;
        project.year = req.body.year;
        project.result = req.body.result;

        if (req.body.generated) {
            project.generated = req.body.generated;
        }

        if (req.body.team === '' || req.body.team === undefined) {
            project.team = null;
        }
        else {
            project.team = req.body.team;
        }

        if (req.body.image) {
            project.image = req.body.image;
        }

        // search for a manager with the same email in the database
        Manager.findOne({email: req.body.manager.email}, function(err, results) {
            if (err)
                res.send(err);

            // check if manager exists
            if (results === null) {
                // manager with email does not exist
                // create a new manager from the request body
                var manager = new Manager();
                manager.name = req.body.manager.name;
                manager.unit = req.body.manager.unit;
                manager.function = req.body.manager.function;
                manager.department = req.body.manager.department;
                manager.phone = req.body.manager.phone;
                manager.email = req.body.manager.email;

                manager.save(function(err, man) {
                    if (err)
                        res.send(err);

                    saveProject(project, man);
                });
            }
            else {
                // manager exists here
                // get the id and store it in the project
                try {
                    saveProject(project, results);
                } catch(e) {
                    res.status(400).send('Saving project unsuccessful');
                }
            }
        });

    })

    // get all projects not in reports (accessed at GET http://localhost:8080/api/projects)
    .get(function(req, res) {
        Project.find({generated: false})
            .populate('manager')
            .exec(function(err, projects) {
                if (err)
                    res.send(err);

                res.json(projects);
            });
    });

// on routes that end in /projects/id/:project_id
// ----------------------------------------------------
router.route('/id/:project_id')

    // get the project with that id (accessed at GET http://localhost:8080/api/project/:project_id)
    .get(function(req, res) {
        Project.findById(req.params.project_id)
            .populate('manager')
            .exec(function(err, project) {
                if (err)
                    res.send(err);

                res.json(project);
            });
    })

    // update the project with this id (accessed at PUT http://localhost:8080/api/projects/:project_id)
    .put(function(req, res) {

        // use our project model to find the project we want
        Project.findById(req.params.project_id, function(err, project) {

            if (err)
                res.send(err);

            project.title = req.body.title;  // update the project info
            project.discipline = req.body.discipline;
            project.summary = req.body.summary;
            project.team = req.body.team;
            project.savings = req.body.savings;
            project.hours = req.body.hours;
            project.day = req.body.day;
            project.month = req.body.month;
            project.year = req.body.year;
            project.result = req.body.result;

            if (req.body.generated) {
                project.generated = true;
            }
            else if (req.body.generated === false) {
                project.generated = false;
            }

            if (req.body.team === '' || req.body.team === undefined) {
                project.team = null;
            }
            else {
                project.team = req.body.team;
            }

            if (req.body.image) {
                project.image = req.body.image;
            }
            else if (req.body.image === null) {
                project.image = null;
            }

            // save the project
            project.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Project updated' });
            });

        });
    })

    // delete the project with this id (accessed at DELETE http://localhost:8080/api/projects/:project_id)
    .delete(function(req, res) {
        Project.remove({
            _id: req.params.project_id
        }, function(err, project) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// on routes that end in /projects/manager/:manager_email
// ----------------------------------------------------
router.route('/manager/:manager_email')

    // get all projects the user has submitted (accessed at GET http://localhost:8080/api/projects/manager/:manager_email)
    .get(function(req, res) {
        Manager.findOne({email: req.params.manager_email},
            function(err, manager) {
                Project.find({manager: manager._id, generated: false})
                    .populate('manager')
                    .exec(function(err, projects) {
                        if (err)
                            res.send(err);

                        res.json(projects);
                    });
            });
    });

// on routes that end in /projects/generated
// ----------------------------------------------------
router.route('/generated')

    // get all projects in reports (accessed at GET http://localhost:8080/api/projects/generated)
    .get(function(req, res) {
        Project.find({generated: true})
            .populate('manager')
            .exec(function(err, projects) {
                if (err)
                    res.send(err);

                res.json(projects);
            });
    });

// on routes that end in /projects/generated/:manager_email
// ----------------------------------------------------
router.route('/generated/:manager_email')

    // get all projects in reports from the manager with the matching email
    // (accessed at GET http://localhost:8080/api/projects/generated/:manager_email)
    .get(function(req, res) {
        Manager.findOne({email: req.params.manager_email},
            function(err, manager) {
                Project.find({manager: manager._id, generated: true})
                    .populate('manager')
                    .exec(function(err, projects) {
                        if (err)
                            res.send(err);

                        res.json(projects);
                    });
            });
    });

// export our routes
// ----------------------------------------------------
module.exports = router;