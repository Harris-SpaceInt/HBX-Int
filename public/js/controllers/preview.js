'use strict';

var app = angular.module('preview', ['myApp']);

app.controller('previewCtrl', function ($scope, $window, sharedData, database) {
    
    $scope.sharedData = sharedData;
    
    /**
     * Initializes the page
     * Re-directs to user page
     */
    $scope.pageInit = function () {
        $scope.items = $scope.sharedData.projectList;
    };

    /**
     * Goes back to user page without logging changes
     */
    $scope.goBack = function () {
        $window.location.href = "#!/user";
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
                $window.location.href = "#!/user";
            }
        }
    };

    /**
     * Add contents in items array to the database
     */
    $scope.addToDB = function () {
        for (var i = 0; i < $scope.items.length; i++) {
            database.addProjectToDatabase($scope.items[i]);
            console.log("adding to db...");
        }
        $scope.items = [];
        sharedData.clearProjectList();
        $window.location.href = "#!/user";
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