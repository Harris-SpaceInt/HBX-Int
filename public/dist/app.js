'use strict';

var app = angular.module('myApp', [
    'ngRoute', 
    'ui.date',
    'isteven-multi-select',
    'display',          //admin display projects page
    'email',            //log in screen
    'entry',            //entering projects
    'preview',          //preview project reports
    'previous',         //previous projects
    'manage'            //editing manager info
]);

app.config([
    '$locationProvider',
    '$routeProvider',
    '$httpProvider',
    function config($locationProvider, $routeProvider, $httpProvider) {
        // cors compatibility
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        

        // define the routes for the application
        $locationProvider.hashPrefix('!');

        $routeProvider.
        when('/login', {
            templateUrl: 'views/email.template.html',
            controller: 'emailCtrl'
        }).
        when('/user', {
            templateUrl: 'views/user.template.html',
            controller: 'userCtrl'
        }).
        when('/display', {
            templateUrl: 'views/display.template.html',
            controller: 'displayCtrl'
        }).
        when('/entry', {
            templateUrl: 'views/entry.template.html',
            controller: 'entryCtrl'
        }).
        when('/previous', {
            templateUrl: 'views/previous.template.html',
            controller: 'previousCtrl'
        }).
        when('/preview', {
            templateUrl: 'views/preview.template.html',
            controller: 'previewCtrl'
        }).
        when('/manage', {
            templateUrl: 'views/manage.template.html',
            controller: 'manageCtrl'
        }).
        otherwise('/login');
    }
]);
