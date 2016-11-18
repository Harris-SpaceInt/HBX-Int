'use strict';

var app = angular.module('display', ['myApp']);

app.controller('displayCtrl', function ($scope, $window, sharedData, database, dropdown, pdf, savings) {
    // constant value used to set the target benchmark for project savings
    $scope.benchmark = 100000;    
    
    // controls whether or not the selected reports tab is open
    // initially closed
    $scope.showSelectedProjects = false;

    // toggles showing a list of previous reports
    $scope.showPrevReports = false;
    $scope.expandedList = false;

    // used to change from viewing individual projects to projects 
    // from a report
    $scope.prev_reports = false;

    // used to keep track of which projects are selected
    $scope.checked = [];

    // variables for viewing previous reports
    // stores the projects from the current report
    $scope.report_projects = [];
    // stores the date of the current result
    $scope.report_date = "";
    // stores the current report
    $scope.currentReport = null;

    // field variables for handling column sort
    // show savings with highest first by default
    $scope.reverse = true;
    $scope.sortOrder = "savings";

    // array of disciplines that are selectable
    dropdown.resetDisciplines();
    $scope.disciplines = dropdown.disciplines;
    $scope.projectDisciplines = [];

    //------------------------------------------------------------------------------------------------------------------
    // link database factory and sharedData factory with scope variables from
    //   controller to allow the controller to use and update from factory

    $scope.database = database;
    $scope.sharedData = sharedData;
    $scope.pdf = pdf;

    //------------------------------------------------------------------------------------------------------------------
    // initialize the page on load

    /**
     * Called on page load
     */
    $scope.pageInit = function () {
        // update the database
        $scope.database.getItemsFromDatabase();

        for (var i = 0; i < $scope.database.projects.length; i++) {
            $scope.database.projects[i].visible = true;
        }

        // set credentials to admin
        if (!$scope.sharedData.checkAdmin()) {
            $scope.sharedData.setAdmin();
        }
    };

    //------------------------------------------------------------------------------------------------------------------
    // showing full projects

    /**
     * Sends the user to the previously submitted
     * projects view. For the admin, this display
     * shows detailed reports of all projects and
     * allows searching
     */
    $scope.switchToFull = function () {
        $window.location.href = '#!/previous';
    };

    /**
     * Shows the full report for a project
     * @param project
     */
    $scope.showFull = function (project) {
        sharedData.project = project;

        $window.location.href = "#!/previous";
    };
    
    
    //------------------------------------------------------------------------------------------------------------------
    // functions for showing and hiding reports 

    /**
     * Hides previous reports from view
     */
    $scope.hideReports = function () {
        $scope.prev_reports = false;
        $scope.report_projects = [];
    };

    /**
     * Sets showPrevReports to its opposite value
     */
    $scope.setShowPrevReports = function () {
        $scope.showPrevReports = !$scope.showPrevReports;
        $scope.expandedList = false;
    };

    /**
     * Sets prev_reports to its opposite value
     */
    $scope.setPrevReports = function () {
        $scope.prev_reports = !$scope.prev_reports;
    };

    /**
     * Sets showSelectedProjects to its opposite value
     */
    $scope.setSelectedProjects = function () {
        $scope.showSelectedProjects = !$scope.showSelectedProjects;
    };

    /**
     * Expands the report list if there are additional hidden reports
     */
    $scope.expandList = function () {
        $scope.expandedList = true;
    };

    /**
     * Adds projects for the selected report to the display
     * @param report
     */
    $scope.addReportsToDisplay = function (report) {
        var promise = database.getReportFromDatabase(report._id);

        promise.then(function () {
            report = database.currentReport;
            $scope.setPrevReports();
            if ($scope.prev_reports) {
                $scope.report_projects = [];
                for (var i = 0; i < report.project.length; i++) {
                    $scope.report_projects.push(report.project[i]);
                }
                $scope.report_date = report.month + "/" + report.day + "/" + report.year;
                $scope.currentReport = report;
            }
        });
    };
    
    
    //------------------------------------------------------------------------------------------------------------------
    // sorting and selecting projects

    /**
     * Controls sorting by category for tabs
     * @param x  The category to sort by
     */
    $scope.setSortOrder = function (x) {
        //reverses display by default for below categories
        if (x === "checked" || x === "savings" || x === "hours" || x === "date") {
            $scope.reverse = ($scope.sortOrder === x) ? !$scope.reverse : true;
        }
        else {
            $scope.reverse = ($scope.sortOrder === x) ? !$scope.reverse : false;
        }
        $scope.sortOrder = x;
    };

    /**
     * Checks if any selection boxes are checked
     * @returns true if there is at least 1 box checked
     */
    $scope.somethingChecked = function () {
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if ($scope.database.projects[i].checked) {
                return true;
            }
        }
        return false;
    };

    // controls select all and select none
    $scope.majorSelection = false;

    /**
     * Selects or deselects all projects when the box next
     * to select is changed
     */
    $scope.selectFunction = function () {
        if ($scope.majorSelection) {
            $scope.selectAll();
        }
        else {
            $scope.deselectAll();
        }
    };

    /**
     * Selects all projects
     */
    $scope.selectAll = function () {
        for (var i = 0; i < database.projects.length; i++) {
            if (!database.projects[i].generated) {
                if (database.projects[i].visible || database.projects[i].visible === undefined) {
                    database.projects[i].checked = true;
                }
            }
        }
    };

    /**
     * Deselects all projects
     */
    $scope.deselectAll = function () {
        for (var i = 0; i < database.projects.length; i++) {
            if (!database.projects[i].generated) {
                database.projects[i].checked = false;
            }
        }
    };
    
    
    //------------------------------------------------------------------------------------------------------------------
    // filtering disciplines

    /**
     * No/all disciplines checked. Shows all projects
     */
    $scope.noOrAllDisciplines = function () {
        // every project is visible
        $scope.database.projects.forEach(function (project) {
            project.visible = true;
        })
    };

    /**
     * Filters the list by disciplines
     */
    $scope.filterDisciplines = function () {
        // get all the selected disciplines and
        //   put them in an array called selected
        var selected = [];
        for (var i = 0; i < $scope.disciplines.length; i++) {
            if ($scope.disciplines[i].ticked) {
                selected.push($scope.disciplines[i].label);
            }
        }

        // if no disciplines are selected or all
        //   disciplines are selected, show all projects
        if (selected.length === 0 || selected.length === $scope.disciplines.length) {
            $scope.noOrAllDisciplines();
        }
        // otherwise, some but not all disciplines are selected,
        //   so we need to find out which projects have those disciplines
        else {
            // loop through each project
            for (var i = 0; i < $scope.database.projects.length; i++) {
                var project = $scope.database.projects[i];

                // loop through the disciplines of the project
                project.visible = false;
                for (var j = 0; j < project.discipline.length; j++) {
                    // if any of the project's disciplines are selected
                    //   set the project to visible
                    var index = selected.indexOf(project.discipline[j]);
                    if (index > -1) {
                        project.visible = true;
                    }
                }
                // at this point we have compared all of the
                //   project's disciplines
                // if none of the project's disciplines are selected
                //   make sure the project is not checked and keep
                //   it invisible
                if (!project.visible) {
                    project.checked = false;
                }

                $scope.database.projects[i] = project;
            }
        }
    };
    

    //------------------------------------------------------------------------------------------------------------------
    // creating reports and generating PDFs

    /**
     * Creates a new report, adds it to the database,
     * and generates a pdf with all the report info
     */
    $scope.createReport = function () {
        var date = new Date();

        // create report with current date
        var report = {
            project: [],
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            savings: 0,
            hours: 0
        };
        
        var reportProjects = [];

        // add all selected projects to the report
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if ($scope.database.projects[i].checked === true) {
                $scope.database.projects[i].generated = true;
                $scope.database.projects[i].checked = false;

                database.updateProjectFromDatabase(database.projects[i]._id, database.projects[i]);

                report.savings += $scope.database.projects[i].savings;
                report.hours += $scope.database.projects[i].hours;
                
                reportProjects.push($scope.database.projects[i]);
                
                var projectId = {_id: $scope.database.projects[i]._id};
                report.project.push(projectId);
            }
        }

        // add the report to the database
        $scope.database.addReportToDatabase(report);

        // generate and display the pdf
        report.project = reportProjects;
        pdf.createReportPDF(report);
    };

    //------------------------------------------------------------------------------------------------------------------
    // helper functions for totaling project amounts

    /**
     * Returns the number of projects that are selected
     * @returns {number} number of projects selected
     */
    $scope.numChecked = function () {
        var n = 0;
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if ($scope.database.projects[i].checked === true) {
                n++;
            }
        }
        return n;
    };

    /**
     * Calculates the total savings from the selected projects
     * @returns {number} amount saved from selected projects
     */
    $scope.totalSavings = function () {
        var total = 0;
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if ($scope.database.projects[i].checked === true) {
                total += savings.projectSavings($scope.database.projects[i]);
            }
        }
        return total;
    };

    /**
     * Calculates the total hours saved from the selected projects
     * @returns {number} amount of hours saved from selected projects
     */
    $scope.totalHours = function () {
        var total = 0;
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if ($scope.database.projects[i].checked === true) {
                total += savings.projectHours($scope.database.projects[i]);
            }
        }
        return total;
    };

    /**
     * Determines if the savings benchmark has been reached
     * @param total_savings total savings from projects
     * @returns {boolean} true if the total savings exceeds the benchmark
     */
    $scope.benchmarkReached = function (total_savings) {
        return (total_savings >= $scope.benchmark);
    };


    //------------------------------------------------------------------------------------------------------------------
    // call the initialization function

    $scope.pageInit();
});

