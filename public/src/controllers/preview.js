'use strict';

var app = angular.module('preview', ['myApp']);

app.controller('previewCtrl', function ($scope, $window, $q, sharedData, database) {
    
    $scope.sharedData = sharedData;
    
    /**
     * Initializes the page
     */
    $scope.pageInit = function () {
        // check if user is already logged in
        if (!$scope.sharedData.loggedIn()) {
            // user is not logged in
            $window.location.href = "#!/login";
        }
        else if (sharedData.checkAdmin()) {
            // user is admin
            // user should not be on this page
            $window.location.href = "#!/display";
        }
        $scope.items = $scope.sharedData.projectList;
    };

    /**
     * Edits an existing project form
     * @param index index in the items array
     */
    $scope.edit = function (index) {
        $scope.sharedData.project = $scope.items[index];
        $scope.items.splice(index, 1);
        $window.location.href = "#!/entry";
    };

    /**
     * Deletes a project from the items array
     * @param index index in items
     */
    $scope.deleteProject = function (index) {
        var confirmation = confirm("Are you sure you want to delete this project?");
        if (confirmation) {
            $scope.items.splice(index, 1);
            if ($scope.items.length == 0) {
                $window.location.href = "#!/previous";
            }
        }
    };

    /**
     * Add contents in items array to the database
     */
    $scope.addToDB = function () {
        var promises = [];
        for (var i = 0; i < $scope.items.length; i++) {
            var promise = database.addProjectToDatabase($scope.items[i]);
            promises.push(promise);
        }

        $q.all(promises).then(function() {
            $scope.items = [];
            sharedData.clearProjectList();
            $window.location.href = "#!/previous";
        });
    };

    /**
     * For adding additional projects
     * Reloads to entry page
     */
    $scope.addNew = function () {
        $window.location.href = "#!/entry";
    };

    //initialize view
    $scope.pageInit();
});