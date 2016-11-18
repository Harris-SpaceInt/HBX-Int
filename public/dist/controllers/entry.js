'use strict';

var app = angular.module('entry', ['myApp']);

app.controller('entryCtrl', function ($scope, $window, sharedData, database, dropdown, savings, validate) {
    $scope.itemsToAdd = [];
    $scope.resultsToAdd = [];
    $scope.update = false; //whether a project is being added or updated
    $scope.savingsNumber = true; //checks for number inputs for savings
    $scope.hoursNumber = true; //checks for number inputs for hours
    $scope.hasImage = false;

    $scope.validate = validate;
    $scope.sharedData = sharedData;

    //date options for the date picked
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '2010:-0'
    };

    //array of project disciplines
    $scope.disciplines = dropdown.disciplines;

    //output of disciplines check boxes
    $scope.projectDisciplines = [];


    //------------------------------------------------------------------------------------------------------------------
    // initialize the page

    /**
     * Runs when the page is loaded
     */
    $scope.pageInit = function () {
        // check if user is already logged in
        if (!sharedData.loggedIn()) {
            // user is not logged in
            $window.location.href = "#!/login";
        }
        else {
            if (sharedData.project === null) {
                $scope.addNew();
            }
            else {
                //editing existing project
                $scope.itemsToAdd.push(sharedData.project);
                if (sharedData.project.image !== null) {
                    $scope.hasImage = true;
                }

                //initialize date
                $scope.itemsToAdd[0].date = new Date(sharedData.project.year, sharedData.project.month - 1, sharedData.project.day);

                //updating results
                for (var i = 0; i < sharedData.project.result.length; i++) {
                    $scope.resultsToAdd.push({
                        summary: sharedData.project.result[i].summary,
                        details: sharedData.project.result[i].details,
                        savings: sharedData.project.result[i].savings,
                        hours: sharedData.project.result[i].hours
                    });
                }

                //updating disciplines
                for (var j = 0; j < sharedData.project.discipline.length; j++) {
                    switch (sharedData.project.discipline[j]) {
                        case "Software":
                            $scope.disciplines[0].ticked = true;
                            break;
                        case "Systems":
                            $scope.disciplines[1].ticked = true;
                            break;
                        case "Electrical":
                            $scope.disciplines[2].ticked = true;
                            break;
                        case "Mechanical":
                            $scope.disciplines[3].ticked = true;
                            break;
                        case "Production":
                            $scope.disciplines[0].ticked = true;
                            break;
                        case "Integration and Test":
                            $scope.disciplines[1].ticked = true;
                            break;
                        case "Corporate":
                            $scope.disciplines[2].ticked = true;
                            break;
                        case "Program Management":
                            $scope.disciplines[3].ticked = true;
                            break;
                    }
                }

                $scope.update = true;
                sharedData.project = null;
            }
        }
    };

    /**
     * Adds a new project form
     */
    $scope.addNew = function () {
        if ($scope.itemsToAdd.length >= 1) {
            alert("Fill out existing report(s) first!");
        }
        else {
            dropdown.resetDisciplines();
            $scope.addResultsField();
            $scope.itemsToAdd.push({
                title: '',
                discipline: [],
                disciplineString: '',
                month: '',
                day: '',
                year: '',
                date: '',
                manager: '',
                team: '',
                summary: '',
                result: $scope.resultsToAdd,
                image: null
            });
        }
    };


    //------------------------------------------------------------------------------------------------------------------
    // discipline related functions

    /**
     * Updates a project's disciplines
     * @param project
     */
    $scope.updateDisciplines = function (project) {
        for (var i = 0; i < $scope.disciplines.length; i++) {
            var checked = $scope.disciplines[i].ticked;
            if (checked) {
                project.discipline.push($scope.disciplines[i].label);
            }
        }
    };

    /**
     * Alerts the values in the output disciplines array
     */
    $scope.alertDisciplines = function () {
        var result = "";
        for (var i = 0; i < $scope.disciplines.length; i++) {
            if ($scope.disciplines[i].ticked) {
                result += ($scope.disciplines[i].label + " ");
            }
        }
        alert(result);
    };

    /**
     * Checks if none of the disciplines are selected
     * @returns {boolean} true if none of the disciplines are ticked, false otherwise
     */
    $scope.noDiscipline = function () {
        for (var i = 0; i < $scope.disciplines.length; i++) {
            if ($scope.disciplines[i].ticked) {
                return false;
            }
        }
        return true;
    };

    /**
     * Checks if the savings input is a number
     * @param index index of result
     */
    $scope.checkSavingsNumberInput = function (index) {
        var input = $scope.resultsToAdd[index].savings;
        if (input === '' || input === undefined) {
            $scope.savingsNumber = true;
        }
        else {
            $scope.savingsNumber = !isNaN(input);
        }
    };

    /**
     * Checks if the hours input is a number
     * @param index index of result
     */
    $scope.checkHoursNumberInput = function (index) {
        var input = $scope.resultsToAdd[index].hours;
        if (input === '' || input === undefined) {
            $scope.hoursNumber = true;
        }
        else {
            $scope.hoursNumber = !isNaN(input);
        }
    };


    //------------------------------------------------------------------------------------------------------------------
    // project form-related functions

    /**
     * Adds a new results field
     */
    $scope.addResultsField = function () {
        $scope.resultsToAdd.push({
            summary: '',
            details: '',
            savings: '',
            hours: ''
        });
    };

    /**
     * Checks if the current manager is in the database and redirects accordingly
     */
    $scope.redirect = function () {
        var promise = database.getManagerByEmail(sharedData.globalManager[0].email);

        promise.then(function (data) {
            sharedData.project = null;
            $scope.managerExists = (data !== null);
            if ($scope.managerExists) {
                $window.location.href = "#!/previous";
            }
            else {
                sharedData.logOut();
            }
        });
    };

    /**
     * Deletes a project form
     */
    $scope.delProjectForm = function () {
        sharedData.project = null;
        if (sharedData.projectList.length > 0) {
            $window.location.href = "#!/preview";
        }
        else {
            $scope.redirect();
        }
    };

    /**
     * Cancels a project edit
     */
    $scope.cancelEdit = function () {
        sharedData.project = null;
        $window.location.href = "#!/previous";
    };

    /**
     * Removes a currently uploaded image
     */
    $scope.removeImage = function () {
        $scope.itemsToAdd[0].image = null;
        $scope.hasImage = false;
    };

    /**
     * Deletes a result field at a given index
     * @param index
     */
    $scope.delResultsField = function (index) {
        if ($scope.resultsToAdd.length > 1) {
            $scope.resultsToAdd.splice(index, 1);
        }
        else {
            alert("Cannot delete only result")
        }
    };

    /**
     * Updates a project's month/day/year fields given a date
     * @param item project
     * @returns {*} the project with its date updated
     */
    $scope.parseDate = function (item) {
        item.month = item.date.getMonth() + 1;
        item.day = item.date.getDate();
        item.year = item.date.getFullYear();
        return item;
    };


    //------------------------------------------------------------------------------------------------------------------
    // adding and updating projects

    /**
     * Validates a project and alerts accordingly
     * @param item project
     * @returns {boolean} false if any fields are invalid and alerts accordingly, true if everything is correct
     */
    $scope.validateProject = function (item) {
        if (!$scope.validate.validateField(item.title)) {
            alert("Invalid project title");
            return false;
        }
        else if (item.date === undefined || item.date === null) {
            alert("Invalid date");
            return false;
        }
        else if (!$scope.validate.validateField(item.summary)) {
            alert("Invalid summary");
            return false;
        }
        else if ($scope.noDiscipline()) {
            alert("No disciplines selected");
            return false;
        }
        else {
            for (var i = 0; i < $scope.resultsToAdd.length; i++) {
                if (!$scope.validate.validateField($scope.resultsToAdd[i].summary)) {
                    alert("Invalid improvement description in result " + (i + 1));
                    return false;
                }
                if (!$scope.validate.validateField($scope.resultsToAdd[i].details)) {
                    alert("Invalid results accomplished in result " + (i + 1));
                    return false;
                }
            }
            return true;
        }
    };

    /**
     * Checks the savings for legit amounts
     * @param item project
     * @returns {boolean} false if the savings/hours are negative, and if both amounts are 0 or less
     */
    $scope.legitSavings = function (item) {
        if (item.savings < 0) {
            alert("Error: Negative savings");
            return false;
        }
        if (item.hours < 0) {
            alert("Error: Negative hours");
            return false;
        }
        if (item.savings <= 0 && item.hours <= 0) {
            alert("Error: project has no savings");
            return false;
        }
        return true;
    };

    /**
     * Validates and updates a project's hours and savings
     * in results. Checks that the project has at least
     * savings or hours, then autofills missing fields.
     * @param item project
     * @returns {boolean} true if
     */
    $scope.updateResults = function (item) {
        item.result = [];

        //loop through all the results
        for (var i = 0; i < $scope.resultsToAdd.length; i++) {
            var result = $scope.resultsToAdd[i];
            var savingsValid = validate.validateSavings(result.savings);
            var hoursValid = validate.validateSavings(result.hours);

            //checking for valid savings/hours amounts
            //if both are invalid then alert error message
            if (!savingsValid && !hoursValid) {
                alert("Need at least savings or hours in result " + (i + 1));
                return false;
            }

            // check if we have at least valid savings or valid hours
            //   but not both
            if ((savingsValid || hoursValid) &&
                    !(savingsValid && hoursValid)) {
                // result has at least one type of valid savings
                // set the other field to 0
                if (!savingsValid) {
                    result.savings = 0;
                }
                else if (!hoursValid) {
                    result.hours = 0;
                }
            }

            item.result.push(result);
        }

        item.savings = savings.projectSavings(item);
        item.hours = savings.projectHours(item);
        return true;
    };

    /**
     * Compiles a project by validating it and updating its results
     * @param item project
     * @returns {boolean} true if it's compiled and the savings are legitimate
     */
    $scope.compileProject = function (item) {
        if ($scope.validateProject(item)) {
            item = $scope.parseDate(item);
            if ($scope.updateResults(item)) {
                if ($scope.legitSavings(item)) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * Adds a project to the items array
     * @param item project to be added
     */
    $scope.addProject = function (item) {
        if ($scope.compileProject(item)) {
            item.manager = sharedData.globalManager[0];
            $scope.updateDisciplines(item);

            sharedData.pushToProjectList(angular.copy(item));
            $window.location.href = "#!/preview";
        }
    };

    /**
     * Updates a project if it already exists in the database
     * @param item updated project
     */
    $scope.updateProject = function (item) {
        if ($scope.compileProject(item)) {
            //checks if it's stored in the database
            if (sharedData.fromDatabase) {
                var promise = database.updateProjectFromDatabase(item._id, item);
                promise.then(function() {
                    sharedData.project = null;
                    sharedData.fromDatabase = false;
                    $window.location.href = "#!/previous";
                });
            }
            else {
                sharedData.pushToProjectList(angular.copy(item));
                $window.location.href = "#!/preview";
            }
        }
    };


    //------------------------------------------------------------------------------------------------------------------
    // call the initialization function

    $scope.pageInit();
});