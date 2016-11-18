'use strict';

var app = angular.module('myApp');

/**
 * Factory module to hold and transfer data between views
 */
app.factory('sharedData', function($window) {
    var data = {};

    // type this in the email box to go to the admin page
    data.adminString = 'view admin';
    
    // project to transfer between views
    data.project = null;

    // global manager for application
    // essentially who is logged in
    data.globalManager = [];

    // list of projects to transfer between views before submitting to database
    data.projectList = [];
    

    data.fromDatabase = false; //boolean to check whether or not an edited project is coming from the database
    
    /**
     * Checks if there is a global manager
     * @returns {boolean} the status of the global manager, false if it's undefined
     */
    data.loggedIn = function() {
        return this.globalManager[0] !== undefined;
    };

    /**
     * Logs the user out
     */
    data.logOut = function () {
        if (data.projectList.length > 0) {
            if (confirm("Are you sure you want to log out with unsubmitted projects?")) {
                this.globalManager = [];
                this.clearProjectList();
                this.project = null;
                $window.location.href = '#!/login';
            }
        }
        else {
            this.globalManager = [];
            this.clearProjectList();
            this.project = null;
            $window.location.href = '#!/login';
        }
    };

    /**
     * Re-directs user to user landing page
     */
    data.goBackToUser = function () {
        this.project = null;
        this.clearProjectList();
        $window.location.href = '#!/previous';
    };

    /**
     * Checks if the global manager is an admin
     * @returns {boolean} the status of the global manager, true if it's an admin
     */
    data.checkAdmin = function () {
        // check if there is a global manager
        if (!this.loggedIn()) {
            return false;
        }
        // user is logged in, so check the fields
        return this.globalManager[0].name === "admin"
                && this.globalManager[0].unit === "admin"
                && this.globalManager[0].function === "admin"
                && this.globalManager[0].department === "admin"
                && this.globalManager[0].phone === "1234567890"
                && this.globalManager[0].email === "admin@admin.admin";
    };

    /**
     * Set the global manager to the admin
     */
    data.setAdmin = function () {
        var admin = {};
        admin.name = "admin";
        admin.unit = "admin";
        admin.function = "admin";
        admin.department = "admin";
        admin.phone = "1234567890";
        admin.email = "admin@admin.admin";

        if (this.loggedIn()) {
            this.globalManager = [];
        }
        
        this.setGlobalManager(admin);
    };
    
    /**
     * Sets a global manager (if there is not 
     * already one)
     * @param {object} manager
     */
    data.setGlobalManager = function (manager) {
        if (this.globalManager.length == 0) {
            this.globalManager.push(manager);
        }
    };
    
    /**
     * Adds a project to projectList and the end
     * of the array
     * @param {object} projectToAdd a project to be added to the list
     */
    data.pushToProjectList = function (projectToAdd) {
        this.projectList.push(projectToAdd);
    };

    /**
     * Deletes a project from projectList at index
     * @param {number} index index of the project to be deleted
     */
    data.deleteFromProjectList = function (index) {
        if (typeof this.projectList[index] !== 'undefined') {
            this.projectList.splice(index, 1);
        }
    };

    /**
     * Clears the list of projects
     */
    data.clearProjectList = function () {
        this.projectList = [];
    };

    /**
     * To string for an array
     * @param array any given array
     * @returns {string} a string representation of the array's comments separated by commas
     */
    data.getArrayString = function (array) {
        var string = "";
        for (var i = 0; i < array.length - 1; i++) {
            string += (array[i] + ", ");
        }
        return (string + array[array.length - 1]);
    };

    return data;
});
