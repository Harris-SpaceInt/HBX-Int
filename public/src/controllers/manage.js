'use strict';

var app = angular.module('manage', ['myApp']);

app.controller('manageCtrl', function ($scope, $window, sharedData, database, dropdown, validate) {
    
    //linking sharedData to scope
    $scope.sharedData = sharedData;

    $scope.manager = sharedData.globalManager[0];
    $scope.addManager = []; //fields for manager information to be edited
    $scope.dropdown = dropdown;
    $scope.validate = validate;

    /**
     * Initializes the page
     */
    $scope.pageInit = function () {
        //if user is logged in
        if (!$scope.sharedData.loggedIn()) {
            // user is not logged in
            $window.location.href = "#!/login";
        }
        else {
            $scope.addManager.push($scope.manager);
        }
    };

    /**
     * Updates the manager's information in the database
     */
    $scope.updateInfo = function () {
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
            if ($scope.validate.validatePhone(manager.phone)) {

                // information has been verified
                // store manager data and redirect to correct page
                $scope.sharedData.setGlobalManager(angular.copy(manager));
                $scope.addManager = [];

                var getPromise = database.getManagerByEmail($scope.manager.email);

                getPromise.then(function (data) {
                    //data found
                    if (data !== null) {
                        var updatePromise = database.updateManagerInDatabase(data._id, manager);
                        updatePromise.then(function () {
                            $window.location.href = "#!/previous";
                        });
                    }
                    else {
                        console.log("Error: Manager not in database");
                    }
                });
            }
            else {
                alert("Invalid phone");
            }
        }
    };

    /**
     * Returns to previous page
     */
    $scope.goBackToPrevious = function () {
        $window.location.href = "#!/previous";
    };

    //initialize page
    $scope.pageInit();
});