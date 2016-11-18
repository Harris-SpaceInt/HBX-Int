'use strict';

var app = angular.module('myApp');

app.factory('database', function($http, $q, REST_URL) {
    var factoryData = {};


    factoryData.reports = [];
    factoryData.projects = [];
    factoryData.managers = [];
    factoryData.results = [];
    
    factoryData.generatedProjects = [];
    
    factoryData.currentReport = {};


    // set the url of the database server
    // REST_URL is set in config/url.constant.js
    var dataUrl = "http://" + REST_URL + "/api";

    
    //------------------------------------------------------------------------------------------------------------------
    // functions to retrieve data from the database
    // these functions populate the fields above
    
    /**
     * gets report information from the database from the reports 
     * url and gives it to reports
     */
    factoryData.getReportsFromDatabase = function() {
        var deferred = $q.defer();

        $http({method: 'GET', url: dataUrl + '/reports'})
            .success(function (data, status) {
                factoryData.reports = data;

                deferred.resolve(data);
            })
            .error(function (data, status) {
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * gets the report with a specified index from the database
     * and sets it as the currentReport
     */
    factoryData.getReportFromDatabase = function(id) {
        var deferred = $q.defer();

        $http({method: 'GET', url: dataUrl + '/reports/' + id})
            .success(function (data, status) {
                data.project = factoryData.addProjectDates(data.project);

                factoryData.currentReport = data;

                deferred.resolve(data);
            })
            .error(function (data, status) {
                if (confirm("Error retrieving report data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * gets project information from the database from the projects 
     * url and gives it to projects
     * 
     * only gets projects not in reports
     */
    factoryData.getProjectsFromDatabase = function() {
        var deferred = $q.defer();

        $http({method: 'GET', url: dataUrl + '/projects'})
            .success(function (data, status) {
                data = factoryData.addProjectDates(data);
                
                factoryData.projects = data;

                deferred.resolve(data);
            })
            .error(function (data, status) {
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * gets project information from the database from the projects
     * url and gives it to projects
     * 
     * only gets projects in reports
     */
    factoryData.getGenearatedProjectsFromDatabase = function() {
        var deferred = $q.defer();

        $http({method: 'GET', url: dataUrl + '/projects/generated'})
            .success(function (data, status) {
                data = factoryData.addProjectDates(data);

                deferred.resolve(data);
            })
            .error(function (data, status) {
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * Gets all ungenerated projects submitted by the current
     * manager
     */
    factoryData.getManagerProjectsFromDatabase = function(email) {
        var deferred = $q.defer();

        $http({method : 'GET', url : dataUrl + '/projects/manager/' + email})
            .success(function(data, status) {
                factoryData.addProjectDates(data);

                factoryData.projects = data;

                deferred.resolve(data);
            })
            .error(function(data, status) {
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * Gets all ungenerated projects submitted by the current
     * manager
     */
    factoryData.getGeneratedManagerProjectsFromDatabase = function(email) {
        var deferred = $q.defer();

        $http({method : 'GET', url : dataUrl + '/projects/generated/' + email})
            .success(function(data, status) {
                data = factoryData.addProjectDates(data);

                deferred.resolve(data);
            })
            .error(function(data, status) {
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * gets manager information from the database from the managers 
     * url and gives it to managers
     */
    factoryData.getManagersFromDatabase = function() {
        var deferred = $q.defer();

        $http({method : 'GET', url : dataUrl + '/managers'})
            .success(function(data, status) {
                factoryData.managers = data;

                deferred.resolve(data);
            })
            .error(function(data, status) {
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * Retrieves a manager given an email
     * @param email
     */
    factoryData.getManagerByEmail = function(email) {
        var deferred = $q.defer();

        $http({method: "GET", url : dataUrl + "/managers/email/" + email})
            .success(function(data, status) {
                deferred.resolve(data);
            })
            .error(function(data, status) {
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });
        
        return deferred.promise;
    };

    /**
     * Updates all fields with information from the database
     */
    factoryData.getItemsFromDatabase = function() {
        var deferred = $q.defer();
        
        $q.all([
            this.getManagersFromDatabase(),
            this.getProjectsFromDatabase(),
            this.getReportsFromDatabase()
        ]).then(function(success) {
            // data retrieved
            deferred.resolve();
        });
        
        return deferred.promise;
    };
    
    
    //------------------------------------------------------------------------------------------------------------------
    // functions to add, update, and delete from the database


    /**
     * Adds a project to the database
     * @param project
     */
    factoryData.addProjectToDatabase = function(project) {
        var deferred = $q.defer();

        $http({method : 'POST', url : dataUrl + '/projects', data : JSON.stringify(project)})
            .success(function(data, status) {

                // update on success
                factoryData.getItemsFromDatabase();
                deferred.resolve();
            })
            .error(function(data, status) {
                alert("Error submitting project data");
                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * Updates a project in the database
     * @param id id of the project
     * @param project
     */
    factoryData.updateProjectFromDatabase = function(id, project) {
        var deferred = $q.defer();
        
        $http({method : 'PUT', url : dataUrl + '/projects/id/' + id, data : JSON.stringify(project)})
            .success(function(data, status) {

                // update on success
                factoryData.getItemsFromDatabase();
                deferred.resolve(data);
            })
            .error(function(data, status) {
                alert("Error submitting project data");
                deferred.reject();
            });
        
        return deferred.promise;
    };

    /**
     * Updates a manager in the database
     * @param id id of the manager
     * @param manager
     */
    factoryData.updateManagerInDatabase = function(id, manager) {
        var deferred = $q.defer();
        
        $http({method : 'PUT', url : dataUrl + '/managers/id/' + id, data : JSON.stringify(manager)})
            .success(function(data, status) {
                
                // update on success
                factoryData.getItemsFromDatabase();
                deferred.resolve(data);
            })
            .error(function(data, status) {
                alert("Error submitting manager data");
                deferred.reject();
            });
        
        return deferred.promise;
    };

    /**
     * Deletes a project from the database
     * @param id id of the project
     */
    factoryData.deleteProjectFromDatabase = function(id) {
        var deferred = $q.defer();
        
        $http({method : 'DELETE', url : dataUrl + '/projects/id/' + id})
            .success(function(data, status) {

                // update on success
                factoryData.getItemsFromDatabase();
                deferred.resolve(data);
            })
            .error(function(data, status) {
                alert("Error deleting project data");
                deferred.reject();
            });
        
        return deferred.promise;
    };

    /**
     * Adds a report (compilation of projects) to the database
     * @param report
     */
    factoryData.addReportToDatabase = function(report) {
        $http({method : 'POST', url : dataUrl + '/reports', data : JSON.stringify(report)})
            .success(function(data, status) {

                // update on success
                factoryData.getItemsFromDatabase();
            })
            .error(function(data, status) {
                alert("Error submitting report data");
            });
    };

    
    //------------------------------------------------------------------------------------------------------------------
    // adding fields to projects

    /**
     * Adds dates to the projects list
     * @param projects
     * @returns {*} list of projects
     */
    factoryData.addProjectDates = function(projects) {
        projects.forEach(function(project) {
            project.date = new Date(project.year, project.month, project.day, 0, 0, 0, 0);
        });
        
        return projects;
    };


    //------------------------------------------------------------------------------------------------------------------


    return factoryData;
});
