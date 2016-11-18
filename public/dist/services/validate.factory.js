/**
 * Created by ewu on 7/11/2016.
 */
'use strict';

var app = angular.module('myApp');

app.factory('validate', function() {
    var data = {};

    /**
     * Validates a phone number
     * @param phone
     * @returns {boolean} true if the phone number is of valid formatting
     */
    data.validatePhone = function (phone) {
        var phone_regex = /^((([0-9]{3}))|([0-9]{3}))[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
        return phone_regex.test(phone);
    };

    /**
     * Validates an email address
     * @param email
     * @returns {boolean} true if the email is of valid format
     */
    data.validateEmail = function (email) {
        var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email_regex.test(email);
    };

    /**
     * Validates a savings input
     * @param savings
     * @returns {boolean} false if it's NaN, null or undefined
     */
    data.validateSavings = function (savings) {
        return !(isNaN(savings) ||
                savings === undefined ||
                savings === null ||
                savings === "" || 
                savings === 0);
    };

    /**
     * Validates a given field
     * @param field
     * @returns {boolean} false if the field is null, undefined, or an empty string
     */
    data.validateField = function (field) {
        if (field === null || field === undefined) {
            return false;
        }
        else {
            //check if it's empty
            return !(field.replace(/\s+/g, '') == "")
        }
    };
    
    return data;
});