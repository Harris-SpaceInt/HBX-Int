'use strict';

var app = angular.module('email', ['myApp']);

app.controller('emailCtrl', function ($scope, $window, sharedData, database, dropdown, validate) {

    $scope.addManager = [{
        email: "",
        name: "",
        unit: "",
        //function: "",
        department: "",
        phone: ""
    }]; // used to keep track of text in the manager boxes on the website

    //------------------------------------------------------------------------------------------------------------------
    // link database and sharedData to scope variables 

    $scope.database = database;
    $scope.sharedData = sharedData;
    $scope.dropdown = dropdown;
    $scope.validate = validate;
    $scope.managerExists = false; //if manager exists in the database
    $scope.createAccount = false; //variable for toggling fields when creating an account

    //------------------------------------------------------------------------------------------------------------------
    // initialize the page

    /**
     * Runs when the page is loaded
     */
    $scope.pageInit = function () {
        // check if user is already logged in
        if ($scope.sharedData.loggedIn()) {
            // user is logged in
            // redirect to correct page
            if ($scope.sharedData.checkAdmin()) {
                // user is admin
                $window.location.href = "#!/display";
            }
            else {
                // regular user
                $window.location.href = "#!/previous";
            }
        }

        // load all project data from the database
        $scope.database.getManagersFromDatabase();
    };

    //------------------------------------------------------------------------------------------------------------------

    /**
     * Sets account creation settings to true
     */
    $scope.create = function () {
        $scope.createAccount = true;
    };

    /**
     * Cancels account creation
     */
    $scope.cancel = function () {
        $scope.clearManager();
        $scope.createAccount = false;
    };

    /**
     * Autofills manager information upon entering a valid email address
     */
    $scope.autoFill = function () {
        var email = $scope.addManager[0].email;

        if (email != null) {
            // autofill for admin editing functionality
            if (email === sharedData.adminString) {
                $scope.sharedData.setAdmin();
                $scope.submit($scope.sharedData.globalManager[0]);
            }

            var managerIndex = $scope.findManager(email);
            $scope.managerExists = !(managerIndex === -1);

            if ($scope.managerExists) {
                $scope.addManager[0].name = $scope.database.managers[managerIndex].name;
                $scope.addManager[0].unit = $scope.database.managers[managerIndex].unit;
                //$scope.addManager[0].function = $scope.database.managers[managerIndex].function;
                $scope.addManager[0].department = $scope.database.managers[managerIndex].department;
                $scope.addManager[0].phone = $scope.database.managers[managerIndex].phone;
            }
            else {
                $scope.addManager[0].name = "";
                $scope.addManager[0].unit = "";
                //$scope.addManager[0].function = "";
                $scope.addManager[0].department = "";
                $scope.addManager[0].phone = "";
            }
        }
    };

    /**
     * Returns index of a manager in the database if an email match is found
     * @param email
     * @returns {number} index of the manager in the database array, -1 if not found
     */
    $scope.findManager = function (email) {
        for (var i = 0; i < $scope.database.managers.length; i++) {
            if ($scope.database.managers[i].email.toLowerCase() === email.toLowerCase()) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Clears manager fields
     */
    $scope.clearManager = function () {
        $scope.addManager[0].email = "";
        $scope.addManager[0].name = "";
        $scope.addManager[0].unit = "";
        //$scope.addManager[0].function = "";
        $scope.addManager[0].department = "";
        $scope.addManager[0].phone = "";
    };

    /**
     * Checks if the current manager is in the database and redirects accordingly
     */
    $scope.redirect = function () {
        var promise = database.getManagerByEmail(sharedData.globalManager[0].email);

        promise.then(function (data) {
            $scope.managerExists = (data !== null);
            if ($scope.managerExists) {
                $window.location.href = "#!/previous";
            }
            else {
                $window.location.href = "#!/entry";
            }
        });
    };

    /**
     * Logs user in
     */
    $scope.submit = function () {
        if ($scope.sharedData.checkAdmin()) {
            // user is admin
            $window.location.href = "#!/display";
        }
        else {
            $scope.addManager[0].email = $scope.addManager[0].email.toLowerCase();
            var manager = $scope.addManager[0];
            if (!$scope.validate.validateField(manager.name)) {
                alert("Invalid name");
            }
            else if (!$scope.validate.validateField(manager.unit)) {
                alert("Invalid unit");
            }
            else if (!$scope.validate.validateField(manager.department)) {
                alert("Invalid department");
            }
            else {
                var e = manager.email;
                var p = manager.phone;
                if ($scope.validate.validatePhone(p) && $scope.validate.validateEmail(e)) {
                    $scope.sharedData.setGlobalManager(angular.copy(manager));
                    $scope.addManager.splice(0, 1);

                    //runs asynchronously
                    $scope.redirect();
                }
                else {
                    if (!$scope.validatePhone(p)) {
                        alert("Invalid phone");
                    }
                    else {
                        alert("Invalid email");
                    }
                }
            }
        }
    };


    //------------------------------------------------------------------------------------------------------------------
    // call the initialization function

    $scope.pageInit();
});