'use strict';

var app = angular.module('myApp');

app.factory('savings', function() {
    var data = {};

    /**
     * Calculates total savings for a project
     * @param project
     * @returns {number} total savings for that project
     */
    data.projectSavings = function (project) {
        var total = 0;
        for (var i = 0; i < project.result.length; i++) {
            total += project.result[i].savings;
        }
        return total;
    };

    /**
     * Calculates the total hours saved for a project
     * @param project
     * @returns {number} total saved hours for that project
     */
    data.projectHours = function (project) {
        var total = 0;
        for (var i = 0; i < project.result.length; i++) {
            total += project.result[i].hours;
        }
        return total;
    };

    return data;
});