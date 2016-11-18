'use strict';

var app = angular.module('myApp');

app.factory('dropdown', function() {
    var data = {};

    //array of disciplines
    data.disciplines = [{
        label: "Software",
        ticked: false
    }, {
        label: "Systems",
        ticked: false
    }, {
        label: "Electrical",
        ticked: false
    }, {
        label: "Mechanical",
        ticked: false
    }, {
        label: "Production",
        ticked: false
    }, {
        label: "Integration and Test",
        ticked: false
    }, {
        label: "Corporate",
        ticked: false
    }, {
        label: "Program Management",
        ticked: false
    }];

    //array of business units
    data.businessUnits = ["ISR", "Space Superiority", "Proprietary", "Geospatial", "Environmental", "PNT"];

    //array of functions
    data.functions = ["Software", "Systems", "Integration & Test", "Mechanical", "Electrical"];
    
    data.resetDisciplines = function () {
        data.disciplines.forEach(function (discipline) {
            discipline.ticked = false;
        });
    };
    
    return data;
});