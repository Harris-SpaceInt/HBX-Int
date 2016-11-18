'use strict';

var app = angular.module('previous', ['myApp']);

app.controller('previousCtrl', function ($scope, $window, $q, sharedData, database) {

    // stores the previous projects of the current user
    //   or all projects in database if user is admin
    $scope.userProjects = [];

    // stores the previous projects of the current user
    //   that have already been used in a report
    // these projects cannot be edited or deleted
    $scope.generatedUserProjects = [];

    // holds projects that are currently being displayed
    $scope.items = [];

    // keeps track of if the user is showing projects
    //   already used in reports
    $scope.showingGenerated = false;

    // linked to the text in the search box
    $scope.searchTerm = "";

    // sets the view to display a full view of one project when true
    $scope.showingFullView = false;


    //------------------------------------------------------------------------------------------------------------------
    // link database and sharedData to scope variables

    $scope.database = database;

    $scope.sharedData = sharedData;

    //------------------------------------------------------------------------------------------------------------------
    // initialize the page

    /**
     * Initializes page
     */
    $scope.pageInit = function () {
        // check if user is already logged in
        if (!$scope.sharedData.loggedIn()) {
            // user is not logged in
            $window.location.href = "#!/login";
        }
        else if (sharedData.checkAdmin() && sharedData.project !== null) {
            // a project was passed to the page
            // show the full view of the project
            $scope.items.push(sharedData.project);
            sharedData.project = null;

            $scope.showingFullView = true;
        }
        else {
            // load and display the user's projects
            var promise = $scope.loadUserProjects(false);

            promise.then(function() {
                $scope.items = $scope.userProjects;
            });
        }
    };

    //------------------------------------------------------------------------------------------------------------------

    /**
     * Takes a user logged in as admin to the display page
     */
    $scope.switchToDisplay = function () {
        $window.location.href = '#!/display';
    };

    /**
     * Finds all of the projects a user has submitted.
     * Places projects that have not been assigned to
     * a report into userProjects and ones that have
     * into generatedUserProjects. If the user is admin,
     * projects that belong to any user are placed in
     * these variables.
     */
    $scope.loadUserProjects = function () {
        var deferred = $q.defer();

        // first load projects not in reports
        // handle admin and regular user cases
        if ($scope.sharedData.checkAdmin()) {
            // user is admin
            // display all projects
            var promise1 = database.getProjectsFromDatabase();

            promise1.then(function(data) {
                $scope.userProjects = data;

                // load projects from reports if they are requested
                if ($scope.showingGenerated) {
                    var promise2 = database.getGenearatedProjectsFromDatabase();
                    
                    promise2.then(function(data) {
                        $scope.generatedUserProjects = data;
                        deferred.resolve();
                    });
                }
                else {
                    // generated not requested
                    deferred.resolve();
                }
            });
        }
        else {
            // user is not admin
            // only display user projects
            var promise1 = database.getManagerProjectsFromDatabase(sharedData.globalManager[0].email);

            promise1.then(function(data) {
                $scope.userProjects = data;

                // load projects from reports if they are requested
                if ($scope.showingGenerated) {
                    var promise2 = database.getGeneratedManagerProjectsFromDatabase(sharedData.globalManager[0].email);
                    
                    promise2.then(function(data) {
                        $scope.generatedUserProjects = data;
                        deferred.resolve();
                    });
                }
                else {
                    // generated not requested
                    deferred.resolve();
                }
            });
        }

        return deferred.promise;
    };

    /**
     * Re-directs to the edit profile information page
     */
    $scope.editManager = function () {
        $window.location.href = '#!/manage';
    };

    /**
     * Re-directs user to entry page
     */
    $scope.addProject = function () {
        $window.location.href = '#!/entry';
    };

    /**
     * Shows projects already in reports
     */
    $scope.showGenerated = function () {
        $scope.showingGenerated = true;

        var promise = $scope.loadUserProjects();

        promise.then(function() {
            $scope.items = [];
            for (var i = 0; i < $scope.userProjects.length; i++) {
                $scope.items.push($scope.userProjects[i]);
            }
            for (var i = 0; i < $scope.generatedUserProjects.length; i++) {
                $scope.items.push($scope.generatedUserProjects[i]);
            }
        });
    };

    /**
     * Hides projects already in reports
     */
    $scope.hideGenerated = function () {
        $scope.showingGenerated = false;

        $scope.items = [];
        for (var i = 0; i < $scope.userProjects.length; i++) {
            $scope.items.push($scope.userProjects[i]);
        }
    };

    /**
     * Searches the database for projects with titles, manager names, or manager
     * emails matching or including searchTerm and populates the view with those
     * items
     */
    $scope.searchAndUpdate = function () {
        $scope.items = [];

        $scope.searchList($scope.userProjects);

        if ($scope.showingGenerated) {
            $scope.searchList($scope.generatedUserProjects);
        }
    };

    /**
     * Searches the given list of projects and adds
     * matches to the items array
     * @param list project list
     */
    $scope.searchList = function (list) {
        for (var i = 0; i < list.length; i++) {
            var title = list[i].title;
            var email = list[i].manager.email;
            var name = list[i].manager.name;

            var search = $scope.searchTerm.toLowerCase();

            title = title.toLowerCase();
            email = email.toLowerCase();
            name = name.toLowerCase();

            // if the admin is accessing search, also check manager names/emails
            if ($scope.sharedData.checkAdmin()) {
                if (title.indexOf(search) > -1) {
                    $scope.items.push(list[i]);
                }
                else if (email.indexOf(search) > -1) {
                    $scope.items.push(list[i]);
                }
                else if (name.indexOf(search) > -1) {
                    $scope.items.push(list[i]);
                }
            }
            // if a user is accessing search, only check titles
            else {
                if (title.indexOf(search) > -1) {
                    $scope.items.push(list[i]);
                }
            }
        }
    };

    /**
     * Clears the search term
     */
    $scope.clearSearch = function () {
        $scope.searchTerm = "";
        $scope.searchAndUpdate();
    };

    /**
     * Sends the user to the entry view to update the project
     * @param {number} index index in items (projects array)
     */
    $scope.editProject = function (index) {
        sharedData.fromDatabase = true;
        sharedData.project = $scope.items[index];
        $window.location.href = '#!/entry';
    };

    /**
     * Deletes a project from the items array
     * @param {number} index index in items (projects array)
     */
    $scope.deleteProject = function (index) {
        // ask if the user wants to delete the project
        var confirmation = confirm("Are you sure you want to delete the project, " +
            $scope.items[index].title + "?");
        // only proceed if the user confirms they want to delete the project
        if (confirmation) {
            // starts a delete request to delete the project from the database
            var deletePromise = $scope.database.deleteProjectFromDatabase($scope.items[index]._id);
            // when deleting is finished, refresh the display
            deletePromise.then(function () {
                // first, clear everything being displayed
                $scope.items = [];
                $scope.userProjects = [];
                $scope.generatedUserProjects = [];

                // now refresh the list of projects from the database
                var getPromise = database.getItemsFromDatabase();
                // when that is done, load the projects back into the 
                //   corresponding list and refresh the display
                getPromise.then(function () {
                    //adding toggle manager fields
                    database.projects.forEach(function (project) {
                        project.checked = false;
                    });

                    $scope.loadUserProjects();
                    $scope.searchAndUpdate();
                });
            });
        }
    };

    //------------------------------------------------------------------------------------------------------------------
    // call the initialization function

    $scope.pageInit();
});