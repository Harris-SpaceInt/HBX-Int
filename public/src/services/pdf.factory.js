'use strict';

var app = angular.module('myApp');

app.factory('pdf', function(staticImages) {
    var data = {};

    /**
     * Creates a report pdf of a list of projects
     * @param projects
     */
    data.createReportPDF = function (projects) {
        var docDefinition = {
            pageMargins: [30, 30, 30, 30],
            footer: {
                columns: [
                    {
                        image: staticImages.proprietary,
                        width: 400
                    }
                ]
            },
            content: [
                data.allProjects(projects)
            ],

            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    alignment: "center"
                },
                subheader: {
                    bold: true
                }
            }
        };
        pdfMake.createPdf(docDefinition).open("Report.pdf");
    };

    /**
     * Helper function to make PDF separated by pages for each project
     * @param projects  The data to print
     * @returns {object []} string that will be used to print to the pdf
     */
    data.allProjects = function (projects) {
        var body = [];

        body.push({image: staticImages.harris, width: 300});
        body.push({text: 'Project Reports Summary \n\n', style: 'header'});
        body.push({text: 'Number of reports: ' + projects.project.length + '\n\n', style: "subheader"});
        body.push({text: 'Total savings: $' + projects.savings + '\n\n', style: "subheader"});
        body.push({text: 'Total time saved: ' + projects.hours + ' hours', style: "subheader"});

        projects.project.forEach(function (project) {
            var projectPage = data.singleProject(project);

            for (var i = 0; i < projectPage.length; i++) {
                body.push(projectPage[i]);
            }
        });

        return body;
    };

    /**
     * Helper function to create a page for each project
     * @param project  The data to print
     * @returns {object []} an object used to print to the pdf
     */
    data.singleProject = function (project) {
        var project_body = [];

        var disciplineString = project.discipline.join(", ");
        
        //manager becomes first team member
        var managerInfo = project.manager.name + " - " + project.manager.email;
        if (project.team === null) {
            project.team = managerInfo;
        }
        else {
            project.team = managerInfo + ", " + project.team;
        }
        
        project_body.push({image: staticImages.hbx, width: 535, pageBreak: "before"});
        project_body.push({
            table: {
                //widths: ['*', 'auto', 100, '*'],
                headerRows: 1,
                widths: [100, 141, 250],
                body: [
                    [{text: "Project Title", bold: true, alignment: 'center'}, {text: "Team Members", bold: true, alignment: 'center'}, {
                        text: "Discipline(s)",
                        bold: true,
                        alignment: 'center'
                    }],
                    [{text: "" + project.title, alignment: 'center'}, {text: "" + project.team, alignment: 'center'}, {text: "" + disciplineString, alignment: 'center'}]
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) return 0;
                    return (i === node.table.headerRows) ? 2 : 0;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                },

                hLineColor: function (i, node) {
                    return 'black';
                },
                vLineColor: function (i, node) {
                    return 'gray';
                }
            }
        });
        project_body.push({text: "\n\n"});
        project_body.push({
            table: {
                headerRows: 1,
                widths: [250, 250],
                body: [
                    [{text: "Savings", bold: true, alignment: 'center'}, {
                        text: "Saved Hours",
                        bold: true,
                        alignment: 'center'
                    }],
                    [{text: "$" + project.savings, alignment: 'center'}, {
                        text: project.hours + " hours",
                        alignment: 'center'
                    }]
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) return 0;
                    return (i === node.table.headerRows) ? 2 : 0;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                },

                hLineColor: function (i, node) {
                    return 'black';
                },
                vLineColor: function (i, node) {
                    return 'gray';
                }
            }
        });

        //if there's an image
        if (project.image !== undefined && project.image !== null) {
            project_body.push({
                table: {
                    headerRows: 1,
                    widths: [250, 250],
                    body: [
                        [{text: "Summary", bold: true, alignment: 'center'}, {
                            text: "Image",
                            bold: true,
                            alignment: 'center'
                        }],
                        [{text: project.summary + "", alignment: 'center'}, {image: project.image, width: 200, alignment: 'center'}]
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        if (i === 0 || i === node.table.body.length) return 0;
                        return (i === node.table.headerRows) ? 2 : 0;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                    },

                    hLineColor: function (i, node) {
                        return 'black';
                    },
                    vLineColor: function (i, node) {
                        return 'gray';
                    }
                }
            });
        }
        else {
            project_body.push({
                table: {
                    headerRows: 1,
                    widths: [500],
                    body: [
                        [{text: "Summary", bold: true, alignment: 'center'}],
                        [{text: project.summary + "", alignment: 'center'}]
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        if (i === 0 || i === node.table.body.length) return 0;
                        return (i === node.table.headerRows) ? 2 : 0;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                    },

                    hLineColor: function (i, node) {
                        return 'black';
                    },
                    vLineColor: function (i, node) {
                        return 'gray';
                    }
                }
            });
        }

        project_body.push({text: "\n\n"});
        for (var i = 0; i < project.result.length; i++) {
            project_body.push({
                table: {
                    headerRows: 1,
                    widths: [250, 250],
                    body: [
                        [{text: "\nResult #" + (i + 1), bold: true, alignment: 'center', colSpan: 2}, {}],
                        [{text: "Improvement Description", bold: true, alignment: 'center'}, {text: "Improvement Results", bold: true, alignment: 'center'}],
                        [{text: "" + project.result[i].summary, alignment: 'center'}, {text: "" + project.result[i].details, alignment: 'center'}]
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        if (i === 0 || i === node.table.body.length) return 0;
                        return (i === node.table.headerRows) ? 2 : 0;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                    },

                    hLineColor: function (i, node) {
                        return 'black';
                    },
                    vLineColor: function (i, node) {
                        return 'gray';
                    }
                }
            });
        }
        return project_body;
    };

    return data;
});